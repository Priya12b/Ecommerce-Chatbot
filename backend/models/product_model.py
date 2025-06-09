#File: ecommerce-sales-chatbot/backend/models/product_model.py

from models.database import db

class Product(db.Model):
    """
    Product model for storing product details in the database.
    """
    id = db.Column(db.Integer, primary_key=True)  # Unique product ID
    name = db.Column(db.String(120))               # Product name
    category = db.Column(db.String(80))            # Product category (e.g., Laptop, Mobile)
    price = db.Column(db.Float)                    # Product price
    description = db.Column(db.String(500))        # Product description
    image_url = db.Column(db.String(200))          # Optional image URL

    def to_dict(self):
        """
        Serialize the product object to a dictionary.
        Returns all product fields as a dict, or an error dict if serialization fails.
        """
        try:
            return {
                "id": self.id,
                "name": self.name,
                "category": self.category,
                "price": self.price,
                "description": self.description,
                "image_url": self.image_url
            }
        except Exception as e:
            # Handle serialization errors
            return {"error": f"Failed to serialize Product: {str(e)}"}