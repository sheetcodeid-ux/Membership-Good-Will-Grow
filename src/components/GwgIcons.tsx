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

/** Crown with three points and a banded base — points and tier rewards. */
export function CrownGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M2.6 7.4a1.2 1.2 0 0 1 1.9-.3l3 2.7 3.5-5.3a1.2 1.2 0 0 1 2 0l3.5 5.3 3-2.7a1.2 1.2 0 0 1 1.98 1.15l-1.86 8.3H4.48L2.62 8.25Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M5.4 19.8h13.2"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Bell with a slash — notifications that are switched off, or an empty list. */
export function BellOffGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M8.1 4.9A5.8 5.8 0 0 1 17.8 9.2c0 3.3.7 5.2 1.6 6.4H8.4m-2.6 0c.6-.9 1.1-2.2 1.3-4.1"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.3 19.1a2 2 0 0 0 3.4 0"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
      <Path
        d="M3.4 3.4 20.6 20.6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Circled "i" — advisory rows. */
export function InfoGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle
        cx={12}
        cy={12}
        r={9.3}
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
      />
      <Path
        d="M12 11v5.4"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Circle cx={12} cy={7.7} r={1.2} fill={active ? "#FFFFFF" : color} />
    </Svg>
  );
}

/** Plus with rounded ends — add, in the places a label cannot fit. */
export function PlusGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 4.6v14.8M4.6 12h14.8"
        stroke={color}
        strokeWidth={2.1}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Folder with its front panel lifted.
 *
 * The tab at the back and the offset front are what make it a folder and not
 * a rectangle, so the two are drawn at different heights rather than nested.
 */
export function FolderGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M2.7 18.4V6.6a2 2 0 0 1 2-2h4.06a2 2 0 0 1 1.6.8l1.04 1.4h6.9a2 2 0 0 1 2 2v1.6"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M4.9 19.4h13.3a2 2 0 0 0 1.94-1.51l1.3-5.2a1.4 1.4 0 0 0-1.36-1.74H6.6a2 2 0 0 0-1.94 1.51l-1.3 5.2A1.4 1.4 0 0 0 4.72 19.4Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Two figures, the second set back — followers and following. */
export function UsersGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={9.2} cy={8.2} r={3.5} fill="none" stroke={color} strokeWidth={1.9} />
      <Path
        d="M2.9 19.6c0-3.6 2.8-5.9 6.3-5.9s6.3 2.3 6.3 5.9"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
      <Path
        d="M16.3 5.1a3.5 3.5 0 0 1 0 6.5M18 14.2c2.1.6 3.5 2.5 3.5 5"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Figure with a slash — a member who cannot be found, or is blocked. */
export function UserOffGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={8.1} r={3.6} fill="none" stroke={color} strokeWidth={1.9} />
      <Path
        d="M5.2 19.9c0-3.7 3-6.1 6.8-6.1 1.3 0 2.6.3 3.7.9"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
      <Path d="M3.9 3.9 20.1 20.1" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Paper plane, cut along its fold.
 *
 * The notch on the trailing edge is what reads as a fold; without it the
 * shape is just a triangle pointing the wrong way at small sizes.
 */
export function SendGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M21.3 3.1 2.9 10.4c-.8.3-.76 1.46.06 1.71l7.2 2.2 2.2 7.2c.25.82 1.41.86 1.71.06L21.3 3.1Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
        strokeLinejoin="round"
      />
      <Path
        d="m10.16 14.31 5.1-5.1"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Sheet with a plus — start a new post. */
export function PostAddGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M13.4 2.8H6.9a2.4 2.4 0 0 0-2.4 2.4v13.6a2.4 2.4 0 0 0 2.4 2.4h10.2a2.4 2.4 0 0 0 2.4-2.4V8.6Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M13.4 2.8v4.4a1.4 1.4 0 0 0 1.4 1.4h4.7"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M12 11.9v5.4M9.3 14.6h5.4"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/* ------------------------------------------------------------------ *
 * The rest of the set.
 *
 * Same rules throughout: a 24-unit box, 1.9 stroke, round joins, and the
 * `active` fill reserved for glyphs that ever appear selected. Each one is
 * drawn for a specific job in this app, which is why some of them are more
 * particular than a general-purpose set would be — the delivery scooter has
 * a box on the back, the coffee cup has a lid.
 * ------------------------------------------------------------------ */

