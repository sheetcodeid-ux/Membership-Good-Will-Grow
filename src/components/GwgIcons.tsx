import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

/**
 * The app's own icon set.
 *
 * SF Symbols and Material Symbols are the marks every app on the phone
 * already uses, so an app wearing them has no face of its own. These are
 * drawn instead, to one grammar: a solid body carrying the weight, detail
 * knocked out of it rather than drawn on top, corners rounded to match the
 * 10–24pt radii the layout uses, and a small asymmetry in each so no two
 * read alike at a glance.
 *
 * `active` fills the body; the inactive state keeps the same silhouette in
 * outline, so switching tabs never shifts the shape, only its weight.
 */
export interface GlyphProps {
  size?: number;
  color?: string;
  /** Solid when selected, outlined when not. */
  active?: boolean;
}

/** House with an arched doorway and a wide stance. */
export function HomeGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M2.9 10.9 10.9 3.7a1.65 1.65 0 0 1 2.2 0l8 7.2a1.7 1.7 0 0 1 .56 1.26V19a2.2 2.2 0 0 1-2.2 2.2H4.54A2.2 2.2 0 0 1 2.34 19v-6.84c0-.48.2-.94.56-1.26Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.7}
        strokeLinejoin="round"
      />
      <Path
        d="M9.2 21.2v-4.6a2.8 2.8 0 0 1 5.6 0v4.6"
        fill={active ? "#FFFFFF" : "none"}
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={active ? 0 : 1.7}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Cup with a saucer and a curl of steam — the brand's own trade. */
export function OrderGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4.2 8.6h11.4v5.1a5.7 5.7 0 0 1-11.4 0V8.6Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.7}
        strokeLinejoin="round"
      />
      <Path
        d="M15.6 9.9h1.9a2.5 2.5 0 0 1 0 5h-1.9"
        fill="none"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <Path
        d="M3 20.4h13.8"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <Path
        d="M8 5.6c0-.9 1.1-1.2 1.1-2.2M11.8 5.6c0-.9 1.1-1.2 1.1-2.2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Rosette seal with a check — a mark of standing, not a generic shield. */
export function MemberGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M 12.00 2.40 Q 14.04 4.37 15.42 4.03 Q 16.80 3.69 17.19 5.05 Q 17.59 6.41 18.95 6.81 Q 20.31 7.20 19.97 8.58 Q 19.63 9.96 20.62 10.98 Q 21.60 12.00 20.62 13.02 Q 19.63 14.04 19.97 15.42 Q 20.31 16.80 18.95 17.19 Q 17.59 17.59 17.19 18.95 Q 16.80 20.31 15.42 19.97 Q 14.04 19.63 13.02 20.62 Q 12.00 21.60 10.98 20.62 Q 9.96 19.63 8.58 19.97 Q 7.20 20.31 6.81 18.95 Q 6.41 17.59 5.05 17.19 Q 3.69 16.80 4.03 15.42 Q 4.37 14.04 3.38 13.02 Q 2.40 12.00 3.38 10.98 Q 4.37 9.96 4.03 8.58 Q 3.69 7.20 5.05 6.81 Q 6.41 6.41 6.81 5.05 Q 7.20 3.69 8.58 4.03 Q 9.96 4.37 10.98 3.38 Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.6}
        strokeLinejoin="round"
      />
      <Path
        d="M8.3 12.2l2.5 2.5 4.9-5.1"
        fill="none"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={2.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Bust in a ring, shoulders meeting the rim so it fills its circle. */
export function ProfileGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle
        cx={12}
        cy={12}
        r={9.4}
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.7}
      />
      <Circle
        cx={12}
        cy={9.9}
        r={3.35}
        fill={active ? "#FFFFFF" : "none"}
        stroke={active ? "none" : color}
        strokeWidth={1.7}
      />
      <Path
        d="M5.4 19.3a6.85 6.85 0 0 1 13.2 0"
        fill="none"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Fountain-pen nib: shoulders, a slit down the middle and a breather hole.
 * A plain diagonal line reads as a pencil; those three details are what make
 * it a pen.
 */
export function ComposeGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M14.9 2.6 21.4 9.1a1.5 1.5 0 0 1 .1 2.03l-8.2 9.4a2 2 0 0 1-1.06.64l-6.9 1.5a1 1 0 0 1-1.19-1.19l1.5-6.9a2 2 0 0 1 .64-1.06l9.4-8.2a1.5 1.5 0 0 1 2.03.1Z"
        fill={color}
      />
      <Path
        d="M9.2 9.4 14.6 14.8"
        stroke="#FFFFFF"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <Circle cx={15.4} cy={8.6} r={1.25} fill="#FFFFFF" />
      <Path
        d="M5.1 18.9 8.3 15.7"
        stroke="#FFFFFF"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Basket with a lifted handle. */
export function CartGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M2.8 8.8h18.4l-1.7 9.6a2.4 2.4 0 0 1-2.36 1.98H6.86A2.4 2.4 0 0 1 4.5 18.4Z"
        fill={color}
      />
      <Path
        d="M8.1 8.6 10.4 3.6M15.9 8.6 13.6 3.6"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path d="M9 12.4v3.4M15 12.4v3.4" stroke="#FFFFFF" strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

