import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

const { useChatKit, ChatKit } =
  typeof window !== "undefined"
    ? require("@openai/chatkit-react")
    : { useChatKit: null, ChatKit: null };

export default function ChatKitInterface({ conversationId = "demo-thread" }) {
  if (!useChatKit || !ChatKit) {
    return (
      <div style={{ padding: 20, border: "1px solid #aaa" }}>
        ChatKit failed to load. Install: pnpm add @openai/chatkit-react
      </div>
    );
  }

  const { control, state } = useChatKit({
    api: {
      url: "http://localhost:8000/chatkit",
      domainKey: "local-dev",
    },
    initialThread: conversationId,
  });

  return (
    <div style={{ height: "80vh", border: "1px solid #ccc" }}>
      <ChatKit control={control} state={state} />
    </div>
  );
}
