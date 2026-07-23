"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser } from "@/services/users";
import { getAccessToken } from "@/services/token-storage";

const ADMIN_ROLE = "ADMIN";

type Status = "checking" | "forbidden" | "authorized";

/**
 * Client-side only — tokens live in localStorage, unreachable from server
 * components. This is UX, not the security boundary: the backend MUST also
 * reject non-admins on every /management/** call.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace(`/giris?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    getCurrentUser()
      .then((user) => {
        setStatus(user.role === ADMIN_ROLE ? "authorized" : "forbidden");
      })
      .catch(() => {
        // 401 here means even the refresh flow failed — session is over.
        router.replace(`/giris?redirect=${encodeURIComponent(pathname)}`);
      });
  }, [router, pathname]);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <span
          className="w-8 h-8 rounded-full border-2 border-gold-light border-t-gold-dark animate-spin"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (status === "forbidden") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="text-center max-w-sm">
          <p aria-hidden="true" className="text-5xl mb-4">
            🔒
          </p>
          <h1 className="font-serif text-[22px] font-semibold text-gray-800 mb-2">
            Erişim Reddedildi
          </h1>
          <p className="text-[14px] text-gray-500 mb-6">
            Bu alana erişmek için yönetici yetkisine sahip olmanız gerekiyor.
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[14px] font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
