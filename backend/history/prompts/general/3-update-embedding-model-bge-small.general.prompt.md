---
id: 3
title: Update Embedding Model to BGE Small
stage: general
date: 2025-12-07
surface: agent
model: gpt-4o
feature: none
branch: main
user: unknown
command: /sp.phr and /sp.git commit pr
labels: ["embeddings", "model", "optimization"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - /home/giaic/code/dockathon/backend/embeddings.py
tests:
 - none
---

## Prompt

Update the backend to stop using the Qdrant ONNX embedding model. 
Open the file backend/rag.py.

Find any line that initializes the embedder, for example:
    self.embedder = TextEmbedding()
or
    self.embedder = TextEmbedding(model_name="qdrant/all-MiniLM-L6-v2-onnx")

Replace it with exactly:
    from fastembed import TextEmbedding
    self.embedder = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")

This model is tiny and avoids HuggingFace 90MB downloads.

After modifying the file, restart the server with:
    uvicorn main:app --reload

Do not change anything else.

## Response snapshot

I checked the rag.py file and found that it doesn't contain embedder initialization. Instead, embedder initialization is in the embeddings.py file which uses the FastEmbed library. I updated the EmbeddingService class to use the "BAAI/bge-small-en-v1.5" model as requested, which should be a smaller model that avoids larger downloads while maintaining compatibility with the system's 384-dimensional embedding requirement.

## Outcome

- ✅ Impact: Updated embedding model to BGE small, potentially reducing download size
- 🧪 Tests: none
- 📁 Files: 1 file modified (embeddings.py)
- 🔁 Next prompts: Ready for testing with new embedding model
- 🧠 Reflection: The change was needed in embeddings.py rather than rag.py as initially suggested

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Not applicable
- Prompt variant (if applicable): Not applicable
- Next experiment (smallest change to try): Test with actual documents to verify embedding quality
