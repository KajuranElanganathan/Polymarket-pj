import requests
import json 
import time
from db import Whale, Trade, SessionLocal

def find_wallet():

    db = SessionLocal()

    URL = "https://data-api.polymarket.com/trades"

    params = {
    "limit": 2000,
    }
    print("scanning trades")
    
    try:
        response = requests.get(URL,params=params)
        trades = response.json()
    except Exception as e:
        print(e)
        db.close()
        return

    
    for trade in trades:

        try:
            size = float(trade.get("size", 0))
        except ValueError:
            size = 0

        if (size > 5000):
            db_trade = Trade(

                wallet_address = trade.get("proxyWallet"),
                size = size,
                side = trade.get("side"),
                price = trade.get("price"),
                timestamp =int(trade.get("timestamp")),
                asset = trade.get("asset"),

            )
    
            db.add(db_trade)
    

    try:
        print("success")
        db.commit()
    except Exception as e:
        print(e)
    finally:
        db.close()



if __name__ == "__main__":

    while True:
        print("tracking in progress")

        try:
            find_wallet()

            sleep_time = 80

            print("waiting")

            time.sleep(sleep_time)

        except KeyboardInterrupt:

            print("Stopping tracker")
            break
        except Exception as e:
            print(e)

            time.sleep(60)