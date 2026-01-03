import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, String, Float, Integer, BigInteger, Boolean
import os
from dotenv import load_dotenv


load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

class Whale(Base):
    __tablename__ = "whales"

    address = Column(String,primary_key=True)
    username = Column(String,nullable=True)
    is_tracked = Column(Boolean,default=True)
    total_r_pnl = Column(Float, default=0.0)
    total_u_pnl = Column(Float, default=0.0)

class Trade(Base):
    __tablename__ = "trades"
    id = Column(Integer, primary_key=True, autoincrement=True)
    wallet_address = Column(String, index=True)
    asset = Column(String)          
    side = Column(String)           
    size = Column(Float)           
    price = Column(Float)           
    timestamp = Column(BigInteger)
    
    #Status: 'OPEN' (Active), 'CLOSED' (Event Finished), 'SOLD' (Exited early)
    status = Column(String, default="OPEN")
    realized_pnl = Column(Float, default=0.0)
    unrealized_pnl = Column(Float, default=0.0)

def init_db():
    try:
        Base.metadata.create_all(bind=engine)

    except Exception as e:
        print(e)


init_db()