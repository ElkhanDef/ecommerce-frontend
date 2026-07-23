import { api } from "./api";
import type {
  ImageUploadResult,
  Page,
  ProductDetail,
  ProductRequest,
  ProductSummary,
} from "@/types";

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

/** Admin-only. There is no update endpoint yet — only create/read/delete. */
export async function createProduct(payload: ProductRequest): Promise<ProductDetail> {
  const { data } = await api.post<ProductDetail>("/products/management", payload);
  return data;
}

/** Admin-only. */
export async function getProductForManagement(id: number): Promise<ProductDetail> {
  const { data } = await api.get<ProductDetail>(`/products/management/${id}`);
  return data;
}

/** Admin-only. */
export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/management/${id}`);
}

/** Admin-only. Reports per-file success/failure instead of throwing on partial failure. */
export async function uploadProductImages(
  productId: number,
  files: File[],
): Promise<ImageUploadResult> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  // The api instance defaults Content-Type to application/json, and axios's
  // default transformRequest JSON-stringifies FormData whenever that header
  // says "application/json" (see node_modules/axios/lib/defaults/index.js).
  // Overriding it here to anything else skips that, so axios's later
  // FormData handling clears Content-Type and lets the browser set the
  // correct multipart/form-data boundary itself.
  const { data } = await api.post<ImageUploadResult>(
    `/products/management/${productId}/images`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

/** Admin-only. */
export async function setMainProductImage(
  productId: number,
  imageId: number,
): Promise<ProductDetail> {
  const { data } = await api.patch<ProductDetail>(
    `/products/management/${productId}/images/${imageId}/main`,
  );
  return data;
}
