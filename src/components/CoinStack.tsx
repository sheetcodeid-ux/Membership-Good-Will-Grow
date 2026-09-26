import React from "react";
import Svg, {
  Defs,
  Ellipse,
  G,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";

const STAR =
  "M0 -5.6C0.5 -5.6 0.8 -5.3 1 -4.9L2.2 -2.4L5 -2C5.5 -1.9 5.8 -1.6 5.9 -1.1C6 -0.7 5.8 -0.3 5.5 0L3.5 2L4 4.8C4.1 5.3 3.9 5.7 3.5 6C3.1 6.2 2.7 6.2 2.3 6L0 4.7L-2.3 6C-2.7 6.2 -3.1 6.2 -3.5 6C-3.9 5.7 -4.1 5.3 -4 4.8L-3.5 2L-5.5 0C-5.8 -0.3 -6 -0.7 -5.9 -1.1C-5.8 -1.6 -5.5 -1.9 -5 -2L-2.2 -2.4L-1 -4.9C-0.8 -5.3 -0.5 -5.6 0 -5.6Z";

/**
 * A little stack of points coins in the reward card's clay style: each
 * coin a lit face over a darker rim, the top one embossed with a star.
 */
export function CoinStack() {
  const coin = (cy: number, key: string, top?: boolean) => (
    <G key={key}>
      <Ellipse cx={46} cy={cy + 3.2} rx={22} ry={8.6} fill="#C98A00" />
      <Ellipse cx={46} cy={cy} rx={22} ry={8.6} fill="url(#csFace)" />
      {top ? (
        <>
          <Ellipse
            cx={46}
            cy={cy}
            rx={15}
            ry={5.6}
            fill="none"
            stroke="#E9AB00"
            strokeOpacity={0.6}
            strokeWidth={1}
          />
          <Path
            d={STAR}
            fill="#E5A100"
            transform={`translate(46 ${cy + 0.2}) scale(0.72 0.3)`}
          />
          <Ellipse cx={37} cy={cy - 3} rx={5} ry={1.4} fill="url(#csGlint)" />
        </>
      ) : null}
    </G>
  );
  return (
    <Svg width={92} height={84} viewBox="0 0 92 84">
      <Defs>
        <RadialGradient id="csFace" cx="0.35" cy="0.3" r="0.8">
          <Stop offset="0" stopColor="#FFF3B0" />
          <Stop offset="0.5" stopColor="#FFD21A" />
          <Stop offset="1" stopColor="#EBAA00" />
        </RadialGradient>
        <RadialGradient id="csGlint" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.95} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="csShadow" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#B07A00" stopOpacity={0.3} />
          <Stop offset="1" stopColor="#B07A00" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={48} cy={76} rx={30} ry={4} fill="url(#csShadow)" />
      {[64, 54, 44, 34].map((cy, i, all) =>
        coin(cy, String(cy), i === all.length - 1),
      )}
    </Svg>
  );
}
