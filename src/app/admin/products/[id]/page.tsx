import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductDetailManager from "@/components/admin/ProductDetailManager";

export const metadata: Metadata = { title: "Ürün Detayı" };

export default async function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-block mb-4 text-[13px] text-gray-500 hover:text-gold-dark transition-colors"
      >
        ← Ürünlere Dön
      </Link>
      <h1 className="font-serif text-2xl font-semibold text-gray-800 mb-6">
        Ürün Detayı
      </h1>
      <ProductDetailManager productId={productId} />
    </div>
  );
}
