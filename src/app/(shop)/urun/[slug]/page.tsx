import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/product/AddToCartButton";
import FavoriteButton from "@/components/product/FavoriteButton";
import ProductGallery from "@/components/product/ProductGallery";
import { formatPrice } from "@/lib/format";
import { ApiError } from "@/services/api";
import { getProductBySlug } from "@/services/products";
import type { ProductDetail, ProductSummary } from "@/types";

type ProductResult =
  | { kind: "ok"; product: ProductDetail }
  | { kind: "not-found" }
  | { kind: "error" };

// cache() deduplicates the fetch between generateMetadata and the page render.
const loadProduct = cache(async (slug: string): Promise<ProductResult> => {
  try {
    return { kind: "ok", product: await getProductBySlug(slug) };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return { kind: "not-found" };
    }
    return { kind: "error" };
  }
});

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await loadProduct(slug);
  if (result.kind !== "ok") {
    return { title: "Ürün Bulunamadı" };
  }
  const { product } = result;
  return {
    title: product.name,
    description:
      product.description.length > 160
        ? `${product.description.slice(0, 157)}...`
        : product.description,
  };
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-red-50 text-red-600">
        Tükendi
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span className="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-gold/15 text-gold-dark">
        Son {stock} ürün
      </span>
    );
  }
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-green-50 text-green-700">
      Stokta var
    </span>
  );
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const result = await loadProduct(slug);

  if (result.kind === "not-found") {
    notFound();
  }

  if (result.kind === "error") {
    return (
      <p className="py-16 text-center text-[15px] text-gray-500">
        Ürün şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.
      </p>
    );
  }

  const { product } = result;
  const mainImage =
    product.imagesResponse.find((image) => image.main) ??
    product.imagesResponse[0];

  // Card-level shape the favorites store works with.
  const summary: ProductSummary = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    mainImageUrl: mainImage?.url ?? null,
  };

  return (
    <article className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <ProductGallery
        images={product.imagesResponse}
        productName={product.name}
      />

      <div>
        <p className="text-[13px] font-medium uppercase tracking-wider text-gold-dark mb-2">
          {product.categoryResponse.name}
        </p>
        <h1 className="font-serif text-[28px] md:text-[34px] font-semibold text-gray-800 leading-tight mb-3">
          {product.name}
        </h1>

        <div className="flex items-center gap-3 mb-6">
          <p className="text-[26px] font-semibold text-gold-dark tabular-nums">
            {formatPrice(product.price)}
          </p>
          <StockBadge stock={product.stock} />
        </div>

        <p className="text-[15px] text-gray-600 leading-[1.7] whitespace-pre-line mb-8">
          {product.description}
        </p>

        <div className="flex flex-wrap items-start gap-3">
          <AddToCartButton productId={product.id} stock={product.stock} />
          <FavoriteButton product={summary} variant="inline" />
        </div>

        <p className="mt-8 text-[13px] text-gray-400">
          Ürün kodu: <span className="tabular-nums">{product.sku}</span>
        </p>
      </div>
    </article>
  );
}
