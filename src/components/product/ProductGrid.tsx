import ProductCard from "./ProductCard";
import type { ProductSummary } from "@/types";

export default function ProductGrid({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p aria-hidden="true" className="text-5xl mb-4">🏺</p>
        <p className="text-[15px] text-gray-500">Henüz ürün bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
