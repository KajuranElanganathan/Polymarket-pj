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

    print(f" Found {len(unique_assets)} unique assets")

    URL = "https://gamma-api.polymarket.com/markets"
    WLmap = {} # Stores w/l resolution

    for (asset_id,) in unique_assets:
        params = {"clob_token_ids": str(asset_id)}
        
        try:
            res = requests.get(URL, params=params)
            data = res.json()

            # Safety check
            if data and data[0].get("closed"):
                market = data[0]
                
                # Parse the strings
                try:
                    id_list = json.loads(market.get('clobTokenIds', '[]'))     
                    price_list = json.loads(market.get('outcomePrices', '[]')) # ["1", "0"]
                    
                    if str(asset_id) in id_list:
                        index = id_list.index(str(asset_id))
                        
                        # BUG FIX 1: Get the PRICE, not the INDEX
                        final_price = float(price_list[index]) 
                        WLmap[str(asset_id)] = final_price
                        
                except Exception as e:
                    print(f"Parse error: {e}")
        
        except Exception as e:
            print(f"API error: {e}")
            
        time.sleep(0.2) # Rate limit

    # --- STEP 2: Replay the Trades ---
    
    # Only get users who traded assets that we successfully resolved above
    if not WLmap:
        print("No resolved assets found.")
        return

    groups = db.query(Trade.wallet_address, Trade.asset).filter(
        Trade.asset.in_(WLmap.keys())
    ).distinct().all()
            
    print(f"🔄 Replaying history for {len(groups)} user positions...")

    for wallet, asset in groups:
        finalPrice = WLmap[asset]

        # Get chronological history
        trades = db.query(Trade).filter(
            Trade.wallet_address == wallet, 
            Trade.asset == asset
        ).order_by(Trade.timestamp.asc()).all()

        buy_queue = [] # FIFO Inventory

        for trade in trades:
            # Reset current PnL to 0 to avoid double counting
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

                # BUG FIX 2: INDENTATION IS CRITICAL HERE
                while sellnum > 0 and buy_queue:
                    oldest = buy_queue[0]
                    matched = min(sellnum, oldest["remaining"])

                    # Math happens inside the loop
                    profitOne = (trade.price - oldest["entry_price"]) * matched
                    profit += profitOne
                    
                    # Decrement counters INSIDE the loop
                    sellnum -= matched
                    oldest["remaining"] -= matched

                    if oldest['remaining'] <= 0.00001: # Float safety
                        buy_queue.pop(0)

                trade.realized_pnl = profit
                trade.status = "SOLD"
        
        for item in buy_queue:
            if item['remaining'] > 0:
                res_profit = (finalPrice - item['entry_price']) * item['remaining']
                
                # Attribute profit to the original Buy row
                item['row'].realized_pnl += res_profit
                item['row'].status = "CLOSED"

    db.commit()
    db.close()
    print("PnL Calculation done.")




if __name__ == "__main__":
    ##CalcUnrealizedPnL()
    CalcRealizedPnL()
