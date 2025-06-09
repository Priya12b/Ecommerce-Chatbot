#File: ecommerce-sales-chatbot/backend/models/user_model.py

from models.database import db

class User(db.Model):
    """
    User model for storing user account details in the database.
    """
    id = db.Column(db.Integer, primary_key=True)  # Unique user ID
    username = db.Column(db.String(100), unique=True, nullable=False)  # Username (must be unique)
    password = db.Column(db.String(100), nullable=False)  # Hashed password

    def to_dict(self):
        """
        Serialize the user object to a dictionary.
        Returns user fields except password, or an error dict if serialization fails.
        """
        try:
            return {
                "id": self.id,
                "username": self.username
                # Do not include password for security reasons
            }
        except Exception as e:
            # Handle serialization errors
            return {"error": f"Failed to serialize User: {str(e)}"}