/** Pulse trace — activity and status feeds. */
export function ActivityGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M2.6 12.4h4.1l2.5-7.2 4.4 14.2 2.6-7h5.2"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** At sign — usernames and email fields. */
export function AtSignGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={3.9} fill="none" stroke={color} strokeWidth={1.9} />
      <Path
        d="M15.9 8.1v5.1a2.9 2.9 0 0 0 5.8 0V12a9.7 9.7 0 1 0-3.8 7.7"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Scooter with a delivery box on the back. */
export function ScooterGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={5.4} cy={17.6} r={3.1} fill="none" stroke={color} strokeWidth={1.9} />
      <Circle cx={18.6} cy={17.6} r={3.1} fill="none" stroke={color} strokeWidth={1.9} />
      <Path
        d="M8.5 17.6h7"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
      <Path
        d="M5.4 17.6 9.9 7.3h3.3"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.3 5.2h3.4a1.5 1.5 0 0 1 1.5 1.5v9.4"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.4 4.3h3.6"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Bicycle — the slower delivery tier. */
export function BikeGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={5.3} cy={17.4} r={3.7} fill="none" stroke={color} strokeWidth={1.9} />
      <Circle cx={18.7} cy={17.4} r={3.7} fill="none" stroke={color} strokeWidth={1.9} />
      <Path
        d="m5.3 17.4 4.4-7.6h5.6l3.4 7.6M9.7 9.8 8.1 6.9h-2M13.2 6.9h3.2"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Shopfront with an awning — outlets. */
export function StoreGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3.4 9.6h17.2v9.6a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M2.4 9.6 4.2 4.3a1.4 1.4 0 0 1 1.33-.96h12.94a1.4 1.4 0 0 1 1.33.96l1.8 5.3"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M9.4 21.2v-4.9h5.2v4.9"
        fill={active ? "#FFFFFF" : "none"}
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={active ? 0 : 1.9}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Tower block — a mall or building address line. */
export function BuildingGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4.2 21.2V5a1.8 1.8 0 0 1 1.8-1.8h6.4A1.8 1.8 0 0 1 14.2 5v16.2"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M14.2 10h3.8a1.8 1.8 0 0 1 1.8 1.8v9.4"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M2.8 21.2h18.4M7.4 7.2h3.6M7.4 11.2h3.6M7.4 15.2h3.6"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Calendar with a torn-off header band. */
export function CalendarGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4.8 5.1h14.4a2 2 0 0 1 2 2v12.1a2 2 0 0 1-2 2H4.8a2 2 0 0 1-2-2V7.1a2 2 0 0 1 2-2Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path d="M2.8 10.2h18.4" stroke={color} strokeWidth={1.9} />
      <Path
        d="M7.8 2.8v4.2M16.2 2.8v4.2"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Clock — opening hours. */
export function ClockGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={9.3} fill="none" stroke={color} strokeWidth={1.9} />
      <Path
        d="M12 6.6V12l3.6 2.2"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Camera with a raised shutter housing. */
export function CameraGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4.2 7.4h2.9l1.36-2.2a1.5 1.5 0 0 1 1.28-.72h4.52a1.5 1.5 0 0 1 1.28.72l1.36 2.2h2.9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4.2a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={13.6} r={3.6} fill="none" stroke={color} strokeWidth={1.9} />
    </Svg>
  );
}

/** Coffee cup with a lid and a sleeve. */
export function CoffeeGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M5.4 7.2h13.2l-1.3 12.3a2 2 0 0 1-1.99 1.79H8.69a2 2 0 0 1-1.99-1.79Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M4.2 4.1h15.6a1 1 0 0 1 1 1.05l-.05 1a1 1 0 0 1-1 .95H4.25a1 1 0 0 1-1-.95l-.05-1a1 1 0 0 1 1-1.05Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path d="M6.3 12.4h11.4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

