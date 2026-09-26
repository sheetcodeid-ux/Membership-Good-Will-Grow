import React from "react";
import { View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient as SvgGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { UiText } from "./ui/Text";
import { Glyph, type GlyphName } from "./icons/Glyph";
import { fontFamilies } from "../theme/typography";
import { formatRupiah } from "../utils/format";
import type { MemberTier } from "../data/types";

/** Portrait card, the shape the creative team's tier artwork is drawn to. */
export const TIER_CARD_RATIO = 0.63;

export interface TierLook {
  /** Card body, lit top left to deep bottom right. */
  body: readonly [string, string, string];
  /** The emblem sphere: highlight, middle, rim. */
  orb: readonly [string, string, string];
  /** Accent for rings, chips and progress on this tier's colour. */
  accent: string;
  glyph: GlyphName;
}

/** Each level's colours and mark: blue, teal, violet, then black and gold. */
export const TIER_LOOK: Record<string, TierLook> = {
  classic: {
    body: ["#5A84E6", "#1A45B0", "#0B2B73"],
    orb: ["#FFFFFF", "#9BB9FF", "#3D66C9"],
    accent: "#B7CDFF",
    glyph: "heart",
  },
  signature: {
    body: ["#3CCBB7", "#14897A", "#0A4A43"],
    orb: ["#FFFFFF", "#9FF0E3", "#2FA897"],
    accent: "#A6F2E6",
    glyph: "star",
  },
  elite: {
    body: ["#9A86F4", "#5A43C8", "#27196E"],
    orb: ["#FFFFFF", "#CFC6FF", "#7461DA"],
    accent: "#D6CEFF",
    glyph: "verified",
  },
  royale: {
    body: ["#45434C", "#1D1C22", "#08080A"],
    orb: ["#FFF6D2", "#F2CF6B", "#B8871F"],
    accent: "#F2CF6B",
    glyph: "crown",
  },
};

export function lookFor(tierId: string): TierLook {
  return TIER_LOOK[tierId] ?? TIER_LOOK.classic;
}

const VW = 100;
const VH = VW / TIER_CARD_RATIO;
const EMBLEM = { x: 50, y: 60 };

/**
 * Soft contour lines around the emblem, like a map of an island seen from
 * above: each ring a closed, smoothly wobbling loop.
 */
function contourPaths() {
  const out: string[] = [];
  for (let k = 0; k < 6; k++) {
    const base = 22 + k * 10;
    const pts: [number, number][] = [];
    const n = 24;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r =
        base *
        (1 + 0.07 * Math.sin(3 * a + k * 0.9) + 0.04 * Math.sin(5 * a + k));
      pts.push([EMBLEM.x + r * Math.cos(a), EMBLEM.y + r * 0.86 * Math.sin(a)]);
    }
    // Catmull-Rom through the points, as cubic curves, closed.
    let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % n];
      const p3 = pts[(i + 2) % n];
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += `C${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
    }
    out.push(`${d}Z`);
  }
  return out;
}

const CONTOURS = contourPaths();

function CardArt({
  id,
  look,
  locked,
}: {
  id: string;
  look: TierLook;
  locked: boolean;
}) {
  const g = (name: string) => `${name}-${id}`;
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${VW} ${VH}`}
      style={{ position: "absolute" }}
    >
      <Defs>
        <SvgGradient id={g("body")} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={look.body[0]} />
          <Stop offset="0.5" stopColor={look.body[1]} />
          <Stop offset="1" stopColor={look.body[2]} />
        </SvgGradient>
        <RadialGradient id={g("glow")} cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.32} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id={g("orb")} cx="0.36" cy="0.3" r="0.75">
          <Stop offset="0" stopColor={look.orb[0]} />
          <Stop offset="0.45" stopColor={look.orb[1]} />
          <Stop offset="1" stopColor={look.orb[2]} />
        </RadialGradient>
        <SvgGradient id={g("sheen")} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
          <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.16} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </SvgGradient>
      </Defs>

      <Rect x={0} y={0} width={VW} height={VH} fill={`url(#${g("body")})`} />

      {/* island contours, fading out from the middle */}
      <G fill="none" stroke="#FFFFFF" strokeWidth={0.45}>
        {CONTOURS.map((d, i) => (
          <Path key={i} d={d} strokeOpacity={0.2 - i * 0.025} />
        ))}
      </G>

      {/* a wide band of light across the card */}
      <Rect
        x={-40}
        y={30}
        width={180}
        height={26}
        fill={`url(#${g("sheen")})`}
        transform={`rotate(-32 50 43)`}
      />

      {/* the emblem: glow, orbit behind, sphere, orbit in front */}
      <Circle cx={EMBLEM.x} cy={EMBLEM.y} r={34} fill={`url(#${g("glow")})`} />
      <G transform={`rotate(-16 ${EMBLEM.x} ${EMBLEM.y})`}>
        <Path
          d={`M${EMBLEM.x - 28} ${EMBLEM.y} A28 8 0 0 1 ${EMBLEM.x + 28} ${EMBLEM.y}`}
          fill="none"
          stroke={look.accent}
          strokeOpacity={0.55}
          strokeWidth={0.9}
          strokeLinecap="round"
        />
      </G>
      <Ellipse
        cx={EMBLEM.x + 1.5}
        cy={EMBLEM.y + 21}
        rx={15}
        ry={3}
        fill="#000000"
        opacity={0.18}
      />
      <Circle cx={EMBLEM.x} cy={EMBLEM.y} r={17} fill={`url(#${g("orb")})`} />
      <Circle
        cx={EMBLEM.x}
        cy={EMBLEM.y}
        r={16.4}
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity={0.45}
        strokeWidth={0.6}
      />
      {/* the glint; on a locked card the lock's glass takes its place */}
      {locked ? null : (
        <Ellipse
          cx={EMBLEM.x - 6.5}
          cy={EMBLEM.y - 8.5}
          rx={4.6}
          ry={2.4}
          fill="#FFFFFF"
          opacity={0.7}
          transform={`rotate(-35 ${EMBLEM.x - 6.5} ${EMBLEM.y - 8.5})`}
        />
      )}
      <G transform={`rotate(-16 ${EMBLEM.x} ${EMBLEM.y})`}>
        <Path
          d={`M${EMBLEM.x + 28} ${EMBLEM.y} A28 8 0 0 1 ${EMBLEM.x - 28} ${EMBLEM.y}`}
          fill="none"
          stroke={look.accent}
          strokeOpacity={0.9}
          strokeWidth={1}
          strokeLinecap="round"
        />
        <Circle
          cx={EMBLEM.x + 21}
          cy={EMBLEM.y + 5.4}
          r={2.2}
          fill={look.orb[1]}
        />
        <Circle
          cx={EMBLEM.x + 20.4}
          cy={EMBLEM.y + 4.8}
          r={0.7}
          fill="#FFFFFF"
          opacity={locked ? 0 : 1}
        />
      </G>
    </Svg>
  );
}

