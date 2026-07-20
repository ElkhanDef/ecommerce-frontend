import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/ui/Pagination";
import { ApiError } from "@/services/api";
import { getCategoryBySlug } from "@/services/categories";
import { getProducts } from "@/services/products";
import type { Category, Page, ProductSummary } from "@/types";

const PAGE_SIZE = 12;

// cache() deduplicates the lookup between generateMetadata and the page render.
const loadCategory = cache(
  async (slug: string): Promise<Category | "not-found" | "error"> => {
    try {
      return await getCategoryBySlug(slug);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        return "not-found";
      }
      return "error";
    }
  },
);

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sayfa?: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await loadCategory(slug);
  if (typeof category === "string") {
    return { title: "Kategori Bulunamadı" };
  }
  return {
    title: category.name,
    description: `${category.name} kategorisindeki el yapımı ürünleri keşfedin.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ slug }, { sayfa }] = await Promise.all([params, searchParams]);
  const category = await loadCategory(slug);

  if (category === "not-found") {
    notFound();
  }

  if (category === "error") {
    return (
      <p className="py-16 text-center text-[15px] text-gray-500">
        Kategori şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.
      </p>
    );
  }

  const currentPage = Math.max(1, Number(sayfa) || 1);

  let productPage: Page<ProductSummary> | null = null;
  try {
    productPage = await getProducts({
      pageNumber: currentPage - 1,
      pageSize: PAGE_SIZE,
      categorySlug: slug,
    });
  } catch {
    // Backend unreachable — the section below renders a friendly error state.
  }

  return (
    <section aria-labelledby="category-heading">
      <h1
        id="category-heading"
        className="font-serif text-[24px] font-semibold text-gray-800 mb-6"
      >
        {category.name}
      </h1>

      {productPage ? (
        <>
          <ProductGrid products={productPage.content} />
          <Pagination
            currentPage={currentPage}
            totalPages={productPage.page.totalPages}
            basePath={`/kategori/${slug}`}
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
