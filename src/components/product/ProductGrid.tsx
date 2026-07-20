import ProductCard from "./ProductCard";
import type { ProductSummary } from "@/types";

export default function ProductGrid({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-[15px] text-gray-500">
        Henüz ürün bulunmuyor.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
