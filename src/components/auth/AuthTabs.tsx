"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/giris", label: "Giriş Yap" },
  { href: "/kayit", label: "Kayıt Ol" },
] as const;

export default function AuthTabs() {
  const pathname = usePathname();

  return (
    <div className="flex bg-[#f0f0f0] rounded-xl p-1 mb-8 border border-[#e0e0e0]">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={pathname === tab.href ? "page" : undefined}
          className={`flex-1 p-2.5 text-center text-sm font-medium rounded-lg transition-all ${
            pathname === tab.href
              ? "bg-gold text-gold-ink"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
