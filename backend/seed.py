import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal, init_db
from app.models import Base, Category, Product

def seed():
    init_db()
    db = SessionLocal()

    if db.query(Category).first():
        # Fix broken image URLs in existing DB (Unsplash 404 or unreliable)
        FIXED_IMAGE = "https://picsum.photos/seed/greenmart/400/400"
        broken_url_patterns = [
            "photo-1593691509543-c55fb32d8de9",  # 404
        ]
        for p in db.query(Product).all():
            url = p.image_url or ""
            is_broken = any(pat in url for pat in broken_url_patterns)
            if is_broken or (p.name == "rose plant" and "unsplash" in url):
                p.image_url = FIXED_IMAGE
        db.commit()
        print("Database already seeded. Fixed broken image URLs.")
        db.close()
        return

    categories = [
        Category(name="Plants", slug="plants"),
        Category(name="Flowers", slug="flowers"),
        Category(name="Seeds", slug="seeds"),
    ]
    for c in categories:
        db.add(c)
    db.flush()

    products = [
        Product(
            name="Monstera Deliciosa",
            description="A tropical plant with distinctive split leaves. Perfect for indoor spaces.",
            price=29.99,
            image_url="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400",
            category_id=categories[0].id,
            stock=15,
        ),
        Product(
            name="Snake Plant",
            description="Low maintenance, air-purifying succulent. Thrives in low light.",
            price=24.99,
            image_url="https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400",
            category_id=categories[0].id,
            stock=20,
        ),
        Product(
            name="rose plant",
            description="Beautiful rose plant with fragrant blooms. Perfect for gardens and gifting.",
            price=34.99,
            image_url="https://picsum.photos/seed/roseplant/400/400",
            category_id=categories[0].id,
            stock=12,
        ),
        Product(
            name="Red Roses Bouquet",
            description="A dozen fresh red roses. Perfect for any occasion.",
            price=49.99,
            image_url="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400",
            category_id=categories[1].id,
            stock=25,
        ),
        Product(
            name="Sunflower Bouquet",
            description="Bright and cheerful sunflowers to brighten your day.",
            price=39.99,
            image_url="https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&q=80",
            category_id=categories[1].id,
            stock=18,
        ),
        Product(
            name="Mixed Wildflowers",
            description="A colorful mix of seasonal wildflowers.",
            price=35.99,
            image_url="https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400",
            category_id=categories[1].id,
            stock=14,
        ),
        Product(
            name="Tomato Seeds Pack",
            description="Organic heirloom tomato seeds. Pack of 50.",
            price=5.99,
            image_url="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400",
            category_id=categories[2].id,
            stock=100,
        ),
        Product(
            name="Basil Herb Seeds",
            description="Fresh basil seeds for kitchen gardens. Pack of 100.",
            price=4.99,
            image_url="https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400",
            category_id=categories[2].id,
            stock=80,
        ),
    ]
    for p in products:
        db.add(p)

    db.commit()
    db.close()
    print("Seed completed. Products and categories added.")

if __name__ == "__main__":
    seed()
