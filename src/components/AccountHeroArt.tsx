import React from "react";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { brand } from "../theme/colors";

/**
 * The scene behind the account header: the reference's layout in the
 * brand's blues. The backdrop is flat; the phone, gear and lock in front
 * are modelled — lit from the top left, with a visible side for depth. Where the reference grows
 * hills and bushes — green reads as nature — a blue scene reads as a city,
 * so the layers are a skyline.
 *
 * Coordinates are dp on a 360-wide screen measured from the very top,
 * status bar included. The scene's lower edge is a shallow arc, as in the
 * reference: 149.5 at the screen edges, dipping out of sight behind the
 * identity card — only its ends show, sloping down towards the card. The title keeps
 * the left clear; the illustration — a phone showing a profile, with a
 * password, a gear and a lock bubble — sits on the right, in front of
 * three rows of buildings that deepen towards the card; the front row also
 * fills the corners beside the card.
 */

/** Height of the viewBox; the arc's lowest point is just above it. */
const SCENE_H = 170;
/** How far the scene reaches below the header block it belongs to. */
export const HERO_ART_OVERHANG = SCENE_H - 150;

/** A gear outline with softly rounded teeth, plus its hub hole. */
function gearPath(teeth: number, outer: number, inner: number, hole: number) {
  const steps = 24;
  const pts: string[] = [];
  for (let i = 0; i < teeth * steps; i += 1) {
    const a = (i / (teeth * steps)) * Math.PI * 2;
    const t = (i % steps) / steps;
    let v = 0;
    if (t < 0.14) v = (1 - Math.cos((Math.PI * t) / 0.14)) / 2;
    else if (t < 0.4) v = 1;
    else if (t < 0.54) v = (1 + Math.cos((Math.PI * (t - 0.4)) / 0.14)) / 2;
    const r = inner + (outer - inner) * v;
    pts.push(`${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join("L")}ZM${hole} 0A${hole} ${hole} 0 1 0 ${-hole} 0A${hole} ${hole} 0 1 0 ${hole} 0Z`;
}
const GEAR = gearPath(8, 8.2, 6.3, 1.8);
const SHACKLE = "M-3.9 -1.2V-4.6a3.9 3.9 0 0 1 7.8 0V-1.2";

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
  [256, 38, 26, "step"],
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
        for (let y = top + 7; y < SCENE_H - 4; y += 9) {
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
              height={SCENE_H + 2 - top}
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
  // Scale by width and keep the bottom anchored, so a taller status bar
  // only reveals more sky.
  const vh = (height * 360) / width;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 ${SCENE_H - vh} 360 ${vh}`}
      preserveAspectRatio="none"
      style={{ position: "absolute" }}
    >
      <Defs>
        <ClipPath id="heroScene">
          <Path d="M-1 -400H361V149.5Q180 184.1 -1 149.5Z" />
        </ClipPath>
        <ClipPath id="heroScreen">
          <Rect x="222" y="37" width="56" height="110" rx="8.5" />
        </ClipPath>
        <LinearGradient id="phBody" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#5A80DA" />
          <Stop offset="0.55" stopColor={brand[600]} />
          <Stop offset="1" stopColor={brand[800]} />
        </LinearGradient>
        <LinearGradient id="phSide" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={brand[900]} />
          <Stop offset="1" stopColor={brand[950]} />
        </LinearGradient>
        <LinearGradient id="phRim" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.75} />
          <Stop offset="0.45" stopColor="#FFFFFF" stopOpacity={0.1} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient id="phScreen" x1="0" y1="0" x2="0.4" y2="1">
          <Stop offset="0" stopColor="#F5F8FF" />
          <Stop offset="1" stopColor="#BCD0FF" />
        </LinearGradient>
        <RadialGradient id="phHead" cx="0.36" cy="0.3" r="0.8">
          <Stop offset="0" stopColor="#C4D6FF" />
          <Stop offset="1" stopColor={brand[500]} />
        </RadialGradient>
        <LinearGradient id="phBust" x1="0.2" y1="0" x2="0.6" y2="1">
          <Stop offset="0" stopColor="#A9C2FF" />
          <Stop offset="1" stopColor={brand[500]} />
        </LinearGradient>
        <LinearGradient id="phBar" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#9DB8F7" />
          <Stop offset="1" stopColor="#C3D5FF" />
        </LinearGradient>
        <RadialGradient id="bubble" cx="0.34" cy="0.28" r="0.85">
          <Stop offset="0" stopColor="#F2F6FF" />
          <Stop offset="1" stopColor="#A9C3FB" />
        </RadialGradient>
        <LinearGradient id="bubbleBar" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#CBDBFF" />
          <Stop offset="1" stopColor="#A5BFFA" />
        </LinearGradient>
        <LinearGradient
          id="gearFace"
          x1="-7"
          y1="-7"
          x2="6"
          y2="7"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#A9C2FF" />
          <Stop offset="0.5" stopColor="#5277D2" />
          <Stop offset="1" stopColor={brand[600]} />
        </LinearGradient>
        <RadialGradient
          id="gearHub"
          cx="-1.4"
          cy="-1.6"
          r="5.2"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#E3ECFF" />
          <Stop offset="1" stopColor={brand[400]} />
        </RadialGradient>
        <LinearGradient
          id="lockGold"
          x1="0"
          y1="-2.3"
          x2="0"
          y2="8.1"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FFEB7A" />
          <Stop offset="0.5" stopColor="#FFD21A" />
          <Stop offset="1" stopColor="#F2B600" />
        </LinearGradient>
        <LinearGradient
          id="lockSteel"
          x1="-4"
          y1="-8.5"
          x2="4"
          y2="-1"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#9FAEC9" />
        </LinearGradient>
      </Defs>

      <G clipPath="url(#heroScene)">
        {/* sky, with the faint rings the reference draws behind its scene */}
        <Rect x="-40" y="-400" width="440" height="600" fill="#EAF1FF" />
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
        <Path
          d="M334 34a6 6 0 0 1 11.2-3A5 5 0 0 1 352 36H334Z"
          fill="#FFFFFF"
        />
        <Path
          d="M122 40a5 5 0 0 1 9.4-2.4A4 4 0 0 1 137 42H122Z"
          fill="#FFFFFF"
        />

        <Row list={BACK} body="#D6E3FF" window="#E6EEFF" />
        <Row list={MID} body="#AEC5FB" window="#CEDCFF" />
        <Row list={FRONT} body="#7B9CEB" window="#A6BFF8" />

        {/* phone: a cast shadow, the dark side for its thickness, a lit
            face with a rim catching the light, glass with a glare band */}
        <G transform="rotate(14 250 92)">
          <Rect
            x="224"
            y="35"
            width="68"
            height="124"
            rx="13"
            fill={brand[950]}
            opacity={0.16}
          />
          <Rect
            x="220.5"
            y="31.5"
            width="68"
            height="124"
            rx="13"
            fill="url(#phSide)"
          />
          <Rect
            x="288"
            y="56"
            width="2.4"
            height="13"
            rx="1.2"
            fill={brand[700]}
          />
          <Rect
            x="288"
            y="73"
            width="2.4"
            height="8"
            rx="1.2"
            fill={brand[700]}
          />
          <Rect
            x="216"
            y="30"
            width="68"
            height="124"
            rx="13"
            fill="url(#phBody)"
          />
          <Rect
            x="216.6"
            y="30.6"
            width="66.8"
            height="122.8"
            rx="12.4"
            fill="none"
            stroke="url(#phRim)"
            strokeWidth={1.2}
          />
          <Rect
            x="222"
            y="37"
            width="56"
            height="110"
            rx="8.5"
            fill="url(#phScreen)"
          />
          <G clipPath="url(#heroScreen)">
            <Path d="M244 37H262L222 104V76Z" fill="#FFFFFF" opacity={0.45} />
            <Path d="M266 37H271L222 118V110Z" fill="#FFFFFF" opacity={0.35} />
          </G>
          <Rect
            x="243"
            y="40.5"
            width="14"
            height="3.2"
            rx="1.6"
            fill={brand[800]}
          />
          <Circle cx="250" cy="66" r="8" fill="url(#phHead)" />
          <Path
            d="M235 87C235 79 242 74.5 250 74.5S265 79 265 87Z"
            fill="url(#phBust)"
          />
          <Rect
            x="236"
            y="94"
            width="28"
            height="3.4"
            rx="1.7"
            fill="url(#phBar)"
          />
          <Rect
            x="241"
            y="101"
            width="18"
            height="3.4"
            rx="1.7"
            fill="url(#phBar)"
          />
        </G>

        {/* password bubble */}
        <Rect
          x="174"
          y="22.5"
          width="54"
          height="21"
          rx="10.5"
          fill="url(#bubbleBar)"
        />
        <Path d="M186 42.5L184.5 49L193 42.5Z" fill="#A5BFFA" />
        {[188, 201, 214].map((x) => (
          <G key={x} transform={`translate(${x} 33)`}>
            {[0, 60, -60].map((a) => (
              <Rect
                key={a}
                x="-0.9"
                y="-4.6"
                width="1.8"
                height="9.2"
                rx="0.9"
                fill="#FFFFFF"
                transform={`rotate(${a})`}
              />
            ))}
          </G>
        ))}

        {/* gear: extruded towards the lower right, face lit from above */}
        <Circle cx="202" cy="56" r="12.6" fill="url(#bubble)" />
        <G transform="translate(201.4 55.3)">
          {[1, 2, 3, 4, 5].map((k) => (
            <Path
              key={k}
              d={GEAR}
              fill={brand[900]}
              fillRule="evenodd"
              transform={`translate(${k * 0.24} ${k * 0.3})`}
            />
          ))}
          <Path d={GEAR} fill="url(#gearFace)" fillRule="evenodd" />
          <Circle r="3.8" fill="url(#gearHub)" />
          <Circle r="1.8" fill={brand[900]} />
        </G>

        {/* lock: steel shackle, gold body with its side showing */}
        <Circle cx="308" cy="59.5" r="15.5" fill="url(#bubble)" />
        <G transform="translate(307.4 60.2)">
          <Path
            d={SHACKLE}
            fill="none"
            stroke="#6E7C9A"
            strokeWidth={2.6}
            strokeLinecap="round"
            transform="translate(0.7 0.8)"
          />
          <Path
            d={SHACKLE}
            fill="none"
            stroke="url(#lockSteel)"
            strokeWidth={2.6}
            strokeLinecap="round"
          />
          <Rect
            x="-5.6"
            y="-1.1"
            width="13.4"
            height="10.4"
            rx="2.8"
            fill="#B98100"
          />
          <Rect
            x="-6.7"
            y="-2.3"
            width="13.4"
            height="10.4"
            rx="2.8"
            fill="url(#lockGold)"
          />
          <Rect
            x="-5.1"
            y="-1.4"
            width="10.2"
            height="1.1"
            rx="0.55"
            fill="#FFFFFF"
            opacity={0.6}
          />
          <Circle cx="0" cy="2.1" r="1.5" fill="#7A3A00" />
          <Rect
            x="-0.6"
            y="2.4"
            width="1.2"
            height="3"
            rx="0.6"
            fill="#7A3A00"
          />
        </G>

        <Sparkle x={152} y={50} s={4.2} />
        <Sparkle x={292} y={30} s={3.4} />
        <Sparkle x={333} y={72} s={3.8} />
        <Sparkle x={100} y={34} s={3} />
      </G>
    </Svg>
  );
}
