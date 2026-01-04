from db import Whale, Trade, SessionLocal, create_engine
from sqlalchemy import select
import requests
import time
import json 


def updateRPnL():

    db = SessionLocal()
    print("Finding whales")


    wallets = db.query(Trade.wallet_address).filter(Trade.status == "CLOSED").distinct().all()

    for (wallet,) in wallets:

        PnLCounter= 0.0

        trades = db.query(Trade).filter(
            Trade.wallet_address == wallet, 
        ).order_by(Trade.timestamp.asc()).all()

        for trade in trades:

            if trade.realized_pnl:
                PnLCounter += trade.realized_pnl
    
        entry = db.query(Whale).filter(Whale.address == wallet).first()

        if (entry):
            entry.total_r_pnl =PnLCounter

        else:
            db_wallet = Whale(
                is_tracked = True,
                address = wallet,
                total_r_pnl = PnLCounter,
                total_u_pnl = 0.0
            )
            db.add(db_wallet)

    db.commit()
    db.close()

                
def updateUPnL():
    db = SessionLocal()
    print("Finding whales")

    wallets = db.query(Trade.wallet_address).filter(Trade.status == "OPEN").distinct().all()

    for (wallet,) in wallets:

        PnLCounter= 0.0

        trades = db.query(Trade).filter(
            Trade.wallet_address == wallet, 
        ).order_by(Trade.timestamp.asc()).all()

        for trade in trades:

            if trade.unrealized_pnl:
                PnLCounter = trade.unrealized_pnl
    
        entry = db.query(Whale).filter(Whale.address == wallet).first()

        if (entry):
            entry.total_u_pnl +=PnLCounter

        else:
            db_wallet = Whale(
                is_tracked = True,
                address = wallet,
                total_r_pnl = 0.0,
                total_u_pnl = PnLCounter
            )
            db.add(db_wallet)

    db.commit()
    db.close()
