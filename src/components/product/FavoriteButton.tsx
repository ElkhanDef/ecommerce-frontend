"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ApiError } from "@/services/api";
import { getAccessToken } from "@/services/token-storage";
import { useFavoritesStore } from "@/stores/favorites";
import type { ProductSummary } from "@/types";

interface FavoriteButtonProps {
  product: ProductSummary;
  /** "overlay" floats over a product card image; "inline" is a labeled button. */
  variant?: "overlay" | "inline";
}

export default function FavoriteButton({
  product,
  variant = "overlay",
}: FavoriteButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const isFavorite = useFavoritesStore(
    (state) => state.items?.some((f) => f.id === product.id) ?? false,
  );

  // Hydrate favorite hearts for signed-in visitors (deduped in the store).
  useEffect(() => {
    void useFavoritesStore.getState().load();
  }, []);

  async function handleClick() {
    const loginUrl = `/giris?redirect=${encodeURIComponent(pathname)}`;
    if (!getAccessToken()) {
      router.push(loginUrl);
      return;
    }
    setPending(true);
    try {
      await useFavoritesStore.getState().toggle(product);
    } catch (err) {
      // The store already rolled the optimistic change back.
      if (err instanceof ApiError && err.status === 401) {
        router.push(loginUrl);
      }
    } finally {
      setPending(false);
    }
  }

  const label = isFavorite ? "Favorilerden çıkar" : "Favorilere ekle";

  const heart = (
    <svg
      width={variant === "inline" ? 20 : 18}
      height={variant === "inline" ? 20 : 18}
      viewBox="0 0 24 24"
      fill={isFavorite ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={isFavorite}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-[14px] font-medium transition-colors disabled:opacity-60 ${
          isFavorite
            ? "border-gold bg-gold/10 text-gold-dark"
            : "border-gray-300 text-gray-600 hover:border-gold hover:text-gold-dark"
        }`}
      >
        {heart}
        {isFavorite ? "Favorilerde" : "Favorilere Ekle"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={isFavorite}
      aria-label={label}
      title={label}
      className={`absolute top-2.5 right-2.5 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 border border-black/5 shadow-sm transition-colors disabled:opacity-60 ${
        isFavorite ? "text-gold-dark" : "text-gray-500 hover:text-gold-dark"
      }`}
    >
      {heart}
    </button>
  );
}
