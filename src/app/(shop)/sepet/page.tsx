import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Sepetim",
  description: "Sepetinizdeki ürünleri görüntüleyin ve düzenleyin.",
};

export default function CartPage() {
  return (
    <section aria-labelledby="cart-heading">
      <h1
        id="cart-heading"
        className="font-serif text-[24px] font-semibold text-gray-800 mb-6"
      >
        Sepetim
      </h1>
      <CartView />
    </section>
  );
}
