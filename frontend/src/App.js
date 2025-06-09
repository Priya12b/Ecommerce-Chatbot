//File: frontend/src/App.js

import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Chat from './Chat';
import Products from './Products';

/**
 * Main App component.
 * Handles authentication state, view switching, and layout.
 */
export default function App() {
  // Store userId in state (persisted in localStorage)
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
  // Track which view is active: 'login', 'register', 'products', or 'chat'
  const [view, setView] = useState(userId ? 'products' : 'login');

  /**
   * Handle user login.
   * @param {string|number} id - User ID returned from backend
   */
  function handleLogin(id) {
    try {
      setUserId(id);
      localStorage.setItem('userId', id);
      setView('products');
    } catch (error) {
      alert('Login error. Please try again.');
    }
  }

  /**
   * Handle user registration.
   * @param {string|number} id - User ID returned from backend
   */
  // function handleRegister(id) {
  //   try {
  //     setUserId(id);
  //     localStorage.setItem('userId', id);
  //     setView('products');
  //   } catch (error) {
  //     alert('Registration error. Please try again.');
  //   }
  // }

  /**
   * Handle user logout.
   * Clears userId from state and localStorage.
   */
  function handleLogout() {
    try {
      setUserId(null);
      localStorage.removeItem('userId');
      setView('login');
    } catch (error) {
      alert('Logout error. Please try again.');
    }
  }

  // Main layout and routing
  return (
    <div style={{
      maxWidth: 600,
      margin: '40px auto',
      padding: 24,
      borderRadius: 18,
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fff4 100%)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      minHeight: 600
    }}>
      {/* Global styles for consistent look */}
      <style>
        {`
          body {
            background: linear-gradient(120deg, #a7bfff 0%, #f3f8ff 100%);
            min-height: 100vh;
            margin: 0;
            font-family: 'Segoe UI', Arial, sans-serif;
          }
          h1, h2 {
            color: #2563eb;
            letter-spacing: 1px;
            text-align: center;
          }
          .nav-btns {
            display: flex;
            gap: 16px;
            justify-content: center;
            margin-top: 8px;
          }
          button {
            background: #2563eb;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 8px 18px;
            margin: 0;
            font-size: 1em;
            cursor: pointer;
            transition: background 0.2s;
          }
          button:hover {
            background: #1e40af;
          }
          .logout-btn {
            background: #f87171;
          }
          input, textarea {
            border: 1px solid #b6c4e0;
            border-radius: 6px;
            padding: 8px;
            margin-bottom: 8px;
            font-size: 1em;
            outline: none;
            transition: border 0.2s;
          }
          input:focus, textarea:focus {
            border: 1.5px solid #2563eb;
          }
          form {
            background: #fff;
            border-radius: 12px;
            padding: 18px 16px;
            box-shadow: 0 2px 8px rgba(37,99,235,0.07);
            margin-bottom: 24px;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
          }
          .centered-text {
            text-align: center;
            margin-bottom: 16px;
          }
        `}
      </style>
      {/* Header with navigation */}
      <header style={{
        marginBottom: 24,
        paddingBottom: 12,
        borderBottom: '2px solid #2563eb',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2.1em', letterSpacing: '2px' }}>
          🛒 E-Commerce Chatbot
        </h1>
        {userId && (
          <div className="nav-btns">
            <button onClick={() => setView('products')}>Products</button>
            <button onClick={() => setView('chat')}>💬 Chat</button>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        )}
      </header>
      {/* Conditional rendering for authentication and main views */}
      {!userId && view === 'login' && (
        <>
          <Login onLogin={handleLogin} />
          <div className="centered-text">
            Don't have an account?{' '}
            <button onClick={() => setView('register')}>Register here</button>
          </div>
        </>
      )}

      {!userId && view === 'register' && (
        <>
          <Register onRegister={handleLogin} />
          <div className="centered-text">
            Already have an account?{' '}
            <button onClick={() => setView('login')}>Login here</button>
          </div>
        </>
      )}

      {userId && view === 'products' && <Products />}

      {userId && view === 'chat' && <Chat userId={userId} />}
    </div>
  );
}