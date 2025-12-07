# Backend RAG System Constitution

## Core Principles

### I. Reliability and Deterministic Behavior
Backend operations must be predictable and consistent across different environments and runs. All API endpoints should behave deterministically given the same inputs and state. This ensures trust and enables effective testing and debugging.

### II. Clean, Reproducible Indexing and Embeddings
The indexing process must be reproducible, with clear inputs and verifiable outputs. Embeddings must be generated consistently using the same model and configuration, with clear tracking of which model version was used for each index run.

### III. Clear Separation Between Indexing and Runtime Serving
Indexing operations (document ingestion, vector generation, storage) must be functionally separate from runtime query operations. This allows for independent scaling, maintenance, and updates of each component without affecting the other.

### IV. No Hardcoded Secrets
All sensitive information (API keys, database passwords, etc.) must be stored in environment variables. No secrets should ever be committed to the codebase, directly hardcoded, or stored in configuration files.

### V. Strict Error Handling and Structured JSON Responses
Every endpoint must implement comprehensive error handling with descriptive error messages. All API responses must follow a consistent JSON structure with appropriate HTTP status codes, ensuring clients receive predictable and actionable feedback.

### VI. Predictable, Testable RAG Pipeline
The Retrieval Augmented Generation (RAG) pipeline must be designed for testability, with clearly defined inputs, outputs, and transformation steps. This enables verification of the system's behavior under various conditions and ensures consistent performance.

## Quality Standards
All backend components must adhere to the following quality standards:
- All endpoints must use Pydantic schemas for request/response validation
- All errors must use structured JSON and proper status codes
- Every external API call must be wrapped in try/except blocks
- Logging required for indexing, search, and inference operations
- All operations must be reproducible across machines
- Vector dimensions must strictly match model + Qdrant configuration
- System must respond with "I don't know" when context is insufficient
- No silent failures - all errors must be properly logged and reported

## Backend Constraints
The system must be built using:
- FastAPI server framework
- uv for dependency management
- Running locally on port 8000
- Indexer must read all .md and .mdx files under ../docs
- Must support re-indexing operations
- Must support both query-based and selection-based RAG
- Embedding model: FastEmbed MiniLM-L6-v2 (384 dimensions)

## Success Criteria
The system is considered successful when:
- Indexing finishes without errors
- Qdrant collection created correctly with 384 dimensions
- /api/health returns 200 OK status
- /api/query returns correct contextual answers
- /api/selection uses ONLY the selected text for response generation
- Backend deploys cleanly to Render/Fly.io platforms

## Governance
This constitution governs all development practices for the backend RAG system. All code changes must comply with these principles and standards. Amendments to this constitution require documentation, team approval, and an appropriate migration plan for existing code.

**Version**: 1.0.0 | **Ratified**: 2025-01-01 | **Last Amended**: 2025-12-07
