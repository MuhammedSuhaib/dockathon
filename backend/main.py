"""
Main FastAPI application for the Backend RAG System with ChatKit integration.
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from loguru import logger
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our modules (these will be imported after they are defined)
from embeddings import EmbeddingService
from vector_store import VectorStore
from rag import RAGService, QueryRequest, QueryResponse, SelectionRequest, SelectionResponse

# Import simple ChatKit API for MVP
from simple_chatkit_api import app as chatkit_app

# Global variable to hold the RAG service instance
rag_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler for FastAPI application.
    Initializes services on startup and cleans up on shutdown.
    """
    # Startup
    global rag_service
    try:
        # Only initialize RAG service if Qdrant credentials are available (for RAG features)
        qdrant_url = os.getenv("QDRANT_URL")
        qdrant_api_key = os.getenv("QDRANT_API_KEY")

        if qdrant_url and qdrant_api_key:
            # Initialize the vector store and RAG service for full functionality
            vector_store = VectorStore()
            rag_service = RAGService()
            rag_service.set_vector_store(vector_store)
            logger.info("Full RAG services initialized successfully")
        else:
            # For MVP without Qdrant, just initialize the ChatKit service
            logger.info("Qdrant not configured - ChatKit service will handle chat functionality")
            rag_service = None

        yield
    except Exception as e:
        logger.error(f"Error during application startup: {e}")
        raise
    finally:
        # Shutdown
        logger.info("Application shutdown")

# Create the main FastAPI app with lifespan
app = FastAPI(
    title="Backend RAG API with ChatKit",
    description="API for the Backend RAG System for Physical AI & Humanoid Robotics with ChatKit integration",
    version="1.0.0",
    lifespan=lifespan
)

# Mount the ChatKit API
app.mount("/chat", chatkit_app)

# Add logging configuration
logging.basicConfig(level=logging.INFO)

class HealthResponse(BaseModel):
    status: str

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint to verify the service is operational.

    Returns:
        HealthResponse: Status of the service
    """
    return HealthResponse(status="ok")

@app.post("/api/query", response_model=QueryResponse)
async def query_endpoint(request: QueryRequest):
    """
    Query endpoint that processes user questions against the indexed documents.

    Args:
        request: QueryRequest containing the user's question

    Returns:
        QueryResponse with the answer and source documents
    """
    try:
        if not rag_service:
            raise HTTPException(status_code=500, detail="RAG service not initialized")

        # Process the query using the RAG service
        response = rag_service.query(request.query)
        return response
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/selection", response_model=SelectionResponse)
async def selection_endpoint(request: SelectionRequest):
    """
    Selection endpoint that answers questions based only on provided text.

    Args:
        request: SelectionRequest containing selected text and question

    Returns:
        SelectionResponse with the answer
    """
    try:
        if not rag_service:
            raise HTTPException(status_code=500, detail="RAG service not initialized")

        # Process the selection-based request
        response = rag_service.answer_from_selection(request.selected_text, request.question)
        return response
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing selection: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Include middleware for error handling and logging
@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    try:
        response = await call_next(request)
        logger.info(f"Response status: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Request failed: {e}")
        raise