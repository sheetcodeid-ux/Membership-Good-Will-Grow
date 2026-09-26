import { getOutlet } from "../data/mock";
import type { CartLine, Coupon } from "../data/types";
import { unitPrice, useCartStore } from "../store/cartStore";
import { useCouponStore } from "../store/couponStore";
import { useMemberStore } from "../store/memberStore";
import { useOrderStore } from "../store/orderStore";
import { useVoucherStore } from "../store/voucherStore";
import { checkCoupon } from "../utils/coupons";
import { computeBreakdown } from "../utils/pricing";

/** Every coupon and voucher the member holds, as one list. */
export function useHeldCoupons() {
  const mine = useCouponStore((s) => s.mine);
  const vouchers = useVoucherStore((s) => s.vouchers);
  return [...vouchers, ...mine];
}

/** Whether a held coupon is a voucher from Voucher Saya. */
export const isVoucher = (c: Coupon) => c.id.startsWith("vc-");

/** Spends a coupon or voucher on a placed order. */
export function markCouponUsed(id: string) {
  if (isVoucher({ id } as Coupon)) useVoucherStore.getState().markUsed(id);
  else useCouponStore.getState().markUsed(id);
}

/** Gives a coupon or voucher back, when its order is cancelled. */
export function restoreCoupon(id: string) {
  if (isVoucher({ id } as Coupon)) useVoucherStore.getState().restore(id);
  else useCouponStore.getState().restore(id);
}

/**
 * The order's money from the cart: the coupon it holds (if it still
 * applies to the cart and outlet), then PB1, rounding and points on what
 * is left. Pure, so checkout (through the hook) and placing the order
 * (from the stores' current state) work it out the same way.
 */
export function resolveCheckout(input: {
  lines: CartLine[];
  usePoints: boolean;
  couponId?: string;
  points: number;
  outletId: string;
  held: Coupon[];
}) {
  const outlet = getOutlet(input.outletId);
  const subtotal = input.lines.reduce(
    (sum, l) => sum + unitPrice(l.menuItem, l.selections) * l.qty,
    0,
  );
  const coupon = input.couponId
    ? input.held.find((c) => c.id === input.couponId)
    : undefined;
  const check = coupon
    ? checkCoupon(coupon, input.lines, outlet?.brandId)
    : undefined;
  const discount = check?.ok ? check.amount : 0;
  const breakdown = computeBreakdown(
    subtotal,
    input.usePoints,
    input.points,
    discount,
  );
  return { breakdown, coupon, check, outlet };
}

/** The checkout's figures, live from the stores. */
export function useCheckout() {
  const lines = useCartStore((s) => s.lines);
  const usePoints = useCartStore((s) => s.usePoints);
  const couponId = useCartStore((s) => s.couponId);
  const points = useMemberStore((s) => s.points);
  const outletId = useOrderStore((s) => s.outletId);
  const held = useHeldCoupons();
  const resolved = resolveCheckout({
    lines,
    usePoints,
    couponId,
    points,
    outletId,
    held,
  });
  return { ...resolved, held, lines };
}

/** The same figures from the stores as they are right now, outside React. */
export function checkoutNow() {
  const cart = useCartStore.getState();
  return resolveCheckout({
    lines: cart.lines,
    usePoints: cart.usePoints,
    couponId: cart.couponId,
    points: useMemberStore.getState().points,
    outletId: useOrderStore.getState().outletId,
    held: [
      ...useVoucherStore.getState().vouchers,
      ...useCouponStore.getState().mine,
    ],
  });
}
