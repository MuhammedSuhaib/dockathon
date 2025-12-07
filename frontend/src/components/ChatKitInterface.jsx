import React, { useState, useEffect, useRef } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Import the real ChatKit React library
// This would be installed via: npm install @openai/chatkit-react
const { useChatKit, ChatKit } = typeof window !== 'undefined' ? require('@openai/chatkit-react') : { useChatKit: null, ChatKit: null };

const ChatKitInterface = ({ conversationId = 'default-conversation', isEmbedded = false }) => {
  const { siteConfig } = useDocusaurusContext();
  const [currentSelectedText, setCurrentSelectedText] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Initialize ChatKit using the real SDK
  const { control, state } = useChatKit ? useChatKit({
    api: {
      url: 'http://localhost:8000/chatkit', // Backend ChatKit server URL
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
  }) : { control: null, state: null };

  // Function to get selected text from the page
  const getSelectedText = () => {
    const selection = window?.getSelection ? window.getSelection() : document?.selection;
    return selection ? selection.toString().trim() : '';
  };

  // Function to handle asking about selected text
  const handleAskAboutSelection = () => {
    const selected = getSelectedText() || currentSelectedText;
    if (!selected) {
      alert('Please select some text first.');
      return;
    }

    if (selected.length > 2000) { // Limit text length
      alert('Selected text is too long. Please select a shorter portion.');
      return;
    }

    const questionPrompt = `About this text: "${selected}". Question: `;
    setInputValue(questionPrompt);
    setCurrentSelectedText(selected);
  };

  // Fallback UI in case ChatKit is not available
  if (!useChatKit || !ChatKit) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: isEmbedded ? '400px' : '600px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f5f5f5',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
        maxWidth: isEmbedded ? '100%' : '800px',
        margin: isEmbedded ? '0' : '20px 0',
        width: isEmbedded ? '100%' : 'auto'
      }}>
        <div style={{
          padding: '15px',
          backgroundColor: '#e0e0e0',
          borderBottom: '1px solid #ccc',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
          }}></div>
          <span style={{ fontWeight: 'bold' }}>AI Assistant (ChatKit)</span>
          <span style={{ fontSize: '12px', opacity: 0.7 }}>
            ChatKit not loaded - please install @openai/chatkit-react
          </span>
        </div>

        <div style={{
          flex: 1,
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <p>ChatKit library not loaded. Please install @openai/chatkit-react package.</p>
        </div>

        <div style={{
          padding: '15px',
          borderTop: '1px solid #ccc',
          backgroundColor: '#e0e0e0',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '11px', opacity: 0.6 }}>
            Install ChatKit: npm install @openai/chatkit-react
          </p>
        </div>
      </div>
    );
  }

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
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (inputValue.trim()) {
                    control.sendUserMessage(inputValue);
                    setInputValue('');
                  }
                }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
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
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || state?.status !== 'ready'}
                      style={{
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '24px',
                        backgroundColor: '#00cc44',
                        color: 'white',
                        cursor: (!inputValue.trim() || state?.status !== 'ready') ? 'not-allowed' : 'pointer',
                        opacity: (!inputValue.trim() || state?.status !== 'ready') ? 0.5 : 1,
                        transition: 'all 0.2s ease',
                        fontFamily: 'monospace',
                        fontWeight: 'bold'
                      }}
                      onMouseEnter={(e) => {
                        if (!(inputValue.trim() || state?.status !== 'ready')) {
                          e.target.style.backgroundColor = '#00ff41';
                          e.target.style.textShadow = '0 0 8px rgba(0, 255, 65, 0.6)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!(inputValue.trim() || state?.status !== 'ready')) {
                          e.target.style.backgroundColor = '#00cc44';
                          e.target.style.textShadow = 'none';
                        }
                      }}
                    >
                      Send
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleAskAboutSelection}
                    disabled={state?.status !== 'ready'}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #00ff41',
                      borderRadius: '24px',
                      backgroundColor: 'transparent',
                      color: '#00ff41',
                      cursor: state?.status !== 'ready' ? 'not-allowed' : 'pointer',
                      opacity: state?.status !== 'ready' ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                      fontFamily: 'monospace',
                      fontSize: '14px'
                    }}
                    onMouseEnter={(e) => {
                      if (state?.status === 'ready') {
                        e.target.style.backgroundColor = 'rgba(0, 255, 65, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (state?.status === 'ready') {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    Ask about selected text
                  </button>
                </form>
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

export default ChatKitInterface;