import requests
import os
import dotenv


def send_message(message):
    
    dotenv.load_dotenv()

    URL = os.getenv("DISCORD_URL")

    payload = {
        "content": message

    }

    header = {
        "Authorization": os.getenv("DISCORD_TOKEN")
    }


    res = requests.post(URL, payload, headers=header)



