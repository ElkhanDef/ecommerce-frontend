"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/stores/cart";

export default function HeaderCartLink() {
  const pathname = usePathname();
  const count = useCartStore((state) => state.cart?.totalQuantity ?? 0);

  // Re-run on navigation so the badge appears right after a soft-nav sign-in;
  // the store dedupes and no-ops while signed out or already loaded.
  useEffect(() => {
    void useCartStore.getState().load();
  }, [pathname]);

  return (
    <Link
      href="/sepet"
      title="Sepet"
      className="relative p-2.5 rounded-xl text-gray-600 hover:bg-surface hover:text-gold-dark transition-colors"
    >
      <span className="sr-only">Sepet</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      {count > 0 && (
        <span
          aria-label={`Sepette ${count} ürün`}
          className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-gold text-gold-ink text-[11px] font-semibold leading-none"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
