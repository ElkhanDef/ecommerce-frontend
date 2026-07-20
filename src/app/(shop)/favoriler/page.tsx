import type { Metadata } from "next";
import FavoritesList from "@/components/favorites/FavoritesList";

export const metadata: Metadata = {
  title: "Favorilerim",
  description: "Favori ürünlerinizi görüntüleyin.",
};

export default function FavoritesPage() {
  return (
    <section aria-labelledby="favorites-heading">
      <h1
        id="favorites-heading"
        className="font-serif text-[24px] font-semibold text-gray-800 mb-6"
      >
        Favorilerim
      </h1>
      <FavoritesList />
    </section>
  );
}
