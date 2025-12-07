# Backend RAG System

This backend system implements a Retrieval Augmented Generation (RAG) solution for the Physical AI & Humanoid Robotics project.

## Core Principles

This project adheres to the following core principles as defined in our [Constitution](../.specify/memory/constitution.md):

- **Reliability and deterministic behavior**: Backend operations are predictable and consistent across different environments and runs
- **Clean, reproducible indexing and embeddings**: The indexing process is reproducible with clear inputs and verifiable outputs
- **Clear separation between indexing and runtime serving**: Indexing operations are functionally separate from runtime query operations
- **No hardcoded secrets**: All sensitive information is stored in environment variables
- **Strict error handling and structured JSON responses**: Comprehensive error handling with descriptive messages
- **Predictable, testable RAG pipeline**: Designed for testability with clearly defined inputs, outputs, and transformation steps

## Quality Standards

All components adhere to these quality standards:
- All endpoints use Pydantic schemas for request/response validation
- All errors use structured JSON and proper status codes
- Every external API call is wrapped in try/except blocks
- Logging required for indexing, search, and inference operations
- All operations are reproducible across machines
- Vector dimensions strictly match model + Qdrant configuration
- System responds with "I don't know" when context is insufficient
- No silent failures

## Backend Constraints

- FastAPI server framework
- uv for dependency management
- Running locally on port 8000
- Indexer reads all .md and .mdx files under ../docs
- Supports re-indexing operations
- Supports both query-based and selection-based RAG
- Embedding model: FastEmbed MiniLM-L6-v2 (384 dimensions)

## Getting Started

1. Install dependencies: `uv sync` (or `pip install -r requirements.txt`)
2. Set up environment variables (see `.env.example`)
3. Start the server: `uv run python main.py`
4. API documentation available at `http://localhost:8000/docs`