import React from "react";
import { AppIcon, type AppIconName } from "./ui/AppIcon";
import { brand } from "../theme/colors";
import { ReceiptGlyph } from "./MemberGlyphs";

const icons: Record<string, AppIconName> = {
  ticket: "ticket",
  "ticket-check": "ticketCheck",
  star: "star",
  gift: "gift",
  bell: "bell",
  bookmark: "bookmark",
  search: "search",
  users: "users",
  "user-plus": "userPlus",
  ban: "ban",
  user: "profile",
  pencil: "compose",
  lock: "lock",
  settings: "settings",
  share: "share",
};

/**
 * Shortcut marks are solid in the reference, not outlines, so the glyph is
 * filled with the same colour as its stroke.
 */
export function ShortcutIcon({
  name,
  size = 18,
  color = brand[700],
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  // The receipt needs its ruled lines knocked out, so it has its own drawing.
  if (name === "receipt") return <ReceiptGlyph size={size} color={color} />;
  const icon = icons[name] ?? "star";
  return <AppIcon name={icon} size={size} color={color} emphasis />;
}
