from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Product, User
from app.schemas import Product as ProductSchema, ProductCreate, ProductUpdate
from app.auth import require_seller

router = APIRouter(prefix="/seller", tags=["seller"])


@router.get("/products", response_model=List[ProductSchema])
def list_my_products(
    db: Session = Depends(get_db),
    user: User = Depends(require_seller),
):
    return db.query(Product).filter(Product.seller_id == user.id).all()


@router.post("/products", response_model=ProductSchema)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_seller),
):
    p = Product(**product.model_dump(), seller_id=user.id)
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


@router.put("/products/{product_id}", response_model=ProductSchema)
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_seller),
):
    p = db.query(Product).filter(
        Product.id == product_id,
        Product.seller_id == user.id,
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    data = product.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(p, k, v)
    db.commit()
    db.refresh(p)
    return p


@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_seller),
):
    p = db.query(Product).filter(
        Product.id == product_id,
        Product.seller_id == user.id,
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(p)
    db.commit()
    return {"ok": True}
