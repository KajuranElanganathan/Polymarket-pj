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
            



if __name__ == "__main__":
    ##CalcUnrealizedPnL()
    CalcRealizedPnL()
