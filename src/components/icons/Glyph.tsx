import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { glyphPaths, type GlyphName } from "./glyphPaths";

export type { GlyphName };

/**
 * One mark from the app's glyph set.
 *
 * A single path, filled even-odd, so the knocked-out detail is a true hole:
 * whatever the glyph sits on — a card, a tinted chip, a gold strip — shows
 * through without the call site passing its background colour.
 */
export function Glyph({
  name,
  size = 24,
  color = "#484949",
  rotate = 0,
}: {
  name: GlyphName;
  size?: number;
  color?: string;
  /** Quarter turns, for the one glyph that serves several directions. */
  rotate?: 0 | 90 | 180 | 270;
}) {
  const svg = (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={glyphPaths[name]} fill={color} fillRule="evenodd" />
    </Svg>
  );
  if (rotate === 0) return svg;
  return <View style={{ transform: [{ rotate: `${rotate}deg` }] }}>{svg}</View>;
}
