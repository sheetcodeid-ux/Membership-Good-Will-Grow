import type { RefObject } from "react";
import type { View } from "react-native";
import { create } from "zustand";

interface BlurTargetState {
  /**
   * Each tab screen's blur target, by route key. On Android a BlurView
   * only blurs what sits inside the BlurTargetView it is pointed at, so
   * the tab bar looks up the one around the tab on show.
   */
  targets: Record<string, RefObject<View | null>>;
  register: (key: string, ref: RefObject<View | null>) => void;
  unregister: (key: string) => void;
}

export const useBlurTargetStore = create<BlurTargetState>((set) => ({
  targets: {},
  register: (key, ref) =>
    set((s) => ({ targets: { ...s.targets, [key]: ref } })),
  unregister: (key) =>
    set((s) => {
      const next = { ...s.targets };
      delete next[key];
      return { targets: next };
    }),
}));