/** Chef's hat — kitchen notes on a product. */
export function ChefHatGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M6.4 16.6a4.6 4.6 0 0 1-1.5-8.95 4.4 4.4 0 0 1 8.3-2.6 4.4 4.4 0 0 1 7.7 4.06A4.6 4.6 0 0 1 17.6 16.6Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M6.4 16.6v2.9a1.7 1.7 0 0 0 1.7 1.7h7.8a1.7 1.7 0 0 0 1.7-1.7v-2.9"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Stacked coins — points balances. */
export function CoinsGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M2.9 6.5c0-1.6 2.6-2.9 5.8-2.9s5.8 1.3 5.8 2.9-2.6 2.9-5.8 2.9-5.8-1.3-5.8-2.9Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
      />
      <Path
        d="M2.9 6.5v4.1c0 1.6 2.6 2.9 5.8 2.9M14.5 6.5v3"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
      <Path
        d="M9.5 15.4c0-1.6 2.6-2.9 5.8-2.9s5.8 1.3 5.8 2.9-2.6 2.9-5.8 2.9-5.8-1.3-5.8-2.9Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
      />
      <Path
        d="M9.5 15.4v2.9c0 1.6 2.6 2.9 5.8 2.9s5.8-1.3 5.8-2.9v-2.9"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Open palm under a coin — points earned. */
export function HandCoinsGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={15.6} cy={6.6} r={3.8} fill="none" stroke={color} strokeWidth={1.9} />
      <Path
        d="M2.6 14.2h4.3l4.5 1.9h3.4a1.6 1.6 0 0 1 0 3.2h-3.5"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.9 19.3h5.8l7.1-2.6a1.7 1.7 0 0 1 1.25 3.15l-6.6 2.8"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Two offset sheets — copy to clipboard. */
export function CopyGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M9.6 8.2h9.2a2 2 0 0 1 2 2v9.2a2 2 0 0 1-2 2H9.6a2 2 0 0 1-2-2v-9.2a2 2 0 0 1 2-2Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M4.4 15.8a2 2 0 0 1-1.8-2V5.2a2 2 0 0 1 2-2h8.6a2 2 0 0 1 2 1.8"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Tray with a down arrow — download and save. */
export function DownloadGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 3.2v11.6M7.4 10.4 12 15l4.6-4.6"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.6 16.4v2.4a2.4 2.4 0 0 0 2.4 2.4h12a2.4 2.4 0 0 0 2.4-2.4v-2.4"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Node graph with an arrow off the top — share. */
export function ShareGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={18} cy={5.4} r={2.9} fill="none" stroke={color} strokeWidth={1.9} />
      <Circle cx={6} cy={12} r={2.9} fill="none" stroke={color} strokeWidth={1.9} />
      <Circle cx={18} cy={18.6} r={2.9} fill="none" stroke={color} strokeWidth={1.9} />
      <Path
        d="m8.54 10.6 6.93-3.8M8.54 13.4l6.93 3.8"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Padlock with a shackle — PIN and security rows. */
export function LockGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M5.8 10.4h12.4a2 2 0 0 1 2 2v6.8a2 2 0 0 1-2 2H5.8a2 2 0 0 1-2-2v-6.8a2 2 0 0 1 2-2Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M7.6 10.4V7.6a4.4 4.4 0 0 1 8.8 0v2.8"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
      <Circle cx={12} cy={15.8} r={1.5} fill={color} />
    </Svg>
  );
}

/** Envelope with a folded flap. */
export function MailGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4.4 4.9h15.2a2 2 0 0 1 2 2v10.2a2 2 0 0 1-2 2H4.4a2 2 0 0 1-2-2V6.9a2 2 0 0 1 2-2Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="m3 6.6 7.72 5.48a2.2 2.2 0 0 0 2.56 0L21 6.6"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Minus with rounded ends — the counterpart to plus. */
export function MinusGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4.6 12h14.8" stroke={color} strokeWidth={2.1} strokeLinecap="round" />
    </Svg>
  );
}

