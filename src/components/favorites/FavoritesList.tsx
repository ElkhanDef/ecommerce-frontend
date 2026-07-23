"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductGrid from "@/components/product/ProductGrid";
import { getAccessToken } from "@/services/token-storage";
import { useFavoritesStore } from "@/stores/favorites";

const LOGIN_REDIRECT = "/giris?redirect=/favoriler";

export default function FavoritesList() {
  const router = useRouter();
  const items = useFavoritesStore((state) => state.items);
  const status = useFavoritesStore((state) => state.status);
  const error = useFavoritesStore((state) => state.error);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace(LOGIN_REDIRECT);
      return;
    }
    void useFavoritesStore
      .getState()
      .load()
      .then(() => {
        // Tokens are cleared when even the refresh flow fails mid-load.
        if (!getAccessToken()) {
          router.replace(LOGIN_REDIRECT);
        }
      });
  }, [router]);

  if (status === "error") {
    return (
      <p role="alert" className="py-12 text-center text-[14px] text-red-600">
        {error}
      </p>
    );
  }

  if (items === null) {
    return (
      <div role="status" className="py-16 flex flex-col items-center gap-3 text-[14px] text-gray-500">
        <span className="w-6 h-6 rounded-full border-2 border-gold-light border-t-gold-dark animate-spin" aria-hidden="true" />
        Favorileriniz yükleniyor...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p aria-hidden="true" className="text-5xl mb-4">♡</p>
        <p className="text-[15px] text-gray-500 mb-4">
          Henüz favori ürününüz yok.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[14px] font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
        >
          Ürünleri Keşfet
        </Link>
      </div>
    );
  }

  return <ProductGrid products={items} />;
}
