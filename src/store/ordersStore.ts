import { useMemo } from "react";
import { create } from "zustand";
import { orders as pastOrders } from "../data/mock";
import type { OrderRecord } from "../data/types";

interface OrdersState {
  /** Orders placed in the app this session, newest first. */
  placed: OrderRecord[];
  place: (order: OrderRecord) => void;
  update: (id: string, patch: Partial<OrderRecord>) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  placed: [],
  place: (order) => set((s) => ({ placed: [order, ...s.placed] })),
  update: (id, patch) =>
    set((s) => ({
      placed: s.placed.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    })),
}));

/** Every order Riwayat Pesanan lists: this session's, then the past ones. */
export function useAllOrders() {
  const placed = useOrdersStore((s) => s.placed);
  return useMemo(() => [...placed, ...pastOrders], [placed]);
}

/** One order by id, placed here or in the past. */
export function useOrderRecord(id: string | undefined) {
  const placed = useOrdersStore((s) => s.placed);
  if (!id) return undefined;
  return placed.find((o) => o.id === id) ?? pastOrders.find((o) => o.id === id);
}
