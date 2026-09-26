export interface PriceBreakdown {
  /** The items, before anything comes off. */
  subtotal: number;
  /** Taken off by a coupon or voucher, before PB1. */
  couponDiscount: number;
  /** What PB1 is charged on: the items less the coupon. */
  net: number;
  tax: number;
  rounding: number;
  total: number;
  pointsDiscount: number;
  finalTotal: number;
}

const TAX_RATE = 0.1;

export function computeBreakdown(
  subtotal: number,
  usePoints: boolean,
  availablePoints: number,
  couponDiscount = 0,
): PriceBreakdown {
  const discount = Math.min(Math.max(0, couponDiscount), subtotal);
  const net = subtotal - discount;
  const tax = Math.round(net * TAX_RATE);
  const rawTotal = net + tax;
  const total = Math.ceil(rawTotal / 100) * 100;
  const rounding = total - rawTotal;
  const pointsDiscount = usePoints ? Math.min(availablePoints, total) : 0;
  const finalTotal = Math.max(0, total - pointsDiscount);
  return {
    subtotal,
    couponDiscount: discount,
    net,
    tax,
    rounding,
    total,
    pointsDiscount,
    finalTotal,
  };
}
