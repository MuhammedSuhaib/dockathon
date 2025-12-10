

"""
Authentication module using Authlib for the RAG Chatbot.
"""
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from authlib.integrations.starlette_client import OAuth
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize OAuth for social logins if needed
oauth = OAuth()

# Add HTTPBearer for token authentication
security = HTTPBearer()

async def get_current_user_optional(request: Request):
    """
    Get current user if authenticated, otherwise return None.
    This allows endpoints to work with or without authentication.
    For now, this is a placeholder that returns None.
    In a full implementation, you would validate JWT tokens or sessions.
    """
    try:
        # In a real implementation, you would:
        # 1. Extract the token from the request
        # 2. Validate it against your authentication provider
        # 3. Return user information
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token:
            return None

        # Placeholder - in production, validate the token with your auth provider
        # For example, with JWT: decode and verify the token
        # For now, returning None to indicate no authenticated user
        return None
    except:
        return None

def require_auth_optional(request: Request = None):
    """
    Optional authentication dependency that doesn't require authentication
    but provides user context if available.
    """
    return request