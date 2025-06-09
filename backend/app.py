#File: ecommerce-sales-chatbot/backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from models.database import init_db, db
from models.product_model import Product
from models.user_model import User
from werkzeug.security import generate_password_hash, check_password_hash
from models.chat_model import ChatMessage

app = Flask(__name__)
CORS(app)

# Initialize the database with the Flask app
init_db(app)

@app.route('/')
def index():
    """
    Health check endpoint to verify backend is running.
    """
    return jsonify({"msg": "Backend running ✅"})

@app.route('/products', methods=['GET'])
def get_products():
    """
    Get a list of products, optionally filtered by name, category, and price range.
    Query params: name, category, price_min, price_max
    """
    try:
        # Get filter parameters from query string, default to empty or broad values
        name = request.args.get('name', '').lower()
        category = request.args.get('category', '').lower()
        price_min = float(request.args.get('price_min', 0))
        price_max = float(request.args.get('price_max', 1e10))

        # Query products with filters
        query = Product.query.filter(
            Product.name.ilike(f'%{name}%'),
            Product.category.ilike(f'%{category}%'),
            Product.price.between(price_min, price_max)
        )
        products = query.all()
        # Return serialized product list
        return jsonify([p.to_dict() for p in products])
    except Exception as e:
        # Handle and report any errors
        return jsonify({"error": "Failed to fetch products", "details": str(e)}), 500

@app.route('/register', methods=['POST'])
def register():
    """
    Register a new user.
    Expects JSON: { "username": "...", "password": "..." }
    """
    try:
        data = request.get_json()
        # Validate input
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({"error": "Username and password required"}), 400

        username = data['username']
        password = data['password']

        # Check if username already exists
        if User.query.filter_by(username=username).first():
            return jsonify({"error": "Username already exists"}), 409

        # Hash password and create user
        hashed_pw = generate_password_hash(password)
        new_user = User(username=username, password=hashed_pw)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"user_id": new_user.id}), 201
    except Exception as e:
        # Handle and report any errors
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    """
    User login endpoint.
    Expects JSON: { "username": "...", "password": "..." }
    """
    try:
        data = request.get_json()
        # Validate input
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({"error": "Missing username or password"}), 400

        username = data['username']
        password = data['password']

        # Find user and check password
        user = User.query.filter_by(username=username).first()
        if not user or not check_password_hash(user.password, password):
            return jsonify({"error": "Invalid credentials"}), 401

        return jsonify({"message": "Login successful", "user_id": user.id})
    except Exception as e:
        # Handle and report any errors
        return jsonify({"error": "Login failed", "details": str(e)}), 500

@app.route('/chat', methods=['POST'])
def chat():
    """
    Chatbot endpoint: processes user messages and returns responses.
    Expects JSON: { "user_id": ..., "message": "...", "is_bot": false }
    Returns: { "chat_history": [...] }
    """
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        message = data.get('message', '').lower().strip()
        is_bot = data.get('is_bot', False)

        # Validate input
        if not user_id:
            return jsonify({"error": "user_id is required"}), 400

        response_msg = ""

        if message:
            import re

            # Handle: show me [category] under ₹[price]
            match = re.search(r"show me (\w+?)(?:s)? under ?₹?(\d+)", message)
            if match:
                category = match.group(1)
                max_price = float(match.group(2))
                products = Product.query.filter(
                    Product.category.ilike(f"%{category}%"),
                    Product.price <= max_price
                ).all()
                if products:
                    response_msg = f"{category.capitalize()}s under ₹{int(max_price)}:\n"
                    for p in products:
                        response_msg += f"- {p.name} (₹{int(p.price)})\n  {p.description}\n"
                else:
                    response_msg = f"Sorry, no {category}s under ₹{int(max_price)} found."

            # Handle: show me [category]
            elif "show me" in message:
                item = message.replace("show me", "").strip()
                # Normalize category names
                if item in ["phones", "phone", "mobiles", "mobile"]:
                    item = "mobile"
                elif item in ["laptops", "laptop"]:
                    item = "laptop"
                elif item in ["tvs", "tv"]:
                    item = "tv"
                products = Product.query.filter(
                    (Product.category.ilike(f'%{item}%')) | (Product.name.ilike(f'%{item}%'))
                ).all()
                if products:
                    response_msg = f"Here are the {item}s I found:\n"
                    for p in products:
                        response_msg += f"- {p.name} (₹{int(p.price)})\n  {p.description}\n"
                else:
                    response_msg = f"Sorry, no {item}s found."

            # Handle: price under
            elif "price under" in message or "products under" in message:
                max_price_match = re.search(r'under\s*₹?(\d+)', message)
                max_price = float(max_price_match.group(1)) if max_price_match else 1e10
                products = Product.query.filter(Product.price <= max_price).all()
                if products:
                    response_msg = f"Products under ₹{int(max_price)}:\n"
                    for p in products:
                        response_msg += f"- {p.name} (₹{int(p.price)})\n  {p.description}\n"
                else:
                    response_msg = f"Sorry, no products found under ₹{int(max_price)}."

            # Handle greetings and fallback
            else:
                if any(word in message for word in ["thank", "thanks", "thank you", "good" , "great" , "wow"]):
                    response_msg = "You're welcome! 😊"
                elif any(word in message for word in ["hello", "hi", "hey", "hii"]):
                    response_msg = "Hey! How can I help you today?"
                else:
                    response_msg = ("Sorry, I didn't understand that. "
                                    "Try something like 'show me phones' or 'products under 30000'.")

            # Save chat messages to database
            try:
                chat_msg_user = ChatMessage(user_id=user_id, message=message, is_bot=False)
                chat_msg_bot = ChatMessage(user_id=user_id, message=response_msg, is_bot=True)
                db.session.add(chat_msg_user)
                db.session.add(chat_msg_bot)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                return jsonify({"error": "Failed to save chat message", "details": str(e)}), 500

        # Return chat history sorted by timestamp
        chat_history = ChatMessage.query.filter_by(user_id=user_id).order_by(ChatMessage.timestamp).all()
        result = [
            {
                "id": msg.id,
                "user_id": msg.user_id,
                "message": msg.message,
                "timestamp": msg.timestamp.isoformat(),
                "is_bot": msg.is_bot
            }
            for msg in chat_history
        ]

        return jsonify({"chat_history": result})
    except Exception as e:
        # Handle and report any errors
        return jsonify({"error": "Chat processing failed", "details": str(e)}), 500

@app.route('/chat/reset', methods=['POST'])
def reset_chat():
    """
    Reset chat history for a user.
    Expects JSON: { "user_id": ... }
    """
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({"error": "user_id is required"}), 400

        # Delete all chat messages for the user
        ChatMessage.query.filter_by(user_id=user_id).delete()
        db.session.commit()
        return jsonify({"message": "Chat history reset."})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to reset chat", "details": str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app in debug mode
    app.run(debug=True)