/**
 * One level's membership card in the Member tab's carousel: the level's
 * colours, an island contour pattern, a glossy emblem with the level's
 * mark, the name and tagline, and the member it belongs to. A level not
 * reached yet is dimmed with a lock and what it takes to get there.
 */
export function MemberTierCard({
  tier,
  level,
  width,
  memberName,
  current,
  locked,
}: {
  tier: MemberTier;
  level: number;
  width: number;
  memberName: string;
  current: boolean;
  locked: boolean;
}) {
  const look = lookFor(tier.id);
  const height = width / TIER_CARD_RATIO;
  const orb = (width * 34) / VW;
  const white = (a: number) => `rgba(255,255,255,${a})`;

  return (
    <View
      style={{
        width,
        height,
        borderRadius: 22,
        shadowColor: look.body[2],
        shadowOpacity: 0.35,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
      }}
    >
      <View style={{ flex: 1, borderRadius: 22, overflow: "hidden" }}>
        <CardArt id={tier.id} look={look} locked={locked} />

        {/* a level not reached yet: dimmed, with a lock set in the sphere */}
        {locked ? (
          <>
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: "rgba(8,12,28,0.42)",
              }}
            />
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                left: (width * EMBLEM.x) / VW - 24,
                top: (height * EMBLEM.y) / VH - 24,
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: white(0.18),
                borderWidth: 1,
                borderColor: white(0.35),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Glyph name="lock" size={21} color="#FFFFFF" />
            </View>
          </>
        ) : null}

        {/* the level's mark on the sphere */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: (width * EMBLEM.x) / VW - orb / 2,
            top: (height * EMBLEM.y) / VH - orb / 2,
            width: orb,
            height: orb,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {locked ? null : (
            <Glyph name={look.glyph} size={orb * 0.46} color="#FFFFFF" />
          )}
        </View>

        <View
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <UiText
            color={white(0.88)}
            numberOfLines={1}
            style={{
              flexShrink: 1,
              fontSize: 10.5,
              lineHeight: 14,
              letterSpacing: 1.5,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            GOOD WILL GROW
          </UiText>
          <View
            style={{
              height: 22,
              paddingHorizontal: 9,
              borderRadius: 11,
              justifyContent: "center",
              backgroundColor: white(0.18),
            }}
          >
            <UiText
              color="#FFFFFF"
              style={{
                fontSize: 10.5,
                lineHeight: 14,
                letterSpacing: 0.4,
                fontFamily: fontFamilies.extrabold,
              }}
            >
              LEVEL {level}
            </UiText>
          </View>
        </View>

        <View style={{ position: "absolute", left: 16, right: 16, bottom: 16 }}>
          {current ? (
            <View
              style={{
                alignSelf: "flex-start",
                marginBottom: 8,
                height: 22,
                paddingHorizontal: 8,
                borderRadius: 11,
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#FFFFFF",
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#22A355",
                }}
              />
              <UiText
                color={look.body[2]}
                style={{
                  fontSize: 10.5,
                  lineHeight: 14,
                  fontFamily: fontFamilies.extrabold,
                }}
              >
                Level kamu
              </UiText>
            </View>
          ) : null}
          <UiText
            color="#FFFFFF"
            numberOfLines={1}
            style={{
              fontSize: width < 240 ? 25 : 28,
              lineHeight: width < 240 ? 30 : 33,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            {tier.name}
          </UiText>
          {locked ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 6,
              }}
            >
              <View style={{ marginTop: 2 }}>
                <Glyph name="lock" size={12} color={look.accent} />
              </View>
              <UiText
                color={white(0.9)}
                numberOfLines={2}
                style={{
                  flex: 1,
                  fontSize: 12.5,
                  lineHeight: 17,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                Terbuka setelah belanja {formatRupiah(tier.minSpend)} dan{" "}
                {tier.minTransactions} transaksi
              </UiText>
            </View>
          ) : (
            <UiText
              color={white(0.82)}
              numberOfLines={2}
              style={{
                fontSize: 12.5,
                lineHeight: 17,
                fontFamily: fontFamilies.medium,
              }}
            >
              {tier.tagline}
            </UiText>
          )}
          <View
            style={{
              height: 1,
              backgroundColor: white(0.2),
              marginVertical: 11,
            }}
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <UiText
                color={white(0.66)}
                style={{
                  fontSize: 10.5,
                  lineHeight: 14,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                Member
              </UiText>
              <UiText
                color="#FFFFFF"
                numberOfLines={1}
                style={{
                  fontSize: 13.5,
                  lineHeight: 18,
                  fontFamily: fontFamilies.bold,
                }}
              >
                {memberName}
              </UiText>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <UiText
                color={white(0.66)}
                style={{
                  fontSize: 10.5,
                  lineHeight: 14,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                Poin/transaksi
              </UiText>
              <UiText
                color={look.accent}
                style={{
                  fontSize: 13.5,
                  lineHeight: 18,
                  fontFamily: fontFamilies.extrabold,
                }}
              >
                {tier.pointRate}
              </UiText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
