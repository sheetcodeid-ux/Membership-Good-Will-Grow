import React from "react";
import { View, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Crown, ShoppingBag, Receipt, ChevronRight, Check, Coins } from "lucide-react-native";
import { AppText, Card } from "../../components/ui";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { PressableScale } from "../../components/ui/PressableScale";
import { brand, ink, gold } from "../../theme/colors";
import { memberTiers } from "../../data/mock";
import { useMemberStore } from "../../store/memberStore";

export default function MemberScreen() {
  const points = useMemberStore((s) => s.points);
  const currentTier = useMemberStore((s) => s.currentTier());
  const nextTier = useMemberStore((s) => s.nextTier());
  const spendProgress = useMemberStore((s) => s.spendProgress());
  const txProgress = useMemberStore((s) => s.transactionProgress());

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 130 }}>
        <View>
          <AppText variant="h2">Membership Level</AppText>
          <AppText variant="caption" color={ink[500]}>Kumpulkan poin, naik level, dapatkan lebih banyak benefit</AppText>
        </View>

        <LinearGradient
          colors={["#0B2B73", "#123CA3", "#4066C2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 28, padding: 24, gap: 20, overflow: "hidden" }}
        >
          <View style={{ position: "absolute", right: -40, top: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(255,255,255,0.08)" }} />
          <View style={{ alignItems: "center", gap: 10 }}>
            <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center" }}>
              <Crown size={30} color={gold[100]} />
            </View>
            <AppText variant="h1" color="#FFFFFF">{currentTier.name}</AppText>
            <AppText variant="caption" color="rgba(255,255,255,0.75)" center>
              Terima kasih sudah menjadi bagian dari Good Will Grow Club
            </AppText>
          </View>

          {nextTier ? (
            <View style={{ gap: 14 }}>
              <ProgressRow
                icon={<ShoppingBag size={14} color="#FFFFFF" />}
                label="Total Belanja"
                value={`${Math.round(spendProgress * 100)}%`}
                progress={spendProgress}
              />
              <ProgressRow
                icon={<Receipt size={14} color="#FFFFFF" />}
                label="Total Transaksi"
                value={`${Math.round(txProgress * 100)}%`}
                progress={txProgress}
              />
            </View>
          ) : (
            <AppText variant="bodyMedium" color="#FFFFFF" center>
              Kamu sudah mencapai level tertinggi! 🎉
            </AppText>
          )}
        </LinearGradient>

        <PressableScale
          onPress={() => router.push("/points-history")}
          style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
        >
          <Card style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 14 }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: gold[50], alignItems: "center", justifyContent: "center" }}>
              <Coins size={20} color={gold[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="caption" color={ink[500]}>Poinmu</AppText>
              <AppText variant="h3">{points.toLocaleString("id-ID")}</AppText>
            </View>
            <ChevronRight size={18} color={ink[400]} />
          </Card>
        </PressableScale>

        <View style={{ gap: 12 }}>
          <AppText variant="h3">Benefit {currentTier.name}</AppText>
          <Card style={{ gap: 12 }}>
            {currentTier.perks.map((perk, i) => (
              <View key={i} style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: brand[50], alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                  <Check size={12} color={brand[600]} />
                </View>
                <AppText variant="body" color={ink[700]} style={{ flex: 1 }}>{perk}</AppText>
              </View>
            ))}
          </Card>
        </View>

        <View style={{ gap: 12 }}>
          <AppText variant="h3">Semua Level</AppText>
          <View style={{ gap: 10 }}>
            {memberTiers.map((tier) => {
              const active = tier.id === currentTier.id;
              return (
                <View
                  key={tier.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    backgroundColor: active ? brand[50] : ink[50],
                    borderRadius: 16,
                    padding: 14,
                    borderWidth: active ? 1.5 : 0,
                    borderColor: brand[300],
                  }}
                >
                  <Crown size={18} color={active ? brand[600] : ink[400]} />
                  <View style={{ flex: 1 }}>
                    <AppText variant="bodySemibold" color={active ? brand[700] : ink[800]}>{tier.name}</AppText>
                    <AppText variant="caption" color={ink[500]}>
                      Min. {tier.minTransactions}x transaksi · Poin {tier.pointRate}
                    </AppText>
                  </View>
                  {active ? (
                    <View style={{ backgroundColor: brand[600], paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                      <AppText variant="micro" color="#FFFFFF">Aktif</AppText>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProgressRow({
  icon,
  label,
  value,
  progress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  progress: number;
}) {
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {icon}
        <AppText variant="captionMedium" color="#FFFFFF" style={{ flex: 1 }}>{label}</AppText>
        <AppText variant="captionMedium" color="#FFFFFF">{value}</AppText>
      </View>
      <ProgressBar progress={progress} color="#FFFFFF" trackColor="rgba(255,255,255,0.2)" />
    </View>
  );
}
