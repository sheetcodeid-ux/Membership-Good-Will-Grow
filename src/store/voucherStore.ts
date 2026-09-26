import { create } from "zustand";
import { voucherCodes } from "../data/mock";
import type { Coupon } from "../data/types";

export type ClaimResult =
  | { ok: true; voucher: Coupon }
  | { ok: false; reason: "invalid" | "claimed" };

interface VoucherState {
  vouchers: Coupon[];
  /** Codes already turned into vouchers, so each works once. */
  claimed: string[];
  claim: (code: string) => ClaimResult;
}

export const useVoucherStore = create<VoucherState>((set, get) => ({
  vouchers: [],
  claimed: [],
  claim: (raw) => {
    const code = raw.trim().toUpperCase();
    const template = voucherCodes[code];
    if (!template) return { ok: false, reason: "invalid" };
    if (get().claimed.includes(code)) return { ok: false, reason: "claimed" };
    const voucher: Coupon = { ...template, id: `vc-${code}`, used: false };
    set((s) => ({
      vouchers: [voucher, ...s.vouchers],
      claimed: [...s.claimed, code],
    }));
    return { ok: true, voucher };
  },
}));
