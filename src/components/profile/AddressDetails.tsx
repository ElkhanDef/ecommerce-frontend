"use client";

import { useEffect, useState } from "react";
import {
  createAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} from "@/services/addresses";
import { ApiError } from "@/services/api";
import TextField from "@/components/ui/TextField";
import TextAreaField from "@/components/ui/TextAreaField";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Address } from "@/types";

type Status = "loading" | "view" | "form";

export default function AddressDetails() {
  const [status, setStatus] = useState<Status>("loading");
  const [address, setAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    getAddress()
      .then((data) => {
        setAddress(data);
        setStatus("view");
      })
      // No address saved yet (or a transient error) — offer the create form either way.
      .catch(() => {
        setAddress(null);
        setStatus("form");
      });
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      city: String(formData.get("city") ?? ""),
      district: String(formData.get("district") ?? ""),
      fullAddress: String(formData.get("fullAddress") ?? ""),
      postalCode: String(formData.get("postalCode") ?? ""),
    };

    try {
      const saved = address
        ? await updateAddress(payload)
        : await createAddress(payload);
      setAddress(saved);
      setStatus("view");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.validationErrors) {
          setFieldErrors(err.validationErrors);
        } else {
          setError(err.message);
        }
      } else {
        setError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirmed() {
    setConfirmDelete(false);
    setError(null);
    setDeleting(true);
    try {
      await deleteAddress();
      setAddress(null);
      setStatus("form");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
      );
    } finally {
      setDeleting(false);
    }
  }

  if (status === "loading") {
    return (
      <div role="status" className="py-16 flex flex-col items-center gap-3 text-[14px] text-gray-500">
        <span className="w-6 h-6 rounded-full border-2 border-gold-light border-t-gold-dark animate-spin" aria-hidden="true" />
        Adres bilgileriniz yükleniyor...
      </div>
    );
  }

  if (status === "view" && address) {
    const fields = [
      { label: "İl", value: address.city },
      { label: "İlçe", value: address.district },
      { label: "Adres", value: address.fullAddress },
      { label: "Posta Kodu", value: address.postalCode },
    ];

    return (
      <div>
        {error && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-700 mb-4"
          >
            {error}
          </div>
        )}
        <div className="bg-white border border-[#e0e0e0] rounded-[16px] p-6 mb-6 shadow-sm">
          <dl className="space-y-4">
            {fields.map((field) => (
              <div key={field.label} className="flex justify-between gap-4">
                <dt className="text-[13px] font-medium text-gray-500">
                  {field.label}
                </dt>
                <dd className="text-[14px] text-gray-800 text-right break-words">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStatus("form")}
            className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-xl text-[14px] font-medium transition-all active:scale-[0.98]"
          >
            Düzenle
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            disabled={deleting}
            className="px-5 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-[14px] font-medium transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {deleting ? "Siliniyor..." : "Sil"}
          </button>
        </div>

        <ConfirmDialog
          open={confirmDelete}
          title="Adresi Sil"
          message="Adresiniz silinecek. Emin misiniz?"
          confirmLabel="Sil"
          destructive
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmDelete(false)}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-700"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <TextField
          id="city"
          name="city"
          label="İl"
          type="text"
          placeholder="İstanbul"
          maxLength={100}
          required
          defaultValue={address?.city}
          error={fieldErrors.city}
        />
        <TextField
          id="district"
          name="district"
          label="İlçe"
          type="text"
          placeholder="Kadıköy"
          maxLength={100}
          required
          defaultValue={address?.district}
          error={fieldErrors.district}
        />
      </div>

      <TextAreaField
        id="fullAddress"
        name="fullAddress"
        label="Açık Adres"
        placeholder="Mahalle, sokak, bina no, daire no"
        rows={3}
        maxLength={500}
        required
        defaultValue={address?.fullAddress}
        error={fieldErrors.fullAddress}
      />

      <TextField
        id="postalCode"
        name="postalCode"
        label="Posta Kodu"
        type="text"
        inputMode="numeric"
        pattern="[0-9]{5}"
        placeholder="34000"
        minLength={5}
        maxLength={5}
        required
        defaultValue={address?.postalCode}
        error={fieldErrors.postalCode}
      />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[14px] font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Kaydediliyor..." : address ? "Kaydet" : "Adres Ekle"}
        </button>
        {address && (
          <button
            type="button"
            onClick={() => {
              setError(null);
              setFieldErrors({});
              setStatus("view");
            }}
            className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-xl text-[14px] font-medium transition-all active:scale-[0.98]"
          >
            Vazgeç
          </button>
        )}
      </div>
    </form>
  );
}
