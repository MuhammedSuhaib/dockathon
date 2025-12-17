"""
Database module for Neon PostgreSQL integration
"""
import os
import asyncpg
from typing import Optional
import logging
from contextlib import asynccontextmanager

# Get database URL from environment
DATABASE_URL = os.getenv("NEON_DATABASE_URL", os.getenv("DATABASE_URL", ""))

if not DATABASE_URL:
    logging.warning("NEON_DATABASE_URL or DATABASE_URL not set in environment")

class DatabaseManager:
    def __init__(self):
        self.pool = None

    async def init_pool(self):
        """Initialize the connection pool"""
        if not DATABASE_URL:
            logging.warning("Database URL not configured, skipping database initialization")
            return

        try:
            self.pool = await asyncpg.create_pool(
                DATABASE_URL,
                min_size=1,
                max_size=10,
                command_timeout=60,
            )
            logging.info("Database connection pool created successfully")
        except Exception as e:
            logging.error(f"Failed to create database connection pool: {e}")
            raise

    async def close_pool(self):
        """Close the connection pool"""
        if self.pool:
            await self.pool.close()

    @asynccontextmanager
    async def get_connection(self):
        """Get a connection from the pool"""
        if not DATABASE_URL:
            # If no database URL is configured, yield None to handle gracefully
            yield None
            return

        if not self.pool:
            await self.init_pool()
            if not self.pool:  # If initialization failed, return None
                yield None
                return

        async with self.pool.acquire() as conn:
            yield conn

# Global database manager instance
db_manager = DatabaseManager()

async def init_db():
    """Initialize the database and create tables if they don't exist"""
    async with db_manager.get_connection() as conn:
        if conn is None:
            logging.warning("Database connection not available, skipping initialization")
            return

        # Drop existing conversations table if it has the wrong constraint (for migration)
        # Note: This will lose existing data, for production you'd want a proper migration
        try:
            await conn.execute("ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_user_id_user_id_fk")
        except:
            pass  # Constraint might not exist, which is fine

        # Create conversations table (or keep if already exists)
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS conversations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id TEXT,  -- No foreign key constraint to user table
                title TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )
        """)

        # Create messages table (or keep if already exists)
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
                role TEXT NOT NULL, -- 'user' or 'assistant'
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        """)

        logging.info("Database tables created/verified successfully")

async def save_conversation(user_id: Optional[str], title: str, messages: list):
    """Save a conversation with its messages to the database"""
    async with db_manager.get_connection() as conn:
        if conn is None:
            logging.warning("Database connection not available, skipping save")
            return None

        # Begin transaction
        async with conn.transaction():
            # Insert conversation
            conversation_id = await conn.fetchval("""
                INSERT INTO conversations (user_id, title)
                VALUES ($1, $2)
                RETURNING id
            """, user_id, title)

            # Insert messages
            for msg in messages:
                await conn.execute("""
                    INSERT INTO messages (conversation_id, role, content)
                    VALUES ($1, $2, $3)
                """, conversation_id, msg['role'], msg['content'])

    return conversation_id

async def get_conversations(user_id: Optional[str] = None):
    """Get all conversations for a user (or all conversations if user_id is None)"""
    async with db_manager.get_connection() as conn:
        if conn is None:
            logging.warning("Database connection not available, returning empty list")
            return []

        if user_id:
            conversations = await conn.fetch("""
                SELECT id, title, created_at
                FROM conversations
                WHERE user_id = $1
                ORDER BY created_at DESC
            """, user_id)
        else:
            conversations = await conn.fetch("""
                SELECT id, title, created_at
                FROM conversations
                ORDER BY created_at DESC
            """)

    return [dict(row) for row in conversations]

async def get_conversation_messages(conversation_id: str):
    """Get all messages for a specific conversation"""
    async with db_manager.get_connection() as conn:
        if conn is None:
            logging.warning("Database connection not available, returning empty list")
            return []

        messages = await conn.fetch("""
            SELECT role, content, created_at
            FROM messages
            WHERE conversation_id = $1
            ORDER BY created_at ASC
        """, conversation_id)

    return [dict(row) for row in messages]