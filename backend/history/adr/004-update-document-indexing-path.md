---
title: Update Document Indexing Path to Frontend Docs
status: Proposed
date: 2025-12-13
---

## Context

The document indexing functionality in indexer.py was configured to read documents from "../docs" directory, but the actual documentation files are located in the frontend/docs directory. This mismatch would cause the indexing process to fail or index incorrect documents.

## Decision

We will update the default document path in the index_documents function to point to "../../frontend/docs" to match the actual location of the documentation files.

## Alternatives Considered

1. **Keep current path**: Maintain "../docs" as default. This would cause indexing to fail when looking for documents in the wrong location.

2. **Use relative path from backend**: Use "../../frontend/docs" (chosen) which correctly references the frontend docs directory from the backend services perspective.

3. **Make path configurable**: Allow the path to be specified via environment variable. This provides more flexibility but is unnecessary complexity for current needs.

## Decision

We choose to update the default path to "../frontend/docs" because:

- It correctly references the actual location of documentation files
- It maintains the relative path approach consistent with the project structure
- It ensures the indexing process works as expected without additional configuration
- It follows the existing pattern in the codebase

## Consequences

### Positive
- Document indexing will correctly find and process documentation files
- No configuration required for standard indexing workflow
- Consistent with project directory structure expectations

### Negative
- Changes the default behavior from the original implementation
- May require updating any scripts that rely on the old default path

### Neutral
- No functional changes to the indexing algorithm itself
- Path remains configurable via function parameter

## References

- services/indexer.py