# Dockathon Project Summary - For Future Agents

## Project Overview
Dockathon is a hackathon project building an AI-powered educational platform for "Embodied Intelligence" textbook content. It features a Docusaurus-based documentation site with an integrated RAG (Retrieval Augmented Generation) chatbot that can answer questions about the textbook content using both general queries and text selection-based responses.

## Core Requirements (Top 2 Compulsory)
1. **Docusaurus**: Educational documentation site with interactive modules
2. **RAG Chatbot**: Integrated chatbot using OpenAI Agents/ChatKit SDKs, FastAPI, Neon Postgres, Qdrant Cloud; can answer questions from book content and respond to text selection

## Tech Stack
- **Frontend**: Docusaurus with @openai/chatkit-react for chat interface
- **Backend**: FastAPI with OpenAI ChatKit Python SDK
- **Vector DB**: Qdrant Cloud (384-dim vectors with cosine similarity)
- **Embeddings**: FastEmbed (BGE small model, 384 dimensions)
- **LLM Provider**: Qwen API (used instead of Gemini as initially planned)
- **Auth**: Better Auth (planned, not fully implemented)
- **Database**: Neon Serverless Postgres (for conversation history, planned)

## Current Implementation Status
- **Working**: Docusaurus site with educational content, basic ChatKit integration, Qwen API integration, embedding and vector storage
- **Missing/Incomplete**: RAG API endpoints (`/api/query`, `/api/selection`, `/api/health`) that are documented and tested but not implemented in main.py
- **Multiple Implementations**: Three competing backend approaches (main.py, chatkit_api.py, simple_chatkit_api.py)

## Key Architecture Components

### Backend Files
- `main.py`: Primary ChatKit server with Qwen and RAG integration
- `chatkit_api.py`: Alternative implementation with Neon Postgres integration
- `simple_chatkit_api.py`: Simplified MVP with in-memory storage
- `my_store.py`: ChatKit store implementation
- `rag.py`: RAG service logic
- `vector_store.py`: Qdrant integration
- `embeddings.py`: Text embedding generation
- `indexer.py`: Document indexing from docs directory

### Frontend Components
- `ChatKitInterface.jsx`: Primary chat interface component
- `FloatingChatWidget.jsx`: Floating widget wrapper
- `ChatWidgetWrapper.jsx`: Docusaurus-compatible ChatKit wrapper
- Educational modules in /docs/ directory

## Critical Issues to Address
1. **Missing API Endpoints**: RAG endpoints documented in README and tested but not implemented in main.py
2. **Architecture Clarity**: Multiple competing backend implementations need consolidation
3. **ChatKit Integration**: Requires special handling for SSR compatibility in Docusaurus
4. **API Consistency**: ChatKit endpoint referenced as both `/chat` and `/chatkit`

## Environment Variables Required
- `QDRANT_URL`: URL for Qdrant Cloud instance
- `QDRANT_API_KEY`: API key for Qdrant Cloud
- `KEY` or `GEMINI_API_KEY`: Qwen API key
- `NEON_DATABASE_URL`: For Neon Postgres connection (future implementation)

## Key Data Models
- **DocumentChunk**: For indexed content with embeddings
- **Query/Selection**: For different request types
- **Response**: For structured answers with source references
- **Conversation/Message**: For chat history (planned in Neon Postgres)

## Testing Structure
- Unit tests in `test_all_modules.py`
- Integration tests in `test_integration.py` (expecting missing API endpoints)
- Individual module tests

## Future Enhancements (Items 3-7)
3. SubAgent and Agent Skills
4. Base functionality (covered)
5. Better-auth integration
6. Content personalization
7. Translation capabilities

## Development Approach
The project follows Spec-Driven Development (SDD) methodology with specifications in `/specs/` and implementation plans. Architecture Decision Records document key technology choices.

## Quick Start
1. Set up environment variables
2. Index documents with `python indexer.py`
3. Start backend with `uv run uvicorn main:app --reload`
4. Start frontend with `pnpm run start`
5. Access at `http://localhost:3000`

This summary contains all essential information for an agent to continue development without needing to read the full codebase.