# Project Report: E-Commerce Sales Chatbot

---

## Objective

Design and implement a sales chatbot that enhances the shopping experience by enabling efficient search, exploration, and (future: purchase) processes on an e-commerce platform.

---

## Features

- User registration and login with session management
- Product browsing and filtering (by name, category, price)
- Chatbot for product queries and recommendations
- Responsive UI for desktop and mobile
- Chat history storage and retrieval
- Conversation reset and session timestamping

---

## Architecture

```
[User Browser]
      |
   [React Frontend]
      |
   [Flask REST API]
      |
   [SQLite Database]
```

- **Frontend:** React SPA
- **Backend:** Flask REST API
- **Database:** SQLite (mock inventory, chat, and user data)

---

## Technology Stack

- **Backend:** Python, Flask, SQLAlchemy, SQLite
- **Frontend:** React, HTML5, CSS
- **Other:** Flask-CORS, Werkzeug (for password hashing)

---

## Mock Data Creation

The backend database is seeded with over 100 mock products across categories (Laptops, Mobiles, TVs) using the `seed_data.py` script. This ensures realistic product data for browsing and chatbot queries.

---

## API Endpoints

### POST /register
Register a new user.
- Request: `{ "username": "user", "password": "pass" }`
- Response: `{ "user_id": 1 }` or `{ "error": "Username already exists" }`

### POST /login
Login a user.
- Request: `{ "username": "user", "password": "pass" }`
- Response: `{ "user_id": 1 }` or `{ "error": "Invalid credentials" }`

### GET /products
Get products with optional filters.
- Query params: `name`, `category`, `price_min`, `price_max`
- Response: `[ { product }, ... ]`

### POST /chat
Send a message to the chatbot.
- Request: `{ "user_id": 1, "message": "show me laptops" }`
- Response: `{ "chat_history": [...] }`

### POST /chat/reset
Reset chat history for a user.
- Request: `{ "user_id": 1 }`
- Response: `{ "message": "Chat history reset." }`

---

## Frontend Components

- **App.js**: Main app, handles routing and authentication state.
- **Login.js**: Login form and logic.
- **Register.js**: Registration form and logic.
- **Products.js**: Product list, filter form, and error handling.
- **Chat.js**: Chat UI and logic.
- **api.js**: Handles all API requests to the backend.

---

## Design Patterns & Best Practices

- **Modular Codebase:** Separate files for models, API routes, and frontend components.
- **Error Handling:** All API endpoints and frontend actions include error handling and user feedback.
- **Security:** Passwords are hashed before storage; sensitive data is never exposed to the frontend.
- **Separation of Concerns:** Clear distinction between data models, business logic, and UI.

---

## Challenges & Solutions

- **Frontend-Backend Integration:** Used CORS and consistent API contracts to ensure smooth communication.
- **Database Seeding:** Automated with a script to ensure consistent mock data for testing and demo.
- **Session Management:** Used `localStorage` for persistent login state on the frontend.
- **Chat Logic:** Implemented simple keyword-based responses for demo; designed for easy extension to real NLP.

---

## Potential Improvements

- **Purchase/Checkout Flow:** Currently, the chatbot assists with product search and exploration. In a full implementation, users could add products to a cart and complete purchases.
- **Advanced AI/NLP:** The chatbot uses basic keyword matching. Future versions could integrate real NLP (e.g., OpenAI GPT, Rasa) for more natural conversations.
- **Order History & Analytics:** Add user order history and admin analytics dashboards.
- **Admin Panel:** For managing products and viewing chat analytics.
- **Better UI/UX:** More product details, images, and improved mobile experience.

---

## Learnings

- Full-stack web development with modern frameworks
- RESTful API design and integration
- Error handling and user feedback best practices
- Importance of modular, maintainable code
- Real-world challenges in session management and data seeding

---

## Sample Queries & Results

- **"Show me laptops under 45000"**  
  _Returns a filtered list of laptops matching the criteria._
- **"Thanks"**  
  _Chatbot responds with welcome greetings._
- **"Reset conversation"**  
  _Chat history is cleared for the user._

---

## Conclusion

This project demonstrates a robust foundation for an e-commerce chatbot platform, with clear separation of concerns, modular code, and a user-friendly interface. With further enhancements, it can be extended to support real purchases and advanced conversational AI.

---
