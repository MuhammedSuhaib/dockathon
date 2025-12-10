import React from "react";
import Head from "@docusaurus/Head";

const { useChatKit, ChatKit } =
  typeof window !== "undefined"
    ? require("@openai/chatkit-react")
    : { useChatKit: null, ChatKit: null };

export default function ChatKitInterface({ conversationId = "demo-thread" }) {
  if (!useChatKit || !ChatKit) {
    return (
      <div style={{ padding: 20, border: "1px solid #aaa" }}>
        ChatKit failed to load. Install: `pnpm add @openai/chatkit-react`
      </div>
    );
  }

  // Inject the required stylesheet for ChatKit to work properly
  const ChatKitCSS = (
    <Head>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@openai/chatkit-react@latest/dist/style.css"
      />
    </Head>
  );

  const { control, state } = useChatKit({
    api: {
      url: "http://127.0.0.1:8000/chatkit", // Corrected: NO trailing slash
      domainKey: "local-dev",
    },
    initialThread: conversationId,
    onThreadChange: ({ threadId }) => {
      // Handle thread changes if needed
    },
    startScreen: {
      prompts: [
        { label: "Hello", prompt: "Say hello" },
        { label: "About Robotics", prompt: "Tell me about robotics" },
        { label: "About AI", prompt: "Explain artificial intelligence" },
      ],
    },
  });

  return (
    <div style={{ height: "80vh", border: "1px solid #ccc", margin: "20px 0" }}>
      {ChatKitCSS}
      <ChatKit control={control} state={state} />
    </div>
  );
}