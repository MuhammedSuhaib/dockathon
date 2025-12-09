import os
import json
from datetime import datetime
from typing import AsyncIterator

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import Response, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from openai import AsyncOpenAI

from chatkit.server import ChatKitServer
from chatkit.types import (
    AssistantMessageItem,
    AssistantMessageContent,
    ThreadItemDoneEvent,
    ThreadMetadata,
    UserMessageItem,
    ThreadStreamEvent,
)

from my_store import MyChatKitStore

load_dotenv()

KEY = os.getenv("KEY")

client = AsyncOpenAI(
    api_key=KEY,
    base_url="https://portal.qwen.ai/v1"
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class MyServer(ChatKitServer[dict]):
    async def respond(
        self,
        thread: ThreadMetadata,
        input_user_message: UserMessageItem,
        context: dict,
    ) -> AsyncIterator[ThreadStreamEvent]:

        messages = []
        page = await self.store.load_thread_items(thread.id, None, 50, "asc", context)
        for item in page.data:
            if item.type == "user_message":
                messages.append({"role": "user", "content": item.content[0].text})
            elif item.type == "assistant_message":
                messages.append({"role": "assistant", "content": item.content[0].text})

        chat = await client.chat.completions.create(
            model="qwen-plus",
            messages=messages,
            stream=True,
        )

        async for chunk in chat:
            delta = chunk.choices[0].delta
            if delta and delta.content:
                yield ThreadItemDoneEvent(
                    item=AssistantMessageItem(
                        thread_id=thread.id,
                        id=self.store.generate_item_id(
                            "message", thread, context
                        ),
                        created_at=datetime.now(),
                        content=[AssistantMessageContent(text=delta.content)],
                    )
                )


server = MyServer(store=MyChatKitStore())


@app.post("/chatkit")
async def chatkit(request: Request):
    raw = await request.body()
    result = await server.process(raw, context={})

    if hasattr(result, "__aiter__"):
        return StreamingResponse(result, media_type="text/event-stream")

    return Response(content=result.json, media_type="application/json")