import { create } from "zustand";
import { ApiError } from "@/services/api";
import { getFavorites, toggleFavorite } from "@/services/favorites";
import { getAccessToken } from "@/services/token-storage";
import type { ProductSummary } from "@/types";

type FavoritesStatus = "idle" | "loading" | "ready" | "error";

interface FavoritesState {
  /** Null until the first successful load (or while signed out). */
  items: ProductSummary[] | null;
  status: FavoritesStatus;
  /** Turkish backend message when status === "error". */
  error: string | null;
  /** Fetches favorites once for a signed-in user; concurrent calls are deduped. */
  load: () => Promise<void>;
  /** Optimistic add/remove; rolls back and rethrows on failure. */
  toggle: (product: ProductSummary) => Promise<void>;
  reset: () => void;
}

// Module-level so every mounted FavoriteButton shares one in-flight request.
let loadPromise: Promise<void> | null = null;

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
  items: null,
  status: "idle",
  error: null,

  load: () => {
    if (get().status === "ready" || !getAccessToken()) {
      return Promise.resolve();
    }
    loadPromise ??= (async () => {
      set({ status: "loading", error: null });
      try {
        const items = await getFavorites();
        set({ items, status: "ready" });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          // Session is over (refresh failed) — behave as signed out.
          set({ items: null, status: "idle" });
          return;
        }
        set({
          status: "error",
          error:
            err instanceof ApiError
              ? err.message
              : "Favoriler yüklenemedi. Lütfen tekrar deneyin.",
        });
      }
    })().finally(() => {
      loadPromise = null;
    });
    return loadPromise;
  },

  toggle: async (product) => {
    // Make sure the current list is in before flipping, so the first click
    // on a fresh page cannot be overwritten by a slower initial load.
    if (get().status !== "ready") {
      await get().load();
    }
    const previous = get().items;
    const items = previous ?? [];
    const isFavorite = items.some((f) => f.id === product.id);
    set({
      items: isFavorite
        ? items.filter((f) => f.id !== product.id)
        : [...items, product],
    });
    try {
      await toggleFavorite(product.id);
    } catch (err) {
      set({ items: previous });
      throw err;
    }
  },

  reset: () => {
    set({ items: null, status: "idle", error: null });
  },
}));
