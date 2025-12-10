import os
import json
from datetime import datetime
from typing import AsyncIterator
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import Response, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from openai import AsyncOpenAI

from chatkit.server import ChatKitServer, StreamingResult
from chatkit.types import (
    AssistantMessageItem,
    AssistantMessageContent,
    ThreadItemDoneEvent,
    ThreadMetadata,
    UserMessageItem,
    ThreadStreamEvent,
)

from my_store import MyChatKitStore

# Import RAG components (only initialize if needed)
from rag import RAGService
from embeddings import EmbeddingService
from vector_store import VectorStore

# Import auth module
from auth import get_current_user_optional

load_dotenv()

# Initialize Qwen client
KEY = os.getenv("KEY")  # This should be your Qwen API key

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


class QwenChatKitServer(ChatKitServer[dict]):
    def __init__(self, store):
        super().__init__(store=store)
        self._rag_service = None
        self._vector_store = None
        self._embedding_service = None

    @property
    def rag_service(self):
        """Lazy initialization of RAG service with error handling"""
        if self._rag_service is None:
            try:
                self._embedding_service = EmbeddingService()
                self._vector_store = VectorStore(collection_name="book_content")
                self._rag_service = RAGService()
                self._rag_service.set_vector_store(self._vector_store)
            except Exception as e:
                print(f"Warning: Could not initialize RAG service: {e}")
                return None
        return self._rag_service

    async def _build_conversation_history(self, thread: ThreadMetadata, context: dict) -> list:
        """Build conversation history from thread items."""
        try:
            page = await self.store.load_thread_items(thread.id, None, 100, "asc", context)
            messages = []

            for item in page.data:
                if hasattr(item, 'type'):
                    if item.type == "user_message":
                        content_text = ""
                        if hasattr(item, 'content') and item.content:
                            for part in item.content:
                                if hasattr(part, 'text'):
                                    content_text += part.text
                        if content_text:
                            messages.append({"role": "user", "content": content_text})
                    elif item.type == "assistant_message":
                        content_text = ""
                        if hasattr(item, 'content') and item.content:
                            for part in item.content:
                                if hasattr(part, 'text'):
                                    content_text += part.text
                        if content_text:
                            messages.append({"role": "assistant", "content": content_text})

            return messages
        except Exception as e:
            print(f"Error building conversation history: {e}")
            return []

    async def respond(
        self,
        thread: ThreadMetadata,
        input_user_message: UserMessageItem,
        context: dict,
    ) -> AsyncIterator[ThreadStreamEvent]:
        """
        Respond to user message using Qwen API.
        """
        try:
            # Extract user message content
            user_content = ""
            if hasattr(input_user_message, 'content') and input_user_message.content:
                for part in input_user_message.content:
                    if hasattr(part, 'text'):
                        user_content += part.text

            if not user_content:
                yield ThreadItemDoneEvent(
                    item=AssistantMessageItem(
                        thread_id=thread.id,
                        id=self.store.generate_item_id("message", thread, context),
                        created_at=datetime.now(),
                        content=[AssistantMessageContent(text="I didn't understand your message. Please try again.")],
                    )
                )
                return

            # Try to get RAG-based response if RAG is available
            rag_response = None
            rag_available = self.rag_service is not None
            if rag_available:
                try:
                    rag_response = self.rag_service.query(user_content)
                except Exception as e:
                    print(f"RAG query failed: {e}")
                    rag_available = False

            response_text = ""
            if rag_available and rag_response and rag_response.answer.lower() != "i don't know" and rag_response.answer.strip():
                # Use RAG response
                response_text = rag_response.answer
            else:
                # Use Qwen API directly
                messages = []
                # Add conversation history if available
                conversation_history = await self._build_conversation_history(thread, context)
                for msg in conversation_history:
                    messages.append({"role": msg["role"], "content": msg["content"]})

                # Add current user message
                messages.append({"role": "user", "content": user_content})

                chat = await client.chat.completions.create(
                    model="qwen-plus",
                    messages=messages,
                    max_tokens=500,
                    temperature=0.7
                )

                response_text = chat.choices[0].message.content

            # Yield the assistant response
            yield ThreadItemDoneEvent(
                item=AssistantMessageItem(
                    thread_id=thread.id,
                    id=self.store.generate_item_id("message", thread, context),
                    created_at=datetime.now(),
                    content=[AssistantMessageContent(text=response_text)],
                )
            )

        except Exception as e:
            print(f"Error in respond method: {e}")
            yield ThreadItemDoneEvent(
                item=AssistantMessageItem(
                    thread_id=thread.id,
                    id=self.store.generate_item_id("message", thread, context),
                    created_at=datetime.now(),
                    content=[AssistantMessageContent(text="Sorry, I encountered an error processing your request. Please try again.")],
                )
            )


# Create the server instance with the store (defer initialization until needed)
def get_server():
    return QwenChatKitServer(store=MyChatKitStore())

server = None  # Initialize later


@app.post("/chatkit")
async def chatkit(request: Request):
    """Main ChatKit endpoint that processes incoming requests."""
    global server
    if server is None:
        server = get_server()

    result = await server.process(await request.body(), context={})

    if isinstance(result, StreamingResult):
        return StreamingResponse(result, media_type="text/event-stream")
    return Response(content=result.json, media_type="application/json")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "ChatKit server with Qwen is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)