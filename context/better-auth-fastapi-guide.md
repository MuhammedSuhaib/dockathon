# Using Better Auth with FastAPI

This guide explains how to integrate Better Auth with FastAPI, allowing you to leverage Better Auth's comprehensive authentication system while maintaining your main API logic in FastAPI.

## How Better Auth Works

Better Auth is a comprehensive authentication and authorization framework designed for the TypeScript ecosystem. Here's how it works:

1. **Server-Side Instance**: Creates an authentication server with `betterAuth()` that handles all core authentication logic, including user registration, login, session management, and more.

2. **REST API Endpoints**: Exposes standardized REST API endpoints that handle authentication flows (login, signup, password reset, etc.) and follow the "bring your own database" philosophy.

3. **Database Adapters**: Connects to various databases (PostgreSQL, MySQL, SQLite, MongoDB, etc.) through adapters or direct integration.

4. **Client Libraries**: Provides framework-specific client libraries for React, Vue, Svelte, etc., that communicate with the server endpoints and handle authentication state.

5. **Framework Agnostic**: Though primarily designed for TypeScript/JavaScript frameworks, it can be used with any system that can make HTTP requests.

## Integration Approaches with FastAPI

Based on research, here are the potential ways to use better-auth with FastAPI:

1. **Hybrid Approach**: Run better-auth as a separate Node.js service alongside your FastAPI application, with your frontend communicating directly with the better-auth endpoints for authentication while using FastAPI for your main business logic.

2. **Reverse Proxy Setup**: Deploy better-auth separately and use a reverse proxy (like nginx) to serve both your FastAPI API and better-auth endpoints under the same domain.

3. **Token Verification Approach**: Use better-auth to handle authentication and issue tokens, then create a FastAPI endpoint that verifies these tokens on behalf of your main application. Better-auth stores session tokens in cookies with the `__Secure-` prefix, which are signed and can be validated.

4. **Session Sharing**: Since better-auth creates session records in the database, you could potentially access these from your FastAPI backend to validate user sessions.

According to available information, better-auth is primarily focused on the TypeScript ecosystem and doesn't have direct Python/FastAPI integrations planned.

## Example Implementation

Here's a practical example showing how better-auth can work with FastAPI:

### 1. Better Auth Server Side (Node.js)

First, we'll set up the better-auth server component:

```typescript
// auth.ts - Better Auth server instance
import { betterAuth } from "better-auth";
import { db } from "./db"; // your database instance

export const auth = betterAuth({
  database: db, // your database adapter
  secret: process.env.AUTH_SECRET || "fallback-secret-change-me",
  baseURL: process.env.BASE_URL || "http://localhost:3000",
  trustHost: true,
  
  // Email and password authentication
  emailAndPassword: {
    enabled: true,
  },

  // Session configuration
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  // User configuration
  user: {
    fields: {
      name: "name",
      email: "email",
      emailVerified: "email_verified",
    },
  },
});
```

```typescript
// api-handler.ts - API handler for better-auth endpoints
import { auth } from "./auth";

export default (req: Request) => {
  // This will handle all better-auth routes
  return auth.handler(req);
};

// This would be deployed as a separate service or mounted in your existing Node.js server
```

### 2. FastAPI Backend

Then we create the FastAPI application that communicates with better-auth:

```python
# main.py
from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from typing import Dict, Optional

app = FastAPI(title="FastAPI with Better Auth Example")

# Add CORS middleware if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration for better-auth service
BETTER_AUTH_BASE_URL = os.getenv("BETTER_AUTH_BASE_URL", "http://localhost:8000")
AUTH_COOKIE_NAME = "__Secure-authjs.session-token"

async def get_current_user(request: Request) -> Dict:
    """
    Extract and verify user session from better-auth cookie.
    This is a simplified approach - in practice, you'd validate the session token properly.
    """
    auth_cookie = request.cookies.get(AUTH_COOKIE_NAME)
    
    if not auth_cookie:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Make request to better-auth session endpoint to validate the session
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{BETTER_AUTH_BASE_URL}/api/auth/get-session",
                cookies={AUTH_COOKIE_NAME: auth_cookie},
                headers={"user-agent": request.headers.get("user-agent", "")}
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session")
                
            session_data = response.json()
            return session_data.get("session", {})
        except Exception as e:
            raise HTTPException(status_code=401, detail="Session validation failed")

@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI with Better Auth"}

@app.get("/protected-route")
async def protected_route(current_user: Dict = Depends(get_current_user)):
    """Example route that requires authentication"""
    return {
        "message": "This is a protected route",
        "user_id": current_user.get("userId"),
        "user_email": current_user.get("user", {}).get("email"),
    }

@app.post("/custom-api-endpoint")
async def custom_endpoint(
    request: Request,
    current_user: Dict = Depends(get_current_user)
):
    """Example of a custom API endpoint that requires authentication"""
    user_id = current_user.get("userId")
    
    # Your custom business logic here
    return {
        "message": f"Successfully processed request for user {user_id}",
        "user_id": user_id
    }
```

### 3. Frontend Integration

For the frontend, you would use the better-auth client to handle authentication:

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8000/api/auth", // URL to your better-auth instance
});

// Use in your React components
import { authClient } from "../lib/auth-client";

const LoginButton = () => {
  const handleLogin = async () => {
    await authClient.signIn.email({
      email: "user@example.com",
      password: "password",
      redirectTo: "/dashboard"
    });
  };

  return (
    <button onClick={handleLogin}>
      Login
    </button>
  );
};
```

### 4. Deployment Configuration

To run this setup, you'd typically:

1. Deploy the better-auth service separately (Node.js server)
2. Deploy the FastAPI application separately (Python server)
3. Use a reverse proxy like nginx to serve both under appropriate paths, or have the frontend communicate with both services directly

```nginx
# Example nginx configuration
server {
    listen 80;
    server_name yourdomain.com;

    # Serve better-auth endpoints
    location /api/auth {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Serve FastAPI endpoints
    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Serve frontend
    location / {
        root /path/to/your/frontend;
        index index.html;
    }
}
```

## Summary

This approach allows you to leverage better-auth's comprehensive authentication system while keeping your main API logic in FastAPI. The frontend communicates with better-auth for authentication and with your FastAPI backend for business logic. This hybrid approach gives you the best of both worlds: robust TypeScript authentication and Python-based backend logic.