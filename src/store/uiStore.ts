import { create } from "zustand";

interface UiState {
  /** Full-screen promo poster shown once you land in the app. */
  promoOpen: boolean;
  openPromo: () => void;
  closePromo: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  promoOpen: false,
  openPromo: () => set({ promoOpen: true }),
  closePromo: () => set({ promoOpen: false }),
}));
