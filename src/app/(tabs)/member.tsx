import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UiText } from "../../components/ui/Text";
import { ACCOUNT_BAR } from "../../components/ui/AppHeader";
import { PressableScale } from "../../components/ui/PressableScale";
import { CountUp } from "../../components/ui/CountUp";
import { Glyph, type GlyphName } from "../../components/icons/Glyph";
import { SkylineBand } from "../../components/AccountHeroArt";
import { CoinStack } from "../../components/CoinStack";
import {
  MemberTierCard,
  TIER_CARD_RATIO,
  lookFor,
} from "../../components/MemberTierCard";
import { LABEL_INK, QUIET_INK, RULE } from "../../components/AccountMenu";
import {
  Block,
  EDGE,
  GradientButton,
  OutlinePill,
} from "../../components/checkout/parts";
import { brand, success, surface } from "../../theme/colors";
import { useResponsive } from "../../theme/responsive";
import { fontFamilies } from "../../theme/typography";
import { memberTiers } from "../../data/mock";
import type { MemberTier } from "../../data/types";
import { useMemberStore } from "../../store/memberStore";
import { useAuthStore } from "../../store/authStore";
import { formatRupiah } from "../../utils/format";
import { tapSelect } from "../../utils/haptics";

const HEADER_H = 64;
const BAR_H = HEADER_H / 2 + 24.5;
const GOLD = ["#FFDD00", "#FFDD00", "#FFFDEF"] as const;
const STRIP_INK = "#702B00";

