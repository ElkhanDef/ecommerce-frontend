import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Şifremi Unuttum",
  description: "Şifrenizi sıfırlamak için e-posta adresinize bağlantı gönderin.",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="font-serif text-[28px] font-semibold text-gray-800 mb-1.5">
        Şifremi Unuttum
      </h1>
      <p className="text-[14px] text-gray-500 mb-7">
        E-posta adresinizi girin, size bir şifre sıfırlama bağlantısı
        gönderelim.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
