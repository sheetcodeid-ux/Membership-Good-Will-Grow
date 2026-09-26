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
  LinearGradient as SvgGradient,
  Path,
  RadialGradient,
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

/**
 * The stage behind the Member tab's cards: a wash in the colour of the
 * level on show (changing as the cards are swiped), a halo of light and
 * two rings behind the card, and a two-step podium the card stands on.
 * Nothing else, so the card stays the one thing to look at.
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
  const haloY = cardTop + cardHeight * 0.42;
  const podY = cardTop + cardHeight - 2;
  const podRx = cardWidth * 0.66;
  const podRy = 15;
  const depth = 15;
  const baseRx = podRx * 1.22;
  const baseY = podY + depth + 4;

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
      </Svg>
    </View>
  );
}
