import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agents import Runner
from simple_agents.aagents import Triage_Agent
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Pydantic Models for Frontend Requests
# ---------------------------

# Matches the payload for the general chat endpoint (/api/query)
class QueryRequest(BaseModel):
    query: str

# Matches the payload for the selection endpoint (/api/selection)
class SelectionRequest(BaseModel):
    selected_text: str
    question: str

# ---------------------------
# FastAPI Endpoints (Matching React expectations)
# ---------------------------

@app.get("/")
def read_root():
    return {"message": "Python Assistant Backend is running."}

@app.post("/api/query")
async def handle_query(req: QueryRequest):
    """Handles general chat queries from the React component."""
    logging.info(f"Received general query: {req.query}")
    
    # Run the main agent with the general query
    result = await Runner.run(
        Triage_Agent,
        req.query
    )
    
    # CRITICAL: Response structure must match React component: {"answer": "...", "sources": []}
    return {
        "answer": result.final_output,
        "sources": [] # Must be included, even if empty
    }

@app.post("/api/selection")
async def handle_selection(req: SelectionRequest):
    """Handles queries based on selected text (RAG context)."""
    logging.info(f"Received selection query. Question: {req.question}")
    
    # Construct a RAG-style prompt for the agent
    prompt = (
        f"Based *only* on the following context, answer the user's question. "
        f"If the context does not contain the answer, state that. "
        f"Context: \"{req.selected_text}\" "
        f"Question: {req.question}"
    )
    
    # Run the agent with the context-aware prompt
    result = await Runner.run(
        Triage_Agent,
        prompt
    )
    
    # CRITICAL: Response structure must match React component: {"answer": "...", "sources": []}
    return {
        "answer": result.final_output,
        "sources": [] # Must be included, even if empty
    }