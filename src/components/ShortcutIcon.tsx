import React from "react";
import {
  Ban,
  Bell,
  Bookmark,
  Gift,
  Lock,
  Pencil,
  Receipt,
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

const icons: Record<string, LucideIcon> = {
  receipt: Receipt,
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

/** Resolves the icon name stored on a shortcut into a rendered glyph. */
export function ShortcutIcon({ name, size = 18 }: { name: string; size?: number }) {
  const Icon = icons[name] ?? Star;
  return <Icon size={size} color={brand[700]} strokeWidth={2} />;
}
