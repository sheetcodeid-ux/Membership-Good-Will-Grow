import React from "react";
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
import { brand } from "../theme/colors";

/**
 * The picture on the "complete your profile" card: a gift whose lid has
 * just popped, a points coin floating beside it, on the cream clouds the
 * reference tucks into the card's bottom-right corner.
 *
 * Same soft, clay-like 3D as the account header — volume from gradients,
 * bounce light along lower edges, blurred glints, no hard extruded sides.
 * Coordinates are dp; the art sits in the card's bottom-right corner and
 * the card clips it.
 */
export const REWARD_ART_W = 112;
export const REWARD_ART_H = 98;

const STAR =
  "M0 -5.6C0.5 -5.6 0.8 -5.3 1 -4.9L2.2 -2.4L5 -2C5.5 -1.9 5.8 -1.6 5.9 -1.1C6 -0.7 5.8 -0.3 5.5 0L3.5 2L4 4.8C4.1 5.3 3.9 5.7 3.5 6C3.1 6.2 2.7 6.2 2.3 6L0 4.7L-2.3 6C-2.7 6.2 -3.1 6.2 -3.5 6C-3.9 5.7 -4.1 5.3 -4 4.8L-3.5 2L-5.5 0C-5.8 -0.3 -6 -0.7 -5.9 -1.1C-5.8 -1.6 -5.5 -1.9 -5 -2L-2.2 -2.4L-1 -4.9C-0.8 -5.3 -0.5 -5.6 0 -5.6Z";

function Sparkle({ x, y, s }: { x: number; y: number; s: number }) {
  const k = s * 0.2;
  return (
    <Path
      d={`M${x} ${y - s}Q${x + k} ${y - k} ${x + s} ${y}Q${x + k} ${y + k} ${x} ${y + s}Q${x - k} ${y + k} ${x - s} ${y}Q${x - k} ${y - k} ${x} ${y - s}Z`}
      fill="url(#rwSpark)"
    />
  );
}

