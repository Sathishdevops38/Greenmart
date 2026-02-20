from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Product, Order, OrderItem
from app.schemas import OrderCreate, Order as OrderSchema, OrderWithItems

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderSchema)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    total = 0
    order_items = []

    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}. Available: {product.stock}",
            )
        item_total = product.price * item.quantity
        total += item_total
        order_items.append(
            OrderItem(
                product_id=product.id,
                quantity=item.quantity,
                price=product.price,
            )
        )

    order = Order(
        customer_name=order_data.customer_name,
        email=order_data.email,
        phone=order_data.phone,
        address=order_data.address,
        total=total,
        status="pending",
    )
    db.add(order)
    db.flush()

    for oi in order_items:
        oi.order_id = order.id
        db.add(oi)
        product = db.query(Product).get(oi.product_id)
        product.stock -= oi.quantity

    db.commit()
    db.refresh(order)
    return order


@router.get("/{order_id}", response_model=OrderWithItems)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
