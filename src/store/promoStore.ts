import { create } from "zustand";

interface PromoState {
  claimedIds: string[];
  claim: (id: string) => void;
  isClaimed: (id: string) => boolean;
}

export const usePromoStore = create<PromoState>((set, get) => ({
  claimedIds: [],
  claim: (id) => set((state) => ({ claimedIds: [...new Set([...state.claimedIds, id])] })),
  isClaimed: (id) => get().claimedIds.includes(id),
}));
