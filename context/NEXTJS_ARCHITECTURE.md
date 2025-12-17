# Next.js + Better Auth + FastAPI Architecture

## Current Complex Architecture (To be replaced):
```
[Frontend (Docusaurus)]
         ↓ (auth requests)
[auth-server (Hono + Better Auth)] ←─┐ (JWKS issues)
         ↓ (auth tokens)              │
[FastAPI Backend] ←───────────────────┘ (token verification)
         ↓
[PostgreSQL DB]
```

## Proposed Simplified Architecture:
```
[Next.js Frontend + Better Auth]
         ↓ (internal auth flow)
[Next.js API Routes] ─────────────→ [FastAPI Backend]
         ↓ (authenticated requests)        ↓ (authenticated requests)
[PostgreSQL DB] ←──────────────────────────┘ (shared data)
```

## Data Flow:
1. User registers/logs in via Next.js pages using Better Auth
2. Better Auth creates session in Next.js
3. Frontend makes authenticated requests to Next.js API routes
4. Next.js API routes validate session internally
5. Next.js API routes call FastAPI backend with necessary data
6. FastAPI processes requests and returns data to Next.js
7. Next.js returns data to frontend
8. All data stored in PostgreSQL with user isolation

## Components:
- Next.js App (Frontend + Auth + API layer)
- Better Auth (Authentication management)
- FastAPI (Business logic and processing)
- PostgreSQL (Shared database)