"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ApiError } from "@/services/api";
import { getAccessToken } from "@/services/token-storage";
import { useCartStore } from "@/stores/cart";

const MAX_QUANTITY = 99;

export default function AddToCartButton({
  productId,
  stock,
}: {
  productId: number;
  stock: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const maxQuantity = Math.min(stock, MAX_QUANTITY);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 2500);
    return () => clearTimeout(timer);
  }, [feedback]);

  async function handleAdd() {
    const loginUrl = `/giris?redirect=${encodeURIComponent(pathname)}`;
    if (!getAccessToken()) {
      router.push(loginUrl);
      return;
    }
    setPending(true);
    setError(null);
    try {
      await useCartStore.getState().add(productId, quantity);
      // The backend's cart.message isn't guaranteed to be Turkish (or present) —
      // own the success copy here instead of surfacing it directly.
      setFeedback("Ürün sepete eklendi.");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.push(loginUrl);
        return;
      }
      setError(
        err instanceof ApiError
          ? err.message
          : "Ürün sepete eklenemedi. Lütfen tekrar deneyin.",
      );
    } finally {
      setPending(false);
    }
  }

  if (stock === 0) {
    return (
      <button
        type="button"
        disabled
        className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-400 text-[14px] font-medium cursor-not-allowed"
      >
        Tükendi
      </button>
    );
  }

  const stepperButtonClass =
    "w-9 h-9 flex items-center justify-center text-[18px] text-gray-600 hover:text-gold-dark disabled:text-gray-300 transition-colors";

  return (
    <div>
      <div className="flex items-center gap-3">
        <div
          role="group"
          aria-label="Adet"
          className="flex items-center border border-gray-300 rounded-xl overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={pending || quantity <= 1}
            aria-label="Adedi azalt"
            className={stepperButtonClass}
          >
            −
          </button>
          <span aria-live="polite" className="min-w-8 text-center text-[14px] font-medium tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            disabled={pending || quantity >= maxQuantity}
            aria-label="Adedi artır"
            className={stepperButtonClass}
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={pending}
          className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-gold-ink hover:text-white text-[14px] font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:hover:shadow-sm disabled:active:scale-100"
        >
          {pending ? "Ekleniyor..." : "Sepete Ekle"}
        </button>
      </div>

      <p aria-live="polite" className="mt-2 min-h-5 text-[13px]">
        {feedback && <span className="text-green-700">{feedback}</span>}
        {error && (
          <span role="alert" className="text-red-600">
            {error}
          </span>
        )}
      </p>
    </div>
  );
}
