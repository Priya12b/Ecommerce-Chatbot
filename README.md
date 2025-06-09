# E-Commerce Sales Chatbot

A full-stack web application that simulates an e-commerce platform with a conversational sales chatbot. Users can register, log in, browse and filter products, and interact with an AI assistant for product queries.

---

## Project Overview

This project demonstrates a modern e-commerce experience powered by a chatbot interface. Users can:
- Register and log in securely
- Browse and filter a catalog of electronics products
- Chat with a salesbot to get product recommendations and information

The backend is built with Flask and SQLAlchemy, while the frontend uses React for a responsive, mobile-friendly UI.

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

- **Frontend:** React SPA (Single Page Application)
- **Backend:** Flask REST API
- **Database:** SQLite (mock inventory, chat, and user data)

---

## Technology Choices

- **Flask:** Lightweight, easy to set up REST API, great for rapid prototyping.
- **SQLAlchemy:** ORM for clean, modular database access.
- **React:** Component-based UI, excellent for responsive and interactive apps.
- **SQLite:** Simple file-based DB, perfect for mock/demo projects.

---

## Setup Instructions

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `python seed_data.py`  &nbsp;_# Seeds the database with mock products_
4. `python app.py`  &nbsp;_# Starts the Flask server on http://localhost:5000_

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`  &nbsp;_# Starts React app on http://localhost:3000_

---

## Usage

- Register or log in as a user.
- Browse and filter products by name, category, or price.
- Chat with the AI assistant for product help or recommendations.
- Reset the chat session at any time.

---

## API Endpoints

- `POST /register` - Register user
- `POST /login` - Login user
- `GET /products` - List/filter products
- `POST /chat` - Chat with bot
- `POST /chat/reset` - Reset chat

See [REPORT.md](./REPORT.md) for detailed API documentation.

---

## Screenshots

 ![Product List Screenshot](public/Products.png)
 ![Chatbot Screenshot](public/Chat.png)
 ![Chat History Screenshot](public/Chats.png)

---

## Troubleshooting / FAQ

- **CORS errors:** Ensure both frontend (`npm start`) and backend (`python app.py`) are running on their default ports.
- **Port conflicts:** If port 3000 (frontend) or 5000 (backend) is in use, stop other apps or change the port.
- **Database not seeded:** Run `python seed_data.py` before starting the backend.
- **API not reachable:** Check that Flask is running and accessible at `http://localhost:5000`.

---

## License

MIT License

---

## Authors

- Priyanka

---
