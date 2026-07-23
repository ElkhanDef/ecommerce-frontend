import Link from "next/link";
import BrandMark from "./BrandMark";

export default function Footer() {
  return (
    <footer className="mt-auto bg-white border-t border-[#e0e0e0]">
      <div className="h-[3px] bg-gradient-to-r from-gold-dark via-gold to-gold-light" />
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <BrandMark className="w-8 h-8 rounded-lg" />
          <span className="font-serif text-[17px] font-bold text-gray-800">
            Kütahya Çini Evi
          </span>
        </div>

        <nav aria-label="Alt menü" className="flex flex-wrap gap-6 text-[13px] text-gray-500">
          <Link href="/" className="hover:text-gold-dark transition-colors">
            Ana Sayfa
          </Link>
          <Link href="/sepet" className="hover:text-gold-dark transition-colors">
            Sepet
          </Link>
          <Link href="/favoriler" className="hover:text-gold-dark transition-colors">
            Favoriler
          </Link>
          <Link href="/profil" className="hover:text-gold-dark transition-colors">
            Profilim
          </Link>
        </nav>

        <p className="text-[13px] text-gray-400">
          © {new Date().getFullYear()} Kütahya Çini Evi. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
