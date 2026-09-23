import React, { useId, useMemo } from "react";
import { View, type ViewStyle } from "react-native";
import Svg, {
  Circle,
  Defs,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { UiText } from "./Text";
import { brand, ink } from "../../theme/colors";

interface ImagePlaceholderProps {
  /** Short note about what asset goes here, e.g. "Logo" or "Foto Hero". */
  label?: string;
  radius?: number;
  iconSize?: number;
  /**
   * Shifts the colour mesh. Passing the post id or index keeps neighbouring
   * placeholders from coming out identical, which is what made a column of
   * them read as one broken image repeated.
   */
  seed?: string | number;
  style?: ViewStyle | ViewStyle[];
}

/** Mountain-and-sun mark, drawn so it keeps its weight at any size. */
function PhotoMark({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect
        x={2.4}
        y={4.4}
        width={19.2}
        height={15.2}
        rx={3}
        stroke={color}
        strokeWidth={1.6}
        fill="none"
      />
      <Circle cx={8.6} cy={9.8} r={1.7} fill={color} />
      <Path
        d="M4.2 17.2l4.3-4.3a1.6 1.6 0 0 1 2.2 0l2.5 2.5 2-2a1.6 1.6 0 0 1 2.2 0l2.4 2.4"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/**
 * Four ways the mesh can come out: [base, blob A, blob B].
 *
 * A single hue for every slot made the feed look like one image failing to
 * load over and over. Real photographs differ from their neighbours, so the
 * placeholders have to as well, or the column reads as an error state.
 */
const PALETTES: [string, string, string][] = [
  ["#E7EDFA", "#C3D5FF", "#DCE5F8"],
  ["#F3EEE4", "#F2DFB4", "#E4E7F3"],
  ["#E6F0EC", "#BFDCCE", "#DDE8F2"],
  ["#EFEAF4", "#D6CBE9", "#DCE4F6"],
];

/**
 * Deterministic 0..1 from the seed, so a given slot always looks the same.
 *
 * FNV-1a with a final avalanche rather than the usual `h * 31 + c`: that one
 * leaves near-identical inputs near-identical outputs, so "p1" and "p2"
 * landed in the same bucket and every post in the feed drew the same
 * palette — exactly the repetition the palettes exist to break.
 */
function hash(seed: string | number) {
  const str = String(seed);
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

/**
 * Stand-in for artwork the client has not supplied yet.
 *
 * It used to be a flat grey panel, on the reasoning that a quiet placeholder
 * cannot be mistaken for the design. In a feed that backfired: a column of
 * identical grey boxes is the single thing that made the whole app read as a
 * wireframe, whatever was built around it.
 *
 * So it is a designed surface now — a soft two-point colour mesh in the brand
 * tints, under a frosted disc holding the mark. Still unmistakably empty (no
 * detail, no subject, and it keeps its label), but it sits in the layout at
 * the same weight a photograph will, so the page around it can be judged.
 */
export function ImagePlaceholder({
  label,
  radius = 20,
  iconSize = 28,
  seed = 0,
  style,
}: ImagePlaceholderProps) {
  /**
   * Gradient ids are global to the document, not scoped to their <Svg>. With
   * every card defining "a" and "b", the first one mounted won for all of
   * them and the whole feed drew one palette however the seeds differed.
   * React's id has colons in it, which url(#...) will not take.
   */
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const idA = `ph-a-${uid}`;
  const idB = `ph-b-${uid}`;

  const mesh = useMemo(() => {
    const t = hash(seed);
    const palette = PALETTES[Math.floor(t * PALETTES.length) % PALETTES.length];
    return {
      palette,
      // Two blobs pulled to opposite corners, their positions drifting with
      // the seed so adjacent slots never line up.
      ax: `${24 + t * 28}%`,
      ay: `${18 + t * 24}%`,
      bx: `${74 - t * 26}%`,
      by: `${78 + t * 14}%`,
    };
  }, [seed]);

  return (
    <View
      style={[
        {
          backgroundColor: mesh.palette[0],
          borderRadius: radius,
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Svg width="100%" height="100%" style={{ position: "absolute" }}>
        <Defs>
          <RadialGradient id={idA} cx={mesh.ax} cy={mesh.ay} r="78%">
            <Stop offset="0" stopColor={mesh.palette[1]} stopOpacity={1} />
            <Stop offset="0.6" stopColor={mesh.palette[1]} stopOpacity={0.45} />
            <Stop offset="1" stopColor={mesh.palette[1]} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id={idB} cx={mesh.bx} cy={mesh.by} r="70%">
            <Stop offset="0" stopColor={mesh.palette[2]} stopOpacity={1} />
            <Stop offset="1" stopColor={mesh.palette[2]} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${idA})`} />
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${idB})`} />
      </Svg>

      {/* The disc is what keeps the mark legible wherever the mesh lands. */}
      <View
        style={{
          width: iconSize * 1.9,
          height: iconSize * 1.9,
          borderRadius: iconSize,
          backgroundColor: "rgba(255,255,255,0.62)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.85)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PhotoMark size={iconSize} color={brand[400]} />
      </View>

      {label ? (
        <UiText token="caption" color={ink[500]} center>
          {label}
        </UiText>
      ) : null}
    </View>
  );
}
