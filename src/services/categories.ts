import { api } from "./api";
import type { Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/categories");
  return data;
}

/** Throws ApiError with status 404 for unknown slugs. */
export async function getCategoryBySlug(slug: string): Promise<Category> {
  const { data } = await api.get<Category>(
    `/categories/${encodeURIComponent(slug)}`,
  );
  return data;
}
