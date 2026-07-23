"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  deleteProduct,
  getProductForManagement,
  setMainProductImage,
  uploadProductImages,
} from "@/services/products";
import { ApiError } from "@/services/api";
import { formatPrice } from "@/lib/format";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { ImageUploadResult, ProductDetail } from "@/types";

interface PendingImage {
  file: File;
  /** Object URL for the local preview thumbnail — revoked once no longer needed. */
  url: string;
}

export default function ProductDetailManager({ productId }: { productId: number }) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [settingMainId, setSettingMainId] = useState<number | null>(null);

  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  // Mirrors pendingImages so the unmount cleanup below can see the latest
  // value without re-subscribing the effect on every add/remove.
  const pendingImagesRef = useRef<PendingImage[]>([]);
  useEffect(() => {
    pendingImagesRef.current = pendingImages;
  }, [pendingImages]);
  useEffect(() => {
    return () => {
      pendingImagesRef.current.forEach((pending) => URL.revokeObjectURL(pending.url));
    };
  }, []);

  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<ImageUploadResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function load() {
    getProductForManagement(productId)
      .then((data) => {
        setProduct(data);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        setLoadError(
          err instanceof ApiError
            ? err.message
            : "Ürün yüklenemedi. Lütfen tekrar deneyin.",
        );
      });
  }

  useEffect(load, [productId]);

  async function handleSetMain(imageId: number) {
    setSettingMainId(imageId);
    try {
      const updated = await setMainProductImage(productId, imageId);
      setProduct(updated);
    } catch (err) {
      setLoadError(
        err instanceof ApiError
          ? err.message
          : "Ana görsel güncellenemedi. Lütfen tekrar deneyin.",
      );
    } finally {
      setSettingMainId(null);
    }
  }

  function handleFilesPicked(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const additions = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPendingImages((prev) => [...prev, ...additions]);
    // Reset so picking the exact same file again (e.g. after removing it
    // from the pending list) still fires a change event.
    event.target.value = "";
  }

  function handleRemovePending(index: number) {
    setPendingImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingImages.length === 0) return;

    setUploading(true);
    setUploadError(null);
    setUploadResult(null);
    try {
      const result = await uploadProductImages(
        productId,
        pendingImages.map((pending) => pending.file),
      );
      setUploadResult(result);
      pendingImages.forEach((pending) => URL.revokeObjectURL(pending.url));
      setPendingImages([]);
      load();
    } catch (err) {
      setUploadError(
        err instanceof ApiError
          ? err.message
          : "Görseller yüklenemedi. Lütfen tekrar deneyin.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteConfirmed() {
    setConfirmDelete(false);
    try {
      await deleteProduct(productId);
      router.push("/admin/products");
    } catch (err) {
      setDeleteError(
        err instanceof ApiError
          ? err.message
          : "Ürün silinemedi. Lütfen tekrar deneyin.",
      );
    }
  }

  if (loadError && !product) {
    return (
      <p role="alert" className="py-12 text-center text-[14px] text-red-600">
        {loadError}
      </p>
    );
  }

  if (!product) {
    return (
      <div className="py-16 flex justify-center">
        <span
          className="w-6 h-6 rounded-full border-2 border-gold-light border-t-gold-dark animate-spin"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <div className="bg-white border border-[#e0e0e0] rounded-[16px] p-6 shadow-sm">
        <h2 className="font-serif text-[17px] font-semibold text-gray-800 mb-4">
          Ürün Bilgileri
        </h2>
        {/* Read-only: the backend has no product-update endpoint yet. */}
        <dl className="space-y-3">
          {[
            ["Ad", product.name],
            ["Fiyat", formatPrice(product.price)],
            ["Stok", String(product.stock)],
            ["SKU", product.sku],
            ["Kategori", product.categoryResponse.name],
            ["Slug", product.slug],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-[13px] font-medium text-gray-500">{label}</dt>
              <dd className="text-[14px] text-gray-800 text-right break-all">
                {value}
              </dd>
            </div>
          ))}
          <div>
            <dt className="text-[13px] font-medium text-gray-500 mb-1">
              Açıklama
            </dt>
            <dd className="text-[14px] text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description || "—"}
            </dd>
          </div>
        </dl>

        {loadError && (
          <p role="alert" className="mt-4 text-[13px] text-red-600">
            {loadError}
          </p>
        )}

        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="mt-6 px-5 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-[14px] font-medium transition-all active:scale-[0.98]"
        >
          Ürünü Sil
        </button>
        {deleteError && (
          <p role="alert" className="mt-2 text-[13px] text-red-600">
            {deleteError}
          </p>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-[#e0e0e0] rounded-[16px] p-6 shadow-sm">
          <h2 className="font-serif text-[17px] font-semibold text-gray-800 mb-4">
            Görseller
          </h2>
          {product.imagesResponse.length === 0 ? (
            <p className="text-[14px] text-gray-500 mb-4">
              Henüz görsel yüklenmemiş.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 mb-5">
              {product.imagesResponse.map((image) => (
                <div key={image.id} className="text-center">
                  <div
                    className={`relative aspect-square rounded-xl overflow-hidden bg-surface border-2 ${
                      image.main ? "border-gold" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image.thumbnailPath ?? image.url}
                      alt=""
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSetMain(image.id)}
                    disabled={image.main || settingMainId === image.id}
                    className="mt-1.5 text-[12px] text-gold-dark hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
                  >
                    {image.main
                      ? "Ana görsel"
                      : settingMainId === image.id
                        ? "Ayarlanıyor..."
                        : "Ana görsel yap"}
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-3">
            <label
              htmlFor="images"
              className="block text-[13px] font-medium text-gray-600"
            >
              Yeni görsel yükle
            </label>
            <input
              id="images"
              name="files"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesPicked}
              className="block w-full text-[13px] text-gray-600 file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-gold file:text-gold-ink file:text-[13px] file:font-medium hover:file:bg-gold-dark hover:file:text-white file:transition-colors file:cursor-pointer"
            />

            {pendingImages.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                {pendingImages.map((pending, index) => (
                  <div key={`${pending.file.name}-${pending.file.lastModified}-${index}`}>
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-surface border border-[#e0e0e0]">
                      {/* eslint-disable-next-line @next/next/no-img-element -- ephemeral local blob: preview, next/image can't optimize it */}
                      <img
                        src={pending.url}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePending(index)}
                        aria-label={`${pending.file.name} seçimini kaldır`}
                        title="Seçimi kaldır"
                        className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-white/90 border border-black/5 text-gray-500 hover:text-red-600 shadow-sm transition-colors"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || pendingImages.length === 0}
              className="px-5 py-2.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[14px] font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading
                ? "Yükleniyor..."
                : pendingImages.length > 0
                  ? `Yükle (${pendingImages.length})`
                  : "Yükle"}
            </button>
          </form>

          {uploadError && (
            <p role="alert" className="mt-3 text-[13px] text-red-600">
              {uploadError}
            </p>
          )}
          {uploadResult && (
            <div className="mt-3 text-[13px]">
              {uploadResult.totalUploaded > 0 && (
                <p className="text-green-700">
                  {uploadResult.totalUploaded} görsel yüklendi.
                </p>
              )}
              {uploadResult.failed.map((failure) => (
                <p key={failure.filename} role="alert" className="text-red-600">
                  {failure.filename}: {failure.error}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Ürünü Sil"
        message={`"${product.name}" ürünü silinecek. Emin misiniz?`}
        confirmLabel="Sil"
        destructive
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
