"use client";

import { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/categories";
import { ApiError } from "@/services/api";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TextField from "@/components/ui/TextField";
import type { Category } from "@/types";

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  function load() {
    getCategories()
      .then((data) => {
        setCategories(data);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        setLoadError(
          err instanceof ApiError
            ? err.message
            : "Kategoriler yüklenemedi. Lütfen tekrar deneyin.",
        );
      });
  }

  useEffect(load, []);

  function startEdit(category: Category) {
    setEditing(category);
    setName(category.name);
    setFormError(null);
  }

  function cancelEdit() {
    setEditing(null);
    setName("");
    setFormError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      if (editing) {
        await updateCategory(editing.id, { name });
      } else {
        await createCategory({ name });
      }
      cancelEdit();
      load();
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : "Kategori kaydedilemedi. Lütfen tekrar deneyin.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirmed() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await deleteCategory(target.id);
      load();
    } catch (err) {
      setLoadError(
        err instanceof ApiError
          ? err.message
          : "Kategori silinemedi. Lütfen tekrar deneyin.",
      );
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#e0e0e0] rounded-[16px] p-5 shadow-sm space-y-4"
      >
        <h2 className="font-serif text-[17px] font-semibold text-gray-800">
          {editing ? "Kategoriyi Düzenle" : "Yeni Kategori"}
        </h2>
        {formError && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-700"
          >
            {formError}
          </div>
        )}
        <TextField
          id="category-name"
          name="name"
          label="Ad"
          type="text"
          placeholder="ör. Vazolar"
          minLength={2}
          maxLength={50}
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[14px] font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Kaydediliyor..." : editing ? "Kaydet" : "Ekle"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-xl text-[14px] font-medium transition-all active:scale-[0.98]"
            >
              Vazgeç
            </button>
          )}
        </div>
      </form>

      <div className="bg-white border border-[#e0e0e0] rounded-[16px] shadow-sm overflow-hidden">
        {loadError && (
          <p role="alert" className="p-5 text-[14px] text-red-600">
            {loadError}
          </p>
        )}
        {!loadError && categories === null && (
          <div className="py-12 flex justify-center">
            <span
              className="w-6 h-6 rounded-full border-2 border-gold-light border-t-gold-dark animate-spin"
              aria-hidden="true"
            />
          </div>
        )}
        {categories?.length === 0 && (
          <p className="p-5 text-[14px] text-gray-500">
            Henüz kategori bulunmuyor.
          </p>
        )}
        {categories && categories.length > 0 && (
          <ul>
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[#f0f0f0] last:border-b-0"
              >
                <div>
                  <p className="text-[14px] font-medium text-gray-800">
                    {category.name}
                  </p>
                  <p className="text-[12px] text-gray-400">
                    {category.slug ?? "slug yok"}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(category)}
                    className="px-3.5 py-1.5 border border-gray-300 hover:bg-gray-50 rounded-lg text-[13px] font-medium transition-all active:scale-[0.98]"
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(category)}
                    className="px-3.5 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-[13px] font-medium transition-all active:scale-[0.98]"
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Kategoriyi Sil"
        message={`"${deleteTarget?.name}" kategorisi silinecek. Emin misiniz?`}
        confirmLabel="Sil"
        destructive
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
