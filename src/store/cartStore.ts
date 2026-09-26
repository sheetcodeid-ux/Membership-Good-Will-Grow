import { create } from "zustand";
import type { CartLine, MenuItem, MenuOptionGroup, OrderGift } from "../data/types";

/** How the order is paid: QRIS in the app, or at the cashier. */
export type PayMethod = "qris" | "cashier";

/** Every single-select group starts on its first option, matching the sheet. */
export function defaultSelections(groups: MenuOptionGroup[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const g of groups) {
    if (g.selection === "single" && g.options[0]) out[g.options[0].id] = 1;
  }
  return out;
}

/** Price of one unit: the chosen options, added up. */
export function unitPrice(item: MenuItem, selections: Record<string, number>) {
  let total = 0;
  for (const group of item.optionGroups) {
    for (const option of group.options) {
      total += option.price * (selections[option.id] ?? 0);
    }
  }
  return total;
}

/** Names of the picked add-ons, for the cart and order summary. Free choices
 *  such as the sweetness level are left out so the line stays short. */
export function selectionSummary(item: MenuItem, selections: Record<string, number>) {
  const parts: string[] = [];
  for (const group of item.optionGroups) {
    for (const option of group.options) {
      const qty = selections[option.id] ?? 0;
      if (qty > 0 && option.price > 0) {
        parts.push(qty > 1 ? `${option.name} x${qty}` : option.name);
      }
    }
  }
  return parts;
}

interface CartState {
  lines: CartLine[];
  usePoints: boolean;
  /** Free-text note attached to the whole order at checkout. */
  orderNote: string;
  pickup: "self" | "table";
  tableNumber: string;
  couponId?: string;
  payMethod: PayMethod;
  /** The member asked for cutlery or straws; off by default, less waste. */
  cutlery: boolean;
  gift?: OrderGift;
  addLine: (menuItem: MenuItem, qty: number, selections: Record<string, number>, note?: string) => void;
  updateLine: (lineId: string, qty: number, selections: Record<string, number>, note?: string) => void;
  setLineQty: (lineId: string, qty: number) => void;
  setLineNote: (lineId: string, note: string) => void;
  removeLine: (lineId: string) => void;
  clear: () => void;
  toggleUsePoints: () => void;
  setOrderNote: (note: string) => void;
  setPickup: (pickup: "self" | "table") => void;
  setTableNumber: (value: string) => void;
  setCoupon: (couponId?: string) => void;
  setPayMethod: (payMethod: PayMethod) => void;
  setCutlery: (cutlery: boolean) => void;
  setGift: (gift?: OrderGift) => void;
  lineTotal: (line: CartLine) => number;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  lines: [],
  usePoints: false,
  orderNote: "",
  pickup: "self",
  tableNumber: "",
  couponId: undefined,
  payMethod: "qris",
  cutlery: false,
  gift: undefined,
  addLine: (menuItem, qty, selections, note) =>
    set((state) => ({
      lines: [
        ...state.lines,
        { lineId: `${menuItem.id}-${Date.now()}`, menuItem, qty, selections, note },
      ],
    })),
  updateLine: (lineId, qty, selections, note) =>
    set((state) => ({
      lines: state.lines.map((l) =>
        l.lineId === lineId ? { ...l, qty, selections, note } : l
      ),
    })),
  setLineQty: (lineId, qty) =>
    set((state) => ({
      lines:
        qty <= 0
          ? state.lines.filter((l) => l.lineId !== lineId)
          : state.lines.map((l) => (l.lineId === lineId ? { ...l, qty } : l)),
    })),
  setLineNote: (lineId, note) =>
    set((state) => ({
      lines: state.lines.map((l) => (l.lineId === lineId ? { ...l, note } : l)),
    })),
  removeLine: (lineId) =>
    set((state) => ({ lines: state.lines.filter((l) => l.lineId !== lineId) })),
  clear: () =>
    set({
      lines: [],
      orderNote: "",
      tableNumber: "",
      couponId: undefined,
      usePoints: false,
      cutlery: false,
      gift: undefined,
    }),
  toggleUsePoints: () => set((state) => ({ usePoints: !state.usePoints })),
  setOrderNote: (orderNote) => set({ orderNote }),
  setPickup: (pickup) => set({ pickup }),
  setTableNumber: (tableNumber) => set({ tableNumber }),
  setCoupon: (couponId) => set({ couponId }),
  setPayMethod: (payMethod) => set({ payMethod }),
  setCutlery: (cutlery) => set({ cutlery }),
  setGift: (gift) => set({ gift }),
  lineTotal: (line) => unitPrice(line.menuItem, line.selections) * line.qty,
  subtotal: () => get().lines.reduce((sum, l) => sum + get().lineTotal(l), 0),
  itemCount: () => get().lines.reduce((sum, l) => sum + l.qty, 0),
}));
