"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { verifyAccount } from "@/services/auth";
import { ApiError } from "@/services/api";

type Status = "verifying" | "success" | "error";

export default function VerifyAccount({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>("verifying");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // The token is single-use; the ref guards against React Strict Mode's
  // double effect invocation in development.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    verifyAccount(token)
      .then(() => setStatus("success"))
      .catch((err: unknown) => {
        setErrorMessage(
          err instanceof ApiError
            ? err.message
            : "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
        );
        setStatus("error");
      });
  }, [token]);

  if (status === "verifying") {
    return (
      <div role="status" className="text-center">
        <span
          className="inline-block w-8 h-8 mb-4 rounded-full border-2 border-gold-light border-t-gold-dark animate-spin"
          aria-hidden="true"
        />
        <p className="font-serif text-[22px] font-semibold text-gray-800 mb-2">
          Hesabınız doğrulanıyor...
        </p>
        <p className="text-[14px] text-gray-500">Lütfen bekleyin.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div role="alert" className="text-center">
        <p className="font-serif text-[22px] font-semibold text-gray-800 mb-2">
          Doğrulama başarısız
        </p>
        <p className="text-[14px] text-red-600 mb-5">{errorMessage}</p>
        <p className="text-[13px] text-gray-500 mb-4">
          Bağlantının süresi dolmuş olabilir. Yeniden kayıt olmayı deneyebilir
          veya giriş sayfasına dönebilirsiniz.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/kayit"
            className="px-5 py-2.5 border border-gray-300 hover:bg-surface rounded-xl text-[14px] font-medium text-gray-700 transition-all active:scale-[0.98]"
          >
            Kayıt Ol
          </Link>
          <Link
            href="/giris"
            className="px-5 py-2.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[14px] font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div role="status" className="text-center">
      <p aria-hidden="true" className="text-5xl mb-4">🎉</p>
      <p className="font-serif text-[22px] font-semibold text-gray-800 mb-2">
        Hesabınız doğrulandı
      </p>
      <p className="text-[14px] text-gray-600 mb-5">
        Artık giriş yapıp alışverişe başlayabilirsiniz.
      </p>
      <Link
        href="/giris"
        className="inline-block px-6 py-2.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[14px] font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
      >
        Giriş Yap
      </Link>
    </div>
  );
}
