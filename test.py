import requests
import json

URL = "https://data-api.polymarket.com/trades"

params = {
    "limit": 5
}

response = requests.get(URL, params=params)

trades = response.json()

print(json.dumps(trades[0], indent=2))
