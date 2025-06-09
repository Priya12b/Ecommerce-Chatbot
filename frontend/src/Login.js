//File: frontend/src/Login.js

import React, { useState } from 'react';
import { loginUser } from './api';

/**
 * Login component.
 * Handles user login with error handling and comments.
 */
export default function Login({ onLogin }) {
  // State for username, password, and error message
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  /**
   * Handle form submission for login.
   * Calls backend API and handles errors.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await loginUser(username, password);
      if (res.error) {
        // Show backend error or generic message
        setError(res.error);
      } else {
        setError(null);
        onLogin(res.user_id); // Pass userId to parent on successful login
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <br />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <br />
      <button type="submit">Login</button>
      {/* Show error message if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}