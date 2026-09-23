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

/**
 * House with an arched doorway.
 *
 * Drawn as one closed path. The previous version drew the roof as an open
 * stroke over a separate body, so the two never joined at the apex and left
 * a notch there that read as a hole in the roof. A single outline has no
 * seam to open up, at any size or stroke weight.
 */
export function HomeGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M11.02 2.86a1.56 1.56 0 0 1 1.96 0l7.72 6.16c.37.3.58.75.58 1.22v8.26a2.5 2.5 0 0 1-2.5 2.5H5.22a2.5 2.5 0 0 1-2.5-2.5v-8.26c0-.47.21-.92.58-1.22Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M9.7 21V16.7a2.3 2.3 0 0 1 4.6 0V21"
        fill={active ? "#FFFFFF" : "none"}
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={active ? 0 : 1.9}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Shopping bag with a rope handle.
 *
 * A cup says "a drink"; a bag says "an order was placed", which is what this
 * tab actually opens. The body widens towards the base the way a paper bag
 * does under weight, and the handle stands clear above the lip — that gap is
 * what stops the whole thing reading as a box.
 */
export function OrderGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M8.5 8.2V6.6a3.5 3.5 0 0 1 7 0v1.6"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
      <Path
        d="M5.3 8.2h13.4a2 2 0 0 1 2 2.18l-.78 8.6a2.6 2.6 0 0 1-2.59 2.37H6.67a2.6 2.6 0 0 1-2.59-2.37l-.78-8.6a2 2 0 0 1 2-2.18Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M9 11.6c0 1.9 1.34 3.2 3 3.2s3-1.3 3-3.2"
        fill="none"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Membership card, seen slightly narrow, with a stripe and a star.
 *
 * A medal reads as an award and shares its subject — a person — with the
 * profile tab beside it. The card is the thing membership actually hands
 * you, and nothing else in the bar is a horizontal rectangle, so it holds
 * its own shape at a glance.
 */
export function MemberGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3.6 5.1h16.8a2.4 2.4 0 0 1 2.4 2.4v9a2.4 2.4 0 0 1-2.4 2.4H3.6a2.4 2.4 0 0 1-2.4-2.4v-9a2.4 2.4 0 0 1 2.4-2.4Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M1.2 9.1h21.6"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={1.9}
      />
      <Path
        d="M16.9 11.7l.83 1.68 1.85.27-1.34 1.3.32 1.85-1.66-.87-1.66.87.32-1.85-1.34-1.3 1.85-.27Z"
        fill={active ? "#FFFFFF" : "none"}
        stroke={active ? "none" : color}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <Path
        d="M4.6 13.3h4.8"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
      <Path
        d="M4.6 16.1h2.8"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Figure in a ring.
 *
 * No frame: a square around a person is a form field, not an account. The
 * ring is the shape an avatar already has everywhere else in the app, and
 * the shoulders are cut to land exactly on it, so the figure sits inside the
 * ring rather than being pasted over it.
 */
export function ProfileGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle
        cx={12}
        cy={12}
        r={9.4}
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
      />
      <Circle
        cx={12}
        cy={9.7}
        r={3}
        fill={active ? "#FFFFFF" : "none"}
        stroke={active ? "none" : color}
        strokeWidth={1.9}
      />
      <Path
        d="M6.91 19.9c.42-3.3 2.52-5 5.09-5s4.67 1.7 5.09 5"
        fill="none"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Pencil over a baseline.
 *
 * The feather this replaces was borrowed styling; the button opens the
 * composer, so it should say "write" and nothing else. The baseline under
 * the pencil is what separates composing from editing a picture, and the
 * flat cut at the tip reads as a sharpened point rather than a stray spike.
 */
export function ComposeGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M17.9 1.9a2.62 2.62 0 0 1 3.7 3.7l-1.28 1.28-3.7-3.7Z"
        fill={color}
      />
      <Path
        d="M15.35 4.45 19.05 8.15 9.1 18.1l-3.7-3.7Z"
        fill={color}
      />
      <Path
        d="M4.42 15.62 8.12 19.32 3.6 20.4a.8.8 0 0 1-.97-.97Z"
        fill={color}
      />
      <Path
        d="M3.4 22.6h17.2"
        stroke={color}
        strokeWidth={2}
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

/** Teardrop pin with a hole punched clean through it. */
export function PinGlyph({ size = 24, color = "#000", active = true }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2.2c4.25 0 7.7 3.45 7.7 7.7 0 5.4-5.83 10.93-7.06 12.03a.96.96 0 0 1-1.28 0C10.13 20.83 4.3 15.3 4.3 9.9c0-4.25 3.45-7.7 7.7-7.7Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.75}
      />
      <Circle
        cx={12}
        cy={9.8}
        r={2.85}
        fill={active ? "#FFFFFF" : "none"}
        stroke={active ? "none" : color}
        strokeWidth={1.75}
      />
    </Svg>
  );
}

/** Four panes, for a feed that mixes every kind of post. */
export function StackGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  const cells: [number, number][] = [
    [3.2, 3.2],
    [13.2, 3.2],
    [3.2, 13.2],
    [13.2, 13.2],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {cells.map(([x, y], i) => (
        <Rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={7.6}
          height={7.6}
          rx={2.4}
          fill={active ? color : "none"}
          stroke={color}
          strokeWidth={active ? 0 : 1.7}
          opacity={active && i === 3 ? 0.55 : 1}
        />
      ))}
    </Svg>
  );
}

/** Framed picture with a horizon, for image posts. */
export function PhotoPostGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect
        x={2.7}
        y={4.4}
        width={18.6}
        height={15.2}
        rx={3.2}
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.75}
      />
      <Circle cx={8.5} cy={9.5} r={1.75} fill={active ? "#FFFFFF" : color} />
      <Path
        d="M3.6 16.9l3.9-3.9a1.8 1.8 0 0 1 2.54 0l2.26 2.26 2.06-2.06a1.8 1.8 0 0 1 2.54 0l3.5 3.5"
        fill="none"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Check in a scalloped disc, for a verified member beside their name. */
export function VerifiedGlyph({ size = 16, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 1.8l2.6 2.02 3.28-.16.72 3.2 2.72 1.84-1.44 2.95 1.44 2.95-2.72 1.84-.72 3.2-3.28-.16L12 21.5l-2.6-2.02-3.28.16-.72-3.2-2.72-1.84 1.44-2.95L2.68 8.7 5.4 6.86l.72-3.2 3.28.16Z"
        fill={color}
      />
      <Path
        d="M8.4 12.1l2.5 2.5 4.7-4.9"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
