import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient as SvgGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { surface } from "../theme/colors";

/** The stage's wash for each level, top to middle; it fades to the page. */
const TINTS: Record<string, readonly [string, string]> = {
  classic: ["#D3E1FF", "#E9F0FF"],
  signature: ["#CDEFE7", "#E6F7F2"],
  elite: ["#E0D9FF", "#EFEBFF"],
  royale: ["#F8E3AE", "#FBF1D8"],
};

/** A five-point star with rounded tips, for the coins' faces. */
const STAR =
  "M0 -5.6C0.5 -5.6 0.8 -5.3 1 -4.9L2.2 -2.4L5 -2C5.5 -1.9 5.8 -1.6 5.9 -1.1C6 -0.7 5.8 -0.3 5.5 0L3.5 2L4 4.8C4.1 5.3 3.9 5.7 3.5 6C3.1 6.2 2.7 6.2 2.3 6L0 4.7L-2.3 6C-2.7 6.2 -3.1 6.2 -3.5 6C-3.9 5.7 -4.1 5.3 -4 4.8L-3.5 2L-5.5 0C-5.8 -0.3 -6 -0.7 -5.9 -1.1C-5.8 -1.6 -5.5 -1.9 -5 -2L-2.2 -2.4L-1 -4.9C-0.8 -5.3 -0.5 -5.6 0 -5.6Z";

/** One level's wash, shown while its card is on stage. */
function Tint({
  index,
  colors,
  x,
  pageWidth,
}: {
  index: number;
  colors: readonly [string, string];
  x: SharedValue<number>;
  pageWidth: number;
}) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(
      x.value / pageWidth,
      [index - 1, index, index + 1],
      [0, 1, 0],
      Extrapolation.CLAMP,
    ),
  }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <LinearGradient
        colors={[colors[0], colors[1], surface]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

/** A gold points coin, tilted, with a rim and a star on its face. */
function Coin({
  x,
  y,
  r,
  tilt,
}: {
  x: number;
  y: number;
  r: number;
  tilt: number;
}) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <Ellipse
        cx={1.5}
        cy={r + 7}
        rx={r * 0.8}
        ry={2.4}
        fill="#0B2B73"
        opacity={0.1}
      />
      <Ellipse cx={r * 0.16} cy={r * 0.1} rx={r * 0.72} ry={r} fill="#C98A00" />
      <Ellipse cx={0} cy={0} rx={r * 0.72} ry={r} fill="url(#mhCoin)" />
      <Ellipse
        cx={0}
        cy={0}
        rx={r * 0.52}
        ry={r * 0.74}
        fill="none"
        stroke="#E9AB00"
        strokeOpacity={0.7}
        strokeWidth={1}
      />
      <Path
        d={STAR}
        fill="#E5A100"
        transform={`scale(${(r / 13) * 0.62} ${(r / 13) * 0.86})`}
      />
      <Ellipse
        cx={-r * 0.3}
        cy={-r * 0.5}
        rx={r * 0.16}
        ry={r * 0.3}
        fill="#FFFFFF"
        opacity={0.7}
      />
    </G>
  );
}

/** A wrapped present in the brand blue with a gold ribbon and bow. */
function Gift({ x, y, tilt }: { x: number; y: number; tilt: number }) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <Ellipse cx={2} cy={25} rx={20} ry={3.2} fill="#0B2B73" opacity={0.1} />
      {/* box */}
      <Rect x={-17} y={-6} width={34} height={28} rx={5} fill="url(#mhBox)" />
      <Rect
        x={6}
        y={-6}
        width={11}
        height={28}
        rx={4}
        fill="#0B2B73"
        opacity={0.18}
      />
      {/* lid */}
      <Rect
        x={-20}
        y={-14}
        width={40}
        height={11}
        rx={4.5}
        fill="url(#mhLid)"
      />
      <Rect
        x={-17}
        y={-12.6}
        width={22}
        height={2.6}
        rx={1.3}
        fill="#FFFFFF"
        opacity={0.45}
      />
      {/* ribbon */}
      <Rect x={-4} y={-14} width={8} height={36} rx={2} fill="url(#mhRibbon)" />
      {/* bow */}
      <Ellipse
        cx={-7}
        cy={-18.5}
        rx={7.5}
        ry={4.6}
        fill="url(#mhRibbon)"
        transform="rotate(-24 -7 -18.5)"
      />
      <Ellipse
        cx={7}
        cy={-18.5}
        rx={7.5}
        ry={4.6}
        fill="url(#mhRibbon)"
        transform="rotate(24 7 -18.5)"
      />
      <Ellipse
        cx={-7}
        cy={-18.5}
        rx={3.2}
        ry={1.8}
        fill="#B8871F"
        opacity={0.5}
        transform="rotate(-24 -7 -18.5)"
      />
      <Ellipse
        cx={7}
        cy={-18.5}
        rx={3.2}
        ry={1.8}
        fill="#B8871F"
        opacity={0.5}
        transform="rotate(24 7 -18.5)"
      />
      <Circle cx={0} cy={-15.5} r={3.8} fill="#F2C44D" />
    </G>
  );
}

