import { create } from "zustand";
import { couponOffers, coupons as initialCoupons } from "../data/mock";
import type { Coupon, CouponOffer, CouponPurchase } from "../data/types";
import { formatIndoDate } from "../utils/dates";
import { useMemberStore } from "./memberStore";

interface CouponState {
  /** Coupons the member holds: Kupon Saya. */
  mine: Coupon[];
  /** Coupons on sale for points: Kupon tersedia. */
  offers: CouponOffer[];
  /** Newest first: Riwayat Pembelian Kupon. */
  purchases: CouponPurchase[];
  /** The coupon bought most recently this session, shown first as "Baru". */
  latestId?: string;
  /**
   * Buys an offer with points: the points leave the balance (and show in
   * Riwayat Poin), the coupon joins Kupon Saya and the purchase is logged.
   * Returns the new coupon, or undefined if the balance is short.
   */
  buy: (offerId: string) => Coupon | undefined;
}

let seq = 1;

export const useCouponStore = create<CouponState>((set, get) => ({
  mine: initialCoupons,
  offers: couponOffers,
  purchases: [],
  buy: (offerId) => {
    const offer = get().offers.find((o) => o.id === offerId);
    if (!offer) return undefined;
    const paid = useMemberStore
      .getState()
      .spendPoints(offer.pricePoints, `Tukar Poin - ${offer.title}`);
    if (!paid) return undefined;
    const n = seq++;
    const coupon: Coupon = {
      id: `cp-buy-${n}`,
      brandId: offer.brandId,
      title: offer.title,
      daysLeft: offer.validDays,
      used: false,
      detail: offer.detail,
    };
    const purchase: CouponPurchase = {
      id: `pur-${n}`,
      offerId: offer.id,
      couponId: coupon.id,
      brandId: offer.brandId,
      title: offer.title,
      pricePoints: offer.pricePoints,
      date: formatIndoDate(new Date()),
    };
    set((s) => ({
      mine: [coupon, ...s.mine],
      purchases: [purchase, ...s.purchases],
      latestId: coupon.id,
    }));
    return coupon;
  },
}));
