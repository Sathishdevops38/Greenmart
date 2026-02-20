"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { createOrder } from "@/lib/api";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    phone: "",
    address: "",
  });

  if (items.length === 0 && !orderId) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-primary-800 mb-4">Your cart is empty</h2>
        <Link
          href="/"
          className="inline-block bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg font-medium"
        >
          Browse products
        </Link>
      </div>
    );
  }

  if (orderId) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <h2 className="text-2xl font-bold text-primary-800 mb-4">Order placed!</h2>
        <p className="text-primary-700 mb-2">Order ID: #{orderId}</p>
        <p className="text-primary-600 mb-6">
          We will contact you shortly. Thank you for shopping at Greenmart.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg font-medium"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const order = await createOrder({
        customer_name: form.customer_name,
        email: form.email,
        phone: form.phone || undefined,
        address: form.address,
        items: items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          price: i.price,
        })),
      });
      clearCart();
      setOrderId(order.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to place order";
      setError(typeof msg === "string" ? msg : "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-800 mb-6">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-primary-700 font-medium mb-1">Name</label>
            <input
              type="text"
              required
              value={form.customer_name}
              onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))}
              className="w-full px-4 py-2 border border-primary-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-primary-700 font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-2 border border-primary-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-primary-700 font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full px-4 py-2 border border-primary-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-primary-700 font-medium mb-1">Address</label>
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="w-full px-4 py-2 border border-primary-300 rounded-lg"
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white py-3 rounded-lg font-medium"
          >
            {loading ? "Placing order…" : "Place order"}
          </button>
        </form>
        <div>
          <h3 className="font-bold text-primary-800 mb-4">Order summary</h3>
          <ul className="space-y-2">
            {items.map((i) => (
              <li key={i.product_id} className="flex justify-between text-primary-700">
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>${(i.price * i.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xl font-bold text-primary-800">
            Total: ${subtotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