/** A promo coupon with a percent mark. */
function Coupon({ x, y, tilt }: { x: number; y: number; tilt: number }) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <Ellipse cx={2} cy={19} rx={18} ry={2.6} fill="#0B2B73" opacity={0.1} />
      <Rect x={-19} y={-11} width={40} height={24} rx={6} fill="#D9435F" />
      <Rect
        x={-21}
        y={-13}
        width={40}
        height={24}
        rx={6}
        fill="url(#mhCoupon)"
      />
      <Rect
        x={-18}
        y={-11}
        width={24}
        height={2.6}
        rx={1.3}
        fill="#FFFFFF"
        opacity={0.4}
      />
      <Path
        d="M7 -8 L7 8"
        stroke="#FFFFFF"
        strokeOpacity={0.55}
        strokeWidth={1.2}
        strokeDasharray="2 2.4"
        strokeLinecap="round"
      />
      {/* percent */}
      <Path
        d="M-5 4 L3 -6"
        stroke="#FFFFFF"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <Circle cx={-5.2} cy={-4.6} r={2.2} fill="#FFFFFF" />
      <Circle cx={3.2} cy={2.8} r={2.2} fill="#FFFFFF" />
      <Circle cx={13} cy={-1} r={2.6} fill="#FFFFFF" opacity={0.85} />
    </G>
  );
}

/**
 * The stage behind the Member tab's cards: a wash in the colour of the
 * level on show (changing as the cards are swiped), a halo of light and
 * two rings behind the card, a two-step podium the card stands on, and
 * the rewards of membership floating at its sides: a gift, points coins,
 * a coupon and a little confetti. Soft, rounded shapes only.
 */
