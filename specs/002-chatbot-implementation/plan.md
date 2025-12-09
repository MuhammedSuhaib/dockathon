# Implementation Plan: Chatbot Interface for Embodied Intelligence Textbook

**Branch**: `002-chatbot-implementation` | **Date**: 2025-12-07 | **Spec**: [specs/002-chatbot-implementation/spec.md]
**Input**: Feature specification from `/specs/002-chatbot-implementation/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement an AI-powered chatbot interface for the Embodied Intelligence textbook that integrates with the existing RAG backend system. The chatbot will provide a conversational interface for users to ask questions about the textbook content, with responses generated using the existing RAG pipeline that retrieves relevant information from indexed documents and uses Gemini AI for response generation.

## Technical Context

**Language/Version**: JavaScript/TypeScript for frontend, Python 3.11+ for backend
**Primary Dependencies**: @openai/chatkit-react for frontend UI, FastAPI for backend, Neon Serverless Postgres for conversation storage, Qdrant Cloud for vector storage and retrieval
**Storage**: Neon Serverless Postgres for conversation history (user_id, conversation_id, message_id, content, timestamp, message_type) and Qdrant for RAG vector storage
**Testing**: Jest for frontend component tests, pytest for backend tests (using existing test infrastructure)
**Target Platform**: Web browser (Docusaurus-based documentation site)
**Project Type**: Web application (frontend chat widget + backend API service)
**Performance Goals**: <3 second response time for typical queries, responsive UI with loading states
**Constraints**: Must implement JWT-based auth, follow Matrix-themed UI design, maintain accessibility standards
**Scale/Scope**: Multi-user session-based chat interface with conversation persistence and role-based access control

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Spec-Driven Development (SDD) Compliance: Following the spec created in spec.md with clear requirements
- ✅ Smallest Testable Step Development: Will implement chatbot in incremental steps (UI, then backend integration, then auth)
- ✅ Complete Information Verification: All requirements clearly specified in the feature spec
- ✅ No Mockup or API Fabrication: Using actual ChatKit, FastAPI, Neon, and Qdrant APIs
- ✅ Context7 Library Verification: Will verify ChatKit, FastAPI, Neon, and Qdrant usage via Context7
- ✅ User Approval Requirement: Will wait for approval after each implementation step
- ✅ Minimalist Workflow Respect: Implementing only the required functionality without extras
- ✅ Context7 Library Constraint: Using only approved libraries (ChatKit, FastAPI, Neon, Qdrant)
- ✅ Context7 Usage Protocol: Will use Context7 for all library implementations
- ✅ Task Restatement Protocol: The task is to implement a chatbot interface integrating ChatKit, FastAPI, Neon, and Qdrant
- ✅ No Indexing Pipeline Hallucination: Not creating new indexing, using existing system
- ✅ Minimal Diff Production: Making minimal changes to implement the chatbot
- ✅ Single Endpoint Development: Will create focused endpoints one at a time
- ✅ No Hallucination Policy: Using real APIs and documented features only
- ✅ No Invented APIs: Using existing, documented APIs from specified libraries
- ✅ Conciseness Requirement: Keeping implementations focused and concise

## Project Structure

### Documentation (this feature)

```text
specs/002-chatbot-implementation/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   └── ChatWidget.jsx        # Floating chat widget component
│   ├── hooks/
│   │   └── useChatAuth.js        # JWT-based authentication hook
│   └── services/
│       └── chatkit-service.js    # ChatKit integration service

backend/
├── src/
│   ├── models/
│   │   ├── user.py              # User model with JWT auth
│   │   ├── conversation.py      # Conversation model for Neon
│   │   └── message.py           # Message model for Neon
│   ├── services/
│   │   ├── auth_service.py      # JWT authentication service
│   │   ├── neon_service.py      # Neon Postgres service
│   │   ├── qdrant_service.py    # Qdrant vector store service
│   │   └── rag_service.py       # RAG orchestration service
│   └── api/
│       └── chatkit_api.py       # ChatKit integration endpoints
└── tests/
    ├── unit/
    ├── integration/
    └── contract/
```

**Structure Decision**: Web application with floating ChatWidget component implementing JWT authentication, connecting to FastAPI backend that orchestrates RAG logic between ChatKit and Qdrant/Neon services.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [N/A] | [No violations detected] | [All constitution principles followed] |
