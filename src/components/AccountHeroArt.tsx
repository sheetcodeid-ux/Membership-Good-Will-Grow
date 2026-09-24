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
import { brand } from "../theme/colors";

/**
 * The scene behind the account header, laid out the way the reference lays
 * out its own and coloured in the brand's blues.
 *
 * Measured off the reference (a 360-wide screen, status bar included, so
 * the viewBox is in dp): the scene is 150 tall and ends in a straight edge
 * about three-quarters of the way down the identity card. The title sits on
 * the left with nothing behind it; the illustration lives on the right — a
 * tilted phone showing a profile, a password bubble, a gear bubble and a
 * lock bubble — over three hills that deepen towards the front. The front
 * hill is mostly hidden by the card and only shows at its sides.
 *
 * The drawing is anchored to the bottom, so on a device with a taller status
 * bar the extra height is sky, not a stretched scene.
 */
export function AccountHeroArt({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 360 150"
      preserveAspectRatio="xMidYMax slice"
      style={{ position: "absolute" }}
    >
      <Defs>
        <SvgGradient id="acc-phone" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={brand[700]} />
          <Stop offset="1" stopColor={brand[900]} />
        </SvgGradient>
      </Defs>

      {/* sky, with the faint rings the reference draws behind its scene */}
      <Rect x="-40" y="-200" width="440" height="350" fill="#EAF1FF" />
      <Circle
        cx="250"
        cy="96"
        r="70"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1.2}
        opacity={0.7}
      />
      <Circle
        cx="250"
        cy="96"
        r="104"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1.2}
        opacity={0.55}
      />

      {/* back hill: low on the left, rising behind the phone on the right */}
      <Path
        d="M-2 104C4 72 16 56 30 57C44 58 50 73 64 74C84 75 100 73 118 78C138 83 158 79 174 70C192 60 208 53 226 50C258 45 280 31 298 27C312 13 330 9 344 18C352 23 358 30 362 34V150H-2Z"
        fill="#C9DAFF"
      />
      {/* middle hill, right half */}
      <Path
        d="M168 150V90C172 81 180 78 188 79C198 80 204 72 214 72C236 72 262 78 282 76C290 72 296 70 302 70C312 66 322 65 332 67C344 69 352 68 362 70V150Z"
        fill="#9BB9FF"
      />

      {/* phone, tilted, showing a profile */}
      <G transform="rotate(14 250 92)">
        <Rect
          x="216"
          y="30"
          width="68"
          height="124"
          rx="13"
          fill="url(#acc-phone)"
        />
        <Rect x="222" y="37" width="56" height="110" rx="8.5" fill="#D6E4FF" />
        <Circle cx="250" cy="63" r="8" fill={brand[400]} />
        <Path
          d="M235 84C235 76 242 71.5 250 71.5S265 76 265 84Z"
          fill={brand[400]}
        />
      </G>

      {/* password bubble */}
      <Rect x="174" y="22.5" width="54" height="21" rx="10.5" fill="#B3CCFF" />
      <Path d="M186 43L184 49L192 43Z" fill="#B3CCFF" />
      {[188, 201, 214].map((x) => (
        <G key={x} transform={`translate(${x} 33)`}>
          <Rect
            x="-0.9"
            y="-4.6"
            width="1.8"
            height="9.2"
            rx="0.9"
            fill="#FFFFFF"
          />
          <Rect
            x="-0.9"
            y="-4.6"
            width="1.8"
            height="9.2"
            rx="0.9"
            fill="#FFFFFF"
            transform="rotate(60)"
          />
          <Rect
            x="-0.9"
            y="-4.6"
            width="1.8"
            height="9.2"
            rx="0.9"
            fill="#FFFFFF"
            transform="rotate(-60)"
          />
        </G>
      ))}

      {/* gear bubble */}
      <Circle cx="202" cy="54.5" r="11.2" fill="#B3CCFF" />
      <G transform="translate(202 54.5)">
        {[0, 45, 90, 135].map((a) => (
          <Rect
            key={a}
            x="-1.6"
            y="-7.2"
            width="3.2"
            height="14.4"
            rx="1"
            fill={brand[700]}
            transform={`rotate(${a})`}
          />
        ))}
        <Circle r="5.2" fill={brand[700]} />
        <Circle r="2.1" fill="#B3CCFF" />
      </G>

      {/* lock bubble */}
      <Circle cx="308" cy="59.5" r="15" fill="#B3CCFF" />
      <Path
        d="M304.3 56.6V54.9a3.7 3.7 0 0 1 7.4 0v1.7"
        fill="none"
        stroke={brand[800]}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Rect
        x="301.5"
        y="56"
        width="13"
        height="9.5"
        rx="2.4"
        fill={brand[800]}
      />
      <Circle cx="308" cy="60.2" r="1.3" fill="#B3CCFF" />

      {/* sparkles */}
      {[
        [150, 45, 4.2],
        [296, 30, 3.4],
        [331, 66, 3.8],
        [184, 76, 3],
      ].map(([x, y, s]) => (
        <Path
          key={`${x}-${y}`}
          d={`M${x} ${y - s}Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y}Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s}Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y}Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s}Z`}
          fill="#FFFFFF"
        />
      ))}

      {/* front hill: shows only at the sides of the card */}
      <Path
        d="M-2 104C10 101 20 109 30 115C46 125 62 128 80 126C120 121 180 118 240 118C290 118 330 111 362 112V150H-2Z"
        fill="#6D8FE0"
      />
    </Svg>
  );
}
