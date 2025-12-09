# ADR-0003: ChatKit Integration with Docusaurus

- **Status:** Proposed
- **Date:** 2025-12-09
- **Feature:** 002-chatbot-implementation
- **Context:** The project needs to integrate OpenAI's ChatKit into a Docusaurus-based documentation site. ChatKit provides a complete chat UI solution, but Docusaurus uses server-side rendering which creates compatibility issues with client-side libraries like ChatKit. The implementation needs to handle SSR properly while maintaining the floating chat widget UX.

## Decision

Use dynamic imports and client-side checking to integrate ChatKit with Docusaurus, specifically:

- **Frontend Framework**: Docusaurus for documentation site
- **Chat UI**: @openai/chatkit-react for chat interface
- **Integration Strategy**: Dynamic loading with SSR compatibility checks
- **Widget Placement**: Floating chat widget at bottom-right of screen
- **Endpoint**: Connect to backend at /chatkit endpoint

## Consequences

### Positive

- Maintains Docusaurus's SSR performance for main site content
- Provides full-featured chat UI with conversation history
- Consistent look and feel across different pages
- Proper separation between documentation content and chat functionality
- Easy to integrate with existing RAG backend

### Negative

- Additional complexity to handle SSR vs client-side rendering
- Potential loading states for chat component
- Extra dependency on ChatKit and its CDN
- May require additional configuration for thread persistence
- Possible issues with hydration if not properly implemented

## Alternatives Considered

### Alternative A: Custom Chat UI
- Build a custom chat interface instead of using ChatKit
- Full control over UI/UX and integration
- *Rejected* because ChatKit provides proven, feature-rich UI with less development time

### Alternative B: Static Site Integration
- Pre-render chat component or use different client-side solution
- Simpler integration but less functionality
- *Rejected* as it would limit chat capabilities

### Alternative C: Standalone Chat App
- Host chat interface as separate application
- Embed via iframe in Docusaurus site
- *Rejected* due to cross-domain issues and reduced integration

## References

- Feature Spec: specs/002-chatbot-implementation/spec.md
- Implementation research: specs/002-chatbot-implementation/research.md
- Frontend Implementation: frontend/src/components/ChatKitInterface.jsx
- Backend Integration: backend/simple_chatkit_api.py
- Docusaurus Config: frontend/docusaurus.config.ts