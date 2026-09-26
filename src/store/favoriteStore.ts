import { create } from "zustand";

interface FavoriteState {
  /** Menu item ids the member saved from the product sheet. */
  ids: string[];
  toggle: (id: string) => void;
}

export const useFavoriteStore = create<FavoriteState>((set) => ({
  ids: [],
  toggle: (id) =>
    set((s) => ({
      ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
    })),
}));
