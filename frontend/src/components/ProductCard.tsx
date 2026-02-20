"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/api";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-primary-200 hover:border-primary-500 hover:shadow-lg transition">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative bg-primary-50">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary-400 text-4xl">
              🌱
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-primary-900 hover:text-primary-600 transition">
            {product.name}
          </h3>
        </Link>
        <p className="text-primary-600 font-bold mt-1">${product.price.toFixed(2)}</p>
        <button
          onClick={() =>
            addItem(
              product.id,
              product.name,
              product.price,
              product.image_url
            )
          }
          className="mt-3 w-full bg-primary-600 hover:bg-primary-500 text-white py-2 rounded-lg font-medium transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
