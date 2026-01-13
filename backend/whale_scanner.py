from db import Whale, Trade, SessionLocal
from sqlalchemy import func
import json
import requests

# whale criteria
THRESHOLD_VOLUME = 50_000.0   
THRESHOLD_PNL = 5_000.0       
THRESHOLD_COUNT = 10       

def scanWhales():
    db = SessionLocal()
    print(f"   Criteria: Vol>${THRESHOLD_VOLUME} | PnL>${THRESHOLD_PNL} | Trades>{THRESHOLD_COUNT}")

    wallets = db.query(Trade.wallet_address).distinct().all()
    
    print(f"Scanning {len(wallets)} unique wallets")
    
    whales_added = 0

    for (wallet,) in wallets:
        if not wallet: 
            continue

        stats = db.query(
            func.count(Trade.id),               
            func.sum(Trade.size * Trade.price)  
        ).filter(Trade.wallet_address == wallet).first()
        
        trade_count = stats[0] or 0.0
        total_volume = stats[1] or 0.0

        r_pnl = db.query(func.sum(Trade.realized_pnl)).filter(
            Trade.wallet_address == wallet
        ).scalar() or 0.0
        u_pnl = db.query(func.sum(Trade.unrealized_pnl)).filter(
            Trade.wallet_address == wallet,
            Trade.status == "OPEN"
        ).scalar() or 0.0

        is_high_volume = total_volume >= THRESHOLD_VOLUME
        is_high_rpnl = r_pnl >= THRESHOLD_PNL
        is_active = trade_count >= THRESHOLD_COUNT
        
        isWhale = is_high_volume and is_high_rpnl and is_active
        
        existing_whale = db.query(Whale).filter(Whale.address == wallet).first()

        if isWhale:

            if existing_whale:
                existing_whale.total_r_pnl = r_pnl
                existing_whale.total_u_pnl = u_pnl
                existing_whale.total_volume = total_volume
                existing_whale.trade_count = trade_count
                existing_whale.is_tracked = True 
            else:
                new_whale = Whale(
                    address=wallet,
                    username=None,
                    is_tracked=True,
                    total_r_pnl=r_pnl,
                    total_u_pnl=u_pnl,
                    total_volume=total_volume,
                    trade_count=trade_count
                )
                db.add(new_whale)
            
            whales_added += 1
            
        else:
            if existing_whale:
                existing_whale.is_tracked = False
            

    db.commit()
    db.close()
    

    print("complete,sucess")

def findUserName():
    db = SessionLocal() 
    
    # take all whales in db
    whales = db.query(Whale).all()

    for whale in whales:
        if whale.username:
            continue

        try:
            URL = "https://gamma-api.polymarket.com/public-profile"
            
            params = {
                "address": whale.address 
            }
            
            res = requests.get(URL, params=params)
            data = res.json()

            if data.get("name"):
                whale.username = data.get("name")
                
        except Exception as e:
            print(f"Error: {e}")
    
    db.commit()
    db.close()

if __name__ == "__main__":
    scanWhales()
    findUserName()