// File: frontend/src/Chat.js

import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, resetChat } from './api';

/**
 * Chat component for user interaction with the salesbot.
 * Handles chat history, sending messages, and resetting conversation.
 */
export default function Chat({ userId }) {
  const [messages, setMessages] = useState([]); // Stores chat history
  const [input, setInput] = useState(''); // User input
  const [sessionStart, setSessionStart] = useState(() => new Date()); // Session start time
  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  // Load chat history on mount or when userId changes
  useEffect(() => {
    setSessionStart(new Date());
    async function loadChat() {
      try {
        const res = await sendMessage(userId, "");
        if (res.chat_history) setMessages(res.chat_history);
        else setMessages([]);
      } catch (error) {
        setMessages([]);
        alert('Failed to load chat history.');
      }
    }
    loadChat();
  }, [userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Send user message to backend and update chat history.
   * Handles errors gracefully.
   */
  async function handleSend() {
    if (!input.trim()) return;
    try {
      const res = await sendMessage(userId, input, false);
      setMessages(res.chat_history || []);
      setInput('');
    } catch (error) {
      alert('Failed to send message.');
    }
  }

  /**
   * Handle Enter key for sending message.
   * @param {object} e - Keyboard event
   */
  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  /**
   * Reset the chat history for the current user.
   * Handles errors gracefully.
   */
  async function handleReset() {
    try {
      await resetChat(userId);
      setMessages([]);
      setSessionStart(new Date());
    } catch (error) {
      alert('Failed to reset conversation.');
    }
  }

  // Render chat UI
  return (
    <div style={{
      maxWidth: 500,
      margin: 'auto',
      padding: 10,
      boxSizing: 'border-box'
    }}>
      <h2>💬Chat with Salesbot</h2>
      <div style={{ fontSize: '0.9em', color: '#888', marginBottom: 8 }}>
        Session started: {sessionStart.toLocaleString()}
      </div>
      <button onClick={handleReset} style={{ marginBottom: 10 }}>Reset Conversation</button>
      <div
        style={{
          border: '1px solid #ccc',
          height: 300,
          overflowY: 'scroll',
          padding: 10,
          marginBottom: 10,
          backgroundColor: '#fafafa',
          borderRadius: 8,
          boxSizing: 'border-box'
        }}
      >
        {messages.length === 0 && (
          <div style={{ color: '#aaa', textAlign: 'center', marginTop: 50 }}>
            Start the conversation!
          </div>
        )}
        {messages.map(m => (
          <div
            key={m.id || Math.random()}
            style={{
              textAlign: m.is_bot ? 'left' : 'right',
              margin: '5px 0'
            }}
          >
            <div
              style={{
                display: 'inline-block',
                backgroundColor: m.is_bot ? '#eee' : ' #a7bfff',
                padding: '8px 12px',
                borderRadius: 12,
                maxWidth: '80%',
                wordBreak: 'break-word'
              }}
            >
              <span style={{ whiteSpace: 'pre-line' }}>{m.message}</span>
              <div style={{ fontSize: '0.7em', color: '#666', marginTop: 3 }}>
                {m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : ''}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <textarea
        rows={2}
        style={{
          width: '100%',
          resize: 'none',
          fontSize: 16,
          borderRadius: 6,
          padding: 8,
          boxSizing: 'border-box'
        }}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your message..."
      />
      <button
        onClick={handleSend}
        style={{
          marginTop: 5,
          width: '100%',
          padding: 10,
          fontSize: 16,
          borderRadius: 6
        }}
      >
        Send
      </button>
      {/* Responsive style for mobile */}
      <style>
        {`
          @media (max-width: 600px) {
            div[style*="max-width: 500px"] {
              max-width: 100vw !important;
              padding: 2vw !important;
            }
          }
        `}
      </style>
    </div>
  );
}