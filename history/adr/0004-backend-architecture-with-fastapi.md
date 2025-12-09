# ADR-0004: Backend Architecture with FastAPI and RAG Integration

- **Status:** Proposed
- **Date:** 2025-12-09
- **Feature:** 002-chatbot-implementation
- **Context:** The project requires a backend system to handle RAG (Retrieval Augmented Generation) functionality for the chatbot. The system must integrate with vector databases (Qdrant), handle ChatKit protocol, and manage conversations. The architecture needs to support both direct RAG queries and selection-based queries.

## Decision

Use FastAPI backend with the following architecture:

- **Framework**: FastAPI for backend API services
- **RAG Integration**: Direct integration with Qdrant for vector storage and retrieval
- **Chat Protocol**: ChatKit protocol for chat interface communication
- **AI Provider**: OpenAI-compatible interface to Qwen API (via base_url override)
- **Endpoints**: Separate endpoints for general queries (/api/query) and selection-based queries (/api/selection)
- **Health Checks**: Dedicated health endpoint for service monitoring

## Consequences

### Positive

- FastAPI provides excellent performance and async support
- Easy integration with OpenAPI documentation
- Good validation and error handling features
- Flexible architecture supporting multiple AI providers
- Clear separation between RAG functionality and chat protocol
- Built-in monitoring via health checks

### Negative

- Additional complexity of managing multiple service dependencies
- Need to handle async operations properly throughout the stack
- Potential latency issues if multiple services are down
- More complex deployment with multiple interconnected services
- Error handling becomes more complex across multiple integration points

## Alternatives Considered

### Alternative A: Node.js/Express Backend
- Use Node.js with Express framework
- Familiar to more developers
- *Rejected* as FastAPI provides better async support and built-in validation

### Alternative B: Serverless Architecture
- Use serverless functions for each endpoint
- Auto-scaling and potentially lower cost during low usage
- *Rejected* as it would complicate RAG operations and state management

### Alternative C: Direct Vector DB Integration
- Client-side connection directly to Qdrant
- Eliminate backend complexity
- *Rejected* due to security concerns with exposing database credentials

## References

- Feature Spec: specs/002-chatbot-implementation/spec.md
- Implementation research: specs/002-chatbot-implementation/research.md
- Backend Implementation: backend/main.py, backend/simple_chatkit_api.py
- API Design: specs/002-chatbot-implementation/contracts/api-contracts.yaml