/** Check with rounded ends. */
export function CheckGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="m4.6 12.6 4.9 4.9 9.9-11"
        fill="none"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Circled check — a step that completed. */
export function CheckCircleGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle
        cx={12}
        cy={12}
        r={9.3}
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
      />
      <Path
        d="m7.7 12.3 2.9 2.9 5.7-6.2"
        fill="none"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Circled cross — a step that failed or was cancelled. */
export function CloseCircleGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle
        cx={12}
        cy={12}
        r={9.3}
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
      />
      <Path
        d="m8.7 8.7 6.6 6.6M15.3 8.7l-6.6 6.6"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Circled exclamation — a warning inline with text. */
export function AlertCircleGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle
        cx={12}
        cy={12}
        r={9.3}
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
      />
      <Path
        d="M12 7.2v5.6"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Circle cx={12} cy={16.3} r={1.2} fill={active ? "#FFFFFF" : color} />
    </Svg>
  );
}

/** Triangle with an exclamation — the heavier warning. */
export function AlertTriangleGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M10.29 3.86 1.92 18a2 2 0 0 0 1.71 3h16.74a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path d="M12 9.4v4.4" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={12} cy={17.2} r={1.2} fill={color} />
    </Svg>
  );
}

/** QR code: three finders and a scatter of cells. */
export function QrGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3.4 3.4h6.2v6.2H3.4ZM14.4 3.4h6.2v6.2h-6.2ZM3.4 14.4h6.2v6.2H3.4Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M14.4 14.4h2.6v2.6h-2.6ZM18 18h2.6v2.6H18ZM14.4 20.6h1M20.6 14.4v1"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Receipt with a torn lower edge. */
export function ReceiptGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4.6 2.8h14.8v18.4l-2.47-1.6-2.46 1.6-2.47-1.6-2.46 1.6-2.47-1.6L4.6 21.2Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M8.2 8h7.6M8.2 12h4.8"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Ticket with a notch on each side. */
export function TicketGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3.4 6.6h17.2v3.2a2.2 2.2 0 0 0 0 4.4v3.2H3.4v-3.2a2.2 2.2 0 0 0 0-4.4Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M13.2 6.6v1.8M13.2 11.1v1.8M13.2 15.6v1.8"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Ticket carrying a percent sign — discount coupons. */
export function TicketPercentGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3.4 6.6h17.2v3.2a2.2 2.2 0 0 0 0 4.4v3.2H3.4v-3.2a2.2 2.2 0 0 0 0-4.4Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
        strokeLinejoin="round"
      />
      <Path
        d="m9.6 14.4 4.8-4.8"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Circle cx={9.6} cy={9.8} r={1.15} fill={active ? "#FFFFFF" : color} />
      <Circle cx={14.4} cy={14.2} r={1.15} fill={active ? "#FFFFFF" : color} />
    </Svg>
  );
}

/** Bin with a lifted lid. */
export function TrashGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3.4 6.4h17.2M9.4 6.4V4.6a1.6 1.6 0 0 1 1.6-1.6h2a1.6 1.6 0 0 1 1.6 1.6v1.8"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
      <Path
        d="M5.8 6.4h12.4l-.9 13a2 2 0 0 1-2 1.86H8.7a2 2 0 0 1-2-1.86Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M10.2 10.6v6M13.8 10.6v6"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Arrow climbing a step chart — points gained. */
