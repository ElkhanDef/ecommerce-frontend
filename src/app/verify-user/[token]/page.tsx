import type { Metadata } from "next";
import VerifyAccount from "@/components/auth/VerifyAccount";

// The URL of this page is dictated by the backend's verification e-mail template:
// http://localhost:3000/verify-user/{token}

export const metadata: Metadata = {
  title: "Hesap Doğrulama",
  description: "E-posta adresinizi doğrulayın.",
  robots: { index: false },
};

export default async function VerifyUserPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-[440px] bg-white border border-[#e0e0e0] rounded-[20px] p-10 shadow-lg">
        <VerifyAccount token={token} />
      </div>
    </div>
  );
}
