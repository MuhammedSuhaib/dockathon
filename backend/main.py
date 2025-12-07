"""
Main FastAPI application for the Backend RAG System.
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
        # Initialize the vector store
        vector_store = VectorStore()
        
        # Initialize the RAG service
        rag_service = RAGService()
        rag_service.set_vector_store(vector_store)
        
        logger.info("Services initialized successfully")
        yield
    except Exception as e:
        logger.error(f"Error during application startup: {e}")
        raise
    finally:
        # Shutdown
        logger.info("Application shutdown")

# Create the FastAPI app with lifespan
app = FastAPI(
    title="Backend RAG API",
    description="API for the Backend RAG System for Physical AI & Humanoid Robotics",
    version="1.0.0",
    lifespan=lifespan
)

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