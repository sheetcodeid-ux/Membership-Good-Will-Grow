import React from "react";
import Svg, {
  Circle,
  Defs,
  G,
  Path,
  Rect,
  Stop,
  LinearGradient as SvgGradient,
} from "react-native-svg";
import { brand, gold } from "../theme/colors";

/**
 * The scene behind the account header.
 *
 * Built the way the reference builds its own: a pale sky, then rounded hills
 * stacked front to back and getting more saturated as they come forward, so
 * the band has depth instead of being a coloured rectangle. Nothing here is
 * a straight edge — the hills scallop and the horizon curves, which is what
 * keeps it from reading as a banner.
 *
 * Drawn rather than placed. A grey box where the artwork belongs would undo
 * the point of the header, so it is made from the brand's own shapes: the
 * membership card, a cup, the reward star, and the small bubbles that carry
 * what the screen is about.
 */
export function AccountHeroArt({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 360 230" style={{ position: "absolute" }}>
      <Defs>
        <SvgGradient id="acc-sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F4F7FF" />
          <Stop offset="1" stopColor="#DDE8FF" />
        </SvgGradient>
        <SvgGradient id="acc-card" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={brand[500]} />
          <Stop offset="1" stopColor={brand[800]} />
        </SvgGradient>
      </Defs>

      <Rect x="0" y="0" width="360" height="230" fill="url(#acc-sky)" />

      {/*
        Three hills. They have to crest inside the top 120 units, because
        that is all of the scene the identity card leaves visible — set
        lower, they were drawn, paid for and then covered up.
      */}
      <Path d="M-10 104q26-26 52-11t52 4 52-15 52 8 52-4 60 13v145H-10Z" fill="#CBDBFF" />
      <Path d="M-10 126q34-24 68-7t68 2 68-17 68 11 48 8v110H-10Z" fill={brand[300]} opacity={0.62} />
      <Path d="M-10 148q44-20 88-5t88 0 92-15 52 11v92H-10Z" fill={brand[400]} opacity={0.55} />

      {/* Line work threaded behind the subject. */}
      <G stroke={brand[400]} strokeWidth={1.6} fill="none" opacity={0.34} strokeLinecap="round">
        <Path d="M14 84q22-24 50-11t46-4" />
        <Path d="M248 26q26 10 38 32t32 24" />
      </G>

      {/* Membership card, tilted, as the subject of the scene. */}
      <G transform="rotate(-10 268 58)">
        <Rect x="230" y="30" width="84" height="54" rx="10" fill="url(#acc-card)" />
        <Rect x="230" y="44" width="84" height="7" fill="#FFFFFF" opacity={0.55} />
        <Rect x="240" y="64" width="26" height="5" rx="2.5" fill="#FFFFFF" opacity={0.7} />
        <Circle cx="300" cy="68" r="6" fill={gold[300]} />
      </G>

      {/* Cup with a lid, in brand blue rather than a wash of white. */}
      <G transform="translate(34 40)">
        <Path
          d="M6 16h42l-4.8 42a7 7 0 0 1-6.96 6.24H17.76A7 7 0 0 1 10.8 58Z"
          fill={brand[400]}
          opacity={0.8}
        />
        <Rect x="0" y="5" width="54" height="12" rx="5" fill={brand[600]} opacity={0.85} />
        <Rect x="10" y="32" width="34" height="4" rx="2" fill="#FFFFFF" opacity={0.6} />
      </G>

      {/* Two bubbles naming what the screen is for: settings and security. */}
      <G>
        <Circle cx="152" cy="30" r="17" fill="#FFFFFF" />
        <G transform="translate(152 30)" stroke={brand[600]} strokeWidth={1.8} fill="none">
          <Circle cx="0" cy="0" r="3.4" />
          <Path d="M0-7.4V-5M0 5v2.4M-7.4 0H-5M5 0h2.4M-5.2-5.2l1.7 1.7M3.5 3.5l1.7 1.7M5.2-5.2 3.5-3.5M-3.5 3.5l-1.7 1.7" />
        </G>
        <Circle cx="206" cy="92" r="15" fill="#FFFFFF" />
        <G transform="translate(206 92)">
          <Rect x="-5" y="-1.5" width="10" height="8" rx="2" fill={brand[700]} />
          <Path d="M-3-1.5v-2.4a3 3 0 0 1 6 0v2.4" stroke={brand[700]} strokeWidth={1.7} fill="none" />
        </G>
      </G>

      {/*
        The reward star, at full strength on purpose. Gold at low alpha over
        a blue ground blends towards grey, so the one warm note in the scene
        cannot be faded without ceasing to be gold.
      */}
      <Path
        d="m198 12 5.2 10.5 11.6 1.7-8.4 8.2 2 11.5-10.4-5.5-10.4 5.5 2-11.5-8.4-8.2 11.6-1.7Z"
        fill={gold[500]}
      />
      <Circle cx="94" cy="22" r="3" fill={gold[300]} />
      <Circle cx="228" cy="58" r="2.6" fill={gold[300]} />
      <Circle cx="62" cy="106" r="2.8" fill="#FFFFFF" opacity={0.85} />
      <Circle cx="320" cy="104" r="3.2" fill="#FFFFFF" opacity={0.75} />
    </Svg>
  );
}
