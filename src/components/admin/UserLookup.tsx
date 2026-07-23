"use client";

import { useState } from "react";
import { getUserForManagement } from "@/services/users";
import { ApiError } from "@/services/api";
import TextField from "@/components/ui/TextField";
import type { CurrentUser } from "@/types";

export default function UserLookup() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setUser(null);

    const id = Number(new FormData(event.currentTarget).get("userId"));
    if (!Number.isInteger(id) || id <= 0) {
      setError("Geçerli bir kullanıcı id'si girin.");
      return;
    }

    setLoading(true);
    try {
      setUser(await getUserForManagement(id));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Kullanıcı bulunamadı. Lütfen tekrar deneyin.",
      );
    } finally {
      setLoading(false);
    }
  }

  const fields = user
    ? [
        ["Ad", user.name],
        ["Soyad", user.lastName],
        ["E-posta", user.email],
        ["Telefon", user.phoneNumber ?? "—"],
        ["Rol", user.role],
        ["Durum", user.active ? "Aktif" : "Pasif"],
        ["Doğrulama", user.verified ? "Doğrulanmış" : "Doğrulanmamış"],
      ]
    : [];

  return (
    <div className="max-w-md">
      {/* No list-all-users endpoint exists yet — lookup is by id only. */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#e0e0e0] rounded-[16px] p-5 shadow-sm flex items-end gap-3"
      >
        <div className="flex-1">
          <TextField
            id="userId"
            name="userId"
            label="Kullanıcı ID"
            type="number"
            inputMode="numeric"
            min={1}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-gold hover:bg-gold-dark text-gold-ink hover:text-white rounded-xl text-[14px] font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Aranıyor..." : "Sorgula"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 text-[14px] text-red-600">
          {error}
        </p>
      )}

      {user && (
        <div className="mt-6 bg-white border border-[#e0e0e0] rounded-[16px] p-6 shadow-sm">
          <dl className="space-y-3">
            {fields.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-[13px] font-medium text-gray-500">{label}</dt>
                <dd className="text-[14px] text-gray-800 text-right break-all">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
