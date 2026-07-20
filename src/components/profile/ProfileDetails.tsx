"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/services/users";
import { signOut } from "@/services/auth";
import { ApiError } from "@/services/api";
import { getAccessToken } from "@/services/token-storage";
import type { CurrentUser } from "@/types";

const LOGIN_REDIRECT = "/giris?redirect=/profil";

export default function ProfileDetails() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace(LOGIN_REDIRECT);
      return;
    }
    getCurrentUser()
      .then(setUser)
      .catch((err: unknown) => {
        // 401 here means even the refresh flow failed — session is over.
        if (err instanceof ApiError && err.status === 401) {
          router.replace(LOGIN_REDIRECT);
          return;
        }
        setError(
          err instanceof ApiError
            ? err.message
            : "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
        );
      });
  }, [router]);

  function handleSignOut() {
    signOut();
    // Full navigation so auth-dependent UI (header button) resets.
    // TODO: Replace with the Zustand auth store when it lands.
    window.location.assign("/");
  }

  if (error) {
    return (
      <p role="alert" className="py-12 text-center text-[14px] text-red-600">
        {error}
      </p>
    );
  }

  if (!user) {
    return (
      <p role="status" className="py-12 text-center text-[14px] text-gray-500">
        Bilgileriniz yükleniyor...
      </p>
    );
  }

  const fields = [
    { label: "Ad", value: user.name },
    { label: "Soyad", value: user.lastName },
    { label: "E-posta", value: user.email },
    { label: "Telefon", value: user.phoneNumber ?? "—" },
  ];

  return (
    <div className="max-w-lg">
      <div className="bg-white border border-[#e0e0e0] rounded-[16px] p-6 mb-6">
        <dl className="space-y-4">
          {fields.map((field) => (
            <div key={field.label} className="flex justify-between gap-4">
              <dt className="text-[13px] font-medium text-gray-500">
                {field.label}
              </dt>
              <dd className="text-[14px] text-gray-800 text-right break-all">
                {field.value}
              </dd>
            </div>
          ))}
          <div className="flex justify-between gap-4">
            <dt className="text-[13px] font-medium text-gray-500">
              Hesap durumu
            </dt>
            <dd>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-gold/15 text-gold-dark">
                {user.verified ? "Doğrulanmış" : "Doğrulanmamış"}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        className="px-5 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-[14px] font-medium transition-colors"
      >
        Çıkış Yap
      </button>
    </div>
  );
}
