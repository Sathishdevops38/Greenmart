from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class CategoryBase(BaseModel):
    name: str
    slug: str


class CategoryCreate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    category_id: Optional[int] = None
    stock: int = 0


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    category_id: Optional[int] = None
    stock: Optional[int] = None


class Product(ProductBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProductWithCategory(Product):
    category: Optional[Category] = None


class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float


class OrderItemCreate(OrderItemBase):
    pass


class OrderItem(OrderItemBase):
    id: int
    order_id: int

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    customer_name: str
    email: str
    phone: Optional[str] = None
    address: str
    items: List[OrderItemCreate]


class Order(BaseModel):
    id: int
    customer_name: str
    email: str
    phone: Optional[str] = None
    address: str
    total: float
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class OrderWithItems(Order):
    items: List[OrderItem] = []
