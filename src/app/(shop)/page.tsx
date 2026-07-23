import Hero from "@/components/home/Hero";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/ui/Pagination";
import { getProducts } from "@/services/products";
import type { Page, ProductSummary } from "@/types";

const PAGE_SIZE = 12;

export default async function HomePage({
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
    });
  } catch {
    // Backend unreachable — the section below renders a friendly error state.
  }

  return (
    <>
      <Hero />

      {/* scroll-mt offsets the sticky header when jumping to #urunler */}
      <section
        id="urunler"
        aria-labelledby="products-heading"
        className="scroll-mt-32"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-[3px] rounded-full bg-gradient-to-r from-gold-dark to-gold-light" aria-hidden="true" />
          <h2
            id="products-heading"
            className="font-serif text-[24px] font-semibold text-gray-800"
          >
            Ürünler
          </h2>
        </div>

        {productPage ? (
          <>
            <ProductGrid products={productPage.content} />
            <Pagination
              currentPage={currentPage}
              totalPages={productPage.page.totalPages}
            />
          </>
        ) : (
          <div className="py-16 text-center">
            <p aria-hidden="true" className="text-5xl mb-4">⚠️</p>
            <p className="text-[15px] text-gray-500">
              Ürünler şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
