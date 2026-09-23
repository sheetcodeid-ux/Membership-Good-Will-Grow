import React from "react";
import { AppIcon } from "../components/ui/AppIcon";
import { ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { brand, danger, ink, success, surface } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { useMemberStore } from "../store/memberStore";

/** Short line under the date saying where the points came from. */
function sourceLabel(title: string, earned: boolean) {
  if (!earned) return "Penukaran Poin";
  return title.toLowerCase().startsWith("transaksi") ? "Poin Transaksi" : "Poin Registrasi";
}

export default function PointsHistoryScreen() {
  const points = useMemberStore((s) => s.points);
  const history = useMemberStore((s) => s.history);

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Riwayat Poin" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 30, gap: 16, flexGrow: 1 }}
      >
        <LinearGradient
          colors={[brand[950], brand[800]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            borderRadius: 16,
            padding: 16,
            ...(shadow.md as object),
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.16)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppIcon name="handCoins" size={24} color="#FFFFFF" />
          </View>
          <View>
            <AppText variant="body" color="rgba(255,255,255,0.85)">
              Total Poin Anda
            </AppText>
            <AppText
              color="#FFFFFF"
              style={{ fontSize: 24, lineHeight: 31, fontFamily: "Urbanist_700Bold" }}
            >
              {points.toLocaleString("id-ID")} Poin
            </AppText>
          </View>
        </LinearGradient>

        <AppText variant="h3" center>
          Riwayat Transaksi Poin
        </AppText>

        {history.length === 0 ? (
          <EmptyState
            icon={<AppIcon name="handCoins" size={50} color={ink[300]} />}
            title="Belum ada riwayat poin"
            subtitle="Poin dari transaksimu akan tercatat di sini."
            style={{ paddingTop: 50 }}
          />
        ) : null}

        <View style={{ gap: 12 }}>
          {history.map((entry) => {
            const earned = entry.points >= 0;
            return (
              <View
                key={entry.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 15,
                  padding: 14,
                  ...(shadow.xs as object),
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 11,
                    backgroundColor: earned ? success[50] : danger[50],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {earned ? (
                    <AppIcon name="trendUp" size={18} color={success[600]} />
                  ) : (
                    <AppIcon name="trendDown" size={18} color={danger[500]} />
                  )}
                </View>

                <View style={{ flex: 1, gap: 1 }}>
                  <AppText variant="h3" numberOfLines={1}>
                    {entry.title}
                  </AppText>
                  <AppText variant="caption" color={ink[500]}>
                    {entry.date}
                  </AppText>
                  <AppText variant="caption" color={ink[400]}>
                    {sourceLabel(entry.title, earned)}
                  </AppText>
                </View>

                <View style={{ alignItems: "flex-end", gap: 5 }}>
                  <AppText
                    variant="bodySemibold"
                    color={earned ? success[600] : danger[500]}
                  >
                    {earned ? "+" : ""}
                    {entry.points.toLocaleString("id-ID")} poin
                  </AppText>
                  <View
                    style={{
                      backgroundColor: earned ? success[50] : danger[50],
                      borderRadius: 7,
                      paddingHorizontal: 9,
                      paddingVertical: 3,
                    }}
                  >
                    <AppText variant="caption" color={earned ? success[600] : danger[500]}>
                      {earned ? "Diperoleh" : "Digunakan"}
                    </AppText>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
