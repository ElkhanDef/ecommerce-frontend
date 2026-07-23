import Link from "next/link";
import { getCategories } from "@/services/categories";
import type { Category } from "@/types";
import BrandMark from "./BrandMark";
import HeaderAuthAction from "./HeaderAuthAction";
import HeaderCartLink from "./HeaderCartLink";

export default async function Header() {
  // Whatever categories the seller creates show up here; slugless legacy
  // records are skipped because they have no category page to link to.
  let categories: Category[] = [];
  try {
    categories = (await getCategories()).filter((category) => category.slug);
  } catch {
    // Backend unreachable — the menu falls back to the built-in links only.
  }
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e0e0e0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5 shrink-0">
            <BrandMark className="w-9 h-9 rounded-xl transition-transform group-hover:scale-105" />
            <span className="font-serif text-[20px] font-bold text-gray-800 whitespace-nowrap">
              Kütahya Çini Evi
            </span>
          </Link>

          {/* Search box removed until the backend exposes a product search
              endpoint (GET /products ignores a search param today). */}

          {/* User actions */}
          <nav aria-label="Kullanıcı menüsü" className="flex items-center gap-1">
            <Link
              href="/favoriler"
              title="Favoriler"
              className="p-2.5 rounded-xl text-gray-600 hover:bg-surface hover:text-gold-dark transition-colors"
            >
              <span className="sr-only">Favoriler</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </Link>
            <HeaderCartLink />
            <HeaderAuthAction />
          </nav>
        </div>

        {/* Category menu */}
        <nav
          aria-label="Kategoriler"
          className="flex items-center gap-6 h-11 overflow-x-auto text-[14px]"
        >
          <Link
            href="/yeni-gelenler"
            className="whitespace-nowrap font-medium text-gold-dark hover:text-gold transition-colors"
          >
            Yeni Gelenler
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/kategori/${category.slug}`}
              className="whitespace-nowrap text-gray-600 hover:text-gold-dark transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
