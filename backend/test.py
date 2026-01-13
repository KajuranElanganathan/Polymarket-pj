from db import Trade, SessionLocal


db = SessionLocal()

print(db.query(Trade).filter(Trade.unrealized_pnl != 0).count())

db.close()
