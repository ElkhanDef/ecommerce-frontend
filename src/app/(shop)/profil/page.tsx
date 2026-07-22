import type { Metadata } from "next";
import ProfileDetails from "@/components/profile/ProfileDetails";
import AddressDetails from "@/components/profile/AddressDetails";

export const metadata: Metadata = {
  title: "Profilim",
  description: "Hesap ve adres bilgilerinizi yönetin.",
  robots: { index: false },
};

export default function ProfilePage() {
  return (
    <section className="max-w-4xl mx-auto">
      <h1 className="font-serif text-3xl font-semibold text-gray-800 mb-8">
        Profilim
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="font-serif text-xl font-semibold text-gray-800 mb-4">
            Hesap Bilgileri
          </h2>
          <ProfileDetails />
        </div>
        <div>
          <h2 className="font-serif text-xl font-semibold text-gray-800 mb-4">
            Adresim
          </h2>
          <AddressDetails />
        </div>
      </div>
    </section>
  );
}
