import { create } from "zustand";
import { memberTiers, pointsHistory as initialHistory } from "../data/mock";
import type { PointsHistoryEntry } from "../data/types";
import { formatIndoDate } from "../utils/dates";

interface MemberState {
  points: number;
  totalSpend: number;
  totalTransactions: number;
  history: PointsHistoryEntry[];
  currentTier: () => (typeof memberTiers)[number];
  nextTier: () => (typeof memberTiers)[number] | undefined;
  spendProgress: () => number;
  transactionProgress: () => number;
  /**
   * Takes points off the balance and records it in Riwayat Poin. False,
   * and nothing changes, when the balance is short.
   */
  spendPoints: (amount: number, title: string) => boolean;
  /** Puts points back, e.g. from a cancelled order, and records it. */
  refundPoints: (amount: number, title: string) => void;
}

let spendSeq = 1;

export const useMemberStore = create<MemberState>((set, get) => ({
  points: 1000,
  totalSpend: 45000,
  totalTransactions: 3,
  history: initialHistory,
  currentTier: () => {
    const { totalSpend, totalTransactions } = get();
    let tier = memberTiers[0];
    for (const t of memberTiers) {
      if (totalSpend >= t.minSpend && totalTransactions >= t.minTransactions) {
        tier = t;
      }
    }
    return tier;
  },
  nextTier: () => {
    const current = get().currentTier();
    const idx = memberTiers.findIndex((t) => t.id === current.id);
    return memberTiers[idx + 1];
  },
  spendProgress: () => {
    const next = get().nextTier();
    if (!next) return 1;
    return Math.min(1, get().totalSpend / next.minSpend);
  },
  transactionProgress: () => {
    const next = get().nextTier();
    if (!next) return 1;
    return Math.min(1, get().totalTransactions / next.minTransactions);
  },
  spendPoints: (amount, title) => {
    if (amount <= 0 || get().points < amount) return false;
    set((s) => ({
      points: s.points - amount,
      history: [
        ...s.history,
        {
          id: `ph-spend-${spendSeq++}`,
          title,
          date: formatIndoDate(new Date()),
          points: -amount,
          type: "redeem",
        },
      ],
    }));
    return true;
  },
  refundPoints: (amount, title) => {
    if (amount <= 0) return;
    set((s) => ({
      points: s.points + amount,
      history: [
        ...s.history,
        {
          id: `ph-refund-${spendSeq++}`,
          title,
          date: formatIndoDate(new Date()),
          points: amount,
          type: "earn",
        },
      ],
    }));
  },
}));