export function TrendUpGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M2.8 16.6 9 10.4l3.8 3.8 8.4-8.4"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.4 5.8h5.8v5.8"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Arrow descending a step chart — points spent. */
export function TrendDownGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M2.8 7.4 9 13.6l3.8-3.8 8.4 8.4"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.4 18.2h5.8v-5.8"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Circular arrows — refresh and retry. */
export function RefreshGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M20.6 11.2a8.7 8.7 0 0 0-14.9-4.5L2.9 9.3M3.4 12.8a8.7 8.7 0 0 0 14.9 4.5l2.8-2.6"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.9 4.6v4.7h4.7M21.1 19.4v-4.7h-4.7"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Three sliders — filters. */
export function SlidersGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3.2 6.6h4.4M12.4 6.6h8.4M3.2 12h10.4M18.4 12h2.4M3.2 17.4h4.4M12.4 17.4h8.4"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
      <Circle cx={10} cy={6.6} r={2.4} fill="none" stroke={color} strokeWidth={1.9} />
      <Circle cx={16} cy={12} r={2.4} fill="none" stroke={color} strokeWidth={1.9} />
      <Circle cx={10} cy={17.4} r={2.4} fill="none" stroke={color} strokeWidth={1.9} />
    </Svg>
  );
}

/** One large sparkle and two small — "new" and promotional flags. */
export function SparklesGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M10.2 2.8 12 7.9l5.1 1.8-5.1 1.8-1.8 5.1-1.8-5.1L3.3 9.7l5.1-1.8Z"
        fill={color}
      />
      <Path d="M18.2 13.4l.85 2.35 2.35.85-2.35.85-.85 2.35-.85-2.35-2.35-.85 2.35-.85Z" fill={color} />
      <Path d="M5.6 16.6l.6 1.65 1.65.6-1.65.6-.6 1.65-.6-1.65-1.65-.6 1.65-.6Z" fill={color} />
    </Svg>
  );
}

/** Figure with a plus — follow a member. */
export function UserPlusGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={9.4} cy={8.2} r={3.7} fill="none" stroke={color} strokeWidth={1.9} />
      <Path
        d="M2.8 19.9c0-3.7 2.95-6.1 6.6-6.1s6.6 2.4 6.6 6.1"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
      <Path
        d="M19 6.2v6M22 9.2h-6"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Star — ratings and favourites. */
export function StarGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="m12 2.6 2.96 6 6.62.96-4.79 4.67 1.13 6.59L12 17.71l-5.92 3.11 1.13-6.59L2.42 9.56 9.04 8.6Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Crossed circle — blocked members and unavailable items. */
export function BanGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={9.3} fill="none" stroke={color} strokeWidth={1.9} />
      <Path d="M5.42 5.42 18.58 18.58" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

/** Cogwheel with a hub — settings. */
export function SettingsGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M10.32 2.8h3.36l.38 2.4 1.9.8 1.98-1.4 2.38 2.38-1.4 1.98.8 1.9 2.4.38v3.36l-2.4.38-.8 1.9 1.4 1.98-2.38 2.38-1.98-1.4-1.9.8-.38 2.4h-3.36l-.38-2.4-1.9-.8-1.98 1.4-2.38-2.38 1.4-1.98-.8-1.9-2.4-.38v-3.36l2.4-.38.8-1.9-1.4-1.98L5.68 4.6l1.98 1.4 1.9-.8Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={3.1} fill="none" stroke={color} strokeWidth={1.9} />
    </Svg>
  );
}

/** Eye — preview and visibility. */
export function EyeGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M1.6 12S5.2 5.2 12 5.2 22.4 12 22.4 12 18.8 18.8 12 18.8 1.6 12 1.6 12Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={3.3} fill="none" stroke={color} strokeWidth={1.9} />
    </Svg>
  );
}

/** Globe with meridians — a post visible to everyone. */
export function GlobeGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={9.3} fill="none" stroke={color} strokeWidth={1.9} />
      <Path
        d="M2.9 9.4h18.2M2.9 14.6h18.2M12 2.7c4.4 4.9 4.4 13.7 0 18.6-4.4-4.9-4.4-13.7 0-18.6Z"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
      />
    </Svg>
  );
}

/** Figure with a check — followers only. */
export function UserCheckGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={9.4} cy={8.2} r={3.7} fill="none" stroke={color} strokeWidth={1.9} />
      <Path
        d="M2.8 19.9c0-3.7 2.95-6.1 6.6-6.1s6.6 2.4 6.6 6.1"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
      <Path
        d="m16.6 9 1.9 1.9 3.5-3.8"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Ticket with a check — a coupon already redeemed. */
