---
title: Backend Organization Structure
status: Proposed
date: 2025-12-13
---

## Context

The backend codebase had all files scattered in a single directory, making it difficult to navigate and maintain. The original structure mixed API endpoints, services, data handling, configuration, and tests in the same directory. This created a cluttered and confusing project layout that didn't follow common Python project conventions.

## Decision

We will organize the backend into logical directories following common Python project structure conventions:

- `main.py` - Main application entry point (kept in root for easy identification by users)
- `services/` - Core business logic and service implementations
- `data/` - Data handling, storage, and processing modules
- `configs/` - Configuration files (original name preserved)
- `simple_agents/` - Agent-related files (original name preserved)
- `tests/` - All test files (already created in previous step)

## Alternatives Considered

1. **Keep flat structure**: Maintain all files in main directory. This is simple but creates maintainability issues as the project grows.

2. **More complex organization**: Create additional subdirectories like `models/`, `controllers/`, `utils/`, etc. This provides more granular organization but may be over-engineering for current project size.

3. **Dedicated directories by layer (chosen)**: Organize by functional layers (api, services, data) which provides clear separation of concerns without over-engineering.

## Decision

We choose to organize the backend into functional directories because:

- It provides clear separation of concerns between different application layers
- It follows Python community conventions and best practices
- It makes the codebase easier to navigate and understand
- It improves maintainability as the project grows
- It enables easier testing and development workflows

## Consequences

### Positive
- Clearer separation of concerns between application layers
- Easier navigation and understanding of the project structure
- Better adherence to Python project conventions
- Improved maintainability and scalability
- Cleaner main directory focused on project configuration

### Negative
- Requires updating import paths throughout the codebase
- Slight increase in directory depth for module imports
- Potential for import path issues if not handled carefully

### Neutral
- No functional changes to the application logic
- Requires adding path modifications to ensure imports work from subdirectories

## References

- main.py (kept in root)
- services/chatkit_service.py
- services/rag.py
- services/indexer.py
- data/vector_store.py
- data/embeddings.py
- configs/config.py
- simple_agents/aagents.py
- tests/ directory