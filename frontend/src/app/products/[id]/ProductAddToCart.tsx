"use client";

import { useCart } from "@/components/CartProvider";
import { useState } from "react";
import type { Product } from "@/lib/api";

export default function ProductAddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product.id, product.name, product.price, product.image_url, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="number"
        min={1}
        max={product.stock}
        value={qty}
        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-20 px-3 py-2 border border-primary-300 rounded-lg"
      />
      <button
        onClick={handleAdd}
        className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg font-medium transition"
      >
        {added ? "Added!" : "Add to Cart"}
      </button>
    </div>
  );
}
