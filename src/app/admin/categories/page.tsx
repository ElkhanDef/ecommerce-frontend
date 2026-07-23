import type { Metadata } from "next";
import CategoryManager from "@/components/admin/CategoryManager";

export const metadata: Metadata = { title: "Kategoriler" };

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-gray-800 mb-6">
        Kategoriler
      </h1>
      <CategoryManager />
    </div>
  );
}
