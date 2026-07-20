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
      <p role="status" className="py-12 text-center text-[14px] text-gray-500">
        Favorileriniz yükleniyor...
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-[15px] text-gray-500 mb-4">
          Henüz favori ürününüz yok.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[14px] font-medium transition-colors"
        >
          Ürünleri Keşfet
        </Link>
      </div>
    );
  }

  return <ProductGrid products={items} />;
}