export function RewardArt() {
  return (
    <Svg
      width={REWARD_ART_W}
      height={REWARD_ART_H}
      viewBox={`0 0 ${REWARD_ART_W} ${REWARD_ART_H}`}
    >
      <Defs>
        <RadialGradient id="rwBox" cx="0.3" cy="0.22" r="0.95">
          <Stop offset="0" stopColor="#9DB8FF" />
          <Stop offset="0.5" stopColor="#4D72D2" />
          <Stop offset="1" stopColor={brand[600]} />
        </RadialGradient>
        <RadialGradient id="rwLid" cx="0.3" cy="0.2" r="0.95">
          <Stop offset="0" stopColor="#B7CCFF" />
          <Stop offset="0.55" stopColor="#5F82DB" />
          <Stop offset="1" stopColor={brand[500]} />
        </RadialGradient>
        <RadialGradient id="rwBounce" cx="0.65" cy="0.9" r="0.55">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.4} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id="rwRibbon" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#FFE77A" />
          <Stop offset="0.55" stopColor="#FFD21A" />
          <Stop offset="1" stopColor="#E9AB00" />
        </LinearGradient>
        <LinearGradient id="rwLidShade" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={brand[900]} stopOpacity={0.3} />
          <Stop offset="1" stopColor={brand[900]} stopOpacity={0} />
        </LinearGradient>
        <RadialGradient id="rwBow" cx="0.35" cy="0.3" r="0.8">
          <Stop offset="0" stopColor="#FFF1A8" />
          <Stop offset="0.55" stopColor="#FFD21A" />
          <Stop offset="1" stopColor="#E5A500" />
        </RadialGradient>
        <RadialGradient id="rwCoin" cx="0.35" cy="0.3" r="0.8">
          <Stop offset="0" stopColor="#FFF3B0" />
          <Stop offset="0.5" stopColor="#FFD21A" />
          <Stop offset="1" stopColor="#EBAA00" />
        </RadialGradient>
        <LinearGradient id="rwCoinEdge" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#F0B400" />
          <Stop offset="1" stopColor="#C98A00" />
        </LinearGradient>
        <RadialGradient id="rwGlint" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.95} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="rwShadow" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#B07A00" stopOpacity={0.28} />
          <Stop offset="1" stopColor="#B07A00" stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id="rwSpark" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFE66B" />
          <Stop offset="1" stopColor="#FFC400" />
        </LinearGradient>
      </Defs>

      {/* cream clouds in the corner, flat like the header's backdrop */}
      <G fill="#FFEDC2">
        <Circle cx="30" cy="108" r="16" />
        <Circle cx="58" cy="104" r="18" />
        <Circle cx="86" cy="92" r="19" />
        <Circle cx="110" cy="72" r="18" />
        <Circle cx="112" cy="100" r="22" />
      </G>

      {/* points coin, floating and tipped, its edge showing */}
      <G transform="rotate(-12 20 34)">
        <Ellipse cx="21.6" cy="34" rx="8.6" ry="10.6" fill="url(#rwCoinEdge)" />
        <Ellipse cx="20" cy="34" rx="8.6" ry="10.6" fill="url(#rwCoin)" />
        <Ellipse
          cx="20"
          cy="34"
          rx="6.1"
          ry="7.9"
          fill="none"
          stroke="#E9AB00"
          strokeOpacity={0.55}
          strokeWidth={1}
        />
        <Path
          d={STAR}
          fill="#E5A100"
          transform="translate(20 34.4) scale(0.72 0.84)"
        />
        <Ellipse
          cx="16.6"
          cy="28.6"
          rx="2.8"
          ry="1.5"
          fill="url(#rwGlint)"
          transform="rotate(-50 16.6 28.6)"
        />
      </G>

      {/* the gift */}
      <Ellipse cx="57" cy="88.5" rx="27" ry="3.6" fill="url(#rwShadow)" />
      <Rect x="36" y="54" width="42" height="32" rx="7" fill="url(#rwBox)" />
      <Rect x="36" y="54" width="42" height="32" rx="7" fill="url(#rwBounce)" />
      <Rect
        x="36"
        y="54"
        width="42"
        height="12"
        rx="7"
        fill="url(#rwLidShade)"
      />
      <Rect x="53" y="54" width="8" height="32" fill="url(#rwRibbon)" />
      <Ellipse
        cx="43.5"
        cy="64"
        rx="3.4"
        ry="1.6"
        fill="url(#rwGlint)"
        transform="rotate(-30 43.5 64)"
      />

      {/* lid, just popped open: lifted and tipped, sparkles escaping */}
      <Sparkle x={86} y={28} s={5.6} />
      <Sparkle x={75} y={17} s={3.2} />
      <Circle cx="93" cy="42" r="1.4" fill="#FFD21A" />
      <G transform="rotate(-10 32 52) translate(0 -3)">
        <Rect x="32" y="42" width="50" height="14" rx="6" fill="url(#rwLid)" />
        <Rect
          x="32"
          y="42"
          width="50"
          height="14"
          rx="6"
          fill="url(#rwBounce)"
        />
        <Rect x="53" y="42" width="8" height="14" fill="url(#rwRibbon)" />
        <Ellipse cx="40" cy="45.4" rx="4" ry="1.4" fill="url(#rwGlint)" />
        {/* bow standing on the lid: two plump loops and a knot */}
        {[1, -1].map((d) => (
          <G
            key={d}
            transform={`translate(57 0) scale(${d} 1) translate(-57 0)`}
          >
            <Path
              d="M57 42.5C52.4 34 44.6 29.4 42.4 33.6C40.6 37.4 48.6 42 57 42.5Z"
              fill="url(#rwBow)"
            />
            <Path
              d="M54.6 40.6C51.4 36.6 47.4 34.6 46.4 36.2C45.6 37.6 49.4 40 54.6 40.6Z"
              fill="#D99A00"
              opacity={0.5}
            />
          </G>
        ))}
        <Circle cx="57" cy="42.2" r="3.4" fill="url(#rwBow)" />
        <Ellipse cx="45.4" cy="33.4" rx="1.8" ry="0.9" fill="url(#rwGlint)" />
      </G>
    </Svg>
  );
}
