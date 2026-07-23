import type { Metadata } from "next";
import ProductManager from "@/components/admin/ProductManager";

export const metadata: Metadata = { title: "Ürünler" };

export default function AdminProductsPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-gray-800 mb-6">
        Ürünler
      </h1>
      <ProductManager />
    </div>
  );
}
