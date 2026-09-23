import React from "react";
import { Platform } from "react-native";
import { Icon } from "@expo/ui";
import {
  BadgeCheck,
  Bell,
  Bookmark,
  ChevronRight,
  CircleUser,
  Feather,
  Gift,
  House,
  Menu,
  MoreHorizontal,
  Search,
  ShoppingBasket,
  ShoppingCart,
  X,
  type LucideIcon,
} from "lucide-react-native";
import { UiHost } from "./UiHost";
import { ink } from "../../theme/colors";

/**
 * Platform-native icons, drawn through `@expo/ui`.
 *
 * On iOS each name resolves to an SF Symbol and on Android to a Material
 * Symbols vector, so the marks are the ones the operating system ships rather
 * than art we drew. `@expo/ui`'s `Icon` renders nothing at all on web, so
 * there the equivalent Lucide outline stands in — without it every icon in
 * the web preview would simply be missing.
 *
 * `Icon.select` is called once per name at module scope so the Babel plugin
 * can fold each call down to the current platform's branch.
 */
const native = {
  home: Icon.select({ ios: "house.fill", android: import("@expo/material-symbols/home.xml") }),
  order: Icon.select({
    ios: "basket.fill",
    android: import("@expo/material-symbols/shopping_basket.xml"),
  }),
  member: Icon.select({
    ios: "checkmark.seal.fill",
    android: import("@expo/material-symbols/verified_user.xml"),
  }),
  profile: Icon.select({
    ios: "person.crop.circle.fill",
    android: import("@expo/material-symbols/account_circle.xml"),
  }),
  compose: Icon.select({
    ios: "square.and.pencil",
    android: import("@expo/material-symbols/edit_square.xml"),
  }),
  cart: Icon.select({
    ios: "cart.fill",
    android: import("@expo/material-symbols/shopping_cart.xml"),
  }),
  menu: Icon.select({
    ios: "line.3.horizontal",
    android: import("@expo/material-symbols/menu.xml"),
  }),
  more: Icon.select({ ios: "ellipsis", android: import("@expo/material-symbols/more_horiz.xml") }),
  search: Icon.select({
    ios: "magnifyingglass",
    android: import("@expo/material-symbols/search.xml"),
  }),
  bookmark: Icon.select({
    ios: "bookmark.fill",
    android: import("@expo/material-symbols/bookmark.xml"),
  }),
  bell: Icon.select({
    ios: "bell.fill",
    android: import("@expo/material-symbols/notifications.xml"),
  }),
  chevronRight: Icon.select({
    ios: "chevron.right",
    android: import("@expo/material-symbols/chevron_right.xml"),
  }),
  gift: Icon.select({ ios: "gift.fill", android: import("@expo/material-symbols/redeem.xml") }),
  close: Icon.select({ ios: "xmark", android: import("@expo/material-symbols/close.xml") }),
};

export type AppIconName = keyof typeof native;

/** Stand-ins used only on web, where `@expo/ui`'s Icon draws nothing. */
const web: Record<AppIconName, LucideIcon> = {
  home: House,
  order: ShoppingBasket,
  member: BadgeCheck,
  profile: CircleUser,
  compose: Feather,
  cart: ShoppingCart,
  menu: Menu,
  more: MoreHorizontal,
  search: Search,
  bookmark: Bookmark,
  bell: Bell,
  chevronRight: ChevronRight,
  gift: Gift,
  close: X,
};

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
  /** Web only: the Lucide stand-in has no filled variant, so it thickens. */
  emphasis?: boolean;
}

export function AppIcon({ name, size = 20, color = ink[500], emphasis }: AppIconProps) {
  if (Platform.OS === "web") {
    const Fallback = web[name];
    return <Fallback size={size} color={color} strokeWidth={emphasis ? 2.3 : 1.9} />;
  }

  // `Icon` returns a bare SwiftUI / Compose node, so it needs a Host of its
  // own wherever it sits outside an existing `@expo/ui` tree.
  return (
    <UiHost matchContents style={{ width: size, height: size }}>
      <Icon name={native[name]} size={size} color={color} />
    </UiHost>
  );
}
