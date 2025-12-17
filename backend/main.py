import logging
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from agents import Runner
from simple_agents.aagents import Triage_Agent
from pydantic import BaseModel
from services.rag import RAGService
from data.vector_store import VectorStore
from database import db_manager, init_db, save_conversation, get_conversations, get_conversation_messages

# Initialize services globally but handle initialization errors gracefully
try:
    vector_store = VectorStore()
    rag_service = RAGService()
    rag_service.set_vector_store(vector_store)
except Exception as e:
    logging.error(f"Failed to initialize services: {e}")
    vector_store = None
    rag_service = None

def get_user_id(request: Request, user_id: str = None) -> str:
    """Get user ID from request - either from parameter or generate temporary ID."""
    if user_id:
        return user_id
    # For Next.js + Better Auth, we may receive session information in headers/cookies
    # For now, fallback to IP-based ID if no user_id provided
    client_ip = request.client.host
    return f"ip_{hash(client_ip) % 1000000}"

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database connection pool and create tables
    try:
        await db_manager.init_pool()
        await init_db()
        logging.info("Database initialized successfully")
    except Exception as e:
        logging.error(f"Failed to initialize database: {e}")
        raise

    yield  # Application runs here

    # Cleanup on shutdown
    await db_manager.close_pool()
    logging.info("Database connection pool closed")

app = FastAPI(lifespan=lifespan)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://muhammedsuhaib.github.io",
        "http://localhost:3000",  # Next.js dev
        "http://localhost:3001",  # Next.js dev alternative
        "http://localhost:8080",  # Legacy
        "http://localhost:4000",  # Legacy
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Pydantic Models for Frontend Requests
# ---------------------------

# Matches the payload for the general chat endpoint (/api/query)
class QueryRequest(BaseModel):
    query: str

# Matches the payload for the selection endpoint (/api/selection)
class SelectionRequest(BaseModel):
    selected_text: str
    question: str

# Matches the payload for the translation endpoint (/api/translate-text)
class TranslationRequest(BaseModel):
    text: str
    target_language: str

# ---------------------------
# FastAPI Endpoints (Matching React expectations)
# ---------------------------

@app.get("/")
def read_root():
    return {"message": "Python Assistant Backend is running."}

@app.post("/api/query")
async def handle_query(req: QueryRequest, request: Request, user_id: str = None):
    """Handles general chat queries from the React component."""
    # Generate temporary user ID based on client IP if none provided
    actual_user_id = get_user_id(request, user_id)
    logging.info(f"Received general query from user {actual_user_id}: {req.query}")

    # Check if services are properly initialized
    if not rag_service or not vector_store:
        logging.error("RAG service not initialized")
        return {
            "answer": "Service temporarily unavailable",
            "sources": []
        }

    # Use global RAG service to get context from Qdrant
    # Get relevant context from Qdrant
    try:
        rag_result = await rag_service.query(req.query)
        print(rag_result)
        print(rag_result.sources)
        context = rag_result.answer if rag_result.answer != "I don't know" else ""
    except Exception as e:
        logging.error(f"RAG query failed: {e}")
        # Fallback to no context if RAG fails
        rag_result = None
        context = ""

    # Include context in the agent's query if available
    if context and context != "I don't know":
        enhanced_query = f"Based on the following context: {context}\n\nQuestion: {req.query}"
    else:
        enhanced_query = req.query

    # Run the main agent with the enhanced query
    result = await Runner.run(
        Triage_Agent,
        enhanced_query
    )

    # Save conversation to database
    try:
        await save_conversation(
            user_id=actual_user_id,
            title=req.query[:40] if len(req.query) > 40 else req.query,
            messages=[
                {"role": "user", "content": req.query},
                {"role": "assistant", "content": result.final_output},
            ]
        )
    except Exception as e:
        logging.error(f"Failed to save conversation: {e}")
        # Don't fail the request if saving conversation fails

    # CRITICAL: Response structure must match React component: {"answer": "...", "sources": []}
    return {
        "answer": result.final_output,
        "sources": rag_result.sources if rag_result and hasattr(rag_result, 'sources') else [] # Must be included, even if empty
    }

