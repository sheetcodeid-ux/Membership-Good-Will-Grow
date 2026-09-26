import { create } from "zustand";

export type ToastTone = "success" | "info" | "error";

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastState {
  toast?: Toast;
  show: (message: string, tone?: ToastTone) => void;
  hide: (id: number) => void;
}

let next = 1;

/** One toast at a time; a new one replaces whatever is showing. */
export const useToastStore = create<ToastState>((set) => ({
  toast: undefined,
  show: (message, tone = "success") =>
    set({ toast: { id: next++, message, tone } }),
  hide: (id) => set((s) => (s.toast?.id === id ? { toast: undefined } : s)),
}));

/** Shorthand for call sites outside React. */
export function showToast(message: string, tone: ToastTone = "success") {
  useToastStore.getState().show(message, tone);
}
