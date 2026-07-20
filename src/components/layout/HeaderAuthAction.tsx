"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { getAccessToken } from "@/services/token-storage";

// TODO: Replace the localStorage peek with the Zustand auth store once it
// exists, so this also reacts to same-tab sign-in/sign-out without a remount.
function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getSnapshot(): boolean {
  return Boolean(getAccessToken());
}

// Server render (and hydration) always assumes signed-out.
function getServerSnapshot(): boolean {
  return false;
}

export default function HeaderAuthAction() {
  const isAuthenticated = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (!isAuthenticated) {
    return (
      <Link
        href="/giris"
        className="ml-1 px-4 py-2 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[14px] font-medium transition-colors whitespace-nowrap"
      >
        Giriş Yap
      </Link>
    );
  }

  return (
    <Link
      href="/profil"
      title="Profilim"
      className="p-2.5 rounded-xl text-gray-600 hover:bg-surface hover:text-gold-dark transition-colors"
    >
      <span className="sr-only">Profilim</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </Link>
  );
}
