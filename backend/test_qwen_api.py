import os
from openai import AsyncOpenAI
import asyncio
from dotenv import load_dotenv
load_dotenv()

KEY=os.getenv("KEY") 
print('KEY: ', KEY)

client = AsyncOpenAI(
    api_key=KEY,
    base_url="https://portal.qwen.ai/v1" 
)

async def test():
    try:
        print("Sending request...")
        r = await client.chat.completions.create(
            model="qwen3-coder-plus", 
            messages=[{"role": "user", "content": "ping"}]
        )
        print("Response:", r.choices[0].message.content)
    except Exception as e:
        print("ERROR:", e)

if __name__ == "__main__":
    asyncio.run(test())