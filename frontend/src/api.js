//File : frontend/src/api.js

const BASE_URL = 'http://localhost:5000'; // Backend API base URL

/**
 * Register a new user.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} API response JSON
 */
export async function registerUser(username, password) {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return await res.json();
  } catch (error) {
    // Handle network or unexpected errors
    return { error: 'Registration failed. Please try again.' };
  }
}

/**
 * Login a user.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} API response JSON
 */
export async function loginUser(username, password) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return await res.json();
  } catch (error) {
    return { error: 'Login failed. Please try again.' };
  }
}

/**
 * Fetch products with optional filters.
 * @param {object} filters - e.g. { name, category, price_min, price_max }
 * @returns {Promise<object[]>} Array of products or error object
 */
export async function fetchProducts(filters = {}) {
  try {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${BASE_URL}/products?${query}`);
    return await res.json();
  } catch (error) {
    return { error: 'Failed to fetch products.' };
  }
}

/**
 * Send a message to the chatbot.
 * @param {number} userId
 * @param {string} message
 * @param {boolean} isBot
 * @returns {Promise<object>} API response JSON
 */
export async function sendMessage(userId, message, isBot = false) {
  try {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, message, is_bot: isBot }),
    });
    return await res.json();
  } catch (error) {
    return { error: 'Failed to send message.' };
  }
}

/**
 * Reset chat history for a user.
 * @param {number} userId
 * @returns {Promise<object>} API response JSON
 */
export async function resetChat(userId) {
  try {
    const res = await fetch(`${BASE_URL}/chat/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });
    return await res.json();
  } catch (error) {
    return { error: 'Failed to reset chat.' };
  }
}