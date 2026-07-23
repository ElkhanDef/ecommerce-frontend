import type { Metadata } from "next";
import FavoritesList from "@/components/favorites/FavoritesList";

export const metadata: Metadata = {
  title: "Favorilerim",
  description: "Favori ürünlerinizi görüntüleyin.",
};

export default function FavoritesPage() {
  return (
    <section aria-labelledby="favorites-heading">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-8 h-[3px] rounded-full bg-gradient-to-r from-gold-dark to-gold-light" aria-hidden="true" />
        <h1
          id="favorites-heading"
          className="font-serif text-[24px] font-semibold text-gray-800"
        >
          Favorilerim
        </h1>
      </div>
      <FavoritesList />
    </section>
  );
}
