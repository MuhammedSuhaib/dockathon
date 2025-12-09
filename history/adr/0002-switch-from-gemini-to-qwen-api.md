# ADR-0002: Switch from Gemini API to Qwen API

- **Status:** Proposed
- **Date:** 2025-12-09
- **Feature:** 002-chatbot-implementation
- **Context:** The project initially used Google's Gemini API for AI responses in the chatbot feature, but needs to switch to Alibaba Cloud's Qwen API for improved performance, cost effectiveness, or availability reasons. The current implementation in test_gemini.py shows the Qwen API integration with the portal.qwen.ai endpoint.

## Decision

Switch from Google's Gemini API to Alibaba Cloud's Qwen API, specifically using the Qwen3-coder-plus model through the portal.qwen.ai endpoint as shown in test_gemini.py. This includes:

- **API Provider**: Migrate from Google's Gemini to Qwen (Alibaba Cloud)
- **Model**: Use qwen3-coder-plus model for responses
- **Endpoint**: Utilize https://portal.qwen.ai/v1 as the base URL
- **Client**: Maintain OpenAI-compatible client interface for consistency

## Consequences

### Positive

- Potentially better performance with Qwen models optimized for coding and technical questions
- Possible cost savings depending on pricing models
- Alternative API provider reduces single point of failure
- Qwen models may have better domain-specific knowledge for robotics/embodied intelligence

### Negative

- Need to update all API calls and potentially handle different response formats
- Additional dependency on Qwen API key and account
- May require tuning of prompts that were optimized for Gemini
- Different rate limiting and quota structures
- Team needs to familiarize themselves with Qwen API documentation

## Alternatives Considered

### Alternative A: Continue with Gemini API
- Keep existing implementation as is
- Avoid migration cost and complexity
- *Rejected* because of potential performance or cost advantages of Qwen API

### Alternative B: Use OpenAI API (GPT models)
- Switch to OpenAI's GPT models instead of Gemini
- Consistent with more widely-used API
- *Rejected* as the implementation already shows Qwen API integration

### Alternative C: Multi-provider approach
- Implement logic to switch between multiple AI providers
- Maintain flexibility to use different providers based on needs
- *Rejected* as it adds complexity for the MVP

## References

- Feature Spec: specs/002-chatbot-implementation/spec.md
- Implementation research: specs/002-chatbot-implementation/research.md
- Qwen implementation: backend/test_gemini.py
- API Integration: backend/simple_chatkit_api.py and related RAG services