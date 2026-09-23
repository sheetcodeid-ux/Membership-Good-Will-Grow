import React from "react";
import { View, type ViewStyle } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { UiText } from "./Text";
import { ink } from "../../theme/colors";

interface ImagePlaceholderProps {
  /** Short note about what asset goes here, e.g. "Logo" or "Foto Hero". */
  label?: string;
  radius?: number;
  iconSize?: number;
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
        strokeWidth={1.5}
        fill="none"
      />
      <Circle cx={8.6} cy={9.8} r={1.7} fill={color} />
      <Path
        d="M4.2 17.2l4.3-4.3a1.6 1.6 0 0 1 2.2 0l2.5 2.5 2-2a1.6 1.6 0 0 1 2.2 0l2.4 2.4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/**
 * Stand-in for artwork the client has not supplied yet.
 *
 * Deliberately quiet: a flat neutral panel with a single mark, so it reads as
 * "a picture belongs here" and nothing more. Anything more decorative starts
 * competing with the real design, and gets mistaken for it.
 */
export function ImagePlaceholder({
  label,
  radius = 20,
  iconSize = 28,
  style,
}: ImagePlaceholderProps) {
  return (
    <View
      style={[
        {
          backgroundColor: ink[100],
          borderRadius: radius,
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <PhotoMark size={iconSize} color={ink[300]} />
      {label ? (
        <UiText token="caption" color={ink[400]} center>
          {label}
        </UiText>
      ) : null}
    </View>
  );
}