/** Three bars, the middle one short — reads as a menu, not a list. */
export function MenuGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={3.2} y={6} width={17.6} height={2.4} rx={1.2} fill={color} />
      <Rect x={3.2} y={10.8} width={11.6} height={2.4} rx={1.2} fill={color} />
      <Rect x={3.2} y={15.6} width={17.6} height={2.4} rx={1.2} fill={color} />
    </Svg>
  );
}

/** Three dots with the middle one larger. */
export function MoreGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={5.4} cy={12} r={1.7} fill={color} />
      <Circle cx={12} cy={12} r={2.1} fill={color} />
      <Circle cx={18.6} cy={12} r={1.7} fill={color} />
    </Svg>
  );
}

/** Lens with a squared-off handle. */
export function SearchGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={10.7} cy={10.7} r={6.9} fill="none" stroke={color} strokeWidth={1.9} />
      <Path d="M15.9 15.9 20.6 20.6" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

/** Ribbon with a notched foot. */
export function BookmarkGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M6.2 3.9h11.6a1.5 1.5 0 0 1 1.5 1.5v14.9l-6.13-4.1a2 2 0 0 0-2.24 0L4.7 20.3V5.4a1.5 1.5 0 0 1 1.5-1.5Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Bell with a clapper and a flat crown. */
export function BellGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2.8a1.5 1.5 0 0 1 1.5 1.5v.5a6.2 6.2 0 0 1 4.7 6v3.3l1.4 2.3a1 1 0 0 1-.86 1.5H5.26a1 1 0 0 1-.86-1.5l1.4-2.3v-3.3a6.2 6.2 0 0 1 4.7-6v-.5A1.5 1.5 0 0 1 12 2.8Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.7}
        strokeLinejoin="round"
      />
      <Path
        d="M9.9 21a2.3 2.3 0 0 0 4.2 0"
        fill="none"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Heart with a flattened top, so it does not read as a sticker. */
export function HeartGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 20.6 4.9 13.8a4.7 4.7 0 0 1 0-6.8 5 5 0 0 1 7.1.35 5 5 0 0 1 7.1-.35 4.7 4.7 0 0 1 0 6.8Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Speech bubble with a squared tail. */
export function CommentGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4.6 3.9h14.8a2 2 0 0 1 2 2v8.6a2 2 0 0 1-2 2H10l-4.5 3.7v-3.7h-.9a2 2 0 0 1-2-2V5.9a2 2 0 0 1 2-2Z"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Gift with an off-centre ribbon. */
export function GiftGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={2.6} y={7.4} width={18.8} height={4.4} rx={1.6} fill={color} />
      <Rect x={4.2} y={11.8} width={15.6} height={9.4} rx={2.2} fill={color} />
      <Rect x={9.6} y={7.4} width={2.6} height={13.8} fill="#FFFFFF" />
      <Path
        d="M10.9 7.3C9.6 4.5 8 3.4 6.7 4.1c-1.3.7-1 2.5.5 3.2M10.9 7.3c1.3-2.8 2.9-3.9 4.2-3.2 1.3.7 1 2.5-.5 3.2"
        fill="none"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Cross with softened ends. */
export function CloseGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M6.6 6.6 17.4 17.4M17.4 6.6 6.6 17.4"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Chevron, weighted to match the rest of the set. */
export function ChevronGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M9.4 5.6 15.8 12l-6.4 6.4"
        fill="none"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Pin with a hollow centre. */
export function PinGlyph({ size = 24, color = "#000", active = true }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2.6c4 0 7.2 3.2 7.2 7.2 0 5.1-5.5 10.4-6.66 11.44a.8.8 0 0 1-1.08 0C10.3 20.2 4.8 14.9 4.8 9.8 4.8 5.8 8 2.6 12 2.6Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.8}
      />
      <Circle cx={12} cy={9.7} r={2.7} fill="#FFFFFF" />
    </Svg>
  );
}

/** Stacked cards, for a feed that mixes every kind of post. */
export function StackGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect
        x={5.4}
        y={2.6}
        width={13.2}
        height={4}
        rx={1.6}
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.6}
        opacity={active ? 0.55 : 1}
      />
      <Rect
        x={3.4}
        y={7.6}
        width={17.2}
        height={13.8}
        rx={3}
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.7}
      />
      <Path
        d="M7.4 12.4h9.2M7.4 16.4h5.6"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Framed picture, for image posts. */
export function PhotoPostGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect
        x={2.8}
        y={4.2}
        width={18.4}
        height={15.6}
        rx={3}
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.7}
      />
      <Circle cx={8.6} cy={9.6} r={1.7} fill={active ? "#FFFFFF" : color} />
      <Path
        d="M4.6 17.6l4.1-4.1a1.6 1.6 0 0 1 2.2 0l2.3 2.3 1.9-1.9a1.6 1.6 0 0 1 2.2 0l2.1 2.1"
        fill="none"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
