import React from "react";
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
}: {
  name: GlyphName;
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={glyphPaths[name]} fill={color} fillRule="evenodd" />
    </Svg>
  );
}
