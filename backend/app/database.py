from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'greenmart.db')}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def _migrate_add_seller_id():
    """Add seller_id to products table if it doesn't exist."""
    with engine.connect() as conn:
        r = conn.execute(text("PRAGMA table_info(products)"))
        cols = [row[1] for row in r]
        if "seller_id" not in cols:
            conn.execute(text("ALTER TABLE products ADD COLUMN seller_id INTEGER REFERENCES users(id)"))
            conn.commit()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
    _migrate_add_seller_id()
