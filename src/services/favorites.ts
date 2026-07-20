import { api } from "./api";
import type { FavoriteToggleResponse, ProductSummary } from "@/types";

/** Requires auth: 401 (after failed refresh) means the user must sign in. */
export async function getFavorites(): Promise<ProductSummary[]> {
  const { data } = await api.get<ProductSummary[]>("/favorites");
  return data;
}

/** Adds the product to favorites if absent, removes it if present. */
export async function toggleFavorite(
  productId: number,
): Promise<FavoriteToggleResponse> {
  const { data } = await api.post<FavoriteToggleResponse>(
    `/favorites/${productId}/toggle`,
  );
  return data;
}
