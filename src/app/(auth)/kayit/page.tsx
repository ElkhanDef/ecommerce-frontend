import type { Metadata } from "next";
import AuthTabs from "@/components/auth/AuthTabs";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description: "Hızlıca üye olun, kaliteli hediyelikleri keşfedin.",
};

export default function RegisterPage() {
  return (
    <div>
      <AuthTabs />
      <h1 className="font-serif text-[28px] font-semibold text-gray-800 mb-1.5">
        Hesap Oluştur
      </h1>
      <p className="text-[14px] text-gray-500 mb-7">Hızlıca üye olun</p>
      <RegisterForm />
    </div>
  );
}
