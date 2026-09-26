import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Defs,
  Ellipse,
  G,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { Glyph } from "../components/icons/Glyph";
import { PressableScale } from "../components/ui/PressableScale";
import { CountUp } from "../components/ui/CountUp";
import { AccountEmpty } from "../components/EmptyArt";
import {
  AccountCard,
  AccountSection,
  LABEL_INK,
  QUIET_INK,
  RULE,
} from "../components/AccountMenu";
import { brand, danger, success, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { useMemberStore } from "../store/memberStore";
import { monthLabel, parseIndoDate } from "../utils/dates";
import { tapSelect } from "../utils/haptics";
import { useScrolled } from "../hooks/useScrolled";

const EDGE = 13.5;
const GOLD = ["#FFDD00", "#FFDD00", "#FFFDEF"] as const;
const STRIP_INK = "#702B00";

const STAR =
  "M0 -5.6C0.5 -5.6 0.8 -5.3 1 -4.9L2.2 -2.4L5 -2C5.5 -1.9 5.8 -1.6 5.9 -1.1C6 -0.7 5.8 -0.3 5.5 0L3.5 2L4 4.8C4.1 5.3 3.9 5.7 3.5 6C3.1 6.2 2.7 6.2 2.3 6L0 4.7L-2.3 6C-2.7 6.2 -3.1 6.2 -3.5 6C-3.9 5.7 -4.1 5.3 -4 4.8L-3.5 2L-5.5 0C-5.8 -0.3 -6 -0.7 -5.9 -1.1C-5.8 -1.6 -5.5 -1.9 -5 -2L-2.2 -2.4L-1 -4.9C-0.8 -5.3 -0.5 -5.6 0 -5.6Z";

/**
 * A little stack of points coins in the reward card's clay style: each
 * coin a lit face over a darker rim, the top one embossed with a star.
 */
function CoinStack() {
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

/** Short line saying where the points came from. */
function sourceLabel(title: string, earned: boolean) {
  if (!earned) return "Penukaran poin";
  return title.toLowerCase().startsWith("transaksi")
    ? "Poin transaksi"
    : "Poin registrasi";
}

type Filter = "all" | "earned" | "spent";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "earned", label: "Diperoleh" },
  { key: "spent", label: "Digunakan" },
];

