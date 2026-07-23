import Link from "next/link";

export default function CategoryNotFound() {
  return (
    <div className="py-16 text-center">
      <p aria-hidden="true" className="text-5xl mb-4">
        🔍
      </p>
      <h1 className="font-serif text-[24px] font-semibold text-gray-800 mb-2">
        Kategori Bulunamadı
      </h1>
      <p className="text-[15px] text-gray-500 mb-6">
        Aradığınız kategori kaldırılmış veya bağlantı hatalı olabilir.
      </p>
      <Link
        href="/"
        className="inline-block px-5 py-2.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[14px] font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
      >
        Ürünleri Keşfet
      </Link>
    </div>
  );
}
