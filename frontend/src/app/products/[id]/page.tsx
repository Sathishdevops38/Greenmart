import Link from "next/link";
import { getProduct } from "@/lib/api";
import { notFound } from "next/navigation";
import ProductAddToCart from "./ProductAddToCart";
import ProductImage from "./ProductImage";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) notFound();

  let product;
  try {
    product = await getProduct(productId);
  } catch {
    notFound();
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/2 aspect-square relative bg-primary-50 rounded-xl overflow-hidden border border-primary-200">
        <ProductImage imageUrl={product.image_url} name={product.name} />
      </div>
      <div className="flex-1">
        <Link href="/" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← Back to products
        </Link>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">{product.name}</h1>
        <p className="text-2xl font-bold text-primary-600 mb-4">
          ${product.price.toFixed(2)}
        </p>
        {product.description && (
          <p className="text-primary-700 mb-6">{product.description}</p>
        )}
        <p className="text-sm text-primary-600 mb-6">
          In stock: {product.stock}
        </p>
        <ProductAddToCart product={product} />
      </div>
    </div>
  );
}
