"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/services/auth";
import { ApiError } from "@/services/api";
import TextField from "@/components/ui/TextField";

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);

    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    try {
      await forgotPassword({ email });
      setSentTo(email);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.validationErrors) {
          setFieldErrors(err.validationErrors);
        } else {
          setError(err.message);
        }
      } else {
        setError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
      }
      setSubmitting(false);
    }
  }

  if (sentTo) {
    return (
      <div
        role="status"
        className="p-5 rounded-xl bg-gold/10 border border-gold-light text-center"
      >
        <p className="font-serif text-[20px] font-semibold text-gray-800 mb-2">
          Bağlantı gönderildi 📮
        </p>
        <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
          Eğer <span className="font-medium">{sentTo}</span> adresine kayıtlı
          bir hesap varsa, şifre sıfırlama bağlantısı gönderdik. Gelen
          kutunuzu ve spam klasörünüzü kontrol edin.
        </p>
        <Link
          href="/giris"
          className="inline-block px-6 py-2.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[14px] font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
        >
          Giriş sayfasına dön
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
        id="email"
        name="email"
        label="E-posta"
        type="email"
        autoComplete="email"
        placeholder="ornek@mail.com"
        required
        error={fieldErrors.email}
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full p-3.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[15px] font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98] mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {submitting ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
      </button>

      <p className="text-center text-[13px] text-gray-500">
        <Link href="/giris" className="text-gold-dark hover:underline">
          ← Giriş sayfasına dön
        </Link>
      </p>
    </form>
  );
}
