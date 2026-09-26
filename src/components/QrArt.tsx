import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import Svg, { G, Rect } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { brand } from "../theme/colors";
import { BrandLogo } from "./BrandLogo";

const N = 29;

/** A tiny seeded generator, so one order always draws the same code. */
function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
}

/** True inside one of the three corner finders or their quiet margin. */
function inFinder(x: number, y: number) {
  const near = (a: number) => a <= 7;
  const far = (a: number) => a >= N - 8;
  return (near(x) && near(y)) || (far(x) && near(y)) || (near(x) && far(y));
}

/** Near the centre, where the logo sits. */
function inLogo(x: number, y: number) {
  const c = (N - 1) / 2;
  return Math.abs(x - c) <= 3 && Math.abs(y - c) <= 3;
}

/** A corner finder as three rounded squares, nothing sharp. */
function Finder({ x, y }: { x: number; y: number }) {
  return (
    <G>
      <Rect x={x} y={y} width={7} height={7} rx={2} fill={brand[900]} />
      <Rect x={x + 1} y={y + 1} width={5} height={5} rx={1.4} fill="#FFFFFF" />
      <Rect x={x + 2} y={y + 2} width={3} height={3} rx={1} fill={brand[900]} />
    </G>
  );
}

/**
 * The payment code as it will look: rounded dots in the brand's navy,
 * three soft corner finders and the outlet's logo in the middle,
 * drawn from the order so it stays put. A light sweeps down over it while
 * the member pays. Once the payment gateway is wired in, its real code
 * takes this one's place.
 */
export function QrArt({
  seed,
  size,
  brandId,
  scanning = true,
}: {
  seed: string;
  size: number;
  /** The outlet's brand, whose logo sits in the middle. */
  brandId?: string;
  scanning?: boolean;
}) {
  // 7.4 modules wide out of the 31 the drawing spans.
  const tile = (size * 7.4) / (N + 2);
  const cells = useMemo(() => {
    const next = rng(seed);
    const out: { x: number; y: number }[] = [];
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (inFinder(x, y) || inLogo(x, y)) continue;
        if (next() > 0.52) out.push({ x, y });
      }
    }
    return out;
  }, [seed]);

  const sweep = useSharedValue(0);
  const [h, setH] = useState(size);
  useEffect(() => {
    if (!scanning) return;
    sweep.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
    );
  }, [scanning, sweep]);
  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sweep.value * (h - 40) }],
  }));

  return (
    <View
      style={{ width: size, height: size }}
      onLayout={(e) => setH(e.nativeEvent.layout.height)}
    >
      <Svg width={size} height={size} viewBox={`-1 -1 ${N + 2} ${N + 2}`}>
        {cells.map(({ x, y }) => (
          <Rect
            key={`${x}-${y}`}
            x={x + 0.08}
            y={y + 0.08}
            width={0.84}
            height={0.84}
            rx={0.36}
            fill={brand[900]}
          />
        ))}
        <Finder x={0} y={0} />
        <Finder x={N - 7} y={0} />
        <Finder x={0} y={N - 7} />
      </Svg>
      {/* the outlet's logo on a white tile, dead centre over the gap */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: (size - tile) / 2,
          top: (size - tile) / 2,
          width: tile,
          height: tile,
          borderRadius: tile * 0.28,
          backgroundColor: "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {brandId ? <BrandLogo brandId={brandId} size={tile * 0.78} /> : null}
      </View>
      {scanning ? (
        <Animated.View
          pointerEvents="none"
          style={[
            { position: "absolute", left: -6, right: -6, top: 0, height: 40 },
            lineStyle,
          ]}
        >
          <LinearGradient
            colors={[
              "rgba(76,120,224,0)",
              "rgba(76,120,224,0.22)",
              "rgba(76,120,224,0)",
            ]}
            style={{ flex: 1 }}
          />
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 19,
              height: 2,
              borderRadius: 1,
              backgroundColor: "#4C78E0",
              opacity: 0.8,
            }}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}
