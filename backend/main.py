from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal, Trade, Whale
from typing import List, Optional
import requests
from sqlalchemy import desc
from fastapi.middleware.cors import CORSMiddleware



def get_top_markets_by_volume():
    URL = "https://gamma-api.polymarket.com/markets"

    params = {
        "limit": 50,              
        "order": "volume",       
        "ascending": "false",    
        "closed": "false",       
        "active": "true"         
    }

    try:
        response = requests.get(URL, params=params)
        data = response.json()
        return data
    except Exception as e:
        print(f"Error: {e}")
        return []


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows your React app to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "online":"true"
    }


@app.get("/home")
def getData():
    data = get_top_markets_by_volume()
    return data



@app.get("/whales")
def get_whales(db: Session = Depends(get_db)): 

    whales = db.query(Whale).all()

    return whales


@app.get("/trades")
def get_trades(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):    
    trades = db.query(Trade).order_by(desc(Trade.timestamp)).offset(skip).limit(limit).all()
    
    return trades







