"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { ApiError } from "@/services/api";
import { useCartStore } from "@/stores/cart";
import type { CartItem } from "@/types";

const LOGIN_REDIRECT = "/giris?redirect=/sepet";

export default function CartItemRow({ item }: { item: CartItem }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(action: () => Promise<void>) {
    setPending(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace(LOGIN_REDIRECT);
        return;
      }
      setError(
        err instanceof ApiError
          ? err.message
          : "İşlem başarısız oldu. Lütfen tekrar deneyin.",
      );
    } finally {
      setPending(false);
    }
  }

  const stepperButtonClass =
    "w-8 h-8 flex items-center justify-center text-[16px] text-gray-600 hover:text-gold-dark disabled:text-gray-300 transition-colors";

  return (
    <li className="py-4 border-b border-[#e0e0e0] last:border-b-0">
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-surface">
          {item.mainImageUrl ? (
            <Image
              src={item.mainImageUrl}
              alt={item.productName}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold-light/30 to-gold/20 text-2xl"
            >
              🏺
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className="text-[14px] font-medium text-gray-800 truncate"
            title={item.productName}
          >
            {item.productName}
          </h3>
          <p className="mt-0.5 text-[13px] text-gray-500 tabular-nums">
            Birim: {formatPrice(item.unitPrice)}
          </p>

          <div
            role="group"
            aria-label={`${item.productName} adedi`}
            className="mt-2 inline-flex items-center border border-gray-300 rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() =>
                run(() =>
                  useCartStore
                    .getState()
                    .updateQuantity(item.productId, item.quantity - 1),
                )
              }
              disabled={pending || item.quantity <= 1}
              aria-label="Adedi azalt"
              className={stepperButtonClass}
            >
              −
            </button>
            <span className="min-w-8 text-center text-[13px] font-medium tabular-nums">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                run(() =>
                  useCartStore
                    .getState()
                    .updateQuantity(item.productId, item.quantity + 1),
                )
              }
              disabled={pending}
              aria-label="Adedi artır"
              className={stepperButtonClass}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() =>
              run(() => useCartStore.getState().remove(item.productId))
            }
            disabled={pending}
            aria-label={`${item.productName} ürününü sepetten çıkar`}
            title="Sepetten çıkar"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <p className="text-[15px] font-semibold text-gold-dark tabular-nums">
            {formatPrice(item.totalPrice)}
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-[13px] text-red-600">
          {error}
        </p>
      )}
    </li>
  );
}
