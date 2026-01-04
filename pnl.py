from db import Whale, Trade, SessionLocal, create_engine
from sqlalchemy import select
import requests
import time
import json 


def CalcUnrealizedPnL():

    db = SessionLocal()

    rows = db.query(Trade).filter(Trade.status=="OPEN").all()
    print(f" Starting UPnL Calculattions on {len(rows)} trades...")


    for row in rows:

        ##unrealized pnl calculations, find market price with buy
        params = {
        "token_id" : str(row.asset),
        "side" :"BUY",
        }

        try :
            res = requests.get("https://clob.polymarket.com/price", params = params)
            data = res.json()
            
            if data.get("error") and "No orderbook exists for the requested token id" in data["error"]:
                print("market is closed, trade now marked as closed")
                row.status = "CLOSED"


            elif data.get("price"):

                    current_price = float(data.get("price")) 
                    pnl_per_share = current_price - row.price

                    row.unrealized_pnl = pnl_per_share * row.size

                    
                    print(f" PnL Update: ${row.unrealized_pnl:,.2f}")

        
        except Exception as e:
            print(e)

        time.sleep(0.2) 

    db.commit()
    db.close()
    

def CalcRealizedPnL():
    db = SessionLocal()
    
    #find all unique trade/assets.
    unique_assets = db.query(Trade.asset).filter(Trade.status == "CLOSED").distinct().all()

    print(f" Found {len(unique_assets)} unique assets to be assesed")

    URL = "https://gamma-api.polymarket.com/markets"
    WLmap = {} # Stores w/l resolution

    for (asset_id,) in unique_assets:
        params = {"clob_token_ids": str(asset_id)}
        
        try:
            res = requests.get(URL, params=params)
            data = res.json()

            #if market is closed, proceed
            if data and data[0].get("closed"):
                market = data[0]
                
                #Parse strings
                try:
                    id_list = json.loads(market.get('clobTokenIds', '[]'))     
                    price_list = json.loads(market.get('outcomePrices', '[]')) 
                    
                    if str(asset_id) in id_list:
                        index = id_list.index(str(asset_id))
                        
                        price = float(price_list[index]) 
                        WLmap[str(asset_id)] = price
                        
                except Exception as e:
                    print(f"parsing error: {e}")
        
        except Exception as e:
            print(f"api error: {e}")
            
        time.sleep(0.2) # Rate limit

    #if no closed trades
    if not WLmap:
        print("No resolved trades found, wait")
        return

    groups = db.query(Trade.wallet_address, Trade.asset).filter(
        Trade.asset.in_(WLmap.keys())
    ).distinct().all()
            
    print(f"found pairs of wallet and trades that have not been resolved")

    #loopo through all wallet and unique asset pairs
    for wallet, asset in groups:
        finalPrice = WLmap[asset]

        #find the trades performed by specific wallet/asset is asc order
        trades = db.query(Trade).filter(
            Trade.wallet_address == wallet, 
            Trade.asset == asset
        ).order_by(Trade.timestamp.asc()).all()

        buy_queue = [] 

        #loop through all trades
        for trade in trades:

            trade.realized_pnl = 0.0

            if trade.side.lower() == "buy": 
                buy_queue.append({
                    'entry_price': trade.price,
                    'remaining': trade.size,
                    'row': trade
                })

            elif trade.side.lower() == "sell":
                sellnum = trade.size
                profit = 0.0

                # while there is existing sell shares and buy shares to subtract from
                while sellnum > 0 and buy_queue:
                    oldest = buy_queue[0]
                    matched = min(sellnum, oldest["remaining"])

                    profitOne = (trade.price - oldest["entry_price"]) * matched
                    profit += profitOne
                    
                    sellnum -= matched
                    oldest["remaining"] -= matched

                    #if any buy shares are 0, pop from queue, next buy shifted over
                    if oldest['remaining'] <= 0.00001: 
                        buy_queue.pop(0)

                trade.realized_pnl = profit
                trade.status = "SOLD"
        
        #if any trades not exited early
        for item in buy_queue:
            if item['remaining'] > 0:
                res_profit = (finalPrice - item['entry_price']) * item['remaining']
                
                # add profit to the original Buy row
                item['row'].realized_pnl += res_profit
                item['row'].status = "CLOSED"

    db.commit()
    db.close()
    print("PnL Calculations done")




if __name__ == "__main__":
    ##CalcUnrealizedPnL()
    CalcRealizedPnL()
