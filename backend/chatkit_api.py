"""
ChatKit-powered RAG API with Neon Postgres and Qdrant integration.
"""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import asyncpg
import os
import logging
from contextlib import asynccontextmanager
from loguru import logger
import asyncio
from openai import AsyncOpenAI
from qdrant_client import AsyncQdrantClient
from qdrant_client.http import models
import json
import uuid
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Pydantic models
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime
    conversation_id: str

class ChatQuery(BaseModel):
    conversation_id: str
    message: str
    selected_text: Optional[str] = None

class ChatResponse(BaseModel):
    conversation_id: str
    response: str
    sources: List[str]
    timestamp: datetime

class ConversationHistory(BaseModel):
    conversation_id: str
    messages: List[ChatMessage]

class ChatKitRAGService:
    def __init__(self):
        # Initialize OpenAI client
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            raise ValueError("GEMINI_API_KEY must be set in environment variables")

        self.openai_client = AsyncOpenAI(
            api_key=gemini_api_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )
        self.model = "gemini-2.0-flash"

        # Initialize Qdrant client
        qdrant_url = os.getenv("QDRANT_URL")
        qdrant_api_key = os.getenv("QDRANT_API_KEY")

        if not qdrant_url or not qdrant_api_key:
            raise ValueError("QDRANT_URL and QDRANT_API_KEY must be set in environment variables")

        self.qdrant_client = AsyncQdrantClient(
            url=qdrant_url,
            api_key=qdrant_api_key,
            prefer_grpc=True
        )

        # Initialize Neon Postgres connection string
        self.neon_dsn = os.getenv("NEON_DATABASE_URL")
        if not self.neon_dsn:
            raise ValueError("NEON_DATABASE_URL must be set in environment variables")

        # Initialize Qdrant collection
        self.collection_name = "book_content"

    async def initialize_qdrant(self):
        """Initialize Qdrant collection if it doesn't exist."""
        try:
            collections = await self.qdrant_client.get_collections()
            collection_names = [c.name for c in collections.collections]

            if self.collection_name not in collection_names:
                await self.qdrant_client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE)
                )
                logger.info(f"Created Qdrant collection '{self.collection_name}' with 384-dim vectors")
            else:
                logger.info(f"Qdrant collection '{self.collection_name}' already exists")
        except Exception as e:
            logger.error(f"Failed to initialize Qdrant collection: {e}")
            raise

    async def search_documents(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search documents in Qdrant based on the query."""
        # In a real implementation, we would need to embed the query
        # For now, using a mock implementation
        try:
            # This is a simplified search - in reality you'd need to embed the query first
            search_results = await self.qdrant_client.search(
                collection_name=self.collection_name,
                query_text=query,  # This would normally be a vector
                limit=limit
            )

            results = []
            for result in search_results:
                results.append({
                    "content": result.payload.get("content", ""),
                    "doc_path": result.payload.get("doc_path", ""),
                    "score": result.score
                })

            return results
        except Exception as e:
            logger.error(f"Error searching documents: {e}")
            return []

    async def get_conversation_history(self, conversation_id: str) -> List[ChatMessage]:
        """Retrieve conversation history from Neon Postgres."""
        try:
            conn = await asyncpg.connect(self.neon_dsn)
            try:
                # Create table if it doesn't exist
                await conn.execute('''
                    CREATE TABLE IF NOT EXISTS conversations (
                        id UUID PRIMARY KEY,
                        conversation_id TEXT NOT NULL,
                        message_role TEXT NOT NULL,
                        message_content TEXT NOT NULL,
                        timestamp TIMESTAMP DEFAULT NOW(),
                        INDEX idx_conversation_id (conversation_id),
                        INDEX idx_timestamp (timestamp)
                    )
                ''')

                rows = await conn.fetch('''
                    SELECT message_role, message_content, timestamp
                    FROM conversations
                    WHERE conversation_id = $1
                    ORDER BY timestamp ASC
                ''', conversation_id)

                messages = []
                for row in rows:
                    messages.append(ChatMessage(
                        role=row['message_role'],
                        content=row['message_content'],
                        timestamp=row['timestamp'],
                        conversation_id=conversation_id
                    ))

                return messages
            finally:
                await conn.close()
        except Exception as e:
            logger.error(f"Error retrieving conversation history: {e}")
            return []

    async def save_message(self, message: ChatMessage):
        """Save a message to Neon Postgres."""
        try:
            conn = await asyncpg.connect(self.neon_dsn)
            try:
                await conn.execute('''
                    INSERT INTO conversations (id, conversation_id, message_role, message_content, timestamp)
                    VALUES ($1, $2, $3, $4, $5)
                ''',
                uuid.uuid4(),
                message.conversation_id,
                message.role,
                message.content,
                message.timestamp
                )
            finally:
                await conn.close()
        except Exception as e:
            logger.error(f"Error saving message: {e}")

    async def generate_response(self, query: str, context: str = None, selected_text: str = None) -> str:
        """Generate response using the LLM with optional context."""
        try:
            # Build the prompt based on the inputs
            if selected_text:
                # Selection-based query
                prompt = f"""
                Selected text: {selected_text}

                Question: {query}

                Please answer the question based ONLY on the provided selected text.
                If the selected text does not contain sufficient information to answer the question, respond with "I don't know".
                """
            elif context:
                # RAG-based query with context
                prompt = f"""
                Context information is below:
                {context}

                Using the provided context information, answer the question: {query}

                If the context does not contain sufficient information to answer the question, respond with "I don't know".
                """
            else:
                # General query without context
                prompt = f"""
                Please answer the question: {query}

                If you don't have sufficient information to answer the question, respond with "I don't know".
                """

            response = await self.openai_client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant for the Embodied Intelligence textbook. Answer questions based on the provided context. If the context is insufficient, respond with 'I don't know'."
                    },
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.1
            )

            answer = response.choices[0].message.content.strip()

            # Check if the answer is "I don't know"
            if "i don't know" in answer.lower():
                return "I don't know"

            return answer
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return "Sorry, I encountered an error processing your request."

# Global service instance
chatkit_service: Optional[ChatKitRAGService] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize services on startup."""
    global chatkit_service
    try:
        chatkit_service = ChatKitRAGService()
        await chatkit_service.initialize_qdrant()
        logger.info("ChatKit RAG service initialized successfully")
        yield
    except Exception as e:
        logger.error(f"Error during application startup: {e}")
        raise
    finally:
        logger.info("Application shutdown")

# Create FastAPI app
app = FastAPI(
    title="ChatKit RAG API",
    description="RAG-powered chatbot API using ChatKit, FastAPI, Neon Postgres, and Qdrant",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

@app.post("/chat/query", response_model=ChatResponse)
async def chat_query(query: ChatQuery):
    """Handle chat queries with RAG capabilities."""
    global chatkit_service
    if not chatkit_service:
        raise HTTPException(status_code=500, detail="ChatKit RAG service not initialized")

    try:
        # Get conversation history
        history = await chatkit_service.get_conversation_history(query.conversation_id)

        # Search for relevant documents if not using selected text
        context = ""
        sources = []
        if not query.selected_text:
            docs = await chatkit_service.search_documents(query.message)
            if docs:
                context = "\n\n".join([doc["content"] for doc in docs])
                sources = list(set([doc["doc_path"] for doc in docs]))

        # Generate response
        response_text = await chatkit_service.generate_response(
            query.message,
            context,
            query.selected_text
        )

        # Create response message
        response_msg = ChatMessage(
            role="assistant",
            content=response_text,
            timestamp=datetime.utcnow(),
            conversation_id=query.conversation_id
        )

        # Save both user message and assistant response
        user_msg = ChatMessage(
            role="user",
            content=query.selected_text + ": " + query.message if query.selected_text else query.message,
            timestamp=datetime.utcnow(),
            conversation_id=query.conversation_id
        )

        await chatkit_service.save_message(user_msg)
        await chatkit_service.save_message(response_msg)

        return ChatResponse(
            conversation_id=query.conversation_id,
            response=response_text,
            sources=sources,
            timestamp=datetime.utcnow()
        )
    except Exception as e:
        logger.error(f"Error processing chat query: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.get("/chat/history/{conversation_id}", response_model=ConversationHistory)
async def get_conversation_history(conversation_id: str):
    """Retrieve conversation history."""
    global chatkit_service
    if not chatkit_service:
        raise HTTPException(status_code=500, detail="ChatKit RAG service not initialized")

    try:
        history = await chatkit_service.get_conversation_history(conversation_id)
        return ConversationHistory(conversation_id=conversation_id, messages=history)
    except Exception as e:
        logger.error(f"Error retrieving conversation history: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving history: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)