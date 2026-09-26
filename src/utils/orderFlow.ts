import { outletFullName } from "../data/mock";
import type { CartLine, OrderRecord } from "../data/types";
import {
  checkoutNow,
  markCouponUsed,
  restoreCoupon,
} from "../hooks/useCheckout";
import { unitPrice, useCartStore } from "../store/cartStore";
import { useMemberStore } from "../store/memberStore";
import { useOrderStore } from "../store/orderStore";
import { useOrdersStore } from "../store/ordersStore";
import { MONTHS } from "./dates";

/** How long after placing an order it can still be cancelled. */
export const CANCEL_WINDOW_MS = 60_000;
/** Minutes the kitchen is given to have an order ready. */
export const READY_MINUTES = 15;

const NOTA_PREFIX: Record<string, string> = {
  nordu: "NRD",
  cattu: "CTU",
  "lesung-pipi": "LSP",
  "ayam-busari": "BSR",
};

const pad = (n: number, w = 2) => String(n).padStart(w, "0");

/** "26 Sep 2026, 19:06", the way Riwayat Pesanan stores dates. */
export function orderDate(d: Date) {
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** "19:06". */
export function clock(ms: number) {
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** The variant the line was ordered in, e.g. "Original" or "Level 3". */
function variantOf(line: CartLine) {
  for (const group of line.menuItem.optionGroups) {
    if (group.selection !== "single") continue;
    const picked = group.options.find((o) => (line.selections[o.id] ?? 0) > 0);
    if (picked) return picked.name;
  }
  return "Original";
}

/**
 * Turns the cart into an order: records it (Riwayat Pesanan and Status
 * Pesanan read it from here on), spends the coupon and the points it
 * used, and empties the cart. Returns the new order's id, or undefined
 * when there is nothing to order.
 *
 * Paid in full by points it is paid at once; otherwise it waits for QRIS
 * or for the cashier.
 */
export function placeOrder(): string | undefined {
  const cart = useCartStore.getState();
  const { serviceType } = useOrderStore.getState();
  const { breakdown, coupon, check, outlet } = checkoutNow();
  if (!outlet || cart.lines.length === 0) return undefined;

  const now = new Date();
  const stamp = now.getTime();
  const count = useOrdersStore.getState().placed.length;
  const free = breakdown.finalTotal === 0;
  const discounted = coupon && check?.ok ? coupon : undefined;

  const order: OrderRecord = {
    id: `ord-app-${stamp}`,
    brandId: outlet.brandId,
    outletId: outlet.id,
    outletName: outletFullName(outlet),
    nota: `${NOTA_PREFIX[outlet.brandId] ?? "GWG"}/${pad(now.getDate())}/${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${pad(now.getMilliseconds(), 3)}`,
    orderCode: pad(128 + count, 4),
    transactionId: `01a0cbea-ab82-72a0-93f8-${String(stamp).slice(-12)}`,
    createdAt: orderDate(now),
    status: free ? "dibayar" : "belum-bayar",
    channel: "member-apps",
    serviceType,
    paymentMethod: free
      ? "Poin"
      : cart.payMethod === "cashier"
        ? "Bayar di kasir"
        : "QRIS",
    lines: cart.lines.map((l) => ({
      id: l.lineId,
      name: l.menuItem.name,
      qty: l.qty,
      variant: variantOf(l),
      unitPrice: unitPrice(l.menuItem, l.selections),
    })),
    subtotal: breakdown.subtotal,
    tax: breakdown.tax,
    rounding: breakdown.rounding,
    paid: breakdown.finalTotal,
    note: cart.orderNote.trim() || undefined,
    placedAt: stamp,
    paidAt: free ? stamp : undefined,
    couponId: discounted?.id,
    couponTitle: discounted?.title,
    couponDiscount: breakdown.couponDiscount || undefined,
    pointsUsed: breakdown.pointsDiscount || undefined,
    pickup: cart.pickup,
    tableNumber: cart.pickup === "table" ? cart.tableNumber : undefined,
    cutlery: cart.cutlery,
    gift: cart.gift,
  };

  if (discounted) markCouponUsed(discounted.id);
  if (breakdown.pointsDiscount > 0) {
    useMemberStore
      .getState()
      .spendPoints(
        breakdown.pointsDiscount,
        `Pakai Poin - ${order.outletName}`,
      );
  }
  useOrdersStore.getState().place(order);
  cart.clear();
  return order.id;
}

/** QRIS went through: the outlet's clock starts from the payment. */
export function markOrderPaid(id: string) {
  useOrdersStore.getState().update(id, {
    status: "dibayar",
    paymentMethod: "QRIS",
    placedAt: Date.now(),
    paidAt: Date.now(),
  });
}

/** Cancels an order and gives back its coupon and points. */
export function cancelOrder(order: OrderRecord) {
  useOrdersStore.getState().update(order.id, { status: "dibatalkan" });
  if (order.couponId) restoreCoupon(order.couponId);
  if (order.pointsUsed) {
    useMemberStore
      .getState()
      .refundPoints(
        order.pointsUsed,
        `Pengembalian Poin - ${order.outletName}`,
      );
  }
}

/**
 * Where a placed order stands, from the time since it was placed:
 * 0 waiting for the outlet (still cancellable), 1 being prepared,
 * 2 ready to collect, 3 done.
 */
export function orderStage(order: OrderRecord, now: number) {
  if (!order.placedAt) return 3;
  const elapsed = now - order.placedAt;
  if (elapsed < CANCEL_WINDOW_MS) return 0;
  if (elapsed < READY_MINUTES * 60_000) return 1;
  if (elapsed < (READY_MINUTES + 10) * 60_000) return 2;
  return 3;
}
