import { api } from "./api";
import type { Page, ProductDetail, ProductSummary } from "@/types";

interface GetProductsParams {
  /** Zero-based page index. */
  pageNumber: number;
  pageSize: number;
  /** Sort column, e.g. "price" or "createdAt". Omitted -> backend default order. */
  column?: string;
  /** Sort direction for `column`; false = descending. */
  asc?: boolean;
  /** Limits the listing to one category. */
  categorySlug?: string;
}

export async function getProducts(
  params: GetProductsParams,
): Promise<Page<ProductSummary>> {
  const { data } = await api.get<Page<ProductSummary>>("/products", { params });
  return data;
}

/** Throws ApiError with status 404 ("Ürün bulunamadı") for unknown slugs. */
export async function getProductBySlug(slug: string): Promise<ProductDetail> {
  const { data } = await api.get<ProductDetail>(
    `/products/${encodeURIComponent(slug)}`,
  );
  return data;
}
