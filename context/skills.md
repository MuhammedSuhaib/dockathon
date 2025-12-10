# Reusable Skills for Context7-based Communication

## 1. FastAPI WebSocket Communication

### Creating WebSocket Endpoints
```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        print("Client disconnected")
```

### JavaScript WebSocket Client
```javascript
const ws = new WebSocket("ws://localhost:8000/ws");
ws.onmessage = (event) => console.log(event.data);
ws.send("Hello Server");
```

## 2. ChatKit Communication Patterns

### Backend ChatKit Server Implementation
```python
from chatkit.server import ChatKitServer
from chatkit.types import ThreadStreamEvent

class MyChatKitServer(ChatKitServer):
    async def respond(self, thread, input_user_message, context) -> AsyncIterator[ThreadStreamEvent]:
        # Process user message and generate response
        yield ThreadItemDoneEvent(...)
```

### Frontend ChatKit Integration
```typescript
import { ChatKit, useChatKit } from '@openai/chatkit-react';

const { control } = useChatKit({
  api: {
    url: "http://localhost:8000/chatkit",
    domainKey: "local-dev",
  },
  initialThread: conversationId,
});

return <ChatKit control={control} />;
```

## 3. Qdrant Vector Database Communication

### REST API Communication
```bash
curl -X POST 'http://localhost:6333/collections/test_collection/points/search' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "vector": [0.1, 0.2, 0.3, 0.4],
    "top": 5
  }'
```

## 4. Better Auth Communication

### Session Communication with Headers
```typescript
import { auth } from "./auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({
    headers: await headers()
});
```

### Client-Side Authentication
```typescript
const session = await authClient.getSession({
    fetchOptions:{
      headers: await headers() // For server-side
    }
});
```

## 5. MCP (Machine-to-Machine Communication Protocol)

### MCP Plugin Configuration (Better Auth)
```typescript
import { mcp } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    mcp({
      loginPage: "/login",
    }),
  ],
});
```

## 6. CORS Configuration for Cross-Origin Communication

### Nitro CORS Setup
```typescript
import cors from "cors";
export default defineNitroPlugin((plugin) => {
  plugin.h3App.use(
    fromNodeMiddleware(
      cors({
        origin: "*",
      }),
    ),
  );
});
```

## 7. Batch Operations for Efficient Communication

### Qdrant Batch Operations
```bash
curl -X POST 'http://localhost:6333/collections/test_collection/points/batch?wait=true' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "operations": [
      {
        "upsert": {
          "points": [
            {
              "id": 100,
              "vector": [0.1, 0.2, 0.3, 0.4],
              "payload": {"city": "Paris"}
            }
          ]
        }
      }
    ]
  }'
```

## 8. Event Handling and Communication Patterns

### ChatKit Event Handling
```typescript
const { control } = useChatKit({
  api: { clientToken },
  onReady: () => console.log('ChatKit is ready'),
  onError: ({ error }) => console.error('ChatKit error:', error),
  onResponseStart: () => setIsLoading(true),
  onResponseEnd: () => setIsLoading(false),
  onThreadChange: ({ threadId }) => console.log('Thread changed:', threadId),
  onLog: ({ name, data }) => console.log('ChatKit log:', name, data),
});
```

## 9. Client-Server Action Communication

### ChatKit Actions
```typescript
// Client-side action handling
async function handleWidgetAction(action: {type: string, payload: Record<string, unknown>}) {
  if (action.type === "example") {
    const res = await doSomething(action);
    
    // Send action back to server
    await chatKit.sendAction({
      type: "example_complete",
      payload: res
    });
  }
}

chatKit.setOptions({
  widgets: { onAction: handleWidgetAction }
});
```

## 10. Context and State Management Communication

### Passing Context in ChatKit
```python
# Python server context
class MyChatKitServer(ChatKitServer):
    async def respond(..., context) -> AsyncIterator[ThreadStreamEvent]:
        # consume context["userId"]

server.process(..., context={"userId": "user_123"})
```

These reusable skills enable proper communication between frontend and backend components using the Context7 libraries and MCP principles.