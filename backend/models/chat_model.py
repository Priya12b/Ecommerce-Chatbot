#File: ecommerce-sales-chatbot/backend/models/chat_model.py

from models.database import db
from datetime import datetime

class ChatMessage(db.Model):
    """
    ChatMessage model for storing individual chat messages between user and bot.
    """
    id = db.Column(db.Integer, primary_key=True)  # Unique message ID
    user_id = db.Column(db.Integer, nullable=False)  # ID of the user who sent/received the message
    message = db.Column(db.Text, nullable=False)  # The message content
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)  # Time the message was created
    is_bot = db.Column(db.Boolean, default=False)  # True if message is from bot, False if from user

    def to_dict(self):
        """
        Serialize the chat message object to a dictionary.
        """
        try:
            return {
                "id": self.id,
                "user_id": self.user_id,
                "message": self.message,
                "timestamp": self.timestamp.isoformat() if self.timestamp else None,
                "is_bot": self.is_bot
            }
        except Exception as e:
            # Handle serialization errors
            return {"error": f"Failed to serialize ChatMessage: {str(e)}"}