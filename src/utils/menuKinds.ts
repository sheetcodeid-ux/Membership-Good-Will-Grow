import { menuItems } from "../data/mock";

/** Menu categories that are something to drink. */
export const DRINK_CATEGORIES = ["coffee", "non-coffee"];
/** Menu categories that are something to eat. */
export const FOOD_CATEGORIES = ["dimsum", "kue", "food", "snack"];

/**
 * Whether an order has drinks, food or both, from its item names. Items
 * no longer on the menu count as drinks, the outlets' main trade, so the
 * picture is never empty.
 */
export function orderKinds(names: string[]) {
  let drink = false;
  let food = false;
  for (const name of names) {
    const cat = menuItems.find((m) => m.name === name)?.categoryId;
    if (cat && FOOD_CATEGORIES.includes(cat)) food = true;
    else if (cat && !DRINK_CATEGORIES.includes(cat)) continue;
    else drink = true;
  }
  if (!drink && !food) drink = true;
  return { drink, food };
}
