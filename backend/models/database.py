#File: ecommerce-sales-chatbot/backend/models/database.py

from flask_sqlalchemy import SQLAlchemy

# Initialize the SQLAlchemy object (used for ORM)
db = SQLAlchemy()

def init_db(app):
    """
    Initialize the database with the Flask app.
    Sets up the SQLite database URI and disables modification tracking for performance.
    Handles and reports any errors during initialization.
    """
    try:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventory.db'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        db.init_app(app)
    except Exception as e:
        # Handle and report any errors during DB initialization
        print(f"❌ Failed to initialize the database: {e}")