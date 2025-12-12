---
title: Reuse Model Configuration Across Services
status: Proposed
date: 2025-12-13
---

## Context

The current backend codebase has inconsistent model configuration management. Different services (chatkit_service.py, rag.py, main.py) create their own OpenAI/AsyncOpenAI clients instead of reusing the centralized configuration defined in configs/config.py. This leads to:

- Code redundancy with multiple client initialization patterns
- Inconsistent model configurations across services
- Undefined variables in chatkit_service.py causing runtime errors
- Maintenance overhead when updating model settings

## Decision

We will centralize model configuration in configs/config.py and reuse this configuration across all services that require AI model access. All services (chatkit_service.py, rag.py, main.py) will import and use the pre-configured model_config and external_client from configs/config.py.

## Alternatives Considered

1. **Keep separate configurations per service**: Each service maintains its own client configuration. This provides flexibility but increases redundancy and inconsistency.

2. **Environment-based configuration only**: Services read environment variables directly without centralized config. This is simpler but lacks type safety and configuration validation.

3. **Configuration factory pattern**: Create a factory function that returns configured clients. This provides flexibility but adds complexity compared to simple imports.

## Decision

We choose to reuse the model configuration from configs/config.py across all services because:

- It eliminates code duplication
- Ensures consistent model behavior across services
- Simplifies maintenance when updating API keys or model settings
- Fixes the undefined variable issues in chatkit_service.py
- Follows the DRY (Don't Repeat Yourself) principle

## Consequences

### Positive
- Reduced code duplication
- Consistent model behavior across all services
- Easier maintenance of model configurations
- Fixes runtime errors in chatkit_service.py
- Single source of truth for model configuration

### Negative
- Tighter coupling between services and config module
- All services will be affected if config changes significantly
- Slight complexity increase in imports

### Neutral
- Requires updating existing services to use the centralized config
- May need additional error handling for config import failures

## References

- configs/config.py
- chatkit_service.py
- rag.py
- main.py