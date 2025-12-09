# Chatbot Data Model

## User Entity

**Table: users**
- `id` (UUID) - Primary key, unique identifier for each user
- `email` (VARCHAR) - User's email address, unique
- `username` (VARCHAR) - User's display name
- `created_at` (TIMESTAMP) - Account creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp
- `is_active` (BOOLEAN) - Whether the account is active

## Conversation Entity

**Table: conversations**
- `id` (UUID) - Primary key, unique identifier for each conversation
- `user_id` (UUID) - Foreign key referencing users table
- `title` (VARCHAR) - Conversation title (auto-generated from first message)
- `created_at` (TIMESTAMP) - Conversation creation timestamp
- `updated_at` (TIMESTAMP) - Last activity timestamp
- `is_active` (BOOLEAN) - Whether the conversation is active

## Message Entity

**Table: messages**
- `id` (UUID) - Primary key, unique identifier for each message
- `conversation_id` (UUID) - Foreign key referencing conversations table
- `user_id` (UUID) - Foreign key referencing users table (who sent the message)
- `message_type` (ENUM: 'user', 'assistant') - Type of message
- `content` (TEXT) - Message content
- `timestamp` (TIMESTAMP) - Message creation timestamp
- `source_references` (JSONB) - Source document references for RAG responses
- `parent_message_id` (UUID) - ID of parent message in conversation thread (nullable)

## Session Entity (for JWT management)

**Table: sessions**
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key referencing users table
- `token_hash` (VARCHAR) - Hash of the JWT token
- `expires_at` (TIMESTAMP) - Token expiration time
- `created_at` (TIMESTAMP) - Session creation timestamp
- `is_active` (BOOLEAN) - Whether the session is still valid

## Validation Rules

1. **User Validation**:
   - Email must be unique and valid
   - Username must be 3-30 characters
   - User must be active to access conversations

2. **Conversation Validation**:
   - Must have valid user_id
   - Title max length: 255 characters
   - Only the user who created can access (RBAC)

3. **Message Validation**:
   - Must have valid conversation_id and user_id
   - Content max length: 10,000 characters
   - Message type must be either 'user' or 'assistant'
   - Source references must be valid JSON format

## Relationships

- One User to Many Conversations (1:M)
- One Conversation to Many Messages (1:M)
- One User to Many Sessions (1:M)

## Indexes

- Users table: index on email for authentication
- Conversations table: index on user_id for fast user-specific queries
- Conversations table: index on updated_at for chronological ordering
- Messages table: index on conversation_id for conversation thread retrieval
- Messages table: index on timestamp for chronological ordering
- Sessions table: index on token_hash and expires_at for JWT validation

## State Transitions

- **User**: Active ↔ Inactive (admin action)
- **Conversation**: Active → Archived (user action)
- **Session**: Active → Expired (automatic based on JWT expiration)