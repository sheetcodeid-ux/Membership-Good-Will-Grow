import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

/**
 * Two marks the icon set has no solid version of. Filling the outline ones
 * turns them into blobs, so these are drawn with their detail knocked out in
 * the background colour, the way the reference draws them.
 */

/** Receipt with a torn bottom edge, used by Total Transaksi. */
export function ReceiptGlyph({
  size = 16,
  color,
  detail = "#FFFFFF",
}: {
  size?: number;
  color: string;
  detail?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M5 2.4h14a1.4 1.4 0 0 1 1.4 1.4v17.8l-2.56-1.7-2.56 1.7-2.56-1.7-2.56 1.7-2.56-1.7L3.6 21.6V3.8A1.4 1.4 0 0 1 5 2.4Z"
        fill={color}
      />
      <Rect x={7.4} y={6.6} width={9.2} height={1.7} rx={0.85} fill={detail} />
      <Rect x={7.4} y={10.4} width={9.2} height={1.7} rx={0.85} fill={detail} />
      <Rect x={7.4} y={14.2} width={5.6} height={1.7} rx={0.85} fill={detail} />
    </Svg>
  );
}

/** Card with a coin, used by the Poinmu row. */
export function PointsCardGlyph({
  size = 16,
  color,
  detail = "#FFFFFF",
}: {
  size?: number;
  color: string;
  detail?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={2} y={5} width={20} height={14} rx={3.4} fill={color} />
      <Rect x={5.2} y={9} width={3.6} height={6} rx={1.8} fill={detail} />
      <Circle cx={15.6} cy={12} r={3.3} fill={detail} />
    </Svg>
  );
}
