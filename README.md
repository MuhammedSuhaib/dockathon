# Physical AI & Humanoid Robotics: Interactive Textbook

Welcome to the "Physical AI & Humanoid Robotics" textbook with integrated RAG (Retrieval Augmented Generation) chatbot. This interactive learning platform features the complete textbook content with intelligent querying capabilities. The project combines a Docusaurus-based frontend with a robust backend RAG system to provide an enhanced learning experience. The development workflow leverages both Claude and Qwen AI assistants to streamline creation and maintenance.

## Overview

The textbook platform consists of:

- **Frontend**: A Docusaurus-based website featuring the "Physical AI & Humanoid Robotics" textbook content with a distinctive Matrix-themed design
- **Backend**: A FastAPI-based RAG system that enables intelligent querying of textbook content
- **AI Integration**: Advanced chatbot capabilities with context-aware responses based on the textbook content
- **AI Orchestration**: Dual AI support using both Claude and Qwen for enhanced development workflows

## Current Features

- ✅ Interactive Docusaurus-based textbook with four modules (foundations, simulation, perception, VLA)
- ✅ Backend RAG system that indexes textbook content and provides contextual answers
- ✅ Qdrant vector database integration for semantic search capabilities
- ✅ Matrix-themed UI with dark/light mode support
- ✅ Health check and API endpoints for programmatic access
- ✅ Urdu translation functionality to make content accessible in local language

## Remaining Tasks

The following critical features need to be implemented to complete the textbook:

### 1. Neon Serverless Postgres Database
- [ ] Set up Neon Serverless Postgres database for conversation storage
- [ ] Design conversation schema with user_id, conversation_id, message_id, content, timestamp, message_type
- [ ] Implement database connection pooling and migration scripts
- [ ] Add conversation history persistence and retrieval functionality

### 2. Better-auth Authentication System
- [ ] Implement JWT-based authentication with role-based access control
- [ ] Create user registration and login flows
- [ ] Add secure session management
- [ ] Implement password reset and account recovery features
- [ ] Connect authentication with conversation privacy controls

### 3. Content Personalization
- [ ] Develop user profile system to track learning preferences
- [ ] Implement recommendation engine for personalized content delivery
- [ ] Add user progress tracking and analytics
- [ ] Create adaptive content presentation based on user interactions
- [ ] Enable customization of UI themes and content filtering

## Architecture

The textbook platform follows a modern microservices architecture:

- **Frontend**: Docusaurus static site generator with React components
- **Backend**: FastAPI application with asynchronous processing
- **Database**: Neon Serverless Postgres for conversation storage
- **Vector Store**: Qdrant Cloud for semantic search capabilities
- **Authentication**: Better-auth for secure user management
- **Translation**: Integrated translation services API

## Tech Stack

- **Frontend**: Docusaurus, React, TypeScript, CSS
- **Backend**: Python, FastAPI, uv
- **Database**: Neon Serverless Postgres
- **Auth**: Better-auth
- **Vector Storage**: Qdrant Cloud
- **Deployment**: Render/Fly.io compatible

## Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js
- pnpm
- uv package manager

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm start
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   uv sync
   ```

3. Set up environment variables in `.env`:
   ```
   QDRANT_URL=your_qdrant_url
   QDRANT_API_KEY=your_qdrant_api_key
   EXTERNAL_API_KEY=your_external_api_key
   ```

4. Index documents:
   ```bash
   python services/indexer.py
   ```

5. Start the server:
   ```bash
   uv run --no-dev uvicorn main:app --reload --port=8000
   ```

## API Endpoints

- `GET /` - Health check endpoint
- `POST /api/query` - Query the textbook content with RAG context
- `POST /api/selection` - Query based on selected text only
- `POST /api/conversations` - Create new conversations (planned feature)
- `GET /api/conversations/{conversation_id}` - Retrieve conversation history (planned feature)

## Contributing

We welcome contributions to the textbook! Please see our contribution guidelines in the `.specify` directory.

## AI Orchestration & Development Tools

The textbook development utilizes sophisticated AI orchestration tools to automate creation and maintenance workflows:

### Claude AI Integration
- **Project Organizer Agent**: Located at `.claude/agents/ProjectOrganizer.md`, this agent helps organize and structure development tasks
- **Qdrant RAG Skill**: Reusable skill at `.claude/qdrant-rag-skill` that provides Qdrant vector database capabilities to Claude agents
- **Claude Configuration**: Settings in `.claude/settings.local.json` for optimal project integration

### Qwen AI Integration
- **Qwen Configuration**: Settings in `.qwen` directory for enhanced development workflows
- **Dual AI Approach**: Using both Claude and Qwen agents for complementary development capabilities

### Development Automation
- **Token Refresh Script**: Located at `refresh_token.py`, automatically handles Claude API token refresh to avoid authentication issues during development
- **Audio Feedback**: Bash script at `.specify/scripts/bash/speak.sh` provides audible notifications during development for enhanced multitasking

## Project Structure

The textbook project follows the Spec-Driven Development (SDD) methodology:

- `.specify/` - Contains project specifications, templates, and scripts
- `.claude/` - Claude-specific configurations and agents
- `.qwen/` - Qwen-specific configurations
- `specs/` - Detailed feature specifications
- `history/` - Prompt History Records (PHRs) and Architecture Decision Records (ADRs)
- `backend/` - FastAPI backend with RAG system
- `frontend/` - Docusaurus-based textbook frontend
- `context/` - Project context files
