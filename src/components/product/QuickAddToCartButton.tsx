"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ApiError } from "@/services/api";
import { getAccessToken } from "@/services/token-storage";
import { useCartStore } from "@/stores/cart";

interface QuickAddToCartButtonProps {
  productId: number;
  productName: string;
}

/**
 * Single-click "add 1 to cart" for grid cards. Unlike AddToCartButton
 * (product detail page) there's no quantity stepper or stock-aware "Tükendi"
 * state — ProductSummary (GET /products) doesn't carry stock, only the
 * detail endpoint does. An out-of-stock add just surfaces the backend's
 * Turkish error message.
 */
export default function QuickAddToCartButton({
  productId,
  productName,
}: QuickAddToCartButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [added]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 2500);
    return () => clearTimeout(timer);
  }, [error]);

  async function handleClick() {
    const loginUrl = `/giris?redirect=${encodeURIComponent(pathname)}`;
    if (!getAccessToken()) {
      router.push(loginUrl);
      return;
    }
    setPending(true);
    setError(null);
    try {
      await useCartStore.getState().add(productId, 1);
      setAdded(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.push(loginUrl);
        return;
      }
      setError(
        err instanceof ApiError ? err.message : "Ürün sepete eklenemedi.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="absolute bottom-3 right-3 z-10">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-label={`${productName} ürününü sepete ekle`}
        title="Sepete Ekle"
        className={`w-9 h-9 flex items-center justify-center rounded-full shadow-sm transition-all active:scale-95 disabled:opacity-60 disabled:active:scale-100 ${
          added
            ? "bg-green-600 text-white"
            : "bg-gold hover:bg-gold-dark text-gold-ink hover:text-white hover:scale-110"
        }`}
      >
        {pending ? (
          <span
            className="w-4 h-4 rounded-full border-2 border-white/50 border-t-white animate-spin"
            aria-hidden="true"
          />
        ) : added ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12.5 10 17.5 19 7" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
        )}
      </button>
      {error && (
        <p
          role="alert"
          className="absolute right-0 top-full mt-1.5 w-max max-w-[170px] px-2.5 py-1.5 rounded-lg bg-red-600 text-white text-[11px] leading-snug shadow-lg"
        >
          {error}
        </p>
      )}
    </div>
  );
}
