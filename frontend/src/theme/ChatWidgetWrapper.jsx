import React from 'react';
import { useChatKit, ChatKit } from '@openai/chatkit-react';

// Docusaurus-compatible ChatKit wrapper to avoid SSR issues
const ChatWidgetWrapper = ({ isEmbedded = false, conversationId = 'default-conversation' }) => {
  // Initialize ChatKit using the real SDK
  // We're using dynamic import to avoid SSR issues with ChatKit
  const { control, state } = useChatKit({
    api: {
      url: `${window.location.protocol}//${window.location.hostname}:8000/chatkit`, // Backend ChatKit server URL - mounted at /chatkit
      domainKey: 'localhost', // Required domain key
    },
    initialThread: conversationId,
    onThreadChange: ({ threadId }) => {
      // Handle thread changes if needed
    },
    startScreen: {
      prompts: [
        { label: 'Hello', prompt: 'Say hello' },
        { label: 'About Robotics', prompt: 'Tell me about robotics' },
        { label: 'About AI', prompt: 'Explain artificial intelligence' }
      ]
    }
  });

  // Real ChatKit UI
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: isEmbedded ? '400px' : '600px',
      border: '1px solid #00ff41',
      borderRadius: '8px',
      backgroundColor: '#001a0d',
      color: '#00ff41',
      fontFamily: 'monospace',
      overflow: 'hidden',
      maxWidth: isEmbedded ? '100%' : '800px',
      margin: isEmbedded ? '0' : '20px 0',
      width: isEmbedded ? '100%' : 'auto'
    }}>
      {/* Chat Header */}
      <div style={{
        padding: '15px',
        backgroundColor: 'rgba(0, 255, 65, 0.1)',
        borderBottom: '1px solid #00ff41',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: '#00ff41',
          boxShadow: '0 0 8px #00ff41'
        }}></div>
        <span style={{ fontWeight: 'bold' }}>AI Assistant (ChatKit)</span>
        <span style={{ fontSize: '12px', opacity: 0.7 }}>
          Ask about Embodied Intelligence & Robotics
        </span>
      </div>

      {/* ChatKit Chat Component */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatKit
          control={control}
          state={state}
          components={{
            // Custom input area with our additional functionality
            InputArea: ({ control, state }) => (
              <div style={{ padding: '15px', borderTop: '1px solid #00ff41', backgroundColor: 'rgba(0, 255, 65, 0.05)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Ask about robotics, AI, or textbook content..."
                      disabled={state?.status !== 'ready'}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        border: '1px solid #00ff41',
                        borderRadius: '24px',
                        backgroundColor: '#001a0d',
                        color: '#00ff41',
                        outline: 'none',
                        fontFamily: 'monospace'
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (e.target.value.trim()) {
                            control.sendUserMessage(e.target.value);
                            e.target.value = '';
                          }
                        }
                      }}
                      onInput={(e) => {
                        if (control && state?.status === 'ready') {
                          control.setDraft(e.target.value);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const inputElement = e.target.previousElementSibling;
                        if (inputElement && inputElement.value.trim() && state?.status === 'ready') {
                          control.sendUserMessage(inputElement.value);
                          inputElement.value = '';
                        }
                      }}
                      disabled={state?.status !== 'ready'}
                      style={{
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '24px',
                        backgroundColor: '#00cc44',
                        color: 'white',
                        cursor: state?.status !== 'ready' ? 'not-allowed' : 'pointer',
                        opacity: state?.status !== 'ready' ? 0.5 : 1,
                        transition: 'all 0.2s ease',
                        fontFamily: 'monospace',
                        fontWeight: 'bold'
                      }}
                      onMouseEnter={(e) => {
                        if (state?.status === 'ready') {
                          e.target.style.backgroundColor = '#00ff41';
                          e.target.style.textShadow = '0 0 8px rgba(0, 255, 65, 0.6)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (state?.status === 'ready') {
                          e.target.style.backgroundColor = '#00cc44';
                          e.target.style.textShadow = 'none';
                        }
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
                <div style={{
                  fontSize: '11px',
                  opacity: 0.6,
                  textAlign: 'center',
                  marginTop: '8px'
                }}>
                  Powered by ChatKit SDK & Gemini API
                </div>
              </div>
            )
          }}
        />
      </div>
    </div>
  );
};

export default ChatWidgetWrapper;