/** Small figure under the balance: what came in, what went out. */
function Stat({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone: string;
  icon: "trendUp" | "trendDown";
}) {
  return (
    <View
      style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: icon === "trendUp" ? success[50] : danger[50],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Glyph name={icon} size={16} color={tone} />
      </View>
      <View>
        <UiText
          color={QUIET_INK}
          style={{
            fontSize: 12,
            lineHeight: 16,
            fontFamily: fontFamilies.medium,
          }}
        >
          {label}
        </UiText>
        <UiText
          color={LABEL_INK}
          style={{
            fontSize: 15,
            lineHeight: 19,
            fontFamily: fontFamilies.extrabold,
          }}
        >
          {value}
        </UiText>
      </View>
    </View>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={() => {
        tapSelect();
        onPress();
      }}
      scaleTo={0.96}
      style={{
        height: 34,
        paddingHorizontal: 14,
        borderRadius: 17,
        borderWidth: active ? 1.5 : 1,
        borderColor: active ? brand[600] : RULE,
        backgroundColor: active ? "#EEF3FF" : "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <UiText
        color={active ? brand[700] : LABEL_INK}
        style={{
          fontSize: 13,
          lineHeight: 17,
          fontFamily: active ? fontFamilies.bold : fontFamilies.semibold,
        }}
      >
        {label}
      </UiText>
    </PressableScale>
  );
}

export default function PointsHistoryScreen() {
  const points = useMemberStore((s) => s.points);
  const history = useMemberStore((s) => s.history);
  const scroll = useScrolled();
  const [filter, setFilter] = useState<Filter>("all");

  const earnedTotal = history
    .filter((e) => e.points > 0)
    .reduce((n, e) => n + e.points, 0);
  const spentTotal = history
    .filter((e) => e.points < 0)
    .reduce((n, e) => n - e.points, 0);

  const visible = history.filter((e) =>
    filter === "all"
      ? true
      : filter === "earned"
        ? e.points >= 0
        : e.points < 0,
  );

  // Newest first, grouped under the month they happened in.
  const groups = (() => {
    const dated = visible
      .map((entry) => ({ entry, at: parseIndoDate(entry.date) }))
      .sort((a, b) => (b.at?.getTime() ?? 0) - (a.at?.getTime() ?? 0));
    const out: { label: string; items: typeof dated }[] = [];
    for (const item of dated) {
      const label = item.at ? monthLabel(item.at) : "Lainnya";
      const last = out[out.length - 1];
      if (last && last.label === label) last.items.push(item);
      else out.push({ label, items: [item] });
    }
    return out;
  })();

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader
        tone="account"
        title="Riwayat Poin"
        divider={scroll.scrolled}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scroll.onScroll}
        scrollEventThrottle={scroll.scrollEventThrottle}
        contentContainerStyle={{
          paddingHorizontal: EDGE,
          paddingTop: 16,
          paddingBottom: 40,
          flexGrow: 1,
        }}
      >
        <View
          style={{
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: RULE,
          }}
        >
          <LinearGradient
            colors={GOLD}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ height: 98, paddingLeft: 16, justifyContent: "center" }}
          >
            <View style={{ position: "absolute", right: 12, bottom: 4 }}>
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
              Total poin kamu
            </UiText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 2,
              }}
            >
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
          </LinearGradient>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              flexDirection: "row",
              paddingHorizontal: 14,
              paddingVertical: 12,
              gap: 10,
            }}
          >
            <Stat
              label="Diperoleh"
              value={`+${earnedTotal.toLocaleString("id-ID")}`}
              tone={success[600]}
              icon="trendUp"
            />
            <View style={{ width: 1, backgroundColor: RULE }} />
            <Stat
              label="Digunakan"
              value={`-${spentTotal.toLocaleString("id-ID")}`}
              tone={danger[500]}
              icon="trendDown"
            />
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
          {filters.map((f) => (
            <FilterChip
              key={f.key}
              label={f.label}
              active={filter === f.key}
              onPress={() => setFilter(f.key)}
            />
          ))}
        </View>

        {groups.length === 0 ? (
          <AccountEmpty
            glyph="coins"
            title={
              history.length === 0
                ? "Belum ada riwayat poin"
                : "Tidak ada transaksi di filter ini"
            }
            subtitle="Poin dari setiap transaksimu akan tercatat di sini."
            action={
              history.length === 0
                ? { label: "Mulai pesan", onPress: () => router.push("/order") }
                : undefined
            }
          />
        ) : (
          groups.map((group) => (
            <View key={group.label}>
              <AccountSection title={group.label} />
              <AccountCard>
                {group.items.map(({ entry }, i) => {
                  const earned = entry.points >= 0;
                  const tone = earned ? success[600] : danger[500];
                  return (
                    <View key={entry.id}>
                      {i > 0 ? (
                        <View
                          style={{
                            height: 1,
                            backgroundColor: RULE,
                            marginLeft: 62,
                            marginRight: 9.5,
                          }}
                        />
                      ) : null}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 12,
                          paddingHorizontal: 14,
                          paddingVertical: 12,
                        }}
                      >
                        <View
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: earned ? success[50] : danger[50],
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Glyph
                            name={earned ? "trendUp" : "trendDown"}
                            size={18}
                            color={tone}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <UiText
                            color={LABEL_INK}
                            numberOfLines={1}
                            style={{
                              fontSize: 15,
                              lineHeight: 19,
                              fontFamily: fontFamilies.semibold,
                            }}
                          >
                            {entry.title}
                          </UiText>
                          <UiText
                            color={QUIET_INK}
                            numberOfLines={1}
                            style={{
                              marginTop: 2,
                              fontSize: 12.5,
                              lineHeight: 16,
                              fontFamily: fontFamilies.medium,
                            }}
                          >
                            {entry.date} · {sourceLabel(entry.title, earned)}
                          </UiText>
                        </View>
                        <UiText
                          color={tone}
                          style={{
                            fontSize: 15,
                            lineHeight: 19,
                            fontFamily: fontFamilies.extrabold,
                          }}
                        >
                          {earned ? "+" : ""}
                          {entry.points.toLocaleString("id-ID")}
                        </UiText>
                      </View>
                    </View>
                  );
                })}
              </AccountCard>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
