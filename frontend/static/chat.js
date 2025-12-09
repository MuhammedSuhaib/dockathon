import React from "react";
import Layout from "@theme/Layout";
import ChatKitInterface from "../src/components/ChatKitInterface";

export default function ChatPage() {
  return (
    <Layout title="Chat">
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
        <ChatKitInterface conversationId="docusaurus-demo" />
      </div>
    </Layout>
  );
}
