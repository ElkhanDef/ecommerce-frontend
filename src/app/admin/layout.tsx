import type { Metadata } from "next";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: {
    default: "Yönetim Paneli",
    template: "%s | Yönetim Paneli",
  },
  robots: { index: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
