"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Order {
  id: number;
  customer_name: string;
  email: string;
  total: number;
  status: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/admin/products`).then((r) => r.json()),
      fetch(`${API}/admin/orders`).then((r) => r.json()),
    ])
      .then(([p, o]) => {
        setProducts(p);
        setOrders(o);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-primary-600">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-800 mb-6">Admin</h1>
      <Link href="/" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
        ← Back to store
      </Link>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-primary-800 mb-4">Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-primary-200 rounded-lg overflow-hidden">
            <thead className="bg-primary-100">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-primary-200 bg-white">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">${p.price.toFixed(2)}</td>
                  <td className="p-3">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-primary-800 mb-4">Recent orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-primary-200 rounded-lg overflow-hidden">
            <thead className="bg-primary-100">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-primary-200 bg-white">
                  <td className="p-3">{o.id}</td>
                  <td className="p-3">{o.customer_name}</td>
                  <td className="p-3">{o.email}</td>
                  <td className="p-3">${o.total.toFixed(2)}</td>
                  <td className="p-3">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <p className="text-primary-600 py-4">No orders yet.</p>
        )}
      </section>
    </div>
  );
}
