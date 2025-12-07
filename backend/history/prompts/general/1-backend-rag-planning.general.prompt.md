---
id: 1
title: Backend RAG Planning
stage: plan
date: 2025-12-07
surface: agent
model: claude-3-5-sonnet-20241022
feature: none
branch: main
user: giaic
command: assistant planning
labels: ["backend", "rag", "planning", "architecture"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - /home/giaic/code/dockathon/backend/specs/001-backend-rag-pipeline/spec.md
 - /home/giaic/code/dockathon/backend/.specify/memory/constitution.md
tests:
 - none
---

## Prompt

Planning the Backend RAG System implementation based on the feature specification and project constitution.

## Response snapshot

## Architectural Plan for Backend RAG System

Based on the feature specification, I'm creating an architectural plan for the Backend RAG Pipeline:

### 1. Scope and Dependencies:
- **In Scope**: 
  - FastAPI backend with /api/health, /api/query, and /api/selection endpoints
  - Document indexing system that processes .md and .mdx files
  - Vector storage using Qdrant with 384-dim vectors
  - Embedding generation using FastEmbed MiniLM-L6-v2
  - OpenAI integration for answer generation

- **Out of Scope**: 
  - Frontend implementation
  - File uploads or PDF ingestion
  - Chatbot UI components

- **External Dependencies**: 
  - Qdrant Cloud (vector database)
  - OpenAI API
  - FastEmbed for local embeddings
  - Environment variables for secrets

### 2. Key Decisions and Rationale:
- **FastAPI Framework**: Chosen for its performance, async support, and automatic API documentation
- **FastEmbed MiniLM-L6-v2**: Selected for its efficiency and 384-dimension output that matches requirements
- **Qdrant Vector Database**: Provides efficient similarity search for RAG implementation
- **Separation of Concerns**: Clear separation between indexing and runtime serving components
- **Pydantic Schemas**: Ensures type safety and request/response validation

Options considered:
- Alternative embedding models were evaluated, but MiniLM-L6-v2 provides the required 384 dimensions
- Various vector databases considered, but Qdrant offers the best balance of features and ease of use

### 3. Interfaces and API Contracts:
- **Health Check**: `GET /api/health` → Returns `{"status": "ok"}` with 200 status
- **Query Endpoint**: `POST /api/query` → Request: `{"query": "text"}`, Response: `{"answer": "text", "sources": []}` with proper error handling
- **Selection Endpoint**: `POST /api/selection` → Request: `{"selected_text": "text", "question": "text"}`, Response: `{"answer": "text"}` with proper error handling

### 4. Non-Functional Requirements (NFRs) and Budgets:
- **Performance**: Query response times under 5 seconds for typical requests
- **Reliability**: 99% uptime with graceful degradation when external services fail
- **Security**: No hardcoded secrets, all sensitive data via environment variables
- **Cost**: Optimized for deployment on Render/Fly.io platforms

### 5. Data Management and Migration:
- **Vector Storage**: Qdrant collection "book" with 384-dim vectors and cosine similarity
- **Document Storage**: Original documents in ../docs directory (not managed by backend)
- **Schema Evolution**: Vector dimensions fixed at 384 to maintain compatibility

### 6. Operational Readiness:
- **Observability**: Logging for indexing, search, and inference operations using loguru
- **Error Handling**: Structured JSON responses for all error conditions
- **Deployment**: Designed for deployment on Render/Fly.io without modifications

### 7. Risk Analysis and Mitigation:
- **Qdrant Unavailability**: Implement timeout and fallback mechanisms
- **API Key Issues**: Proper error logging and graceful degradation
- **Large Document Processing**: Chunking strategy to handle documents of varying sizes

### 8. Evaluation and Validation:
- **Definition of Done**: All endpoints return proper responses with appropriate status codes
- **Testing**: Unit tests for core functionality, integration tests for API endpoints

### 9. Implementation Structure:
- `main.py`: FastAPI application with the three required endpoints
- `indexer.py`: Module for processing documents and storing embeddings in Qdrant
- `embeddings.py`: Module for generating embeddings using FastEmbed
- `rag.py`: Module for RAG functionality (querying and answer generation)
- `.env.example`: Template for required environment variables
- `requirements.txt`: Updated dependencies

This architecture follows the core principles outlined in the constitution: reliability, reproducible indexing, separation of indexing and serving, no hardcoded secrets, and strict error handling.

## Detailed Task Breakdown for Backend RAG Pipeline

#### Phase 1: Setup and Dependencies
1. **Update pyproject.toml**: Add all required dependencies for RAG system (FastEmbed, Qdrant, OpenAI, etc.)
2. **Create .env.example**: Setup environment variable template with all required variables
3. **Create directory structure**: Set up files for indexer, embeddings, rag logic, and main app

#### Phase 2: Core Components
4. **Implement embeddings module (embeddings.py)**: 
   - Create class/function to generate embeddings using FastEmbed MiniLM-L6-v2
   - Ensure consistent 384-dim output
   - Add error handling for model loading issues

5. **Implement vector storage module (vector_store.py)**:
   - Connect to Qdrant Cloud using env vars
   - Create "book" collection with 384-dim vectors and cosine similarity
   - Implement methods to store and retrieve document chunks

6. **Implement document indexer (indexer.py)**:
   - Recursively read all .md and .mdx files from ../docs
   - Chunk documents appropriately
   - Generate embeddings for each chunk
   - Store in Qdrant with metadata

#### Phase 3: RAG Logic
7. **Implement RAG service (rag.py)**:
   - Query processing with context retrieval from Qdrant
   - Answer generation using OpenAI API with retrieved context
   - Selection-based answering using only provided text
   - "I don't know" response when context is insufficient
   - Error handling for external API calls

#### Phase 4: API Endpoints
8. **Create FastAPI application (main.py)**:
   - Health check endpoint: GET /api/health
   - Query endpoint: POST /api/query with Pydantic models
   - Selection endpoint: POST /api/selection with Pydantic models
   - Proper error responses with structured JSON
   - Logging integration

#### Phase 5: Testing and Validation
9. **Create basic tests**: Unit tests for core functionality
10. **Integration testing**: Test all API endpoints
11. **Documentation**: Update README with setup and usage instructions

Each task maps directly to the functional requirements specified in the feature spec:
- FR-001: Document indexing with proper embeddings
- FR-002: Qdrant collection with correct configuration
- FR-003/FR-004: Query endpoint with contextual answers
- FR-005: Selection endpoint using only provided text
- FR-006: Structured JSON responses with proper status codes
- FR-007: Error handling with logging
- FR-008: Health check endpoint

## Outcome

- ✅ Impact: Created comprehensive architectural plan and task breakdown for Backend RAG System
- 🧪 Tests: none
- 📁 Files: /home/giaic/code/dockathon/backend/specs/001-backend-rag-pipeline/spec.md, /home/giaic/code/dockathon/backend/.specify/memory/constitution.md
- 🔁 Next prompts: Implementation of the backend RAG system
- 🧠 Reflection: The plan aligns with both the feature specification and project constitution principles

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Update pyproject.toml with required dependencies