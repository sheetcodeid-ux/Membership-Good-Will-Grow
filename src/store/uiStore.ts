import { create } from "zustand";

interface UiState {
  /** Full-screen promo poster shown once you land in the app. */
  promoOpen: boolean;
  openPromo: () => void;
  closePromo: () => void;
  /** Quick menu opened by the tab bar button on Member and Profile. */
  shortcutsOpen: boolean;
  openShortcuts: () => void;
  closeShortcuts: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  promoOpen: false,
  openPromo: () => set({ promoOpen: true }),
  closePromo: () => set({ promoOpen: false }),
  shortcutsOpen: false,
  openShortcuts: () => set({ shortcutsOpen: true }),
  closeShortcuts: () => set({ shortcutsOpen: false }),
}));
