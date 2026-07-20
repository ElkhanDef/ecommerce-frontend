"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/services/auth";
import { ApiError } from "@/services/api";
import TextField from "@/components/ui/TextField";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirm = String(formData.get("newPasswordConfirm") ?? "");

    // Frontend-only check; everything else comes from backend validation.
    if (newPassword !== confirm) {
      setFieldErrors({ newPasswordConfirm: "Şifreler eşleşmiyor." });
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({ token, newPassword });
      setDone(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.validationErrors) {
          // The token error is not tied to a visible field — show it globally.
          const { token: tokenError, ...rest } = err.validationErrors;
          setFieldErrors(rest);
          if (tokenError) setError(tokenError);
        } else {
          setError(err.message);
        }
      } else {
        setError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
      }
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div
        role="status"
        className="p-5 rounded-xl bg-gold/10 border border-gold-light text-center"
      >
        <p className="font-serif text-[20px] font-semibold text-gray-800 mb-2">
          Şifreniz güncellendi ✓
        </p>
        <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
          Artık yeni şifrenizle giriş yapabilirsiniz.
        </p>
        <Link
          href="/giris"
          className="inline-block px-6 py-2.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[14px] font-medium transition-colors"
        >
          Giriş Yap
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-700"
        >
          {error}
        </div>
      )}

      <TextField
        id="newPassword"
        name="newPassword"
        label="Yeni Şifre"
        type="password"
        autoComplete="new-password"
        placeholder="En az 8 karakter"
        required
        minLength={8}
        error={fieldErrors.newPassword}
      />
      <TextField
        id="newPasswordConfirm"
        name="newPasswordConfirm"
        label="Yeni Şifre (Tekrar)"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        required
        error={fieldErrors.newPasswordConfirm}
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full p-3.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[15px] font-medium transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Kaydediliyor..." : "Şifreyi Güncelle"}
      </button>
    </form>
  );
}