export function TicketCheckGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3.4 6.6h17.2v3.2a2.2 2.2 0 0 0 0 4.4v3.2H3.4v-3.2a2.2 2.2 0 0 0 0-4.4Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="m9.4 12.2 1.9 1.9 3.9-4.2"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Frame with a plus — attach an image. */
export function ImagePlusGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M13.4 3.4H5a2 2 0 0 0-2 2v13.2a2 2 0 0 0 2 2h13.2a2 2 0 0 0 2-2v-8.4"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m3.3 17.6 4.9-4.9a1.8 1.8 0 0 1 2.5 0l6.4 6.4"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={9} cy={8.6} r={1.5} fill={color} />
      <Path
        d="M18.6 2.4v6M21.6 5.4h-6"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Two frames offset — a gallery rather than one picture. */
export function ImagesGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M8.6 2.9h11.5a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2H8.6a2 2 0 0 1-2-2V4.9a2 2 0 0 1 2-2Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="m6.8 13.4 3.5-3.5a1.7 1.7 0 0 1 2.4 0l5.1 5.1"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={11.4} cy={7.2} r={1.4} fill={color} />
      <Path
        d="M17.4 18.4v.7a2 2 0 0 1-2 2H3.9a2 2 0 0 1-2-2V9.6a2 2 0 0 1 2-2h.7"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Hourglass — an order still being prepared. */
export function HourglassGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M6.2 2.8h11.6M6.2 21.2h11.6"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
      <Path
        d="M7.4 2.8v3.6c0 2.2 1.6 4 4.6 5.6 3-1.6 4.6-3.4 4.6-5.6V2.8M7.4 21.2v-3.6c0-2.2 1.6-4 4.6-5.6 3 1.6 4.6 3.4 4.6 5.6v3.6"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Pause bars — an order on hold. */
export function PauseGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M9 3.8v16.4M15 3.8v16.4"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Lemniscate — an offer with no expiry. */
export function InfinityGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M18.18 7.2a4.8 4.8 0 0 0 0 9.6c2.66 0 4.02-2.4 5.02-4.8-1-2.4-2.36-4.8-5.02-4.8Zm-12.36 0a4.8 4.8 0 0 1 0 9.6C3.16 16.8 1.8 14.4.8 12c1-2.4 2.36-4.8 5.02-4.8Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M5.82 7.2C8.48 7.2 9.84 9.6 10.84 12c1 2.4 2.36 4.8 5.02 4.8"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
      />
    </Svg>
  );
}

/** Desktop screen on a stand — an order taken at the counter. */
export function MonitorGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3.4 3.8h17.2a2 2 0 0 1 2 2v8.6a2 2 0 0 1-2 2H3.4a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M12 16.4v3.8M8 20.2h8"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Handset — an order placed from the app. */
export function PhoneGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M7.4 2.2h9.2a2 2 0 0 1 2 2v15.6a2 2 0 0 1-2 2H7.4a2 2 0 0 1-2-2V4.2a2 2 0 0 1 2-2Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path d="M10.4 18.6h3.2" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

/** Hash — order reference numbers. */
export function HashGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4.4 9.2h15.2M3.8 15h15.2M10.2 3.4 8.2 20.6M16.2 3.4l-2 17.2"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Armchair — dining in. */
export function ArmchairGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M5.6 11.4V6.8a2.6 2.6 0 0 1 2.6-2.6h7.6a2.6 2.6 0 0 1 2.6 2.6v4.6"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
      <Path
        d="M5.6 11.4a2.4 2.4 0 0 0 0 4.8v1.6h12.8v-1.6a2.4 2.4 0 0 0 0-4.8 2.4 2.4 0 0 0-2.4 2.4v2.4H8v-2.4a2.4 2.4 0 0 0-2.4-2.4Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M6.4 17.8v2M17.6 17.8v2"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Two footprints — taking the order away. */