export function MemberHeroArt({
  width,
  height,
  cardTop,
  cardWidth,
  cardHeight,
  x,
  pageWidth,
  tierIds,
}: {
  width: number;
  height: number;
  cardTop: number;
  cardWidth: number;
  cardHeight: number;
  x: SharedValue<number>;
  pageWidth: number;
  tierIds: string[];
}) {
  const cx = width / 2;
  const side = (width - cardWidth) / 2;
  const haloY = cardTop + cardHeight * 0.42;
  const podY = cardTop + cardHeight - 2;
  const podRx = cardWidth * 0.66;
  const podRy = 15;
  const depth = 15;
  const baseRx = podRx * 1.22;
  const baseY = podY + depth + 4;

  const confetti: [number, number, number, string][] = [
    [side * 0.35, cardTop - 4, -30, "#FFC83D"],
    [side * 1.05, cardTop - 16, 24, "#6D8FE0"],
    [width - side * 1.1, cardTop - 12, -18, "#FF7A8A"],
    [width - side * 0.3, cardTop + 8, 36, "#3CCBB7"],
    [side * 0.25, cardTop + cardHeight * 0.48, 60, "#FF7A8A"],
    [width - side * 0.22, cardTop + cardHeight * 0.44, -50, "#FFC83D"],
    [side * 0.55, cardTop + cardHeight * 0.86, 18, "#3CCBB7"],
    [width - side * 0.6, cardTop + cardHeight * 0.84, -28, "#6D8FE0"],
  ];

  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", left: 0, top: 0, width, height }}
    >
      <LinearGradient
        colors={[TINTS.classic[0], TINTS.classic[1], surface]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      {tierIds.map((id, i) => (
        <Tint
          key={id}
          index={i}
          colors={TINTS[id] ?? TINTS.classic}
          x={x}
          pageWidth={pageWidth}
        />
      ))}

      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="mhHalo" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.9} />
            <Stop offset="0.6" stopColor="#FFFFFF" stopOpacity={0.35} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="mhCoin" cx="0.35" cy="0.3" r="0.8">
            <Stop offset="0" stopColor="#FFF3B0" />
            <Stop offset="0.5" stopColor="#FFD21A" />
            <Stop offset="1" stopColor="#EBAA00" />
          </RadialGradient>
          <SvgGradient id="mhBox" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#6D8FE0" />
            <Stop offset="1" stopColor="#123CA3" />
          </SvgGradient>
          <SvgGradient id="mhLid" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#9BB9FF" />
            <Stop offset="1" stopColor="#4066C2" />
          </SvgGradient>
          <SvgGradient id="mhRibbon" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFE38A" />
            <Stop offset="1" stopColor="#E0A21C" />
          </SvgGradient>
          <SvgGradient id="mhCoupon" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FF9A8A" />
            <Stop offset="1" stopColor="#F0506E" />
          </SvgGradient>
          <SvgGradient id="mhPodTop" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" />
            <Stop offset="1" stopColor="#E3EAF8" />
          </SvgGradient>
          <SvgGradient id="mhPodSide" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#C4D1EE" />
            <Stop offset="0.5" stopColor="#DCE4F6" />
            <Stop offset="1" stopColor="#B6C5E8" />
          </SvgGradient>
          <RadialGradient id="mhFloor" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#0B2B73" stopOpacity={0.16} />
            <Stop offset="1" stopColor="#0B2B73" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {/* halo and rings behind the card */}
        <Circle cx={cx} cy={haloY} r={cardWidth * 0.95} fill="url(#mhHalo)" />
        <Circle
          cx={cx}
          cy={haloY}
          r={cardWidth * 0.74}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity={0.9}
          strokeWidth={1.4}
        />
        <Circle
          cx={cx}
          cy={haloY}
          r={cardWidth * 0.98}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity={0.55}
          strokeWidth={1.2}
        />

        {/* two-step podium */}
        <Ellipse
          cx={cx}
          cy={baseY + 16}
          rx={baseRx * 1.08}
          ry={9}
          fill="url(#mhFloor)"
        />
        <Path
          d={`M${cx - baseRx} ${baseY} L${cx - baseRx} ${baseY + 8} A${baseRx} ${podRy * 0.9} 0 0 0 ${cx + baseRx} ${baseY + 8} L${cx + baseRx} ${baseY} Z`}
          fill="url(#mhPodSide)"
        />
        <Ellipse
          cx={cx}
          cy={baseY}
          rx={baseRx}
          ry={podRy * 0.9}
          fill="url(#mhPodTop)"
        />
        <Path
          d={`M${cx - podRx} ${podY} L${cx - podRx} ${podY + depth} A${podRx} ${podRy} 0 0 0 ${cx + podRx} ${podY + depth} L${cx + podRx} ${podY} Z`}
          fill="url(#mhPodSide)"
        />
        <Ellipse
          cx={cx}
          cy={podY}
          rx={podRx}
          ry={podRy}
          fill="url(#mhPodTop)"
        />
        <Ellipse
          cx={cx}
          cy={podY}
          rx={podRx - 1}
          ry={podRy - 1}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={1.4}
        />

        {/* rewards floating at the sides */}
        <Gift x={side * 0.52} y={cardTop + cardHeight * 0.3} tilt={-12} />
        <Coin
          x={side * 0.58}
          y={cardTop + cardHeight * 0.64}
          r={12}
          tilt={-16}
        />
        <Coin
          x={width - side * 0.55}
          y={cardTop + cardHeight * 0.17}
          r={12}
          tilt={14}
        />
        <Coin
          x={width - side * 0.26}
          y={cardTop + cardHeight * 0.31}
          r={7.5}
          tilt={-20}
        />
        <Coupon
          x={width - side * 0.5}
          y={cardTop + cardHeight * 0.58}
          tilt={16}
        />

        {/* confetti */}
        {confetti.map(([px, py, rot, fill], i) => (
          <Rect
            key={i}
            x={px - 4.5}
            y={py - 1.8}
            width={9}
            height={3.6}
            rx={1.8}
            fill={fill}
            transform={`rotate(${rot} ${px} ${py})`}
          />
        ))}
      </Svg>
    </View>
  );
}
