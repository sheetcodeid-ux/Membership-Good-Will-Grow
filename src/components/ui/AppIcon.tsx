import React from "react";
import {
  BellGlyph,
  BookmarkGlyph,
  CartGlyph,
  ChevronGlyph,
  CloseGlyph,
  CommentGlyph,
  ComposeGlyph,
  GiftGlyph,
  HeartGlyph,
  HomeGlyph,
  MemberGlyph,
  MenuGlyph,
  MoreGlyph,
  OrderGlyph,
  PhotoPostGlyph,
  PinGlyph,
  ProfileGlyph,
  SearchGlyph,
  VerifiedGlyph,
  StackGlyph,
  type GlyphProps,
} from "../GwgIcons";
import { ink } from "../../theme/colors";

/**
 * The app's icons, by name.
 *
 * These are drawn for this app rather than taken from the platform sets.
 * SF Symbols and Material Symbols are what every other app on the phone
 * already wears, and they differ between iOS and Android, so a screen built
 * from them has neither a face of its own nor one shape across platforms.
 * Drawing them keeps both.
 */
const glyphs = {
  home: HomeGlyph,
  order: OrderGlyph,
  member: MemberGlyph,
  profile: ProfileGlyph,
  compose: ComposeGlyph,
  cart: CartGlyph,
  menu: MenuGlyph,
  more: MoreGlyph,
  search: SearchGlyph,
  bookmark: BookmarkGlyph,
  bell: BellGlyph,
  heart: HeartGlyph,
  comment: CommentGlyph,
  gift: GiftGlyph,
  close: CloseGlyph,
  chevronRight: ChevronGlyph,
  pin: PinGlyph,
  stack: StackGlyph,
  photoPost: PhotoPostGlyph,
  verified: VerifiedGlyph,
} satisfies Record<string, React.ComponentType<GlyphProps>>;

export type AppIconName = keyof typeof glyphs;

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
  /** Fills the glyph; the silhouette stays the same either way. */
  emphasis?: boolean;
}

export function AppIcon({ name, size = 24, color = ink[500], emphasis }: AppIconProps) {
  const Glyph = glyphs[name];
  return <Glyph size={size} color={color} active={emphasis} />;
}