export function FootprintsGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3.4 17.2c0-1.4.5-2.2.5-3.6 0-1.9-1-2.6-1-4.6 0-2.6 1.3-4.6 3-4.6s3 2 3 4.6c0 2-1 2.7-1 4.6 0 1.4.5 2.2.5 3.6Z"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M3.4 17.2h5c.3 1.6-.5 2.8-2.5 2.8s-2.8-1.2-2.5-2.8Z"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M15.1 12.4c0-1.4.5-2.2.5-3.6 0-1.9-1-2.6-1-4.6 0-1.8.9-3.2 2.2-3.2s2.2 1.4 2.2 3.2c0 2-1 2.7-1 4.6 0 1.4.5 2.2.5 3.6Z"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M15.1 12.4h3.4c.3 1.6-.4 2.8-1.7 2.8s-2-1.2-1.7-2.8Z"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Lidded cold cup with a straw — the drinks category. */
export function ColdCupGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M5.8 8.4h12.4l-1.2 11.4a2 2 0 0 1-1.99 1.8H8.99a2 2 0 0 1-1.99-1.8Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M4.6 5.4h14.8a.9.9 0 0 1 .9.95l-.1 1.1a.9.9 0 0 1-.9.85H4.7a.9.9 0 0 1-.9-.85l-.1-1.1a.9.9 0 0 1 .9-.95Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path d="M13.4 5.4 15.6 1.8" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

/** Drumstick — the savoury category. */
export function DrumstickGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M14.4 3.1a6.1 6.1 0 0 1 4.6 10.1c-1.5 1.7-1.4 3.3-2.5 4.4a3.6 3.6 0 0 1-5.1-5.1c1.1-1.1 2.7-1 4.4-2.5"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m11.4 12.5-5 5"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
      <Circle cx={5} cy={19} r={2.4} fill="none" stroke={color} strokeWidth={1.9} />
      <Circle cx={4.8} cy={14.2} r={2.4} fill="none" stroke={color} strokeWidth={1.9} />
    </Svg>
  );
}

/** Layer cake with a candle — the dessert category. */
export function CakeGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4.4 12.4h15.2a2 2 0 0 1 2 2v6.8H2.4v-6.8a2 2 0 0 1 2-2Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M2.4 17.2c1.6 0 1.6-1.6 3.2-1.6s1.6 1.6 3.2 1.6 1.6-1.6 3.2-1.6 1.6 1.6 3.2 1.6 1.6-1.6 3.2-1.6 1.6 1.6 3.2 1.6"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path d="M12 12.4V8.6" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Path
        d="M12 8.6c-1.1 0-1.8-.7-1.8-1.7S12 3.6 12 3.6s1.8 2.3 1.8 3.3-.7 1.7-1.8 1.7Z"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Bowl with steam — the hot-food category. */
export function SoupGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3 11.6h18a9 9 0 0 1-9 9 9 9 0 0 1-9-9Z"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M8.4 8.2c0-1.4 1.2-1.6 1.2-3s-1.2-1.6-1.2-3M13.2 8.2c0-1.4 1.2-1.6 1.2-3s-1.2-1.6-1.2-3"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Cookie with chips — the snack category. */
export function CookieGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M21.2 12.2a9.2 9.2 0 1 1-9.4-9.4 3.6 3.6 0 0 0 3.5 4.3 3.6 3.6 0 0 0 3.6 3.6c.8 0 1.6-.2 2.3-.7"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={9} cy={10.2} r={1.25} fill={color} />
      <Circle cx={13.6} cy={15.4} r={1.25} fill={color} />
      <Circle cx={7.6} cy={15.8} r={1.25} fill={color} />
    </Svg>
  );
}

/** Cash register — an order rung up at the till. */
export function PosGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={12} width={20} height={9} rx={2} stroke={color} strokeWidth={2} />
      <Rect x={6} y={3} width={12} height={6} rx={1.5} stroke={color} strokeWidth={2} />
      <Path d="M6 9v3M18 9v3" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M6 16.5h4M6 19h8" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}
