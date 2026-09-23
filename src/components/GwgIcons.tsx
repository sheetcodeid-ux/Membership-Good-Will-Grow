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

/** House with an arched door; the roof meets the walls instead of floating. */
export function HomeGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M11.02 2.94a1.6 1.6 0 0 1 1.96 0l7.64 5.95c.39.3.62.77.62 1.26V18.8a2.4 2.4 0 0 1-2.4 2.4H5.16a2.4 2.4 0 0 1-2.4-2.4v-8.65c0-.49.23-.96.62-1.26Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M9.5 21.2v-3.9a2.5 2.5 0 0 1 5 0v3.9"
        fill={active ? "#FFFFFF" : "none"}
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={active ? 0 : 1.9}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Shopping bag with a folded lip and rope handles.
 *
 * A cup says "a drink"; a bag says "an order was placed", which is what this
 * tab actually opens. The fold across the top and the two handle arcs are
 * what stop it reading as a plain box.
 */
export function OrderGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M8.1 7.4V6.2a3.9 3.9 0 0 1 7.8 0v1.2"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
      <Path
        d="M4.6 7.4h14.8a1.7 1.7 0 0 1 1.69 1.87l-1.13 11.2a2 2 0 0 1-1.99 1.8H5.03a2 2 0 0 1-1.99-1.8L1.91 9.27A1.7 1.7 0 0 1 3.6 7.4Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M2.2 11.6h19.6"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={1.8}
      />
      <Path
        d="M8.6 15.1h6.8"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Membership card with a chip and a star.
 *
 * A medal reads as an award and sits awkwardly beside the profile figure,
 * since both are about a person. The card is the thing membership actually
 * gives you, and its silhouette shares nothing with the other three.
 */
export function MemberGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3.4 4.6h17.2a2.2 2.2 0 0 1 2.2 2.2v10.4a2.2 2.2 0 0 1-2.2 2.2H3.4a2.2 2.2 0 0 1-2.2-2.2V6.8a2.2 2.2 0 0 1 2.2-2.2Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M1.2 8.9h21.6"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={1.9}
      />
      <Path
        d="M16.4 11.9l.92 1.86 2.05.3-1.48 1.44.35 2.04-1.84-.96-1.84.96.35-2.04-1.48-1.44 2.05-.3Z"
        fill={active ? "#FFFFFF" : "none"}
        stroke={active ? "none" : color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Path
        d="M4.4 15.9h5"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Figure inside a rounded frame.
 *
 * A bare bust is what every avatar placeholder in the app already uses; the
 * frame is what makes this one read as "your account" instead of "a person".
 */
export function ProfileGlyph({ size = 24, color = "#000", active = false }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M5.4 2.6h13.2a2.8 2.8 0 0 1 2.8 2.8v13.2a2.8 2.8 0 0 1-2.8 2.8H5.4a2.8 2.8 0 0 1-2.8-2.8V5.4a2.8 2.8 0 0 1 2.8-2.8Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth={active ? 0 : 1.9}
        strokeLinejoin="round"
      />
      <Circle
        cx={12}
        cy={9.7}
        r={2.9}
        fill={active ? "#FFFFFF" : "none"}
        stroke={active ? "none" : color}
        strokeWidth={1.8}
      />
      <Path
        d="M6.6 19.2c0-2.86 2.42-4.8 5.4-4.8s5.4 1.94 5.4 4.8"
        fill="none"
        stroke={active ? "#FFFFFF" : color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Feather, traced off the reference rather than drawn by eye.
 *
 * Thresholding the reference art and walking its boundary showed two details
 * every earlier attempt missed: a V bitten into the top edge near the tip,
 * and a second, deeper V at the lower left splitting the blade's lobe from
 * the stem. Without those it reads as a plain leaf. Coordinates below come
 * from that trace, normalised to the 24-unit box.
 */
export function ComposeGlyph({ size = 24, color = "#000" }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M18.5 2.9c1.8-.1 3 0 3.4.2.3 1.9.2 3.3.1 4.7-.2 2-.5 3.2-1.1 4.5-.7 1.4-1.2 2.5-1.9 3.4-.5.7-.9 1-1.4 1.4-1.4 1.2-2.8 2.1-4 2.6-.8.3-1.5.4-2.2.4-1.4-.3-2.9-.7-4.2-1l-3.8 2.1c-.8.4-1.7-.2-1.4-1 .2-.5.5-.8 1-1.1 2-1.2 4.1-2.3 5.7-3.3.9-.6 1.8-1.4 2.2-2.1V12.8l-1-.4c-1.4.9-2.9 1.9-4.2 2.8l-.7.1c-.3-1.1-.3-2.1-.2-3.1.2-1.1.8-2.1 1.6-3 .8-1 1.9-2 3.1-2.8 1.1-.8 2.3-1.6 3.4-2.1l.9.2c.2.5.4 1 .7 1.3l1 .5c.6-1 1.2-1.9 1.7-2.7.3-.4.8-.6 1.3-.7Z"
        fill={color}
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
