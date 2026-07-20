import type { Metadata } from "next";
import ProfileDetails from "@/components/profile/ProfileDetails";

export const metadata: Metadata = {
  title: "Profilim",
  description: "Hesap bilgilerinizi yönetin.",
  robots: { index: false },
};

export default function ProfilePage() {
  return (
    <section>
      <h1 className="font-serif text-3xl font-semibold text-gray-800 mb-6">
        Profilim
      </h1>
      <ProfileDetails />
    </section>
  );
}
