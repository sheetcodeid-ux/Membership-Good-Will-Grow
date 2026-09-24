import React from "react";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
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

/**
 * A chubby gear: the radius swings smoothly between root and tip, so teeth
 * and gaps are both round — no flat flanks, no corners.
 */
function gearPath(teeth: number, outer: number, inner: number, hole: number) {
  const n = 240;
  const pts: string[] = [];
  const k = Math.tanh(2.4);
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2;
    const v = 0.5 + (0.5 * Math.tanh(2.4 * Math.cos(teeth * a))) / k;
    const r = inner + (outer - inner) * v;
    pts.push(`${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join("L")}ZM${hole} 0A${hole} ${hole} 0 1 0 ${-hole} 0A${hole} ${hole} 0 1 0 ${hole} 0Z`;
}
const GEAR = gearPath(7, 8.6, 6.2, 2.3);
const SHIELD =
  "M-1.3 -14.4C-0.5 -14.9 0.5 -14.9 1.3 -14.4C5 -12.3 8.8 -11.3 12.3 -11C13.1 -10.9 13.6 -10.4 13.6 -9.6V-2.4C13.6 6.6 7.6 12.6 1.3 15.1C0.4 15.4 -0.4 15.4 -1.3 15.1C-7.6 12.6 -13.6 6.6 -13.6 -2.4V-9.6C-13.6 -10.4 -13.1 -10.9 -12.3 -11C-8.8 -11.3 -5 -12.3 -1.3 -14.4Z";
const TICK = "M-5.4 0.4L-1.6 4.2L5.6 -3.4";
const SHACKLE = "M-4 -0.5V-4.2a4 4 0 0 1 8 0V-0.5";

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

/**
 * A soft floating orb, modelled like clay rather than glass: shading comes
 * from the gradient alone (light top left, bounce light along the lower
 * edge), a blurred glint, and a faint shadow on the scene below.
 */
function Orb({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <Ellipse
        cx={cx + 1.5}
        cy={cy + r + 4}
        rx={r * 0.8}
        ry={2.6}
        fill="url(#softShadow)"
      />
      <Circle cx={cx} cy={cy} r={r} fill="url(#orb)" />
      <Circle cx={cx} cy={cy} r={r} fill="url(#orbBounce)" />
      <Ellipse
        cx={cx - r * 0.36}
        cy={cy - r * 0.44}
        rx={r * 0.34}
        ry={r * 0.22}
        fill="url(#glint)"
        transform={`rotate(-32 ${cx - r * 0.36} ${cy - r * 0.44})`}
      />
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
        <RadialGradient
          id="shieldFace"
          cx="-5"
          cy="-7"
          r="24"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#B9CEFF" />
          <Stop offset="0.45" stopColor="#5A7ED8" />
          <Stop offset="1" stopColor={brand[600]} />
        </RadialGradient>
        <LinearGradient
          id="shieldInset"
          x1="-9"
          y1="-11"
          x2="8"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor={brand[600]} />
          <Stop offset="1" stopColor="#6F93EA" />
        </LinearGradient>
        <LinearGradient id="phBar" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#9DB8F7" />
          <Stop offset="1" stopColor="#C3D5FF" />
        </LinearGradient>
        <RadialGradient id="orb" cx="0.38" cy="0.32" r="0.72">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="0.5" stopColor="#DCE7FF" />
          <Stop offset="1" stopColor="#A6BFF8" />
        </RadialGradient>
        <RadialGradient id="orbBounce" cx="0.62" cy="0.82" r="0.5">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.45} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="glint" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.95} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="softShadow" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor={brand[800]} stopOpacity={0.14} />
          <Stop offset="1" stopColor={brand[800]} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="pill" cx="0.3" cy="0.2" r="0.9">
          <Stop offset="0" stopColor="#F4F8FF" />
          <Stop offset="0.55" stopColor="#C6D7FF" />
          <Stop offset="1" stopColor="#97B3F4" />
        </RadialGradient>
        <LinearGradient id="star" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#E4ECFF" />
        </LinearGradient>
        <RadialGradient
          id="gearFace"
          cx="-3.2"
          cy="-3.6"
          r="13"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#B9CEFF" />
          <Stop offset="0.45" stopColor="#6386DE" />
          <Stop offset="1" stopColor={brand[600]} />
        </RadialGradient>
        <RadialGradient
          id="gearHub"
          cx="-1.2"
          cy="-1.4"
          r="5"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#EEF3FF" />
          <Stop offset="1" stopColor="#7E9EEA" />
        </RadialGradient>
        <RadialGradient
          id="lockBody"
          cx="-3.4"
          cy="-0.4"
          r="13"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#B9CEFF" />
          <Stop offset="0.45" stopColor="#6386DE" />
          <Stop offset="1" stopColor={brand[600]} />
        </RadialGradient>
        <LinearGradient
          id="lockSteel"
          x1="-4"
          y1="-8.5"
          x2="4"
          y2="-0.5"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#EEF2FA" />
          <Stop offset="1" stopColor="#7F90B4" />
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
          {/* a shield with a tick — the account is protected — raised
              off the glass: a soft shadow, a face lit from the top left,
              an inset rim, a tick with its own shadow */}
          <G transform="translate(250 69)">
            <Path
              d={SHIELD}
              fill={brand[800]}
              opacity={0.3}
              transform="translate(0.6 1.4)"
            />
            <Path d={SHIELD} fill="url(#shieldFace)" />
            <Path d={SHIELD} fill="url(#orbBounce)" />
            <Path
              d={SHIELD}
              fill="none"
              stroke="url(#shieldInset)"
              strokeWidth={1.1}
              opacity={0.55}
              transform="scale(0.78)"
            />
            <Path
              d="M-9.8 -8.2C-6.8 -8.6 -3.6 -9.6 -0.8 -11.2"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={1.2}
              strokeLinecap="round"
              opacity={0.75}
            />
            <Path
              d={TICK}
              fill="none"
              stroke={brand[950]}
              strokeOpacity={0.35}
              strokeWidth={3.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(0.5 0.9)"
            />
            <Path
              d={TICK}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={3.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
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

        {/* password bubble: puffy and tipped a little, shaded by its
            gradient, with chubby asterisks */}
        <Ellipse cx="203" cy="50.5" rx="21" ry="2.4" fill="url(#softShadow)" />
        <G transform="rotate(-6 201 33)">
          <Path
            d="M184.6 41.6C184.4 45 183 47.8 181 49.8C185.2 49.6 189 47.4 191.4 43.2Z"
            fill="#AFC6FB"
          />
          <Rect
            x="174"
            y="22"
            width="54"
            height="22"
            rx="11"
            fill="url(#pill)"
          />
          <Rect
            x="174"
            y="22"
            width="54"
            height="22"
            rx="11"
            fill="url(#orbBounce)"
          />
          <Ellipse cx="186" cy="26.4" rx="9" ry="2.6" fill="url(#glint)" />
          {[188, 201, 214].map((x) => (
            <G key={x} transform={`translate(${x} 33.4)`}>
              {[0, 60, -60].map((a) => (
                <Rect
                  key={a}
                  x="-1.1"
                  y="-5"
                  width="2.2"
                  height="10"
                  rx="1.1"
                  fill="#7C9BE6"
                  opacity={0.28}
                  transform={`translate(0.3 0.8) rotate(${a})`}
                />
              ))}
              {[0, 60, -60].map((a) => (
                <Rect
                  key={a}
                  x="-1.1"
                  y="-5"
                  width="2.2"
                  height="10"
                  rx="1.1"
                  fill="url(#star)"
                  transform={`rotate(${a})`}
                />
              ))}
            </G>
          ))}
        </G>

        {/* gear: chubby, round-toothed, tipped a little */}
        <Orb cx={202} cy={57} r={12.8} />
        <G transform="translate(201.6 56.6) rotate(10)">
          <Path
            d={GEAR}
            fill={brand[800]}
            fillRule="evenodd"
            opacity={0.3}
            transform="translate(0.5 1.1)"
          />
          <Path d={GEAR} fill="url(#gearFace)" fillRule="evenodd" />
          <Circle
            r="4.3"
            fill="none"
            stroke="url(#gearHub)"
            strokeWidth={2.2}
          />
          <Ellipse
            cx="-3.6"
            cy="-4.4"
            rx="2.4"
            ry="1.3"
            fill="url(#glint)"
            transform="rotate(-40 -3.6 -4.4)"
          />
        </G>

        {/* lock: chubby body, thick shackle, tipped the other way */}
        <Orb cx={308} cy={59.5} r={15.5} />
        <G transform="translate(307.6 60.6) rotate(8)">
          <Ellipse cx="0.6" cy="9.4" rx="7" ry="1.4" fill="url(#softShadow)" />
          <Path
            d={SHACKLE}
            fill="none"
            stroke="url(#lockSteel)"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <Rect
            x="-7.2"
            y="-2"
            width="14.4"
            height="11.4"
            rx="4.2"
            fill="url(#lockBody)"
          />
          <Rect
            x="-7.2"
            y="-2"
            width="14.4"
            height="11.4"
            rx="4.2"
            fill="url(#orbBounce)"
          />
          <Ellipse cx="-3.4" cy="0.4" rx="2.8" ry="1.3" fill="url(#glint)" />
          <Circle cx="0" cy="2.9" r="1.7" fill={brand[900]} />
          <Rect
            x="-0.75"
            y="3.2"
            width="1.5"
            height="3.4"
            rx="0.75"
            fill={brand[900]}
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
