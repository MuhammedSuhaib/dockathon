import React, { useState } from 'react';
import ChatKitInterface from '@site/src/components/ChatKitInterface';

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
    setIsMinimized(!isMinimized);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(true);
  };

  return (
    <div className="floating-chat-widget">
      {isOpen && (
        <div className={`chat-window ${isMinimized ? 'minimized' : 'expanded'}`}>
          <div className="chat-header">
            <div className="chat-title">AI Assistant</div>
            <div className="chat-controls">
              <button
                className="minimize-btn"
                onClick={toggleChat}
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                {isMinimized ? '+' : '−'}
              </button>
              <button
                className="close-btn"
                onClick={closeChat}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </div>
          {!isMinimized && (
            <div className="chat-body">
              <ChatKitInterface isEmbedded={true} conversationId="floating-chat" />
            </div>
          )}
        </div>
      )}

      {!isOpen && (
        <button
          className="chat-fab"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-label="Open AI Assistant"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}

      <style jsx>{`
        .floating-chat-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          font-family: sans-serif;
        }

        .chat-fab {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #00cc00;
          color: white;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          transition: all 0.3s ease;
        }

        .chat-fab:hover {
          background: #00aa00;
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .chat-window {
          width: 380px;
          max-height: 600px;
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          background: white;
          border: 1px solid #e0e0e0;
        }

        .chat-header {
          background: #00cc00;
          color: white;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: move;
        }

        .chat-title {
          font-weight: 600;
          font-size: 16px;
        }

        .chat-controls {
          display: flex;
          gap: 8px;
        }

        .minimize-btn, .close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .minimize-btn:hover, .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .chat-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 400px;
        }

        .minimized {
          width: 380px;
          height: 50px;
        }

        .minimized .chat-body {
          display: none;
        }

        @media (max-width: 768px) {
          .chat-window {
            width: 320px;
            max-height: 500px;
          }

          .chat-body {
            height: 350px;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingChatWidget;