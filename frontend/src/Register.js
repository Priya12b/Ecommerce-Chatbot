//File: frontend/src/Register.js

import React, { useState } from 'react';
import { registerUser } from './api';

/**
 * Register component.
 * Handles user registration with error handling and comments.
 */
export default function Register({ onRegister }) {
  // State for username, password, and error message
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  /**
   * Handle form submission for registration.
   * Calls backend API and handles errors.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await registerUser(username, password);
      if (res.user_id) {
        // Registration successful: store userId and switch to products page
        localStorage.setItem('userId', res.user_id);
        onRegister(res.user_id);
      } else {
        // Show backend error or generic message
        setError(res.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {/* Show error message if any */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <br />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <br />
      <button type="submit">Register</button>
    </form>
  );
}