/** One card in the carousel, easing down in size as it slides away. */
function CarouselCard({
  index,
  x,
  pageWidth,
  children,
}: {
  index: number;
  x: SharedValue<number>;
  pageWidth: number;
  children: React.ReactNode;
}) {
  const style = useAnimatedStyle(() => {
    const at = x.value / pageWidth;
    return {
      opacity: interpolate(
        at,
        [index - 1, index, index + 1],
        [0.4, 1, 0.4],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          scale: interpolate(
            at,
            [index - 1, index, index + 1],
            [0.88, 1, 0.88],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });
  return (
    <View style={{ width: pageWidth, alignItems: "center" }}>
      <Animated.View style={style}>{children}</Animated.View>
    </View>
  );
}

/**
 * The four levels as a path: reached ones ticked, the rest locked, the
 * line filled up to the member's level, the card on show ringed. Each
 * stop turns the carousel to its card.
 */
function TierJourney({
  shown,
  reached,
  onPick,
}: {
  shown: number;
  reached: number;
  onPick: (i: number) => void;
}) {
  const last = memberTiers.length - 1;
  return (
    <View style={{ paddingHorizontal: EDGE + 8 }}>
      <View
        style={{
          position: "absolute",
          left: EDGE + 8 + 30,
          right: EDGE + 8 + 30,
          top: 15,
          height: 4,
          borderRadius: 2,
          backgroundColor: "#DCE4F5",
        }}
      >
        <LinearGradient
          colors={[brand[400], brand[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: `${(reached / last) * 100}%`,
            height: 4,
            borderRadius: 2,
          }}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {memberTiers.map((t, i) => {
          const isReached = i <= reached;
          const isShown = i === shown;
          const look = lookFor(t.id);
          return (
            <PressableScale
              key={t.id}
              onPress={() => onPick(i)}
              scaleTo={0.92}
              accessibilityLabel={`Lihat level ${t.name}`}
              style={{ width: 60, alignItems: "center" }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isShown ? "#FFFFFF" : "transparent",
                  borderWidth: isShown ? 2 : 0,
                  borderColor: look.body[1],
                  marginTop: -2,
                }}
              >
                <LinearGradient
                  colors={
                    isReached
                      ? [look.body[0], look.body[2]]
                      : ["#E7EBF3", "#D3DAE8"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Glyph
                    name={isReached ? "check" : "lock"}
                    size={12}
                    color={isReached ? "#FFFFFF" : "#8A93A6"}
                  />
                </LinearGradient>
              </View>
              <UiText
                color={isShown ? LABEL_INK : QUIET_INK}
                style={{
                  marginTop: 5,
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: isShown
                    ? fontFamilies.extrabold
                    : fontFamilies.semibold,
                }}
              >
                {t.name}
              </UiText>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

/** A labelled bar that fills to its share, in the target level's colours. */
function ProgressRow({
  icon,
  label,
  value,
  ratio,
  colors,
}: {
  icon: GlyphName;
  label: string;
  value: string;
  ratio: number;
  colors: readonly [string, string];
}) {
  const fill = useSharedValue(0);
  useEffect(() => {
    fill.value = withTiming(Math.max(0, Math.min(1, ratio)), {
      duration: 700,
    });
  }, [ratio, fill]);
  const fillStyle = useAnimatedStyle(() => ({
    width: `${Math.max(fill.value * 100, fill.value > 0 ? 4 : 0)}%`,
  }));
  return (
    <View style={{ gap: 7 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Glyph name={icon} size={15} color={brand[600]} />
        <UiText
          color={LABEL_INK}
          style={{
            flex: 1,
            fontSize: 14,
            lineHeight: 19,
            fontFamily: fontFamilies.semibold,
          }}
        >
          {label}
        </UiText>
        <UiText
          color={QUIET_INK}
          style={{
            fontSize: 12.5,
            lineHeight: 17,
            fontFamily: fontFamilies.semibold,
          }}
        >
          {value}
        </UiText>
      </View>
      <View
        style={{
          height: 10,
          borderRadius: 5,
          backgroundColor: "#E9EDF5",
          overflow: "hidden",
        }}
      >
        <Animated.View style={[{ height: 10, borderRadius: 5 }, fillStyle]}>
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, borderRadius: 5 }}
          />
        </Animated.View>
      </View>
    </View>
  );
}

/** How far the member is from the next level, or from the level on show. */
function ProgressCard({ shown, reached }: { shown: number; reached: number }) {
  const totalSpend = useMemberStore((s) => s.totalSpend);
  const totalTx = useMemberStore((s) => s.totalTransactions);
  const top = reached >= memberTiers.length - 1;
  const target: MemberTier | undefined =
    shown > reached ? memberTiers[shown] : memberTiers[reached + 1];

  if (!target || top) {
    return (
      <Block style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Glyph name="crown" size={26} color="#C9962B" />
          <View style={{ flex: 1 }}>
            <UiText
              color={LABEL_INK}
              style={{
                fontSize: 16,
                lineHeight: 21,
                fontFamily: fontFamilies.extrabold,
              }}
            >
              Kamu di level tertinggi
            </UiText>
            <UiText
              color={QUIET_INK}
              style={{
                fontSize: 13,
                lineHeight: 18,
                fontFamily: fontFamilies.medium,
              }}
            >
              Semua benefit Good Will Grow sudah terbuka untukmu.
            </UiText>
          </View>
        </View>
      </Block>
    );
  }

  const look = lookFor(target.id);
  const spendLeft = Math.max(0, target.minSpend - totalSpend);
  const txLeft = Math.max(0, target.minTransactions - totalTx);
  const needs = [
    spendLeft > 0 ? `belanja ${formatRupiah(spendLeft)} lagi` : null,
    txLeft > 0 ? `${txLeft} transaksi lagi` : null,
  ].filter(Boolean);
  const hint = needs.length
    ? `Tinggal ${needs.join(" dan ")} untuk naik ke ${target.name}.`
    : `Syarat ${target.name} sudah terpenuhi, levelmu naik setelah transaksi berikutnya.`;

  return (
    <Block style={{ padding: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <UiText
          color={LABEL_INK}
          style={{
            flex: 1,
            fontSize: 17,
            lineHeight: 22,
            fontFamily: fontFamilies.extrabold,
          }}
        >
          {shown > reached ? `Syarat ${target.name}` : `Menuju ${target.name}`}
        </UiText>
        <LinearGradient
          colors={[look.body[0], look.body[2]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 24,
            paddingHorizontal: 10,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Glyph name={look.glyph} size={12} color="#FFFFFF" />
          <UiText
            color="#FFFFFF"
            style={{
              fontSize: 11.5,
              lineHeight: 15,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            Poin {target.pointRate}
          </UiText>
        </LinearGradient>
      </View>

      <View style={{ marginTop: 14, gap: 14 }}>
        <ProgressRow
          icon="cart"
          label="Total belanja"
          value={`${formatRupiah(totalSpend)} / ${formatRupiah(target.minSpend)}`}
          ratio={totalSpend / target.minSpend}
          colors={[look.body[0], look.body[1]]}
        />
        <ProgressRow
          icon="receipt"
          label="Total transaksi"
          value={`${totalTx} / ${target.minTransactions}`}
          ratio={totalTx / target.minTransactions}
          colors={[look.body[0], look.body[1]]}
        />
      </View>

      <View
        style={{
          marginTop: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          borderRadius: 12,
          backgroundColor: "#EEF3FF",
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <Glyph name="trendUp" size={16} color={brand[600]} />
        <UiText
          color={brand[800]}
          style={{
            flex: 1,
            fontSize: 12.5,
            lineHeight: 17,
            fontFamily: fontFamilies.semibold,
          }}
        >
          {hint}
        </UiText>
      </View>

      <View style={{ marginTop: 14 }}>
        <GradientButton
          label="Pesan sekarang"
          icon="cart"
          height={48}
          onPress={() => {
            tapSelect();
            router.push("/order");
          }}
        />
      </View>
    </Block>
  );
}

/** The points balance in gold, with where to see it and where to use it. */
function PointsCard() {
  const points = useMemberStore((s) => s.points);
  return (
    <Block style={{ padding: 0 }}>
      <PressableScale
        onPress={() => router.push("/points-history")}
        scaleTo={0.99}
        accessibilityLabel="Riwayat poin"
      >
        <LinearGradient
          colors={GOLD}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ height: 104, paddingLeft: 16, justifyContent: "center" }}
        >
          <View style={{ position: "absolute", right: 12, bottom: 6 }}>
            <CoinStack />
          </View>
          <UiText
            color={STRIP_INK}
            style={{
              fontSize: 13,
              lineHeight: 17,
              fontFamily: fontFamilies.semibold,
            }}
          >
            Poin kamu
          </UiText>
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <CountUp
              value={points}
              format={(n) => n.toLocaleString("id-ID")}
              color={STRIP_INK}
              style={{
                fontSize: 28,
                lineHeight: 34,
                fontFamily: fontFamilies.extrabold,
              }}
            />
            <UiText
              color={STRIP_INK}
              style={{
                marginLeft: 6,
                fontSize: 15,
                lineHeight: 34,
                fontFamily: fontFamilies.bold,
              }}
            >
              poin
            </UiText>
          </View>
          <UiText
            color={STRIP_INK}
            style={{
              fontSize: 12,
              lineHeight: 16,
              fontFamily: fontFamilies.medium,
              opacity: 0.85,
            }}
          >
            Senilai {formatRupiah(points)} potongan saat bayar
          </UiText>
        </LinearGradient>
      </PressableScale>
      <View style={{ flexDirection: "row", padding: 12, gap: 10 }}>
        <PressableScale
          onPress={() => router.push("/points-history")}
          scaleTo={0.97}
          style={{
            flex: 1,
            height: 42,
            borderRadius: 21,
            borderWidth: 1.5,
            borderColor: "#C9D6F5",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Glyph name="clock" size={15} color={brand[700]} />
          <UiText
            color={brand[700]}
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontFamily: fontFamilies.bold,
            }}
          >
            Riwayat poin
          </UiText>
        </PressableScale>
        <PressableScale
          onPress={() => router.push("/order")}
          scaleTo={0.97}
          style={{
            flex: 1,
            height: 42,
            borderRadius: 21,
            backgroundColor: brand[600],
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Glyph name="coins" size={15} color="#FFFFFF" />
          <UiText
            color="#FFFFFF"
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontFamily: fontFamilies.bold,
            }}
          >
            Pakai poin
          </UiText>
        </PressableScale>
      </View>
    </Block>
  );
}

/** What the level on show gives, ticked when the member has it. */
function BenefitCard({ tier, open }: { tier: MemberTier; open: boolean }) {
  const look = lookFor(tier.id);
  return (
    <Block style={{ padding: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <LinearGradient
          colors={[look.body[0], look.body[2]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderColor: "rgba(255,255,255,0.45)",
          }}
        >
          <Glyph name="gift" size={20} color="#FFFFFF" />
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <UiText
            color={LABEL_INK}
            style={{
              fontSize: 17,
              lineHeight: 22,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            Benefit {tier.name}
          </UiText>
          <UiText
            color={open ? success[600] : QUIET_INK}
            style={{
              fontSize: 12.5,
              lineHeight: 17,
              fontFamily: fontFamilies.semibold,
            }}
          >
            {open
              ? "Sudah bisa kamu nikmati"
              : "Terbuka saat naik ke level ini"}
          </UiText>
        </View>
      </View>

      <View style={{ marginTop: 14, gap: 12 }}>
        {tier.perks.map((perk) => (
          <View
            key={perk}
            style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                marginTop: 1,
                backgroundColor: open ? success[50] : "#EEF1F6",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Glyph
                name={open ? "check" : "lock"}
                size={11}
                color={open ? success[600] : "#8A93A6"}
              />
            </View>
            <UiText
              color={open ? LABEL_INK : QUIET_INK}
              style={{
                flex: 1,
                fontSize: 13.5,
                lineHeight: 19,
                fontFamily: fontFamilies.medium,
              }}
            >
              {perk}
            </UiText>
          </View>
        ))}
      </View>

      <View
        style={{
          marginTop: 16,
          paddingTop: 14,
          borderTopWidth: 1,
          borderTopColor: RULE,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <UiText
          color={QUIET_INK}
          style={{
            flex: 1,
            fontSize: 12.5,
            lineHeight: 17,
            fontFamily: fontFamilies.medium,
          }}
        >
          Syarat naik level dan cara hitung poin
        </UiText>
        <OutlinePill
          label="Selengkapnya"
          onPress={() => router.push("/terms")}
        />
      </View>
    </Block>
  );
}

/**
 * Member tab: the member's level cards over the city scene, a path through
 * the four levels, how far the next one is, the points balance, and what
 * the level on show gives.
 */
export default function MemberScreen() {
  const { width } = useWindowDimensions();
  const r = useResponsive();
  const insets = useSafeAreaInsets();
  const top = Math.max(insets.top, 24);
  const name = useAuthStore((s) => s.name);
  const currentTier = useMemberStore((s) => s.currentTier());
  const reached = Math.max(
    0,
    memberTiers.findIndex((t) => t.id === currentTier.id),
  );
  const [shown, setShown] = useState(reached);

  const cardWidth = Math.min(width * 0.7, 252);
  const cardHeight = cardWidth / TIER_CARD_RATIO;
  const pager = useRef<Animated.ScrollView>(null);
  const x = useSharedValue(reached * width);

  const onPage = useAnimatedScrollHandler((e) => {
    x.value = e.contentOffset.x;
  });
  useAnimatedReaction(
    () => Math.round(x.value / width),
    (i, prev) => {
      if (i !== prev) runOnJS(setShown)(i);
    },
  );

  // Open on the member's own card.
  useEffect(() => {
    const t = setTimeout(
      () => pager.current?.scrollTo({ x: reached * width, animated: false }),
      0,
    );
    return () => clearTimeout(t);
  }, [reached, width]);

  const pick = (i: number) => {
    tapSelect();
    setShown(i);
    pager.current?.scrollTo({ x: i * width, animated: true });
  };

  const pageY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    pageY.value = e.contentOffset.y;
  });
  const barStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pageY.value, [8, 52], [0, 1], Extrapolation.CLAMP),
  }));

  const tier =
    memberTiers[Math.min(Math.max(shown, 0), memberTiers.length - 1)];

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
      >
        <View style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
          <SkylineBand
            width={width}
            height={top + HEADER_H + cardHeight * 0.52}
          />
        </View>

        <View style={{ height: top + HEADER_H }} />

        <Animated.ScrollView
          ref={pager}
          horizontal
          pagingEnabled
          onScroll={onPage}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 4, paddingBottom: 26 }}
        >
          {memberTiers.map((t, i) => (
            <CarouselCard key={t.id} index={i} x={x} pageWidth={width}>
              <MemberTierCard
                tier={t}
                level={i + 1}
                width={cardWidth}
                memberName={name}
                current={i === reached}
                locked={i > reached}
              />
            </CarouselCard>
          ))}
        </Animated.ScrollView>

        <TierJourney shown={shown} reached={reached} onPick={pick} />

        <View style={{ paddingHorizontal: EDGE, marginTop: 20, gap: 14 }}>
          <ProgressCard shown={shown} reached={reached} />
          <PointsCard />
          <BenefitCard tier={tier} open={shown <= reached} />
        </View>
      </Animated.ScrollView>

      {/* the title stays put; a bar fades in behind it once the page moves */}
      <View
        pointerEvents="none"
        style={{ position: "absolute", left: 0, right: 0, top: 0 }}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { height: top + BAR_H, backgroundColor: ACCOUNT_BAR },
            barStyle,
          ]}
        />
        <View
          style={{
            marginTop: top,
            height: HEADER_H,
            justifyContent: "center",
            paddingHorizontal: r.gutter,
          }}
        >
          <UiText
            token="titleLg"
            color={LABEL_INK}
            style={{ fontFamily: fontFamilies.bold }}
          >
            Membership
          </UiText>
        </View>
      </View>
    </View>
  );
}
