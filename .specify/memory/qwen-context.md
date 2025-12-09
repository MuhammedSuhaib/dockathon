# Qwen Agent Context: Backend RAG System

## Technologies in Context

### FastEmbed
- Library for efficient text embeddings
- Using MiniLM-L6-v2 model for 384-dimensional embeddings
- Local processing without external API calls
- Used for generating embeddings of document chunks

### Qdrant
- Vector database for semantic search
- Cloud-based with API key authentication
- Used to store document embeddings with 384 dimensions
- Cosine similarity for similarity search
- Requires QDRANT_URL and QDRANT_API_KEY environment variables

### OpenAI API
- Used for answer generation in RAG pipeline
- Requires OPENAI_API_KEY environment variable
- Processes retrieved context to generate human-readable answers
- Implements "I don't know" responses when context is insufficient

### FastAPI
- Web framework for building the API
- Provides automatic API documentation at /docs
- Uses Pydantic for request/response validation
- Implements structured JSON responses with proper HTTP status codes

### Architecture Components
- `embeddings.py`: Handles text embedding generation
- `vector_store.py`: Manages Qdrant integration and document storage
- `rag.py`: Implements RAG logic and answer generation
- `indexer.py`: Processes documents and indexes them in Qdrant
- `main.py`: FastAPI application with health, query, and selection endpoints

## Key Requirements
- All operations must be reproducible across machines
- No hardcoded secrets - all via environment variables
- Proper error handling with structured JSON responses
- Clear separation between indexing and runtime serving
- Consistent use of 384-dimensional embeddings
- Support for .md and .mdx file processing

## Environment Variables
- QDRANT_URL: URL for Qdrant Cloud instance
- QDRANT_API_KEY: API key for Qdrant Cloud
- OPENAI_API_KEY: API key for OpenAI service

## API Endpoints
- GET /api/health: Returns service status
- POST /api/query: Query-based RAG with context from Qdrant
- POST /api/selection: Selection-based RAG using provided text only