import React, { useId } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { glyphPaths, type GlyphName } from "./icons/glyphPaths";
import type { MenuItem } from "../data/types";

/** Background, then the glyph's light, body and shade, per category. */
type Palette = {
  bg: [string, string];
  light: string;
  body: string;
  shade: string;
  glyph: GlyphName;
};

const PALETTES: Record<string, Palette> = {
  coffee: {
    bg: ["#FCEEDF", "#F1D1B1"],
    light: "#F6D2AE",
    body: "#B97842",
    shade: "#6E3C1C",
    glyph: "coffee",
  },
  "non-coffee": {
    bg: ["#EAF6E6", "#CBE8C4"],
    light: "#CBEBBE",
    body: "#57A04C",
    shade: "#2E6B2B",
    glyph: "coldCup",
  },
  dimsum: {
    bg: ["#FFF3E0", "#FBDDB3"],
    light: "#FFE7B0",
    body: "#E2A33A",
    shade: "#9A6212",
    glyph: "dimsum",
  },
  kue: {
    bg: ["#FFEBF1", "#F8CBD9"],
    light: "#FFCADB",
    body: "#D9587F",
    shade: "#8F2349",
    glyph: "cake",
  },
  food: {
    bg: ["#FFEDE2", "#FBCCB0"],
    light: "#FFC8A1",
    body: "#E0692B",
    shade: "#973A0E",
    glyph: "drumstick",
  },
  snack: {
    bg: ["#FFF7DA", "#FBE59C"],
    light: "#FFE88F",
    body: "#E0AA10",
    shade: "#8A6205",
    glyph: "cookie",
  },
  merch: {
    bg: ["#EAF0FF", "#CCDAFF"],
    light: "#C9D8FF",
    body: "#4F76D6",
    shade: "#123CA3",
    glyph: "coldCup",
  },
};

const FALLBACK = PALETTES.merch;

/** Chocolate, for the cocoa drinks on the non-coffee menu. */
const CHOCO: Palette = {
  bg: ["#F7E9E2", "#E6C8B8"],
  light: "#E2B79E",
  body: "#8A4B2C",
  shade: "#4A2412",
  glyph: "coldCup",
};

/**
 * Items that should not look like their neighbours: iced drinks in a
 * cup, cocoa in chocolate, rice dishes in a bowl.
 */
const ITEM_ART: Record<string, Partial<Palette>> = {
  "coffee-creamy": { glyph: "coldCup" },
  "arabika-coffee-milk": { glyph: "coldCup" },
  "arenga-coffee": { glyph: "coldCup" },
  "choco-hazelnut": CHOCO,
  "nasi-ayam-bakar": { glyph: "bowl" },
  "kentang-goreng": { glyph: "cookie" },
};

export function menuPalette(categoryId: string | undefined) {
  return (categoryId && PALETTES[categoryId]) || FALLBACK;
}

/**
 * The picture for a menu item until its photo is shot: the category's
 * glyph modelled in soft clay on a warm tile in the category's colour —
 * a plate of light behind it, a glint, a shadow under it and a couple of
 * sparkles — the same hand as the account and empty-state art. Coffee is
 * caramel, matcha green, dimsum golden, cakes pink, fried chicken orange.
 *
 * Fills whatever box it is given; the scene keeps to the middle square.
 */
export function MenuArt({
  item,
  categoryId,
  radius = 14,
  style,
  big,
}: {
  item?: MenuItem;
  categoryId?: string;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  /** The product sheet's hero: larger glyph, more sparkle. */
  big?: boolean;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const p: Palette = {
    ...menuPalette(item?.categoryId ?? categoryId),
    ...(item ? ITEM_ART[item.id] : undefined),
  };
  const g = big ? 2.9 : 3.1;
  const size = 24 * g;
  const gx = 50 - size / 2;
  const gy = 48 - size / 2;
  return (
    <View style={[{ borderRadius: radius, overflow: "hidden" }, style]}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        // the hero shows the whole scene; tiles crop to fill
        preserveAspectRatio={big ? "xMidYMid meet" : "xMidYMid slice"}
      >
        <Defs>
          <LinearGradient id={`bg${id}`} x1="0" y1="0" x2="0.4" y2="1">
            <Stop offset="0" stopColor={p.bg[0]} />
            <Stop offset="1" stopColor={p.bg[1]} />
          </LinearGradient>
          <RadialGradient id={`plate${id}`} cx="0.42" cy="0.36" r="0.62">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.95} />
            <Stop offset="0.7" stopColor="#FFFFFF" stopOpacity={0.35} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient
            id={`face${id}`}
            cx="7"
            cy="5"
            r="22"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor={p.light} />
            <Stop offset="0.5" stopColor={p.body} />
            <Stop offset="1" stopColor={p.shade} />
          </RadialGradient>
          <RadialGradient id={`glint${id}`} cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.95} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id={`drop${id}`} cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor={p.shade} stopOpacity={0.28} />
            <Stop offset="1" stopColor={p.shade} stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Rect x={-50} y={-50} width={200} height={200} fill={`url(#bg${id})`} />
        {/* a soft diagonal sheen across the tile */}
        <Path d="M-10 30L40 -10H62L-10 52Z" fill="#FFFFFF" opacity={0.18} />
        <Circle cx={50} cy={48} r={big ? 36 : 34} fill={`url(#plate${id})`} />
        <Ellipse
          cx={51}
          cy={big ? 88 : 86}
          rx={big ? 27 : 24}
          ry={4.2}
          fill={`url(#drop${id})`}
        />

        <G transform={`translate(${gx} ${gy}) scale(${g})`}>
          <Path
            d={glyphPaths[p.glyph]}
            fill={p.shade}
            fillRule="evenodd"
            opacity={0.3}
            transform="translate(0.45 0.9)"
          />
          <Path
            d={glyphPaths[p.glyph]}
            fill={`url(#face${id})`}
            fillRule="evenodd"
          />
          <Ellipse
            cx={7.4}
            cy={6.6}
            rx={3.1}
            ry={1.5}
            fill={`url(#glint${id})`}
            transform="rotate(-35 7.4 6.6)"
          />
        </G>

        {/* sparkles, rounded all round */}
        <Path
          d="M82 16q1.4 5 6 6.2q-4.6 1.4 -6 6.2q-1.4 -4.8 -6 -6.2q4.6 -1.2 6 -6.2z"
          fill="#FFFFFF"
          opacity={0.95}
        />
        <Circle cx={18} cy={24} r={2.2} fill="#FFFFFF" opacity={0.85} />
        {big ? (
          <>
            <Path
              d="M16 70q1 3.6 4.4 4.6q-3.4 1 -4.4 4.6q-1 -3.6 -4.4 -4.6q3.4 -1 4.4 -4.6z"
              fill="#FFFFFF"
              opacity={0.9}
            />
            <Circle cx={88} cy={62} r={1.8} fill="#FFFFFF" opacity={0.8} />
          </>
        ) : null}
      </Svg>
    </View>
  );
}
