# Chatbot Feature Specification

## Overview
Implement an AI-powered chatbot interface for the Embodied Intelligence textbook that allows users to ask questions about the content and receive intelligent responses based on the indexed documentation. The chatbot must utilize ChatKit SDKs, FastAPI, Neon Serverless Postgres database, and Qdrant Cloud Free Tier.

## Requirements
- Create a chat interface component for the Docusaurus frontend using ChatKit SDKs
- Use existing FastAPI backend with modifications to fix ChatKit integration
- Focus on MVP without Neon Postgres integration initially (future enhancement)
- Focus on MVP without Qdrant integration initially (future enhancement)
- Support both general queries and selection-based questions
- Implement proper error handling and loading states
- Follow the existing Matrix-themed design
- Ensure responsive design for all devices
- ChatKit handles UI/UX, existing FastAPI backend orchestrates RAG logic
- Add floating chat widget positioned at bottom-right of screen with customizable visibility
- Implement graceful error handling for service failures
- Fix broken ChatKit embedding inside Docusaurus

## Functional Requirements
1. Users can type questions in a ChatKit-powered chat interface
2. Chatbot responds using the RAG system with context from textbook via existing backend
3. Responses include source document references
4. Support for "selection-based" questions (when user highlights text)
5. Loading indicators during AI processing
6. (MVP) Basic conversation functionality without persistent storage
7. Integration with ChatKit's built-in UI components and features
8. (Future) JWT-based authentication with role-based access control to ensure conversation privacy
9. Floating chat widget positioned at bottom-right of screen with customizable visibility
10. Graceful degradation when ChatKit or backend services are unavailable

## Non-Functional Requirements
- Fast response times (under 3 seconds for typical queries)
- (Future) JWT-based authentication with role-based access control for conversation privacy
- Follow accessibility guidelines
- Work in both light and dark modes
- (MVP) Basic conversation functionality without persistent storage
- (Future) Conversation history using Neon Postgres with proper schema design
- Scalable architecture using serverless technologies
- Graceful degradation when ChatKit or backend services are unavailable
- Proper error handling and user feedback for all failure scenarios

## Success Criteria
- Chat interface powered by ChatKit is responsive and user-friendly
- (MVP) Working integration with existing FastAPI backend
- (Future) FastAPI backend integrates seamlessly with Neon Postgres and Qdrant
- Proper error handling and user feedback with graceful degradation
- Maintains the Matrix-themed UI design where possible
- All functionality tested and working
- (MVP) Basic conversation functionality without persistent storage
- (Future) Conversation persistence across sessions using proper schema (user_id, conversation_id, message_id, content, timestamp, message_type)
- Available globally via floating chat widget on all pages, positioned at bottom-right
- (Future) JWT-based authentication ensures conversation privacy and security
- Service failures (ChatKit or backend) are handled gracefully with appropriate user feedback

## Clarifications

### Session 2025-12-09 (Continued)
- Q: How should ChatKit integrate with the existing Docusaurus frontend? → A: Integrate ChatKit as a React component within Docusaurus pages using @openai/chatkit-react
- Q: Should we build upon or replace the existing backend with ChatKit issues? → A: Replace problematic ChatKit components while keeping existing backend functionality
- Q: What is the approach to address ChatKit issues in Docusaurus? → A: Replace with a standard React component that mimics ChatKit functionality but with more reliable implementation
- Q: What are the implementation priorities for the hackathon? → A: Keep existing backend, keep ChatKit (hackathon requirement), fix ChatKit embedding in Docusaurus, make minimal working MVP, add Neon/Qdrant later
- Q: What is the scope for initial MVP? → A: Focus on minimal working MVP first, add Neon/Qdrant integration in future tasks

### Session 2025-12-09
- Q: What should the conversation data model in Neon Postgres include? → A: Define conversation schema with user_id, conversation_id, message_id, content, timestamp, message_type
- Q: How should the system handle service failures for ChatKit, Qdrant, and Neon? → A: Implement specific error handling for ChatKit, Qdrant, and Neon failures with graceful degradation
- Q: How should ChatKit integrate with the RAG system? → A: ChatKit handles UI/UX, FastAPI backend orchestrates RAG logic between ChatKit and Qdrant/Neon
- Q: What authentication approach should be used for conversation privacy? → A: Implement JWT-based authentication with role-based access control for conversation privacy
- Q: How should the chat widget be positioned and displayed? → A: Floating chat widget positioned at bottom-right of screen with customizable visibility

### Session 2025-12-07
- Q: Which SDK should be used for the chat interface? → A: ChatKit SDKs
- Q: What backend stack should be used? → A: FastAPI, Neon Serverless Postgres database, and Qdrant Cloud Free Tier