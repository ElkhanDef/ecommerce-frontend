"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "@/components/layout/BrandMark";

const links = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/products", label: "Ürünler" },
  { href: "/admin/categories", label: "Kategoriler" },
  { href: "/admin/users", label: "Kullanıcılar" },
] as const;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e0e0e0] shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4 h-16">
            <Link href="/admin" className="flex items-center gap-2.5 shrink-0">
              <BrandMark className="w-8 h-8 rounded-lg" />
              <span className="font-serif text-[16px] font-bold text-gray-800 whitespace-nowrap">
                Yönetim Paneli
              </span>
            </Link>
            <Link
              href="/"
              className="text-[13px] text-gray-500 hover:text-gold-dark transition-colors whitespace-nowrap"
            >
              ← Mağazaya Dön
            </Link>
          </div>
          <nav
            aria-label="Yönetim menüsü"
            className="flex items-center gap-1 h-12 overflow-x-auto"
          >
            {links.map((link) => {
              const active =
                link.href === "/admin"
                  ? pathname === link.href
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-[14px] font-medium transition-colors ${
                    active
                      ? "bg-gold text-gold-ink"
                      : "text-gray-600 hover:bg-surface hover:text-gold-dark"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
