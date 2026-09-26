import React, { useId } from "react";
import { View, type ViewStyle } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";
import { UiText } from "./ui/Text";
import { glyphPaths, type GlyphName } from "./icons/glyphPaths";
import { LABEL_INK, QUIET_INK } from "./AccountMenu";
import { brand } from "../theme/colors";
import { fontFamilies } from "../theme/typography";

const ART = 132;
const GLYPH_SCALE = 2.5;

function Sparkle({ x, y, s }: { x: number; y: number; s: number }) {
  const k = s * 0.2;
  return (
    <Path
      d={`M${x} ${y - s}Q${x + k} ${y - k} ${x + s} ${y}Q${x + k} ${y + k} ${x} ${y + s}Q${x - k} ${y + k} ${x - s} ${y}Q${x - k} ${y - k} ${x} ${y - s}Z`}
      fill="#FFC928"
    />
  );
}

/**
 * The picture for an empty list: one of the app's glyphs modelled in the
 * same soft clay as the account header — a floating orb lit from the top
 * left with a glint and a faint shadow below, and the glyph inside it
 * raised off the orb with its own gradient and glint. No hard extruded
 * sides, so it reads as the header's gear and lock do.
 */
export function EmptyArt({
  glyph,
  size = ART,
}: {
  glyph: GlyphName;
  /** Drawn size; the art scales as a whole. */
  size?: number;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const g = 24 * GLYPH_SCALE;
  const gx = ART / 2 - g / 2;
  const gy = 60 - g / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${ART} ${ART}`}>
      <Defs>
        <RadialGradient id={`orb${id}`} cx="0.38" cy="0.32" r="0.72">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="0.5" stopColor="#DCE7FF" />
          <Stop offset="1" stopColor="#A6BFF8" />
        </RadialGradient>
        <RadialGradient id={`bounce${id}`} cx="0.62" cy="0.84" r="0.5">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.45} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id={`glint${id}`} cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.95} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id={`shadow${id}`} cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor={brand[800]} stopOpacity={0.18} />
          <Stop offset="1" stopColor={brand[800]} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient
          id={`face${id}`}
          cx="7"
          cy="5"
          r="22"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#B9CEFF" />
          <Stop offset="0.45" stopColor="#5A7ED8" />
          <Stop offset="1" stopColor={brand[600]} />
        </RadialGradient>
      </Defs>

      <Ellipse
        cx={ART / 2 + 2}
        cy={119}
        rx={36}
        ry={4.5}
        fill={`url(#shadow${id})`}
      />
      <Circle cx={ART / 2} cy={60} r={48} fill={`url(#orb${id})`} />
      <Circle cx={ART / 2} cy={60} r={48} fill={`url(#bounce${id})`} />
      <Ellipse
        cx={ART / 2 - 19}
        cy={36}
        rx={15}
        ry={8}
        fill={`url(#glint${id})`}
        transform={`rotate(-32 ${ART / 2 - 19} 36)`}
      />

      <G transform={`translate(${gx} ${gy}) scale(${GLYPH_SCALE})`}>
        <Path
          d={glyphPaths[glyph]}
          fill={brand[800]}
          fillRule="evenodd"
          opacity={0.28}
          transform="translate(0.35 0.7)"
        />
        <Path
          d={glyphPaths[glyph]}
          fill={`url(#face${id})`}
          fillRule="evenodd"
        />
        <Ellipse
          cx={7.2}
          cy={6.4}
          rx={3}
          ry={1.5}
          fill={`url(#glint${id})`}
          transform="rotate(-35 7.2 6.4)"
        />
      </G>

      <Sparkle x={112} y={24} s={7} />
      <Sparkle x={100} y={8} s={3.6} />
      <Sparkle x={18} y={84} s={4.6} />
      <Circle cx={26} cy={30} r={2.4} fill="#FFC928" />
    </Svg>
  );
}

/** Empty list: the clay picture, a firm title and a quiet line under it. */
export function AccountEmpty({
  glyph,
  title,
  subtitle,
  style,
}: {
  glyph: GlyphName;
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 36,
          paddingBottom: 40,
        },
        style,
      ]}
    >
      <EmptyArt glyph={glyph} />
      <UiText
        color={LABEL_INK}
        center
        style={{
          marginTop: 14,
          fontSize: 17,
          lineHeight: 22,
          fontFamily: fontFamilies.bold,
        }}
      >
        {title}
      </UiText>
      {subtitle ? (
        <UiText
          color={QUIET_INK}
          center
          style={{
            marginTop: 6,
            fontSize: 13.5,
            lineHeight: 19,
            fontFamily: fontFamilies.medium,
          }}
        >
          {subtitle}
        </UiText>
      ) : null}
    </View>
  );
}
