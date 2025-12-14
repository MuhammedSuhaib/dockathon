from dotenv import load_dotenv
from openai import AsyncOpenAI
import os
import asyncio

load_dotenv()

# Note: Google's OpenAI-compatible endpoint usually remains at /v1beta/openai/
# even for newer models.
client = AsyncOpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

async def test():
    try:
        r = await client.chat.completions.create(
            # Standard efficient model for late 2025
            model="gemini-2.5-flash", 
            
            # Or use the bleeding edge (if available in your region/tier):
            # model="gemini-3-pro-preview",
            
            messages=[{"role": "user", "content": "ping"}]
        )
        print(r.choices[0].message.content)
    except Exception as e:
        print("ERROR:", e)

asyncio.run(test())