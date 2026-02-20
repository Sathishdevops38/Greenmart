"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: number | null;
  stock: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function SellerPage() {
  const { user, fetchWithAuth, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
    stock: "0",
  });
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.role !== "seller") return;
    Promise.all([
      fetchWithAuth(`${API_URL}/seller/products`).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API_URL}/categories`).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, fetchWithAuth]);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      image_url: "",
      category_id: "",
      stock: "0",
    });
    setEditingId(null);
    setShowForm(false);
    setSubmitError("");
  };

  const editProduct = (p: Product) => {
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: String(p.price),
      image_url: p.image_url ?? "",
      category_id: p.category_id ? String(p.category_id) : "",
      stock: String(p.stock),
    });
    setEditingId(p.id);
    setShowForm(true);
    setSubmitError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const body = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price) || 0,
      image_url: form.image_url || null,
      category_id: form.category_id ? parseInt(form.category_id, 10) : null,
      stock: parseInt(form.stock, 10) || 0,
    };

    try {
      if (editingId) {
        const res = await fetchWithAuth(`${API_URL}/seller/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Failed to update");
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const res = await fetchWithAuth(`${API_URL}/seller/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Failed to create");
        const created = await res.json();
        setProducts((prev) => [...prev, created]);
      }
      resetForm();
    } catch {
      setSubmitError("Failed to save product");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetchWithAuth(`${API_URL}/seller/products/${id}`, { method: "DELETE" });
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  if (authLoading) return null;
  if (!user) return null;
  if (user.role !== "seller") {
    return (
      <div className="max-w-md">
        <h1 className="text-2xl font-bold text-primary-800 mb-4">Seller Dashboard</h1>
        <p className="text-primary-700 mb-4">
          You&apos;re logged in as a buyer. To list plants, flowers, or seeds for sale, create a new account with the seller role.
        </p>
        <Link
          href="/signup"
          className="text-primary-600 font-medium hover:underline"
        >
          Sign up as seller →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-800 mb-6">My products</h1>
      <Link href="/" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
        ← Back to store
      </Link>

      <div className="mb-6">
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? "Cancel" : "+ Add product"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 border border-primary-200 rounded-lg bg-white space-y-4"
        >
          <h2 className="text-lg font-semibold text-primary-800">
            {editingId ? "Edit product" : "Add new product"}
          </h2>
          <div>
            <label className="block text-sm font-medium text-primary-800 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              className="w-full px-4 py-2 border border-primary-300 rounded-lg"
              placeholder="e.g. Rose plant, Tomato seeds"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-800 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-primary-300 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-800 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                required
                className="w-full px-4 py-2 border border-primary-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-800 mb-1">Stock</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                className="w-full px-4 py-2 border border-primary-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-800 mb-1">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
              className="w-full px-4 py-2 border border-primary-300 rounded-lg"
            >
              <option value="">— Select —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-800 mb-1">Image URL</label>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-primary-300 rounded-lg"
            />
            {form.image_url && (
              <img
                src={form.image_url}
                alt="Preview"
                className="mt-2 h-24 w-24 object-cover rounded border"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
          </div>
          {submitError && <p className="text-red-600 text-sm">{submitError}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg"
            >
              {editingId ? "Update" : "Add product"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-primary-300 rounded-lg hover:bg-primary-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-primary-600">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-primary-600 py-4">
          You haven&apos;t added any products yet. Click &quot;Add product&quot; to list plants, flowers, or seeds for sale.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-primary-200 rounded-lg overflow-hidden">
            <thead className="bg-primary-100">
              <tr>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-primary-200 bg-white">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {p.image_url && (
                        <img
                          src={p.image_url}
                          alt=""
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium">{p.name}</div>
                        {p.description && (
                          <div className="text-sm text-primary-600 truncate max-w-xs">
                            {p.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">${p.price.toFixed(2)}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">
                    <button
                      onClick={() => editProduct(p)}
                      className="text-primary-600 hover:text-primary-700 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
