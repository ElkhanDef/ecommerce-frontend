import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Sepetim",
  description: "Sepetinizdeki ürünleri görüntüleyin ve düzenleyin.",
};

export default function CartPage() {
  return (
    <section aria-labelledby="cart-heading">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-8 h-[3px] rounded-full bg-gradient-to-r from-gold-dark to-gold-light" aria-hidden="true" />
        <h1
          id="cart-heading"
          className="font-serif text-[24px] font-semibold text-gray-800"
        >
          Sepetim
        </h1>
      </div>
      <CartView />
    </section>
  );
}
