"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CartItemRow from "./CartItemRow";
import { formatPrice } from "@/lib/format";
import { ApiError } from "@/services/api";
import { getAccessToken } from "@/services/token-storage";
import { useCartStore } from "@/stores/cart";

const LOGIN_REDIRECT = "/giris?redirect=/sepet";

export default function CartView() {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const status = useCartStore((state) => state.status);
  const error = useCartStore((state) => state.error);
  const [clearing, setClearing] = useState(false);
  const [clearError, setClearError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace(LOGIN_REDIRECT);
      return;
    }
    void useCartStore
      .getState()
      .load()
      .then(() => {
        // Tokens are cleared when even the refresh flow fails mid-load.
        if (!getAccessToken()) {
          router.replace(LOGIN_REDIRECT);
        }
      });
  }, [router]);

  async function handleClear() {
    if (!window.confirm("Sepetteki tüm ürünler silinecek. Emin misiniz?")) {
      return;
    }
    setClearing(true);
    setClearError(null);
    try {
      await useCartStore.getState().clear();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace(LOGIN_REDIRECT);
        return;
      }
      setClearError(
        err instanceof ApiError
          ? err.message
          : "Sepet temizlenemedi. Lütfen tekrar deneyin.",
      );
    } finally {
      setClearing(false);
    }
  }

  if (status === "error") {
    return (
      <p role="alert" className="py-12 text-center text-[14px] text-red-600">
        {error}
      </p>
    );
  }

  if (cart === null) {
    return (
      <p role="status" className="py-12 text-center text-[14px] text-gray-500">
        Sepetiniz yükleniyor...
      </p>
    );
  }

  if (cart.cartItems.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-[15px] text-gray-500 mb-4">Sepetiniz boş.</p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[14px] font-medium transition-colors"
        >
          Ürünleri Keşfet
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
      <ul className="bg-white border border-[#e0e0e0] rounded-[16px] px-5">
        {cart.cartItems.map((item) => (
          <CartItemRow key={item.productId} item={item} />
        ))}
      </ul>

      <aside
        aria-label="Sipariş özeti"
        className="bg-white border border-[#e0e0e0] rounded-[16px] p-5 lg:sticky lg:top-32"
      >
        <h2 className="font-serif text-[18px] font-semibold text-gray-800 mb-4">
          Sipariş Özeti
        </h2>
        <dl className="space-y-2 text-[14px]">
          <div className="flex justify-between text-gray-600">
            <dt>Ürün adedi</dt>
            <dd className="tabular-nums">{cart.totalQuantity}</dd>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#e0e0e0] text-[16px] font-semibold text-gray-800">
            <dt>Toplam</dt>
            <dd className="text-gold-dark tabular-nums">
              {formatPrice(cart.totalPrice)}
            </dd>
          </div>
        </dl>

        {/* Checkout lands here once the backend exposes an order endpoint. */}

        <button
          type="button"
          onClick={handleClear}
          disabled={clearing}
          className="mt-5 w-full px-5 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-[14px] font-medium transition-colors disabled:opacity-60"
        >
          {clearing ? "Temizleniyor..." : "Sepeti Temizle"}
        </button>
        {clearError && (
          <p role="alert" className="mt-2 text-[13px] text-red-600">
            {clearError}
          </p>
        )}
      </aside>
    </div>
  );
}
