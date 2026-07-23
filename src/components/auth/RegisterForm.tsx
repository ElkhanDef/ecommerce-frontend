"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "@/services/auth";
import { ApiError } from "@/services/api";
import TextField from "@/components/ui/TextField";

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const user = await signUp({
        name: String(formData.get("name") ?? ""),
        lastName: String(formData.get("lastName") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        phoneNumber: String(formData.get("phoneNumber") ?? "") || undefined,
      });
      setRegisteredEmail(user.email);
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

  // The backend requires e-mail verification before the first sign-in.
  if (registeredEmail) {
    return (
      <div
        role="status"
        className="p-5 rounded-xl bg-gold/10 border border-gold-light text-center"
      >
        <p className="font-serif text-[20px] font-semibold text-gray-800 mb-2">
          Hesabınız oluşturuldu 🎉
        </p>
        <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
          <span className="font-medium">{registeredEmail}</span> adresine bir
          doğrulama bağlantısı gönderdik. Giriş yapabilmek için lütfen
          e-postanızı doğrulayın.
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

      <div className="grid grid-cols-2 gap-3">
        <TextField
          id="name"
          name="name"
          label="Ad"
          type="text"
          autoComplete="given-name"
          placeholder="Adınız"
          required
          error={fieldErrors.name}
        />
        <TextField
          id="lastName"
          name="lastName"
          label="Soyad"
          type="text"
          autoComplete="family-name"
          placeholder="Soyadınız"
          required
          error={fieldErrors.lastName}
        />
      </div>

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
      <TextField
        id="phoneNumber"
        name="phoneNumber"
        label="Telefon (opsiyonel)"
        type="tel"
        autoComplete="tel"
        placeholder="05XX XXX XX XX"
        error={fieldErrors.phoneNumber}
      />
      <TextField
        id="password"
        name="password"
        label="Şifre"
        type="password"
        autoComplete="new-password"
        placeholder="En az 8 karakter"
        required
        minLength={8}
        error={fieldErrors.password}
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full p-3.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[15px] font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98] mt-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {submitting ? "Kayıt yapılıyor..." : "Kayıt Ol"}
      </button>
    </form>
  );
}
