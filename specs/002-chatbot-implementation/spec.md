# Chatbot Feature Specification

## Overview
Implement an AI-powered chatbot interface for the Embodied Intelligence textbook that allows users to ask questions about the content and receive intelligent responses based on the indexed documentation. The chatbot must utilize ChatKit SDKs, FastAPI, Neon Serverless Postgres database, and Qdrant Cloud Free Tier.

## Requirements
- Create a chat interface component for the frontend using ChatKit SDKs
- Implement FastAPI backend with Neon Serverless Postgres for conversation storage
- Integrate Qdrant Cloud Free Tier for vector storage and retrieval
- Support both general queries and selection-based questions
- Implement proper error handling and loading states
- Follow the existing Matrix-themed design
- Ensure responsive design for all devices
- ChatKit handles UI/UX, FastAPI backend orchestrates RAG logic between ChatKit and Qdrant/Neon
- Implement JWT-based authentication with role-based access control
- Add floating chat widget positioned at bottom-right of screen with customizable visibility
- Implement graceful error handling for service failures

## Functional Requirements
1. Users can type questions in a ChatKit-powered chat interface
2. Chatbot responds using the RAG system with context from textbook via Qdrant
3. Responses include source document references
4. Support for "selection-based" questions (when user highlights text)
5. Loading indicators during AI processing
6. Conversation history stored in Neon Serverless Postgres with user_id, conversation_id, message_id, content, timestamp, message_type
7. Integration with ChatKit's built-in UI components and features
8. JWT-based authentication with role-based access control to ensure conversation privacy
9. Floating chat widget positioned at bottom-right of screen with customizable visibility
10. Graceful degradation when ChatKit, Qdrant, or Neon services are unavailable

## Non-Functional Requirements
- Fast response times (under 3 seconds for typical queries)
- JWT-based authentication with role-based access control for conversation privacy
- Follow accessibility guidelines
- Work in both light and dark modes
- Preserve conversation history using Neon Postgres with proper schema design
- Scalable architecture using serverless technologies
- Graceful degradation when ChatKit, Qdrant, or Neon services are unavailable
- Proper error handling and user feedback for all failure scenarios

## Success Criteria
- Chat interface powered by ChatKit is responsive and user-friendly
- FastAPI backend integrates seamlessly with Neon Postgres and Qdrant
- Proper error handling and user feedback with graceful degradation
- Maintains the Matrix-themed UI design where possible
- All functionality tested and working
- Conversation persistence across sessions using proper schema (user_id, conversation_id, message_id, content, timestamp, message_type)
- Available globally via floating chat widget on all pages, positioned at bottom-right
- JWT-based authentication ensures conversation privacy and security
- Service failures (ChatKit, Qdrant, Neon) are handled gracefully with appropriate user feedback

## Clarifications

### Session 2025-12-09
- Q: What should the conversation data model in Neon Postgres include? → A: Define conversation schema with user_id, conversation_id, message_id, content, timestamp, message_type
- Q: How should the system handle service failures for ChatKit, Qdrant, and Neon? → A: Implement specific error handling for ChatKit, Qdrant, and Neon failures with graceful degradation
- Q: How should ChatKit integrate with the RAG system? → A: ChatKit handles UI/UX, FastAPI backend orchestrates RAG logic between ChatKit and Qdrant/Neon
- Q: What authentication approach should be used for conversation privacy? → A: Implement JWT-based authentication with role-based access control for conversation privacy
- Q: How should the chat widget be positioned and displayed? → A: Floating chat widget positioned at bottom-right of screen with customizable visibility

### Session 2025-12-07
- Q: Which SDK should be used for the chat interface? → A: ChatKit SDKs
- Q: What backend stack should be used? → A: FastAPI, Neon Serverless Postgres database, and Qdrant Cloud Free Tier