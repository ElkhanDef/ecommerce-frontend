import Link from "next/link";

const sections = [
  {
    href: "/admin/products",
    title: "Ürünler",
    description: "Ürün oluşturun, görsellerini yönetin ve kaldırın.",
  },
  {
    href: "/admin/categories",
    title: "Kategoriler",
    description: "Kategori oluşturun, düzenleyin ve kaldırın.",
  },
  {
    href: "/admin/users",
    title: "Kullanıcılar",
    description: "Kullanıcı hesaplarını id ile sorgulayın.",
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-gray-800 mb-6">
        Yönetim Paneli
      </h1>
      <div className="grid sm:grid-cols-3 gap-5">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="block bg-white border border-[#e0e0e0] rounded-[16px] p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <h2 className="font-serif text-lg font-semibold text-gray-800 mb-1.5">
              {section.title}
            </h2>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