@app.post("/api/selection")
async def handle_selection(req: SelectionRequest, request: Request, user_id: str = None):
    """Handles queries based on selected text (RAG context)."""
    # Generate temporary user ID based on client IP if none provided
    actual_user_id = get_user_id(request, user_id)
    logging.info(f"Received selection query from user {actual_user_id}. Question: {req.question}")

    # Check if services are properly initialized
    if not rag_service or not vector_store:
        logging.error("RAG service not initialized")
        return {
            "answer": "Service temporarily unavailable",
            "sources": []
        }

    # Use global RAG service to get additional context from Qdrant
    # Get relevant context from Qdrant based on the question
    try:
        rag_result = await rag_service.query(req.question)
        additional_context = rag_result.answer if rag_result.answer != "I don't know" else ""
    except Exception as e:
        logging.error(f"RAG query failed: {e}")
        # Fallback to no context if RAG fails
        rag_result = None
        additional_context = ""

    # Construct a RAG-style prompt for the agent
    if additional_context and additional_context != "I don't know":
        prompt = (
            f"Based *only* on the following context, answer the user's question. "
            f"If the context does not contain the answer, state that. "
            f"Context: \"{req.selected_text}\"\n\nAdditional context from knowledge base: {additional_context} "
            f"Question: {req.question}"
        )
    else:
        prompt = (
            f"Based *only* on the following context, answer the user's question. "
            f"If the context does not contain the answer, state that. "
            f"Context: \"{req.selected_text}\" "
            f"Question: {req.question}"
        )
    # Run the agent with the context-aware prompt
    result = await Runner.run(
        Triage_Agent,
        prompt
    )

    # Save conversation to database
    try:
        await save_conversation(
            user_id=actual_user_id,
            title=req.question[:40] if len(req.question) > 40 else req.question,
            messages=[
                {"role": "user", "content": f"Context: {req.selected_text}\nQuestion: {req.question}"},
                {"role": "assistant", "content": result.final_output},
            ]
        )
    except Exception as e:
        logging.error(f"Failed to save conversation: {e}")
        # Don't fail the request if saving conversation fails

    # CRITICAL: Response structure must match React component: {"answer": "...", "sources": []}
    return {
        "answer": result.final_output,
        "sources": rag_result.sources if rag_result and hasattr(rag_result, 'sources') else [] # Must be included, even if empty
    }

@app.get("/health")
def health_check():
    """Health check endpoint for Vercel deployment."""
    return {"status": "healthy", "message": "Backend is running"}

@app.post("/api/translate-text")
async def translate_text(req: TranslationRequest):
    """Translates text to the specified target language."""
    logging.info(f"Received translation request")
    from deep_translator import GoogleTranslator

    try:
        # Validate target language
        if req.target_language != 'ur':
            return {"error": "Currently only Urdu (ur) translation is supported"}

        # Perform translation
        translated = GoogleTranslator(source='en', target=req.target_language).translate(req.text)

        return {"translated_text": translated}
    except Exception as e:
        logging.error(f"Translation error: {e}")
        return {"error": str(e)}


# ---------------------------
# Database Endpoints for Conversation History
# ---------------------------

class SaveConversationRequest(BaseModel):
    user_id: str = None  # Optional user identifier
    title: str
    messages: list  # List of message objects with 'role' and 'content' keys


@app.post("/api/conversations")
async def save_conversation_endpoint(req: SaveConversationRequest):
    """Save a conversation to the database"""
    try:
        conversation_id = await save_conversation(req.user_id, req.title, req.messages)
        return {"conversation_id": str(conversation_id)}
    except Exception as e:
        logging.error(f"Failed to save conversation: {e}")
        raise HTTPException(status_code=500, detail="Failed to save conversation")


@app.get("/api/conversations")
async def get_conversations_endpoint(user_id: str = None):
    """Get all conversations for a user"""
    try:
        conversations = await get_conversations(user_id)
        return {"conversations": conversations}
    except Exception as e:
        logging.error(f"Failed to get conversations: {e}")
        raise HTTPException(status_code=500, detail="Failed to get conversations")


@app.get("/api/conversations/{conversation_id}")
async def get_conversation_messages_endpoint(conversation_id: str):
    """Get all messages for a specific conversation"""
    try:
        messages = await get_conversation_messages(conversation_id)
        return {"messages": messages}
    except Exception as e:
        logging.error(f"Failed to get conversation messages: {e}")
        raise HTTPException(status_code=500, detail="Failed to get conversation messages")
