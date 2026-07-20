import { api } from "./api";
import type { Cart } from "@/types";

// All cart endpoints require auth; the {id} path segment is the PRODUCT id
// (cart items carry no id of their own).

export async function getCart(): Promise<Cart> {
  const { data } = await api.get<Cart>("/cart");
  return data;
}

export async function addCartItem(
  productId: number,
  quantity: number,
): Promise<Cart> {
  const { data } = await api.post<Cart>(`/cart/items/${productId}`, null, {
    params: { quantity },
  });
  return data;
}

/** Sets the line to an absolute quantity (not a delta). */
export async function updateCartItemQuantity(
  productId: number,
  quantity: number,
): Promise<Cart> {
  const { data } = await api.patch<Cart>(`/cart/items/${productId}`, null, {
    params: { quantity },
  });
  return data;
}

export async function removeCartItem(productId: number): Promise<Cart> {
  const { data } = await api.delete<Cart>(`/cart/items/${productId}`);
  return data;
}

/** Empties the cart; the response body is empty (not a Cart). */
export async function clearCart(): Promise<void> {
  await api.delete("/cart");
}
