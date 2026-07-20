"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/services/auth";
import { ApiError } from "@/services/api";
import TextField from "@/components/ui/TextField";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      await signIn({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });
      const redirect = searchParams.get("redirect");
      router.replace(redirect?.startsWith("/") ? redirect : "/");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
      {error && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-700"
        >
          {error}
        </div>
      )}

      <TextField
        id="email"
        name="email"
        label="E-posta"
        type="email"
        autoComplete="email"
        placeholder="ornek@mail.com"
        required
      />
      <TextField
        id="password"
        name="password"
        label="Şifre"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        required
      />

      <div className="text-right">
        <Link
          href="/sifremi-unuttum"
          className="text-[13px] text-gold-dark hover:underline"
        >
          Şifremi unuttum
        </Link>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full p-3.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[15px] font-medium transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>
    </form>
  );
}
