import React from "react";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import { brand } from "../theme/colors";

/**
 * The scene behind the account header: the reference's layout, drawn flat
 * (2D, no gradients) and in the brand's blues. Where the reference grows
 * hills and bushes — green reads as nature — a blue scene reads as a city,
 * so the layers are a skyline.
 *
 * Coordinates are dp on a 360-wide screen measured from the very top,
 * status bar included: the scene is 150 tall and ends in a straight edge
 * about three-quarters of the way down the identity card. The title keeps
 * the left clear; the illustration — a phone showing a profile, with a
 * password, a gear and a lock bubble — sits on the right, in front of
 * three rows of buildings that deepen towards the card; the front row also
 * fills the corners beside the card.
 */

type Building = [
  x: number,
  top: number,
  width: number,
  kind?: "tower" | "step",
];

const BACK: Building[] = [
  [-4, 74, 22],
  [16, 68, 20, "step"],
  [34, 76, 18],
  [50, 70, 24],
  [72, 78, 18],
  [88, 66, 24, "step"],
  [110, 58, 22],
  [130, 66, 20],
  [148, 50, 24, "tower"],
  [170, 62, 22],
  [190, 54, 26],
  [214, 44, 24, "step"],
  [236, 56, 22],
  [256, 38, 26, "tower"],
  [280, 50, 24],
  [302, 60, 20],
  [320, 36, 24, "step"],
  [342, 52, 24],
];
const MID: Building[] = [
  [-6, 80, 22],
  [14, 84, 18, "step"],
  [30, 78, 22],
  [50, 86, 18],
  [66, 80, 22],
  [86, 76, 20, "step"],
  [104, 82, 22],
  [124, 72, 24],
  [146, 78, 20],
  [164, 68, 24, "step"],
  [186, 76, 22],
  [206, 70, 20],
  [276, 74, 22],
  [296, 68, 22],
  [316, 62, 24, "step"],
  [338, 72, 26],
];
const FRONT: Building[] = [
  [-4, 78, 18, "step"],
  [12, 84, 20],
  [30, 80, 16],
  [44, 86, 22],
  [64, 80, 18, "step"],
  [80, 84, 20],
  [98, 78, 22],
  [118, 84, 18],
  [134, 80, 22, "step"],
  [154, 86, 20],
  [172, 80, 20],
  [190, 84, 22],
  [210, 80, 20],
  [230, 86, 24],
  [252, 82, 20],
  [270, 86, 22],
  [290, 80, 20],
  [308, 84, 18, "step"],
  [324, 76, 20],
  [342, 82, 22, "step"],
];

function Row({
  list,
  body,
  window: win,
}: {
  list: Building[];
  body: string;
  window: string;
}) {
  return (
    <>
      {list.map(([x, top, w, kind]) => {
        const windows: React.ReactNode[] = [];
        const cols = Math.max(1, Math.floor((w - 6) / 7));
        const x0 = x + (w - (cols * 7 - 3)) / 2;
        for (let y = top + 7; y < 146; y += 9) {
          for (let c = 0; c < cols; c += 1) {
            windows.push(
              <Rect
                key={`${x}-${y}-${c}`}
                x={x0 + c * 7}
                y={y}
                width={4}
                height={5}
                rx={1}
                fill={win}
              />,
            );
          }
        }
        return (
          <G key={`${x}-${top}`}>
            {kind === "step" ? (
              <Rect
                x={x + w * 0.25}
                y={top - 7}
                width={w * 0.5}
                height={10}
                rx={2}
                fill={body}
              />
            ) : null}
            {kind === "tower" ? (
              <>
                <Rect
                  x={x + w / 2 - 1}
                  y={top - 16}
                  width={2}
                  height={18}
                  rx={1}
                  fill={body}
                />
                <Circle cx={x + w / 2} cy={top - 17} r={2.2} fill={body} />
              </>
            ) : null}
            <Rect
              x={x}
              y={top}
              width={w}
              height={160 - top}
              rx={3}
              fill={body}
            />
            {windows}
          </G>
        );
      })}
    </>
  );
}

function Sparkle({ x, y, s }: { x: number; y: number; s: number }) {
  const k = s * 0.18;
  return (
    <Path
      d={`M${x} ${y - s}Q${x + k} ${y - k} ${x + s} ${y}Q${x + k} ${y + k} ${x} ${y + s}Q${x - k} ${y + k} ${x - s} ${y}Q${x - k} ${y - k} ${x} ${y - s}Z`}
      fill="#FFFFFF"
    />
  );
}

export function AccountHeroArt({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const bubble = "#B8CFFF";
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 360 150"
      preserveAspectRatio="xMidYMax slice"
      style={{ position: "absolute" }}
    >
      {/* sky, with the faint rings the reference draws behind its scene */}
      <Rect x="-40" y="-200" width="440" height="360" fill="#EAF1FF" />
      <Circle
        cx="250"
        cy="96"
        r="72"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1.2}
        opacity={0.75}
      />
      <Circle
        cx="250"
        cy="96"
        r="106"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1.2}
        opacity={0.55}
      />
      {/* a flat cloud, right of the lock bubble */}
      <Path d="M334 34a6 6 0 0 1 11.2-3A5 5 0 0 1 352 36H334Z" fill="#FFFFFF" />
      <Path
        d="M122 40a5 5 0 0 1 9.4-2.4A4 4 0 0 1 137 42H122Z"
        fill="#FFFFFF"
      />

      <Row list={BACK} body="#D6E3FF" window="#E6EEFF" />
      <Row list={MID} body="#AEC5FB" window="#CEDCFF" />
      <Row list={FRONT} body="#7B9CEB" window="#A6BFF8" />

      {/* phone, flat: face, a darker side for thickness, screen, profile */}
      <G transform="rotate(14 250 92)">
        <Rect
          x="219"
          y="31"
          width="68"
          height="124"
          rx="13"
          fill={brand[900]}
        />
        <Rect
          x="216"
          y="30"
          width="68"
          height="124"
          rx="13"
          fill={brand[700]}
        />
        <Rect x="222" y="37" width="56" height="110" rx="8.5" fill="#D6E4FF" />
        <Rect
          x="243"
          y="40.5"
          width="14"
          height="3.2"
          rx="1.6"
          fill={brand[700]}
        />
        <Circle cx="250" cy="66" r="8" fill={brand[400]} />
        <Path
          d="M235 87C235 79 242 74.5 250 74.5S265 79 265 87Z"
          fill={brand[400]}
        />
        <Rect x="236" y="94" width="28" height="3.4" rx="1.7" fill="#B8CFFF" />
        <Rect x="241" y="101" width="18" height="3.4" rx="1.7" fill="#B8CFFF" />
      </G>

      {/* password bubble */}
      <Rect x="174" y="22.5" width="54" height="21" rx="10.5" fill={bubble} />
      <Path d="M186 42.5L184.5 49L193 42.5Z" fill={bubble} />
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
      <Circle cx="202" cy="56" r="11.2" fill={bubble} />
      <G transform="translate(202 56)">
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
        <Circle r="2.1" fill={bubble} />
      </G>

      {/* lock bubble */}
      <Circle cx="308" cy="59.5" r="15" fill={bubble} />
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
      <Circle cx="308" cy="60.2" r="1.3" fill={bubble} />

      <Sparkle x={152} y={50} s={4.2} />
      <Sparkle x={292} y={30} s={3.4} />
      <Sparkle x={333} y={72} s={3.8} />
      <Sparkle x={100} y={34} s={3} />
    </Svg>
  );
}
