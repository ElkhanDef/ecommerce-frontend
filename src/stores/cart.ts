import { create } from "zustand";
import { ApiError } from "@/services/api";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
} from "@/services/cart";
import { getAccessToken } from "@/services/token-storage";
import type { Cart } from "@/types";

type CartStatus = "idle" | "loading" | "ready" | "error";

interface CartState {
  /** Null until the first successful load (or while signed out). */
  cart: Cart | null;
  status: CartStatus;
  /** Turkish backend message when status === "error". */
  error: string | null;
  /** Fetches the cart once for a signed-in user; concurrent calls are deduped. */
  load: () => Promise<void>;
  add: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  remove: (productId: number) => Promise<void>;
  clear: () => Promise<void>;
  reset: () => void;
}

// Module-level so every consumer shares one in-flight request.
let loadPromise: Promise<void> | null = null;

/** Every mutation returns the full cart — no optimistic bookkeeping needed. */
export const useCartStore = create<CartState>()((set, get) => ({
  cart: null,
  status: "idle",
  error: null,

  load: () => {
    if (get().status === "ready" || !getAccessToken()) {
      return Promise.resolve();
    }
    loadPromise ??= (async () => {
      set({ status: "loading", error: null });
      try {
        const cart = await getCart();
        set({ cart, status: "ready" });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          // Session is over (refresh failed) — behave as signed out.
          set({ cart: null, status: "idle" });
          return;
        }
        set({
          status: "error",
          error:
            err instanceof ApiError
              ? err.message
              : "Sepet yüklenemedi. Lütfen tekrar deneyin.",
        });
      }
    })().finally(() => {
      loadPromise = null;
    });
    return loadPromise;
  },

  add: async (productId, quantity) => {
    const cart = await addCartItem(productId, quantity);
    set({ cart, status: "ready", error: null });
  },

  updateQuantity: async (productId, quantity) => {
    const cart = await updateCartItemQuantity(productId, quantity);
    set({ cart, status: "ready", error: null });
  },

  remove: async (productId) => {
    const cart = await removeCartItem(productId);
    set({ cart, status: "ready", error: null });
  },

  clear: async () => {
    await clearCart();
    const current = get().cart;
    // DELETE /cart returns no body — empty the cart locally.
    set({
      cart: current
        ? { ...current, message: null, totalQuantity: 0, totalPrice: 0, cartItems: [] }
        : null,
      error: null,
    });
  },

  reset: () => {
    set({ cart: null, status: "idle", error: null });
  },
}));
