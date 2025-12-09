# Implementation Plan: Chatbot Interface for Embodied Intelligence Textbook

**Branch**: `002-chatbot-implementation` | **Date**: 2025-12-07 | **Spec**: [specs/002-chatbot-implementation/spec.md]
**Input**: Feature specification from `/specs/002-chatbot-implementation/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement an AI-powered chatbot interface for the Embodied Intelligence textbook that integrates with the existing RAG backend system. The chatbot will provide a conversational interface for users to ask questions about the textbook content, with responses generated using the existing RAG pipeline that retrieves relevant information from indexed documents and uses Gemini AI for response generation.

## Technical Context

**Language/Version**: JavaScript/TypeScript for frontend, Python 3.11+ for backend
**Primary Dependencies**: @openai/chatkit-react for frontend UI, FastAPI for backend, existing RAG components
**Storage**: (MVP) In-memory/ephemeral storage, (Future) Neon Serverless Postgres for conversation history
**Testing**: Jest for frontend component tests, pytest for backend tests (using existing test infrastructure)
**Target Platform**: Web browser (Docusaurus-based documentation site)
**Project Type**: Docusaurus site with embedded chat component
**Performance Goals**: <3 second response time for typical queries, responsive UI with loading states
**Constraints**: Must fix existing ChatKit issues, follow Matrix-themed UI design, maintain accessibility standards, ensure ChatKit works within Docusaurus
**Scale/Scope**: MVP chat functionality with future enhancements for persistence and auth

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Spec-Driven Development (SDD) Compliance: Following the updated spec with MVP approach and Docusaurus integration
- ✅ Smallest Testable Step Development: Will implement in incremental steps (fix ChatKit → MVP → future features)
- ✅ Complete Information Verification: Requirements updated to reflect existing backend and Docusaurus frontend
- ✅ No Mockup or API Fabrication: Using actual ChatKit, FastAPI APIs and existing components
- ✅ Context7 Library Verification: Will verify ChatKit and FastAPI usage via Context7
- ✅ User Approval Requirement: Will wait for approval after each implementation step
- ✅ Minimalist Workflow Respect: Focusing on MVP first as specified
- ✅ Context7 Library Constraint: Using only approved libraries (ChatKit, FastAPI)
- ✅ Context7 Usage Protocol: Will use Context7 for ChatKit and FastAPI implementations
- ✅ Task Restatement Protocol: The task is to fix ChatKit embedding in Docusaurus and create working MVP
- ✅ No Indexing Pipeline Hallucination: Using existing RAG system, not creating new indexing
- ✅ Minimal Diff Production: Making minimal changes to fix ChatKit integration
- ✅ Single Endpoint Development: Will work with existing backend endpoints
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
│   ├── pages/
│   │   └── ChatPage.jsx          # Dedicated chat page (if needed)
│   └── theme/
│       └── ChatWidgetWrapper.jsx # Docusaurus-compatible ChatKit wrapper

backend/
├── src/
│   ├── models/                   # (Future) Models for auth and storage
│   ├── services/
│   │   ├── auth_service.py      # (Future) JWT authentication service
│   │   ├── neon_service.py      # (Future) Neon Postgres service
│   │   ├── qdrant_service.py    # Qdrant vector store service
│   │   └── rag_service.py       # RAG orchestration service
│   └── api/
│       └── chatkit_api.py       # ChatKit integration endpoints
└── tests/
    ├── unit/
    ├── integration/
    └── contract/
```

**Structure Decision**: Docusaurus-based documentation site with ChatKit component integrated using a Docusaurus-compatible wrapper, connecting to existing FastAPI backend that orchestrates RAG logic.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [N/A] | [No violations detected] | [All constitution principles followed] |
