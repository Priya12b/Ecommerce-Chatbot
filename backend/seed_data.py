#File: ecommerce-sales-chatbot/backend/seed_data.py

from models.database import db
from models.product_model import Product
from app import app

# This script seeds the database with mock product data for testing/demo purposes.

try:
    with app.app_context():
        # Drop all existing tables and recreate them for a clean slate
        db.drop_all()
        db.create_all()

        # Generate mock products for Laptops, Mobiles, and TVs
        mock_products = [
            Product(
                name=f"Lenovo Laptop {i}",
                category="Laptop",
                price=40000 + i*100,
                description=f"15.6 inch, {4+i%8}GB RAM",
                image_url="https://via.placeholder.com/150"
            )
            for i in range(1, 34)
        ] + [
            Product(
                name=f"iPhone {12+i}",
                category="Mobile",
                price=60000 + i*200,
                description=f"{64+i*16}GB, A1{i} chip",
                image_url="https://via.placeholder.com/150"
            )
            for i in range(1, 34)
        ] + [
            Product(
                name=f"Samsung LED TV {i}",
                category="TV",
                price=30000 + i*150,
                description=f"{32+i} inch 4K",
                image_url="https://via.placeholder.com/150"
            )
            for i in range(1, 34)
        ]

        # Add all mock products to the session and commit to the database
        db.session.add_all(mock_products)
        db.session.commit()

        print("✅ Database seeded with 100+ mock products.")
except Exception as e:
    # Handle and report any errors during seeding
    db.session.rollback()
    print(f"❌ Failed to seed database: {e}")