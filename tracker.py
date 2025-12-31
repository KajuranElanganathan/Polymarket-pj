import requests
import json 
import time



def find_wallet():

    URL = "https://data-api.polymarket.com/trades"

    params = {
    "limit": 1000,
    #"user":wallet

    }
    response = requests.get(URL,params=params)

    trades = response.json()

    whale_wallets = []


    for trade in trades:

        size = trade.get("size")

        if (size > 5000):
            whale_wallets.append(trade.get("proxyWallet"))


    return whale_wallets


def find_user(whale_wallets):

    URL = "https://gamma-api.polymarket.com/public-profile"

    userNames =[]

    for wallet in whale_wallets:
        params = {

            "address": wallet,

        }
        response = requests.get(URL,params=params)
        x = response.json()
        
        userNames.append(x.get("name"))

    print(userNames)



wal = find_wallet()

find_user(wal)
