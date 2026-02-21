"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import ImageWithFallback from "@/components/ImageWithFallback";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  const fallbackElement = (
    <div className="w-full h-full flex items-center justify-center text-2xl">
      🌱
    </div>
  );

  if (items.length === 0) {
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-800 mb-6">Shopping Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product_id}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-primary-200"
          >
            <div className="w-20 h-20 relative bg-primary-50 rounded-lg overflow-hidden flex-shrink-0">
              {item.image_url ? (
                <ImageWithFallback
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover"
                  fallbackElement={fallbackElement}
                />
              ) : (
                fallbackElement
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.product_id}`}
                className="font-medium text-primary-900 hover:text-primary-600"
              >
                {item.name}
              </Link>
              <p className="text-primary-600">${item.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.product_id, parseInt(e.target.value) || 1)
                }
                className="w-16 px-2 py-1 border border-primary-300 rounded text-center"
              />
              <button
                onClick={() => removeItem(item.product_id)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
            <p className="font-bold text-primary-800 w-24 text-right">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href="/" className="text-primary-600 hover:text-primary-700">
          ← Continue shopping
        </Link>
        <div className="flex items-center gap-6">
          <p className="text-xl font-bold text-primary-800">
            Subtotal: ${subtotal.toFixed(2)}
          </p>
          <Link
            href="/checkout"
            className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg font-medium"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
