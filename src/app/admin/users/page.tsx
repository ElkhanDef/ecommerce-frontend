import type { Metadata } from "next";
import UserLookup from "@/components/admin/UserLookup";

export const metadata: Metadata = { title: "Kullanıcılar" };

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-gray-800 mb-2">
        Kullanıcılar
      </h1>
      <p className="text-[14px] text-gray-500 mb-6">
        Backend henüz kullanıcı listeleme endpoint&apos;i sunmuyor — id ile tek
        tek sorgulayabilirsiniz.
      </p>
      <UserLookup />
    </div>
  );
}
