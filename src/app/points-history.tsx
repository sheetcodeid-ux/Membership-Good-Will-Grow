import React from "react";
import { ScrollView, View } from "react-native";
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
import { AccountEmpty } from "../components/EmptyArt";
import {
  AccountCard,
  AccountSection,
  LABEL_INK,
  QUIET_INK,
  RULE,
} from "../components/AccountMenu";
import { danger, success, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { useMemberStore } from "../store/memberStore";

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

export default function PointsHistoryScreen() {
  const points = useMemberStore((s) => s.points);
  const history = useMemberStore((s) => s.history);

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader tone="account" title="Riwayat Poin" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: EDGE,
          paddingTop: 16,
          paddingBottom: 40,
          flexGrow: 1,
        }}
      >
        <LinearGradient
          colors={GOLD}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            borderRadius: 16,
            overflow: "hidden",
            height: 98,
            paddingLeft: 16,
            justifyContent: "center",
          }}
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
          <UiText
            color={STRIP_INK}
            style={{
              marginTop: 2,
              fontSize: 28,
              lineHeight: 34,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            {points.toLocaleString("id-ID")}
            <UiText
              color={STRIP_INK}
              style={{
                fontSize: 15,
                lineHeight: 34,
                fontFamily: fontFamilies.bold,
              }}
            >
              {"  poin"}
            </UiText>
          </UiText>
        </LinearGradient>

        <AccountSection title="Riwayat transaksi poin" />

        {history.length === 0 ? (
          <AccountEmpty
            glyph="coins"
            title="Belum ada riwayat poin"
            subtitle="Poin dari setiap transaksimu akan tercatat di sini."
          />
        ) : (
          <AccountCard>
            {history.map((entry, i) => {
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
                    <View style={{ alignItems: "flex-end" }}>
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
                      <UiText
                        color={QUIET_INK}
                        style={{
                          marginTop: 2,
                          fontSize: 12,
                          lineHeight: 16,
                          fontFamily: fontFamilies.medium,
                        }}
                      >
                        {earned ? "Diperoleh" : "Digunakan"}
                      </UiText>
                    </View>
                  </View>
                </View>
              );
            })}
          </AccountCard>
        )}
      </ScrollView>
    </View>
  );
}
