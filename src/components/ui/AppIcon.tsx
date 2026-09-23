import React from "react";
import { View } from "react-native";
import {
  BellGlyph,
  BellOffGlyph,
  BookmarkGlyph,
  CartGlyph,
  ChevronGlyph,
  CloseGlyph,
  CommentGlyph,
  ComposeGlyph,
  CrownGlyph,
  FolderGlyph,
  GiftGlyph,
  HeartGlyph,
  HomeGlyph,
  InfoGlyph,
  MemberGlyph,
  MenuGlyph,
  MoreGlyph,
  OrderGlyph,
  PhotoPostGlyph,
  PinGlyph,
  PlusGlyph,
  PostAddGlyph,
  ProfileGlyph,
  SearchGlyph,
  SendGlyph,
  UserOffGlyph,
  UsersGlyph,
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
  bellOff: BellOffGlyph,
  crown: CrownGlyph,
  info: InfoGlyph,
  plus: PlusGlyph,
  folder: FolderGlyph,
  users: UsersGlyph,
  userOff: UserOffGlyph,
  send: SendGlyph,
  postAdd: PostAddGlyph,
} satisfies Record<string, React.ComponentType<GlyphProps>>;

export type AppIconName = keyof typeof glyphs;

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
  /** Fills the glyph; the silhouette stays the same either way. */
  emphasis?: boolean;
  /**
   * Quarter turns clockwise. The chevron is drawn once and turned, rather
   * than kept as four near-identical paths that can drift apart.
   */
  rotate?: 0 | 90 | 180 | 270;
}

export function AppIcon({
  name,
  size = 24,
  color = ink[500],
  emphasis,
  rotate = 0,
}: AppIconProps) {
  const Glyph = glyphs[name];
  const glyph = <Glyph size={size} color={color} active={emphasis} />;
  if (rotate === 0) return glyph;
  return <View style={{ transform: [{ rotate: `${rotate}deg` }] }}>{glyph}</View>;
}
