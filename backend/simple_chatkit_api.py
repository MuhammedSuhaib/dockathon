import os
import uuid
import asyncio
from datetime import datetime
from fastapi import FastAPI, Request, Response
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from openai import OpenAI

from openai.chatkit.server import ChatKitServer
from openai.chatkit.types import (
    ThreadMetadata,
    UserMessageItem,
    AssistantMessageItem,
    AssistantMessageContent,
    ThreadStreamEvent,
    ThreadItemDoneEvent,
)
from openai_chatkit.results import StreamingResult
# core imports
import os

# chatkit client
from openai_chatkit import ChatKit

# message types (needed if you handle types directly)
from openai_chatkit.types import (
    ThreadCreateParams,
    MessageCreateParams,
    RunCreateParams,
)

from my_store import MyChatKitStore

load_dotenv()

# Qwen client
client = OpenAI(
    api_key=os.getenv("KEY"),
    base_url="https://portal.qwen.ai/v1"
)

MODEL = "qwen-plus"


class MyChatKit(MyChatKitServer := ChatKitServer[dict]):

    async def respond(
        self,
        thread: ThreadMetadata,
        input_user_message: UserMessageItem | None,
        context: dict,
    ):
        # extract user text
        text = ""
        if input_user_message and input_user_message.content:
            for c in input_user_message.content:
                if hasattr(c, "text"):
                    text += c.text

        # build short history (last 20 msgs)
        items_page = await self.store.load_thread_items(
            thread.id, None, 20, "asc", context
        )

        msgs = [
            {"role": "system", "content": "You are a helpful assistant."}
        ]

        for item in items_page.data:
            buf = ""
            if item.content:
                for c in item.content:
                    if hasattr(c, "text"):
                        buf += c.text
            if not buf:
                continue

            if isinstance(item, UserMessageItem):
                msgs.append({"role": "user", "content": buf})
            else:
                msgs.append({"role": "assistant", "content": buf})

        msgs.append({"role": "user", "content": text})

        # call Qwen
        res = client.chat.completions.create(
            model=MODEL,
            messages=msgs,
            temperature=0.7,
            max_tokens=300,
        )

        answer = res.choices[0].message.content.strip()

        # stream back to ChatKit
        item = AssistantMessageItem(
            thread_id=thread.id,
            id=str(uuid.uuid4()),
            created_at=datetime.now(),
            content=[AssistantMessageContent(text=answer)],
        )

        yield ThreadItemDoneEvent(item=item)


# create server
server = MyChatKit(store=MyChatKitStore())

# fastapi wrapper
app = FastAPI()


@app.post("/chatkit")
async def chatkit(request: Request):
    result = await server.process(await request.body(), context={})
    if isinstance(result, StreamingResult):
        return StreamingResponse(result, media_type="text/event-stream")
    return Response(content=result.json, media_type="application/json")


@app.get("/health")
async def health():
    return {"status": "ok"}
