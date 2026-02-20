const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: number | null;
  stock: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
}

export interface OrderCreate {
  customer_name: string;
  email: string;
  phone?: string;
  address: string;
  items: CartItem[];
}

export interface Order {
  id: number;
  customer_name: string;
  email: string;
  total: number;
  status: string;
}

export async function getProducts(category?: string): Promise<Product[]> {
  const url = category
    ? `${API_URL}/products?category=${encodeURIComponent(category)}`
    : `${API_URL}/products`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProduct(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function createOrder(order: OrderCreate): Promise<Order> {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const detail = err?.detail;
    const msg = Array.isArray(detail)
      ? detail[0]?.msg ?? "Failed to create order"
      : typeof detail === "string"
        ? detail
        : "Failed to create order";
    throw new Error(msg);
  }
  return res.json();
}
