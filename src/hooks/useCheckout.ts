import { getOutlet } from "../data/mock";
import type { Coupon } from "../data/types";
import { useCartStore } from "../store/cartStore";
import { useCouponStore } from "../store/couponStore";
import { useMemberStore } from "../store/memberStore";
import { useOrderStore } from "../store/orderStore";
import { useVoucherStore } from "../store/voucherStore";
import { checkCoupon, type CouponCheck } from "../utils/coupons";
import { computeBreakdown } from "../utils/pricing";

/** Every coupon and voucher the member holds, as one list. */
export function useHeldCoupons() {
  const mine = useCouponStore((s) => s.mine);
  const vouchers = useVoucherStore((s) => s.vouchers);
  return [...vouchers, ...mine];
}

/** Whether a held coupon is a voucher from Voucher Saya. */
export const isVoucher = (c: Coupon) => c.id.startsWith("vc-");

/** Spends a coupon or voucher once its order is paid. */
export function markCouponUsed(id: string) {
  if (id.startsWith("vc-")) useVoucherStore.getState().markUsed(id);
  else useCouponStore.getState().markUsed(id);
}

/**
 * The order's money, the same on checkout, QRIS and the receipt: the
 * coupon the cart holds (if it still applies to the cart and outlet), then
 * PB1, rounding and points on what is left.
 *
 * `paid` is for the receipt: the coupon was marked used as the payment went
 * through, and should still show as taken off this order.
 */
export function useCheckout({ paid = false }: { paid?: boolean } = {}) {
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const usePoints = useCartStore((s) => s.usePoints);
  const couponId = useCartStore((s) => s.couponId);
  const points = useMemberStore((s) => s.points);
  const outletId = useOrderStore((s) => s.outletId);
  const outlet = getOutlet(outletId);
  const held = useHeldCoupons();

  const coupon = couponId ? held.find((c) => c.id === couponId) : undefined;
  const check: CouponCheck | undefined = coupon
    ? checkCoupon(coupon, lines, outlet?.brandId, { ignoreUsed: paid })
    : undefined;
  const discount = check?.ok ? check.amount : 0;
  const breakdown = computeBreakdown(subtotal, usePoints, points, discount);

  return { breakdown, coupon, check, held, lines, outlet };
}
