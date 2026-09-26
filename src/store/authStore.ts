import { create } from "zustand";

export type Gender = "male" | "female";

/** Everything Detail Profil prints and Edit Profil writes back. */
export interface ProfileFields {
  name: string;
  username: string;
  email: string;
  /** Stored as shown, e.g. "12 Agustus 1998"; older "12/08/1998" still reads. */
  birthDate: string;
  gender?: Gender;
  province: string;
  regency: string;
  district: string;
  village: string;
  address: string;
  bio: string;
}

interface AuthState extends ProfileFields {
  hasOnboarded: boolean;
  isLoggedIn: boolean;
  hasPin: boolean;
  phone: string;
  /** Code the member shares from the Account card and Kode Referal. */
  referralCode: string;
  /** Friends who joined with the code, and the coupons that earned. */
  referralJoined: number;
  referralRewards: number;
  completeOnboarding: () => void;
  setPhone: (phone: string) => void;
  loginSuccess: () => void;
  setPin: () => void;
  unlock: () => void;
  logout: () => void;
  updateName: (name: string) => void;
  updateProfile: (patch: Partial<ProfileFields>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  hasOnboarded: false,
  isLoggedIn: false,
  hasPin: false,
  phone: "81234567890",
  referralCode: "GWGRW7QX",
  referralJoined: 0,
  referralRewards: 0,
  name: "Amalia Putri",
  username: "amaliaputri",
  email: "",
  birthDate: "",
  gender: "female",
  province: "",
  regency: "",
  district: "",
  village: "",
  address: "",
  bio: "",
  completeOnboarding: () => set({ hasOnboarded: true }),
  setPhone: (phone) => set({ phone }),
  loginSuccess: () => set({ isLoggedIn: true }),
  setPin: () => set({ hasPin: true }),
  unlock: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
  updateName: (name) => set({ name }),
  updateProfile: (patch) => set(patch),
}));

/** Renders a stored number the way Indonesian members write it: 08xx…. */
/**
 * The number as the account screen shows it: +62 and the national part.
 *
 * `localPhone` stays for the places that ask for the 08 form people type;
 * this is the one for display, where the country code is part of the
 * identity rather than noise.
 */
export function intlPhone(phone: string) {
  const digits = phone.replace(/[^0-9]/g, "");
  const national = digits.startsWith("62")
    ? digits.slice(2)
    : digits.startsWith("0")
      ? digits.slice(1)
      : digits;
  return `+62${national}`;
}

export function localPhone(phone: string) {
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.startsWith("62")) return `0${digits.slice(2)}`;
  if (digits.startsWith("0")) return digits;
  return `0${digits}`;
}
