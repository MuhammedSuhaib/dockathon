# 📘 SpecKit Plus: Master Implementation Guide

**Project:** Physical AI & Humanoid Robotics Textbook (Interactive RAG)
**Architecture:** Sidecar Auth Pattern (Stateless JWT Verification)
**Theme:** The Matrix (Green/Black Terminal UI)

## 🏗️ System Architecture & Port Map

| Service | Technology | Port | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | Docusaurus (React) | `3000` | Static content & Chat UI. Consumes Auth & Backend APIs. |
| **Auth Server** | Node.js + Hono | `4000` | Handles Login/Signup, Minting JWTs, Exposing JWKS. |
| **Backend** | FastAPI (Python) | `8000` | RAG AI Engine. Verifies JWTs via JWKS. Persists Chat. |
| **Database** | Neon Postgres | *Cloud* | **Shared Source of Truth:** Users, Keys, and Chat History. |

---

## 🛠️ Step 0: Database Schema (Neon)

We need a unified schema. One part is for Better Auth (standard), the other for your Chat History.

1.  **Action:** Open your [Neon Console](https://console.neon.tech) SQL Editor.
2.  **Run:** Execute the following SQL to create the necessary tables.

```sql
-- === 1. BETTER AUTH STANDARD TABLES ===
CREATE TABLE "user" (
    id text PRIMARY KEY, name text NOT NULL, email text NOT NULL UNIQUE, 
    "emailVerified" boolean NOT NULL, image text, "createdAt" timestamp NOT NULL, 
    "updatedAt" timestamp NOT NULL
);
CREATE TABLE "session" (
    id text PRIMARY KEY, "expiresAt" timestamp NOT NULL, token text NOT NULL UNIQUE, 
    "createdAt" timestamp NOT NULL, "updatedAt" timestamp NOT NULL, "ipAddress" text, 
    "userAgent" text, "userId" text NOT NULL REFERENCES "user"(id)
);
CREATE TABLE "account" (
    id text PRIMARY KEY, "accountId" text NOT NULL, "providerId" text NOT NULL, 
    "userId" text NOT NULL REFERENCES "user"(id), "accessToken" text, "refreshToken" text, 
    "idToken" text, "accessTokenExpiresAt" timestamp, "refreshTokenExpiresAt" timestamp, 
    "scope" text, "password" text, "createdAt" timestamp NOT NULL, "updatedAt" timestamp NOT NULL
);
CREATE TABLE "verification" (
    id text PRIMARY KEY, identifier text NOT NULL, value text NOT NULL, 
    "expiresAt" timestamp NOT NULL, "createdAt" timestamp, "updatedAt" timestamp
);
-- The table storing the Public/Private Key pair for JWT signing
CREATE TABLE "jwks" (
    id text PRIMARY KEY, "publicKey" text NOT NULL, "privateKey" text NOT NULL, 
    "createdAt" timestamp NOT NULL
);

-- === 2. TEXTBOOK CHAT HISTORY ===
CREATE TABLE "conversations" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    title text,
    created_at timestamp DEFAULT now()
);

CREATE TABLE "messages" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES "conversations"(id) ON DELETE CASCADE,
    role text NOT NULL, -- 'user' or 'assistant'
    content text NOT NULL,
    created_at timestamp DEFAULT now()
);
```

---

## 🚀 Phase 1: The Auth Server (Hono + Better Auth)

This server manages identity and exposes the Public Key (JWKS) so the Python backend can verify users without touching the Auth DB directly.

### 1.1 Setup
```bash
mkdir auth-server && cd auth-server
pnpm init
pnpm add better-auth hono @hono/node-server dotenv pg drizzle-orm
pnpm add -D tsx typescript @types/node @types/pg
```

### 1.2 The Auth Logic (`src/auth.ts`)
We configure the `jwt` plugin to expose the keys at `/.well-known/jwks.json`.

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { jwt } from "better-auth/plugins/jwt";
import { Pool } from "pg"; 
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./db/schema"; // (Assume you generated this via drizzle-kit)

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

export const auth = betterAuth({
    database: drizzleAdapter(db, { provider: "pg" }),
    emailAndPassword: { enabled: true },
    plugins: [
        jwt({
            jwks: {
                keyPairConfig: { alg: "RS256", use: "sig" },
                jwksPath: "/.well-known/jwks.json" // ✅ Explicit path as per Context7
            }
        })
    ],
    trustedOrigins: ["http://localhost:3000"] // Frontend Origin
});
```

### 1.3 The Server Entry (`src/index.ts`)
We must handle **CORS** here, otherwise, Docusaurus (Port 3000) cannot talk to Hono (Port 4000).

```typescript
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";

const app = new Hono();

// ✅ CORS Configuration (Crucial for Sidecar pattern)
app.use("/api/*", cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Mount Better Auth
app.on(["POST", "GET"], "/api/auth/**", (c) => {
    return auth.handler(c.req.raw);
});

// The JWKS endpoint is now auto-handled by the plugin at /api/auth/.well-known/jwks.json
// Or the specific path configured in 1.2

serve({ fetch: app.fetch, port: 4000 });
console.log("🔐 Auth Server running on port 4000");
```

---

## 🖥️ Phase 2: The Frontend (Docusaurus)

### 2.1 Auth Client (`src/lib/auth-client.ts`)
Connect the client to the Auth Server, not the Docusaurus server.

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "http://localhost:4000", // Points to Hono
});
```

### 2.2 Calling the Backend (Matrix Chat Component)
When the user sends a message, we must grab the token and pass it to Python.

```tsx
import { authClient } from "../../lib/auth-client";

const MatrixChat = () => {
  const { data: session } = authClient.useSession();

  const handleSendMessage = async (msg: string) => {
    // ⚠️ CRITICAL: Ensure we have a valid session
    if (!session) return alert("Access Denied: Jack in to the Matrix first.");

    // The JWT token is usually available in the session object or via authClient.getToken()
    // depending on plugin config. With standard setup:
    const token = session.token || session.user.id; // Adjust based on your JWT payload config

    const response = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // ✅ Send Token to Python
      },
      body: JSON.stringify({ message: msg })
    });
    
    // ... handle response
  };
  
  return (/* Matrix UI JSX */);
};
```

---

## 🐍 Phase 3: The Backend (FastAPI)

FastAPI acts as a **Stateless Resource Server**. It doesn't query the "session" table; it verifies the mathematical signature of the JWT using keys fetched from Hono.

### 3.1 Dependencies
```bash
uv add fastapi uvicorn pyjwt[crypto] cryptography asyncpg pydantic-settings
```

### 3.2 JWKS Verification Utility (`app/auth_utils.py`)

```python
import jwt
from jwt.algorithms import RSAAlgorithm
import requests
import json

# URL to Hono's exposed JWKS
JWKS_URL = "http://localhost:4000/api/auth/.well-known/jwks.json"

def get_public_key():
    # In production, cache this response!
    jwks = requests.get(JWKS_URL).json()
    public_keys = {}
    for jwk in jwks['keys']:
        kid = jwk['kid']
        public_keys[kid] = RSAAlgorithm.from_jwk(json.dumps(jwk))
    return public_keys

def verify_token(token: str):
    public_keys = get_public_key()
    kid = jwt.get_unverified_header(token)['kid']
    key = public_keys[kid]
    
    # Verify signature
    payload = jwt.decode(token, key=key, algorithms=["RS256"])
    return payload # Returns dict with user_id, email, etc.
```

### 3.3 The Chat Endpoint (`app/main.py`)

```python
from fastapi import FastAPI, Header, HTTPException, Depends
from pydantic import BaseModel
from .auth_utils import verify_token
# Import your DB logic here (sqlalchemy/asyncpg)

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest, authorization: str = Header(...)):
    # 1. Extract Token
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Header")
    token = authorization.split(" ")[1]

    # 2. Verify Token (Stateless)
    try:
        user_data = verify_token(token)
        user_id = user_data.get("sub") or user_data.get("id")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid Token")

    # 3. Process RAG / AI Logic
    ai_response = f"Matrix Answer to: {req.message}"

    # 4. Persist to Neon (SQL)
    # await database.execute(
    #    "INSERT INTO messages (user_id, role, content) VALUES ($1, 'user', $2)", 
    #    user_id, req.message
    # )
    # await database.execute(
    #    "INSERT INTO messages (user_id, role, content) VALUES ($1, 'assistant', $2)", 
    #    user_id, ai_response
    # )

    return {"response": ai_response}
```

---

## ✅ Implementation Checklist

1.  **DB:** Run SQL schema in Neon.
2.  **Auth (Port 4000):** 
    *   Verify `jwt()` plugin has `jwksPath` configured.
    *   Verify `cors` allows `localhost:3000`.
    *   Run `pnpm dev`.
    *   Check `http://localhost:4000/api/auth/.well-known/jwks.json` in browser—you should see JSON keys.
3.  **Frontend (Port 3000):**
    *   `authClient` pointing to Port 4000.
    *   Login works (Check `session` table in Neon).
4.  **Backend (Port 8000):**
    *   Update `JWKS_URL` to point to Auth Server.
    *   Send a `curl` request with the token from the frontend to verify connectivity.