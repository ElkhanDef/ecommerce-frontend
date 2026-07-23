"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/services/categories";
import { createProduct, deleteProduct, getProducts } from "@/services/products";
import { ApiError } from "@/services/api";
import { formatPrice } from "@/lib/format";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TextField from "@/components/ui/TextField";
import TextAreaField from "@/components/ui/TextAreaField";
import type { Category, Page, ProductSummary } from "@/types";

const PAGE_SIZE = 10;

export default function ProductManager() {
  const [page, setPage] = useState<Page<ProductSummary> | null>(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [listError, setListError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [deleteTarget, setDeleteTarget] = useState<ProductSummary | null>(null);

  function loadProducts() {
    getProducts({ pageNumber, pageSize: PAGE_SIZE })
      .then((data) => {
        setPage(data);
        setListError(null);
      })
      .catch((err: unknown) => {
        setListError(
          err instanceof ApiError
            ? err.message
            : "Ürünler yüklenemedi. Lütfen tekrar deneyin.",
        );
      });
  }

  useEffect(loadProducts, [pageNumber]);
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {
        // The create form just shows an empty category select on failure.
      });
  }, []);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const categoryId = Number(formData.get("categoryId"));
    try {
      await createProduct({
        name: String(formData.get("name") ?? ""),
        price: Number(formData.get("price")),
        stock: Number(formData.get("stock")),
        sku: String(formData.get("sku") ?? ""),
        description: String(formData.get("description") ?? "") || undefined,
        categoryId,
      });
      setShowForm(false);
      setPageNumber(0);
      loadProducts();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.validationErrors) {
          setFieldErrors(err.validationErrors);
        } else {
          setFormError(err.message);
        }
      } else {
        setFormError("Ürün oluşturulamadı. Lütfen tekrar deneyin.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirmed() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await deleteProduct(target.id);
      loadProducts();
    } catch (err) {
      setListError(
        err instanceof ApiError
          ? err.message
          : "Ürün silinemedi. Lütfen tekrar deneyin.",
      );
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="px-5 py-2.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[14px] font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
        >
          {showForm ? "Formu Kapat" : "Yeni Ürün Ekle"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-[#e0e0e0] rounded-[16px] p-5 shadow-sm space-y-4 mb-6"
        >
          {formError && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-700"
            >
              {formError}
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              id="name"
              name="name"
              label="Ad"
              type="text"
              minLength={3}
              maxLength={100}
              required
              error={fieldErrors.name}
            />
            <div>
              <label
                htmlFor="categoryId"
                className="block text-[13px] font-medium text-gray-600 mb-1.5"
              >
                Kategori
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                defaultValue=""
                className="w-full p-3 border rounded-xl text-[14px] outline-none focus:ring-[3px] transition-all border-gray-300 focus:border-gold focus:ring-gold/15 bg-white"
              >
                <option value="" disabled>
                  Kategori seçin
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {fieldErrors.categoryId && (
                <p className="mt-1.5 text-[12px] text-red-600">
                  {fieldErrors.categoryId}
                </p>
              )}
            </div>
            <TextField
              id="price"
              name="price"
              label="Fiyat (₺)"
              type="number"
              step="0.01"
              min={0.01}
              required
              error={fieldErrors.price}
            />
            <TextField
              id="stock"
              name="stock"
              label="Stok"
              type="number"
              min={0}
              max={999999}
              required
              error={fieldErrors.stock}
            />
            <TextField
              id="sku"
              name="sku"
              label="SKU"
              type="text"
              minLength={3}
              maxLength={50}
              required
              error={fieldErrors.sku}
            />
          </div>
          <TextAreaField
            id="description"
            name="description"
            label="Açıklama"
            rows={3}
            maxLength={2000}
            error={fieldErrors.description}
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[14px] font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Oluşturuluyor..." : "Ürünü Oluştur"}
          </button>
        </form>
      )}

      <div className="bg-white border border-[#e0e0e0] rounded-[16px] shadow-sm overflow-hidden">
        {listError && (
          <p role="alert" className="p-5 text-[14px] text-red-600">
            {listError}
          </p>
        )}
        {!listError && page === null && (
          <div className="py-12 flex justify-center">
            <span
              className="w-6 h-6 rounded-full border-2 border-gold-light border-t-gold-dark animate-spin"
              aria-hidden="true"
            />
          </div>
        )}
        {page?.content.length === 0 && (
          <p className="p-5 text-[14px] text-gray-500">Henüz ürün bulunmuyor.</p>
        )}
        {page && page.content.length > 0 && (
          <ul>
            {page.content.map((product) => (
              <li
                key={product.id}
                className="flex items-center gap-4 px-5 py-3.5 border-b border-[#f0f0f0] last:border-b-0"
              >
                <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-surface">
                  {product.mainImageUrl ? (
                    <Image
                      src={product.mainImageUrl}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold-light/30 to-gold/20 text-lg"
                    >
                      🏺
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-gray-800 truncate">
                    {product.name}
                  </p>
                  <p className="text-[12px] text-gray-400 tabular-nums">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <Link
                  href={`/admin/products/${product.id}`}
                  className="px-3.5 py-1.5 border border-gray-300 hover:bg-gray-50 rounded-lg text-[13px] font-medium transition-all active:scale-[0.98]"
                >
                  Detay
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(product)}
                  className="px-3.5 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-[13px] font-medium transition-all active:scale-[0.98]"
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {page && page.page.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPageNumber((p) => Math.max(0, p - 1))}
            disabled={pageNumber === 0}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-xl text-[13px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ‹ Önceki
          </button>
          <span className="text-[13px] text-gray-500 tabular-nums">
            {pageNumber + 1} / {page.page.totalPages}
          </span>
          <button
            type="button"
            onClick={() =>
              setPageNumber((p) => Math.min(page.page.totalPages - 1, p + 1))
            }
            disabled={pageNumber >= page.page.totalPages - 1}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-xl text-[13px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Sonraki ›
          </button>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Ürünü Sil"
        message={`"${deleteTarget?.name}" ürünü silinecek. Emin misiniz?`}
        confirmLabel="Sil"
        destructive
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
