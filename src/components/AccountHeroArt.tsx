import React from "react";
import Svg, { Circle, Defs, G, Path, Rect, Stop, LinearGradient as SvgGradient } from "react-native-svg";
import { brand, gold } from "../theme/colors";

/**
 * The scene behind the account header.
 *
 * Drawn rather than placed: the reference this follows uses a commissioned
 * illustration, and a grey box where that belongs would undo the point of
 * the header. It is built from the brand's own shapes — the membership card,
 * a coffee cup, the reward star — so it reads as this app's illustration
 * rather than stock artwork, and it costs nothing to ship.
 *
 * Deliberately low contrast: it sits under a white card carrying the
 * member's name, and anything busier would fight it.
 */
export function AccountHeroArt({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 360 200" style={{ position: "absolute" }}>
      <Defs>
        <SvgGradient id="hero-sky" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={brand[900]} />
          <Stop offset="1" stopColor={brand[600]} />
        </SvgGradient>
      </Defs>

      <Rect x="0" y="0" width="360" height="200" fill="url(#hero-sky)" />

      {/* Soft hills, lightest at the back, so the card has something to sit on. */}
      <Path
        d="M0 150c48-26 92-12 140 2s96 18 140-10c30-19 58-20 80-6v64H0Z"
        fill="#FFFFFF"
        opacity={0.07}
      />
      <Path
        d="M0 172c56-24 104-8 156 6s104 10 152-16c22-12 40-14 52-9v47H0Z"
        fill="#FFFFFF"
        opacity={0.06}
      />

      {/* Membership card, tilted, as the subject of the scene. */}
      <G opacity={0.62}>
        <Rect
          x="238"
          y="40"
          width="86"
          height="54"
          rx="9"
          fill="#FFFFFF"
          opacity={0.22}
          transform="rotate(-11 281 67)"
        />
        <Rect
          x="238"
          y="54"
          width="86"
          height="5"
          fill="#FFFFFF"
          opacity={0.35}
          transform="rotate(-11 281 67)"
        />
        <Rect
          x="248"
          y="72"
          width="26"
          height="5"
          rx="2.5"
          fill="#FFFFFF"
          opacity={0.35}
          transform="rotate(-11 281 67)"
        />
      </G>

      {/* Cup, lid and all, on the other side of the card. */}
      <G opacity={0.55} transform="translate(38 44)">
        <Path d="M6 16h40l-4.6 44a7 7 0 0 1-6.97 6.3H17.57A7 7 0 0 1 10.6 60Z" fill="#FFFFFF" opacity={0.2} />
        <Rect x="1" y="6" width="50" height="11" rx="4" fill="#FFFFFF" opacity={0.3} />
        <Rect x="9" y="33" width="34" height="4" rx="2" fill="#FFFFFF" opacity={0.28} />
      </G>

      {/*
        Reward star and a scatter of sparks.
        The star is nearly opaque on purpose. Gold at low alpha over navy
        blends to a blue-grey — 47% of #EAC584 over the header lands on
        (120,125,148), which is not a colour anyone would call gold — so
        the one warm note in the scene has to be carried at full strength.
      */}
      <G>
        <Path
          d="m176 34 5.6 11.3 12.5 1.8-9 8.8 2.1 12.4-11.2-5.9-11.2 5.9 2.1-12.4-9-8.8 12.5-1.8Z"
          fill={gold[300]}
          opacity={0.92}
        />
        <Circle cx="120" cy="30" r="3" fill="#FFFFFF" opacity={0.4} />
        <Circle cx="214" cy="96" r="2.4" fill="#FFFFFF" opacity={0.35} />
        <Circle cx="296" cy="126" r="3.4" fill="#FFFFFF" opacity={0.28} />
        <Circle cx="66" cy="120" r="2.6" fill="#FFFFFF" opacity={0.3} />
      </G>
    </Svg>
  );
}
