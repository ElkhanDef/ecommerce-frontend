import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductSummary } from "@/types";
import FavoriteButton from "./FavoriteButton";
import QuickAddToCartButton from "./QuickAddToCartButton";

export default function ProductCard({ product }: { product: ProductSummary }) {
  const card = (
    <article className="group bg-white border border-[#e0e0e0] rounded-[16px] overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-square bg-surface">
        {product.mainImageUrl ? (
          <Image
            src={product.mainImageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold-light/30 to-gold/20 text-4xl"
          >
            🏺
          </div>
        )}
      </div>
      <div className="p-4 pr-11">
        <h3 className="text-[14px] font-medium text-gray-800 truncate" title={product.name}>
          {product.name}
        </h3>
        <p className="mt-1.5 text-[18px] font-semibold text-gold-dark tabular-nums">
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  );

  return (
    // FavoriteButton/QuickAddToCartButton are siblings of the link (a button
    // inside an anchor is invalid HTML) and overlay the card via this wrapper.
    <div className="relative">
      {product.slug ? (
        <Link
          href={`/urun/${product.slug}`}
          className="block rounded-[16px] focus-visible:outline-2 focus-visible:outline-gold"
        >
          {card}
        </Link>
      ) : (
        // Legacy products without a slug have no detail URL to link to.
        card
      )}
      <FavoriteButton product={product} />
      <QuickAddToCartButton productId={product.id} productName={product.name} />
    </div>
  );
}
