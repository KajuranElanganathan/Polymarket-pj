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
    rows = db.query(Trade).filter(Trade.status=="CLOSED").all()

    print(f"Starting RPnL Calculattions on {len(rows)} trades...")

    URL = "https://gamma-api.polymarket.com/markets"

    WLmap = {}


    for row in rows:
         
        params = {
              
            "clob_token_ids" : str(row.asset)

        }

        res = requests.get(URL,params = params)
    
        data = res.json()

        marketClosure = data[0].get("closed")
    
        if (marketClosure):
            
            #load as list
            id_list = json.loads(data[0]['clobTokenIds'])     
            price_list = json.loads(data[0]['outcomePrices'])


            indexlist = id_list.index(str(row.asset))

            WLmap[str(row.asset)] = indexlist


    print(WLmap)


    groups = db.query(Trade.wallet_address, Trade.asset).filter(
        Trade.asset.in_(WLmap.keys())
    ).distinct().all()
            
    print("found" + len(groups) + "user positions")

    for wallet,asset in groups:
        finalPrice = WLmap[asset]

        #find all trades for a wallet and the asset 
        trades = db.query(Trade).filter(
            Trade.wallet_address == wallet, 
            Trade.asset == asset
        ).order_by(Trade.timestamp.asc()).all()

        #queue to hold all trades for an asset
        buy_queue = []

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

                while sellnum > 0 and buy_queue:
                    oldest = buy_queue[0]
                    matched = min(sellnum,oldest["remaining"])


                profitOne = (trade.price-oldest["entry_price"]) * matched

                profit += profitOne
                sellnum -= matched
                oldest["remaining"] -=matched

                if oldest['remaining'] <= 0:
                    buy_queue.pop(0)
 
            
            trade.realized_pnl = profit
            trade.status = "SOLD"
        
        #if existing shares held till resolved
        for item in buy_queue:
            if item['remaining'] > 0:
                res_profit = (finalPrice - item['entry_price']) * item['remaining']
                
                item['row'].realized_pnl += res_profit
                item['row'].status = "CLOSED"

        db.commit()
        db.close()




if __name__ == "__main__":
    ##CalcUnrealizedPnL()
    CalcRealizedPnL()
