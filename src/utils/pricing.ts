export interface PriceBreakdown {
  subtotal: number;
  tax: number;
  rounding: number;
  total: number;
  pointsDiscount: number;
  finalTotal: number;
}

const TAX_RATE = 0.1;

export function computeBreakdown(subtotal: number, usePoints: boolean, availablePoints: number): PriceBreakdown {
  const tax = Math.round(subtotal * TAX_RATE);
  const rawTotal = subtotal + tax;
  const total = Math.ceil(rawTotal / 100) * 100;
  const rounding = total - rawTotal;
  const pointsDiscount = usePoints ? Math.min(availablePoints, total) : 0;
  const finalTotal = Math.max(0, total - pointsDiscount);
  return { subtotal, tax, rounding, total, pointsDiscount, finalTotal };
}
