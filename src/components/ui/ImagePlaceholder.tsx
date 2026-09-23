import React, { useMemo } from "react";
import { View, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Defs, G, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { AppText } from "./AppText";
import { brand } from "../../theme/colors";

interface ImagePlaceholderProps {
  /** Short note about what asset goes here, e.g. "Logo" or "Foto Hero". */
  label?: string;
  radius?: number;
  iconSize?: number;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Stand-in for artwork the client has not supplied yet.
 *
 * This used to be a grey dashed box, which read as an unfinished wireframe
 * everywhere it appeared — and it appears on nearly every screen. It is now a
 * finished-looking surface instead: a brand gradient, a soft light source, and
 * a faint geometric pattern, with the label carried in a small glass chip so
 * it still says plainly that real artwork belongs here.
 *
 * The gradient is picked from the label, so the same slot keeps the same
 * colour between renders while different slots do not all look identical.
 */
const palettes: [string, string, string][] = [
  ["#0B2B73", "#123CA3", "#4066C2"],
  ["#0E3A6B", "#1C6B8C", "#3FA3AE"],
  ["#081E50", "#2A2F7E", "#5B4BC4"],
  ["#123CA3", "#5B4BC4", "#9B6DD6"],
  ["#0B2B73", "#7A4E8C", "#C97FA8"],
  ["#10325E", "#B9852A", "#EAC584"],
  ["#0D2F7E", "#4066C2", "#9BB9FF"],
  ["#0A2A4A", "#166B5B", "#57B894"],
];

function hashOf(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Faint shapes that give the surface something to catch the eye. */
function Pattern({ seed }: { seed: number }) {
  const rotation = seed % 40;
  return (
    <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <RadialGradient id="glow" cx="24%" cy="16%" r="72%">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.30} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect width="100" height="100" fill="url(#glow)" />
      <G opacity={0.14} transform={`rotate(${rotation} 50 50)`}>
        <Circle cx={18} cy={78} r={30} fill="none" stroke="#FFFFFF" strokeWidth={0.8} />
        <Circle cx={18} cy={78} r={20} fill="none" stroke="#FFFFFF" strokeWidth={0.8} />
        <Circle cx={88} cy={20} r={26} fill="none" stroke="#FFFFFF" strokeWidth={0.8} />
        <Path d="M-10 60 Q 30 34 70 52 T 130 40" fill="none" stroke="#FFFFFF" strokeWidth={0.9} />
        <Path d="M-10 72 Q 34 48 74 64 T 130 54" fill="none" stroke="#FFFFFF" strokeWidth={0.7} />
      </G>
    </Svg>
  );
}

export function ImagePlaceholder({
  label,
  radius = 20,
  iconSize = 28,
  style,
}: ImagePlaceholderProps) {
  const seed = useMemo(() => hashOf(label ?? "gwg"), [label]);
  const colors = palettes[seed % palettes.length];
  const chip = Math.max(9, Math.min(12, iconSize * 0.42));

  return (
    <View
      style={[
        { borderRadius: radius, overflow: "hidden", backgroundColor: brand[900] },
        style,
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ ...StyleSheetAbsolute }}
      />
      <View style={{ ...StyleSheetAbsolute }}>
        <Pattern seed={seed} />
      </View>

      {label ? (
        <View
          style={{
            position: "absolute",
            left: 10,
            top: 10,
            paddingHorizontal: 9,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.18)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.28)",
          }}
        >
          <AppText
            color="rgba(255,255,255,0.92)"
            numberOfLines={1}
            style={{ fontSize: chip, lineHeight: chip * 1.35, fontFamily: "Urbanist_600SemiBold" }}
          >
            {label}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const StyleSheetAbsolute = {
  position: "absolute" as const,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};
