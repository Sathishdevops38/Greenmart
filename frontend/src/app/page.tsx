import Link from "next/link";
import { getProducts, getCategories } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const [products, categories] = await Promise.all([
    getProducts(category),
    getCategories(),
  ]);

  return (
    <div>
      <section className="text-center py-12 mb-12 bg-gradient-to-b from-primary-100 to-primary-50 rounded-2xl border border-primary-200">
        <h1 className="text-4xl font-bold text-primary-800 mb-2">Welcome to Greenmart</h1>
        <p className="text-primary-700 text-lg">Plants and flowers for every home</p>
      </section>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/"
          className={`px-4 py-2 rounded-lg font-medium transition ${
            !category
              ? "bg-primary-600 text-white"
              : "bg-primary-100 text-primary-800 hover:bg-primary-200"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={category === c.slug ? "/" : `/?category=${c.slug}`}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              category === c.slug
                ? "bg-primary-600 text-white"
                : "bg-primary-100 text-primary-800 hover:bg-primary-200"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-center text-primary-600 py-12">No products found.</p>
      )}
    </div>
  );
}
