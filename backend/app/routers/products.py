from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import Product, Category
from app.schemas import Product as ProductSchema

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=List[ProductSchema])
def get_products(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Product)
    if category:
        q = q.join(Category, Product.category_id == Category.id).filter(Category.slug == category)
    return q.all()


@router.get("/{product_id}", response_model=ProductSchema)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    return product
