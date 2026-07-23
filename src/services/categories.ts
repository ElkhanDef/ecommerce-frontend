import { api } from "./api";
import type { Category, CategoryRequest } from "@/types";

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

/** Admin-only. Creates a category. */
export async function createCategory(payload: CategoryRequest): Promise<Category> {
  const { data } = await api.post<Category>("/categories/management", payload);
  return data;
}

/** Admin-only. */
export async function getCategoryForManagement(id: number): Promise<Category> {
  const { data } = await api.get<Category>(`/categories/management/${id}`);
  return data;
}

/** Admin-only. */
export async function updateCategory(
  id: number,
  payload: CategoryRequest,
): Promise<Category> {
  const { data } = await api.put<Category>(
    `/categories/management/${id}`,
    payload,
  );
  return data;
}

/** Admin-only. */
export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/categories/management/${id}`);
}
