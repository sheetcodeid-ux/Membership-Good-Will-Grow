import { getBrand, getMenuItem } from "../data/mock";
import type { CartLine, Coupon } from "../data/types";
import { unitPrice } from "../store/cartStore";
import { formatRupiah } from "./format";

export type CouponCheck =
  | { ok: true; amount: number }
  | { ok: false; reason: string };

/**
 * Whether a coupon applies to the order in the cart, and how much it takes
 * off; when it does not, the reason in a few words, for the picker to show
 * under the coupon ("Belanja Rp 12.000 lagi", "Khusus Nordu Coffee").
 *
 * Rewards on an item go to the dearest unit that qualifies, so the member
 * always gets the most the coupon allows. `ignoreUsed` is for the coupon
 * the order itself is paying with, which is marked used the moment the
 * payment goes through while the receipt is still on screen.
 */
export function checkCoupon(
  coupon: Coupon,
  lines: CartLine[],
  outletBrandId: string | undefined,
  { ignoreUsed = false }: { ignoreUsed?: boolean } = {},
): CouponCheck {
  if (coupon.used && !ignoreUsed) return { ok: false, reason: "Sudah dipakai" };
  if (coupon.brandId && coupon.brandId !== outletBrandId) {
    const b = getBrand(coupon.brandId);
    return { ok: false, reason: `Khusus ${b?.name ?? "brand lain"}` };
  }
  const rule = coupon.rule;
  if (!rule) return { ok: false, reason: "Pakai langsung di kasir" };

  const subtotal = lines.reduce(
    (sum, l) => sum + unitPrice(l.menuItem, l.selections) * l.qty,
    0,
  );
  if (lines.length === 0)
    return { ok: false, reason: "Keranjang masih kosong" };
  if (rule.minSpend && subtotal < rule.minSpend) {
    return {
      ok: false,
      reason: `Belanja ${formatRupiah(rule.minSpend - subtotal)} lagi`,
    };
  }

  // Lines of the item that qualifies, the dearest unit first.
  let qualifying = lines;
  if (rule.items) {
    const minQty = rule.minQty ?? 1;
    const met = rule.items.filter(
      (id) =>
        lines
          .filter((l) => l.menuItem.id === id)
          .reduce((n, l) => n + l.qty, 0) >= minQty,
    );
    if (met.length === 0) {
      const name = getMenuItem(rule.items[0])?.name ?? "item syarat";
      const qty = minQty > 1 ? `${minQty} ` : "";
      return {
        ok: false,
        reason:
          rule.items.length > 1
            ? `Tambah ${qty}${name} atau item syarat lain`
            : `Tambah ${qty}${name}`,
      };
    }
    qualifying = lines.filter((l) => met.includes(l.menuItem.id));
  }
  const dearest = Math.max(
    ...qualifying.map((l) => unitPrice(l.menuItem, l.selections)),
  );

  let amount = 0;
  const reward = rule.reward;
  if (reward.kind === "amount") {
    amount = reward.value;
  } else if (reward.kind === "percent") {
    const base = rule.items ? dearest : subtotal;
    amount = Math.round((base * reward.value) / 100);
    if (reward.max) amount = Math.min(amount, reward.max);
  } else if (reward.kind === "price") {
    amount = dearest - reward.value;
  } else if (reward.itemId) {
    const free = lines.filter((l) => l.menuItem.id === reward.itemId);
    if (free.length === 0) {
      const name = getMenuItem(reward.itemId)?.name ?? "item gratisnya";
      return { ok: false, reason: `Tambah ${name} untuk digratiskan` };
    }
    amount = Math.max(...free.map((l) => unitPrice(l.menuItem, l.selections)));
  } else {
    amount = Math.min(...lines.map((l) => unitPrice(l.menuItem, l.selections)));
  }

  amount = Math.min(Math.max(0, amount), subtotal);
  if (amount <= 0) return { ok: false, reason: "Belum ada potongan" };
  return { ok: true, amount };
}
