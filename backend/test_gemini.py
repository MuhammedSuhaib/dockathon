from dotenv import load_dotenv
import os
from openai import AsyncOpenAI
import asyncio

load_dotenv()

client = AsyncOpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

async def test():
    try:
        r = await client.chat.completions.create(
            model="gemini-2.0-flash",
            messages=[{"role": "user", "content": "ping"}]
        )
        print(r.choices[0].message["content"])
    except Exception as e:
        print("ERROR:", e)

asyncio.run(test())
