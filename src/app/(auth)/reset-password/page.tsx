import type { Metadata } from "next";
import Link from "next/link";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { verifyResetToken } from "@/services/auth";

// The URL of this page is dictated by the backend's reset e-mail template
// (hence English, like /verify-user):
// http://localhost:3000/reset-password?token={token}

export const metadata: Metadata = {
  title: "Şifre Sıfırlama",
  description: "Hesabınız için yeni bir şifre belirleyin.",
  robots: { index: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let valid = false;
  if (token) {
    try {
      valid = await verifyResetToken(token);
    } catch {
      // Backend unreachable or unexpected error — treat as invalid link.
    }
  }

  if (!token || !valid) {
    return (
      <div>
        <h1 className="font-serif text-[28px] font-semibold text-gray-800 mb-1.5">
          Bağlantı Geçersiz
        </h1>
        <p className="text-[14px] text-gray-500 mb-7">
          Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni
          bir bağlantı isteyin.
        </p>
        <Link
          href="/sifremi-unuttum"
          className="inline-block w-full p-3.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[15px] font-medium text-center transition-colors"
        >
          Yeni Bağlantı İste
        </Link>
        <p className="text-center text-[13px] text-gray-500 mt-4">
          <Link href="/giris" className="text-gold-dark hover:underline">
            ← Giriş sayfasına dön
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-[28px] font-semibold text-gray-800 mb-1.5">
        Yeni Şifre Belirle
      </h1>
      <p className="text-[14px] text-gray-500 mb-7">
        Hesabınız için yeni bir şifre oluşturun.
      </p>
      <ResetPasswordForm token={token} />
    </div>
  );
}
