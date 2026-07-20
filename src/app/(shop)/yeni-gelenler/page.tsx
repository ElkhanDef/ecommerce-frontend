import type { Metadata } from "next";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/ui/Pagination";
import { getProducts } from "@/services/products";
import type { Page, ProductSummary } from "@/types";

export const metadata: Metadata = {
  title: "Yeni Gelenler",
  description:
    "Mağazamıza yeni eklenen el yapımı porselen, cam ürünler ve hediyelikleri keşfedin.",
};

const PAGE_SIZE = 12;

export default async function NewArrivalsPage({
  searchParams,
}: {
  searchParams: Promise<{ sayfa?: string }>;
}) {
  const { sayfa } = await searchParams;
  const currentPage = Math.max(1, Number(sayfa) || 1);

  let productPage: Page<ProductSummary> | null = null;
  try {
    productPage = await getProducts({
      pageNumber: currentPage - 1,
      pageSize: PAGE_SIZE,
      column: "createdAt",
      asc: false,
    });
  } catch {
    // Backend unreachable — the section below renders a friendly error state.
  }

  return (
    <section aria-labelledby="new-arrivals-heading">
      <h1
        id="new-arrivals-heading"
        className="font-serif text-[24px] font-semibold text-gray-800 mb-2"
      >
        Yeni Gelenler
      </h1>
      <p className="text-[15px] text-gray-500 mb-6">
        Mağazamıza en son eklenen ürünler.
      </p>

      {productPage ? (
        <>
          <ProductGrid products={productPage.content} />
          <Pagination
            currentPage={currentPage}
            totalPages={productPage.page.totalPages}
            basePath="/yeni-gelenler"
          />
        </>
      ) : (
        <p className="py-16 text-center text-[15px] text-gray-500">
          Ürünler şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.
        </p>
      )}
    </section>
  );
}
