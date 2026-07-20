import type { Metadata } from "next";
import { Suspense } from "react";
import AuthTabs from "@/components/auth/AuthTabs";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "Hesabınıza giriş yapın ve alışverişe devam edin.",
};

export default function LoginPage() {
  return (
    <div>
      <AuthTabs />
      <h1 className="font-serif text-[28px] font-semibold text-gray-800 mb-1.5">
        Hoş Geldiniz
      </h1>
      <p className="text-[14px] text-gray-500 mb-7">Hesabınıza giriş yapın</p>
      {/* Suspense: LoginForm reads the ?redirect= search param on the client. */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
