from db import Whale, Trade, SessionLocal, create_engine
from sqlalchemy import select
import requests
import time

def CalcUnrealizedPnL():

    db = SessionLocal()

    rows = db.query(Trade).filter(Trade.status=="OPEN").all()
    print(f"🔄 Starting audit on {len(rows)} trades...")


    for row in rows:

        params = {
        "token_id" : str(row.asset),
        "side" :"BUY",
        }

        try :
            res = requests.get("https://clob.polymarket.com/price", params = params)
            data = res.json()
            
            if data.get("error") and "No orderbook exists for the requested token id" in data["error"]:
                print("market closed")
                row.status = "CLOSED"


            elif data.get("price"):


                    current_price = float(data.get("price")) 
                    pnl_per_share = current_price - row.price

                    row.unrealized_pnl = pnl_per_share * row.size

                    
                    print(f"✅ PnL Update: ${row.unrealized_pnl:,.2f}")

        
        except Exception as e:
            print(e)

        time.sleep(0.2) 

    db.commit()
    db.close()


if __name__ == "__main__":
    CalcUnrealizedPnL()
