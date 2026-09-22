import { create } from "zustand";

interface AuthState {
  hasOnboarded: boolean;
  isLoggedIn: boolean;
  hasPin: boolean;
  phone: string;
  name: string;
  completeOnboarding: () => void;
  setPhone: (phone: string) => void;
  loginSuccess: () => void;
  setPin: () => void;
  unlock: () => void;
  logout: () => void;
  updateName: (name: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  hasOnboarded: false,
  isLoggedIn: false,
  hasPin: false,
  phone: "",
  name: "Amalia Putri",
  completeOnboarding: () => set({ hasOnboarded: true }),
  setPhone: (phone) => set({ phone }),
  loginSuccess: () => set({ isLoggedIn: true }),
  setPin: () => set({ hasPin: true }),
  unlock: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
  updateName: (name) => set({ name }),
}));
