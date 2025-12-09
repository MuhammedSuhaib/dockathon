# Chatbot Feature Quickstart

## Prerequisites

- Node.js 18+ for frontend development
- Python 3.11+ for backend development
- Access to Qdrant Cloud (with API key and URL)
- Access to Neon Serverless Postgres (with connection string)
- GEMINI_API_KEY for AI responses
- Git for version control

## Environment Setup

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install Backend Dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt] psycopg2-binary python-dotenv
```

### 3. Install Frontend Dependencies
```bash
cd frontend
npm install @openai/chatkit-react react react-dom
```

### 4. Set Up Environment Variables
Create `.env` file in the backend directory:

```env
QDRANT_URL=your_qdrant_cloud_url
QDRANT_API_KEY=your_qdrant_api_key
NEON_DATABASE_URL=your_neon_postgres_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET_KEY=your_jwt_secret_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Running the Application

### 1. Start the Backend
```bash
cd backend
uvicorn src.api.chatkit_api:app --reload --port 8000
```

### 2. Start the Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

## Key Components

### Backend Structure
- `src/models/` - Data models (user.py, conversation.py, message.py)
- `src/services/` - Business logic (auth_service.py, neon_service.py, qdrant_service.py, rag_service.py)
- `src/api/` - API endpoints (chatkit_api.py)

### Frontend Structure
- `src/components/` - React components (ChatWidget.jsx)
- `src/hooks/` - Custom hooks (useChatAuth.js)
- `src/services/` - Service utilities (chatkit-service.js)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Chat Functionality
- `POST /api/chatkit` - Main chat endpoint
- `POST /api/chatkit/selection` - Selection-based queries
- `GET /api/health` - Health check

### Conversation Management
- `GET /api/conversations` - Get user's conversations
- `GET /api/conversations/{id}` - Get specific conversation
- `DELETE /api/conversations/{id}` - Delete conversation

## Testing the Chatbot

1. Register a new user via `POST /api/auth/register`
2. Login to get your JWT token via `POST /api/auth/login`
3. Use the JWT token in the Authorization header to interact with chat endpoints
4. The floating chat widget will connect to the `/api/chatkit` endpoint
5. For selection-based queries, use the `/api/chatkit/selection` endpoint

## Troubleshooting

### Common Issues
- **Qdrant Connection Error**: Verify your QDRANT_URL and QDRANT_API_KEY are correct
- **Neon Connection Error**: Check your NEON_DATABASE_URL and make sure Neon is accessible
- **JWT Authentication Failures**: Ensure your JWT token is valid and not expired
- **ChatKit Integration Issues**: Verify the ChatKit configuration and domainKey

### Health Check
Run the health check endpoint to verify all services are connected:
`GET http://localhost:8000/api/health`