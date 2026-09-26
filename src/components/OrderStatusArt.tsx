import React from "react";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
import { brand } from "../theme/colors";

/**
 * The scene over Status Pesanan: a street of shops in the brand's pale
 * blues, the outlet in the middle under a striped awning, and in front of
 * it a modelled takeaway cup, steaming — the order being made. Soft
 * shapes only, lit from the top left like the account scene.
 *
 * Coordinates are on a 360 × 300 canvas; the scene is anchored to its
 * bottom edge and a taller space only shows more sky. The last
 * `SCENE_TUCK` units run on under the status panel, which overlaps the
 * art by that much, so nothing that matters sits there.
 */
export const SCENE_TUCK = 30;

/** Where a scene point lands on screen, for things laid over the art. */
export function scenePoint(
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const vh = (height * 360) / width;
  const top = 300 + SCENE_TUCK - vh;
  return { x: (x * width) / 360, y: ((y - top) * height) / vh };
}

export function OrderStatusArt({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const vh = (height * 360) / width;
  const awning = Array.from({ length: 8 }, (_, i) => i);
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 ${300 + SCENE_TUCK - vh} 360 ${vh}`}
      preserveAspectRatio="none"
    >
      <Defs>
        <LinearGradient id="osSky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#D5E2FF" />
          <Stop offset="1" stopColor="#EEF3FF" />
        </LinearGradient>
        <LinearGradient id="osCup" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="0.6" stopColor="#F1F5FF" />
          <Stop offset="1" stopColor="#C9D7F7" />
        </LinearGradient>
        <LinearGradient id="osLid" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#5A80DA" />
          <Stop offset="1" stopColor={brand[800]} />
        </LinearGradient>
        <LinearGradient id="osSleeve" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#FFE680" />
          <Stop offset="0.55" stopColor="#FFD233" />
          <Stop offset="1" stopColor="#E0A800" />
        </LinearGradient>
        <LinearGradient id="osShop" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#E4ECFF" />
        </LinearGradient>
      </Defs>

      <Rect x={0} y={-400} width={360} height={700} fill="url(#osSky)" />

      {/* clouds */}
      <G fill="#FFFFFF" opacity={0.85}>
        <Path d="M40 78a14 14 0 0 1 26-7a11 11 0 0 1 18 8h-44z" />
        <Path d="M232 56a17 17 0 0 1 31-8a13 13 0 0 1 22 10h-53z" />
        <Path d="M300 110a9 9 0 0 1 17-4a7 7 0 0 1 12 6h-29z" />
      </G>

      {/* far row of buildings */}
      <G fill="#C8D8FB">
        <Rect x={-6} y={120} width={70} height={130} rx={8} />
        <Rect x={58} y={146} width={48} height={104} rx={8} />
        <Rect x={290} y={128} width={76} height={122} rx={8} />
      </G>
      <G fill="#E3ECFF">
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2].map((c) => (
            <Rect
              key={`l${r}${c}`}
              x={8 + c * 17}
              y={134 + r * 24}
              width={9}
              height={12}
              rx={3}
            />
          )),
        )}
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2].map((c) => (
            <Rect
              key={`r${r}${c}`}
              x={304 + c * 19}
              y={142 + r * 24}
              width={10}
              height={12}
              rx={3}
            />
          )),
        )}
      </G>

      {/* the outlet */}
      <Rect
        x={104}
        y={112}
        width={176}
        height={140}
        rx={10}
        fill="url(#osShop)"
      />
      <Rect x={104} y={112} width={176} height={20} rx={8} fill="#C3D4FA" />
      <Rect x={150} y={116} width={84} height={12} rx={6} fill="#FFFFFF" />
      <Circle cx={160} cy={122} r={3} fill={brand[600]} />
      <Rect x={167} y={120} width={58} height={4} rx={2} fill="#B7C9F4" />
      {/* awning, scalloped, in stripes */}
      {awning.map((i) => (
        <Path
          key={i}
          d={`M${98 + i * 23.5} 134h23.5v20a11.75 11.75 0 0 1 -23.5 0z`}
          fill={i % 2 === 0 ? brand[500] : "#FFFFFF"}
        />
      ))}
      <Rect x={98} y={130} width={188} height={7} rx={3.5} fill={brand[700]} />
      {/* window with a mug in it, and the door */}
      <Rect x={118} y={178} width={78} height={52} rx={8} fill="#CFDDFB" />
      <Path
        d="M140 196h22v14a8 8 0 0 1 -8 8h-6a8 8 0 0 1 -8 -8z"
        fill="#FFFFFF"
      />
      <Path
        d="M162 199h3a5 5 0 0 1 0 10h-3"
        stroke="#FFFFFF"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <Rect x={212} y={176} width={50} height={76} rx={8} fill="#B9CCF6" />
      <Circle cx={252} cy={216} r={3} fill="#FFFFFF" />

      {/* street */}
      <Rect x={-10} y={248} width={380} height={80} fill="#CCDAFB" />
      <Rect x={-10} y={248} width={380} height={6} fill="#B8CCF7" />
      <G fill="#E1EAFF">
        <Rect x={20} y={278} width={34} height={5} rx={2.5} />
        <Rect x={98} y={278} width={34} height={5} rx={2.5} />
        <Rect x={260} y={278} width={34} height={5} rx={2.5} />
        <Rect x={330} y={278} width={34} height={5} rx={2.5} />
      </G>

      {/* the cup, steaming, in front */}
      <Ellipse cx={186} cy={290} rx={40} ry={6} fill="#9FB6EC" opacity={0.55} />
      <G
        stroke="#FFFFFF"
        strokeWidth={4.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.95}
      >
        <Path d="M172 168c-8-10 8-14 0-26" />
        <Path d="M190 162c-8-10 8-14 0-26" />
      </G>
      <Path
        d="M154 196h64l-7 86a8 8 0 0 1 -8 7h-34a8 8 0 0 1 -8 -7z"
        fill="url(#osCup)"
      />
      <Path d="M157 232h58l-2.4 30h-53.2z" fill="url(#osSleeve)" />
      <Circle cx={186} cy={247} r={9} fill="#FFFFFF" opacity={0.9} />
      <Path
        d="M190.5 243.5a6 6 0 1 0 1.2 4.5h-5"
        stroke={brand[700]}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Rect
        x={148}
        y={182}
        width={76}
        height={17}
        rx={8.5}
        fill="url(#osLid)"
      />
      <Rect x={160} y={176} width={52} height={10} rx={5} fill="#5A80DA" />
      <Rect
        x={160}
        y={186}
        width={30}
        height={4}
        rx={2}
        fill="#FFFFFF"
        opacity={0.45}
      />
      <Path
        d="M162 204l-1 6"
        stroke="#FFFFFF"
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.9}
      />

      {/* sparkles */}
      <G fill="#FFFFFF">
        <Path d="M112 96q1.6 5.4 7 7q-5.4 1.6 -7 7q-1.6 -5.4 -7 -7q5.4 -1.6 7 -7z" />
        <Path d="M296 92q1.2 4 5 5q-3.8 1.2 -5 5q-1.2 -3.8 -5 -5q3.8 -1 5 -5z" />
      </G>
    </Svg>
  );
}

/** A phone with a help mark, for "Butuh bantuan?". */
export function HelpArt({ size = 110 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 110 110">
      <Defs>
        <LinearGradient id="haBody" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#6F93EA" />
          <Stop offset="1" stopColor={brand[800]} />
        </LinearGradient>
        <LinearGradient id="haScreen" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#DCE7FF" />
        </LinearGradient>
      </Defs>
      <G fill="#C9D7F7">
        {[0, 1, 2, 3, 4].map((r) =>
          [0, 1, 2].map((c) => (
            <Circle key={`${r}${c}`} cx={84 + c * 9} cy={14 + r * 9} r={2.4} />
          )),
        )}
      </G>
      <G transform="rotate(-12 50 60)">
        <Rect
          x={24}
          y={14}
          width={50}
          height={90}
          rx={12}
          fill="url(#haBody)"
        />
        <Rect
          x={29}
          y={22}
          width={40}
          height={72}
          rx={8}
          fill="url(#haScreen)"
        />
        <Circle cx={49} cy={56} r={15} fill="#FFD233" />
        <Rect x={46.6} y={46} width={4.8} height={13} rx={2.4} fill="#7A4B00" />
        <Circle cx={49} cy={64.5} r={2.8} fill="#7A4B00" />
        <Rect
          x={41}
          y={17}
          width={16}
          height={3}
          rx={1.5}
          fill="#FFFFFF"
          opacity={0.5}
        />
      </G>
    </Svg>
  );
}
