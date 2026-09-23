import React from "react";
import {
  Ban,
  Bell,
  Bookmark,
  Gift,
  Lock,
  Pencil,
  Search,
  Settings,
  Share2,
  Star,
  Ticket,
  TicketCheck,
  User,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react-native";
import { brand } from "../theme/colors";
import { ReceiptGlyph } from "./MemberGlyphs";

const icons: Record<string, LucideIcon> = {
  ticket: Ticket,
  "ticket-check": TicketCheck,
  star: Star,
  gift: Gift,
  bell: Bell,
  bookmark: Bookmark,
  search: Search,
  users: Users,
  "user-plus": UserPlus,
  ban: Ban,
  user: User,
  pencil: Pencil,
  lock: Lock,
  settings: Settings,
  share: Share2,
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
  const Icon = icons[name] ?? Star;
  return <Icon size={size} color={color} fill={color} strokeWidth={1.6} />;
}
