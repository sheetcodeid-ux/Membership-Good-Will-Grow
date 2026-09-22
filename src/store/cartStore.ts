import { create } from "zustand";
import type { CartLine, MenuItem, ServiceType } from "../data/types";
import { toppingPool } from "../data/mock";

interface CartState {
  outletId?: string;
  fulfillment: ServiceType;
  lines: CartLine[];
  pickupMethod: "self" | "table";
  tableNote: string;
  usePoints: boolean;
  setOutlet: (outletId: string) => void;
  setFulfillment: (type: ServiceType) => void;
  setPickupMethod: (m: "self" | "table") => void;
  setTableNote: (note: string) => void;
  toggleUsePoints: () => void;
  addLine: (menuItem: MenuItem, qty: number, toppingIds: string[], notes?: string) => void;
  updateLineQty: (lineId: string, qty: number) => void;
  removeLine: (lineId: string) => void;
  clear: () => void;
  lineTotal: (line: CartLine) => number;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  outletId: undefined,
  fulfillment: "dine_in",
  lines: [],
  pickupMethod: "table",
  tableNote: "",
  usePoints: false,
  setOutlet: (outletId) => set({ outletId }),
  setFulfillment: (fulfillment) => set({ fulfillment }),
  setPickupMethod: (pickupMethod) => set({ pickupMethod }),
  setTableNote: (tableNote) => set({ tableNote }),
  toggleUsePoints: () => set((state) => ({ usePoints: !state.usePoints })),
  addLine: (menuItem, qty, toppingIds, notes) =>
    set((state) => ({
      lines: [
        ...state.lines,
        {
          lineId: `${menuItem.id}-${Date.now()}`,
          menuItem,
          qty,
          toppingIds,
          notes,
        },
      ],
    })),
  updateLineQty: (lineId, qty) =>
    set((state) => ({
      lines:
        qty <= 0
          ? state.lines.filter((l) => l.lineId !== lineId)
          : state.lines.map((l) => (l.lineId === lineId ? { ...l, qty } : l)),
    })),
  removeLine: (lineId) =>
    set((state) => ({ lines: state.lines.filter((l) => l.lineId !== lineId) })),
  clear: () => set({ lines: [], outletId: undefined }),
  lineTotal: (line) => {
    const toppingsPrice = line.toppingIds.reduce((sum, id) => {
      const t = toppingPool.find((tp) => tp.id === id);
      return sum + (t?.price ?? 0);
    }, 0);
    return (line.menuItem.price + toppingsPrice) * line.qty;
  },
  subtotal: () => {
    const { lines, lineTotal } = get();
    return lines.reduce((sum, l) => sum + lineTotal(l), 0);
  },
  itemCount: () => get().lines.reduce((sum, l) => sum + l.qty, 0),
}));
