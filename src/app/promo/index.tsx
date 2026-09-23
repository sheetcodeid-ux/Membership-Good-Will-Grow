import React from "react";
import { AppIcon } from "../../components/ui/AppIcon";
import { View, FlatList } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "../../components/ui/AppText";
import { Badge } from "../../components/ui/Badge";
import { PressableScale } from "../../components/ui/PressableScale";
import { ink } from "../../theme/colors";
import { promos, getBrand } from "../../data/mock";
import { usePromoStore } from "../../store/promoStore";

export default function PromoScreen() {
  const isClaimed = usePromoStore((s) => s.isClaimed);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
        <AppText variant="h2">Promo</AppText>
        <AppText variant="caption" color={ink[500]}>
          Akses lebih dulu ke promo & giveaway eksklusif member
        </AppText>
      </View>

      <FlatList
        data={promos}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const b = getBrand(item.brandId);
          const claimed = isClaimed(item.id);
          return (
            <PressableScale onPress={() => router.push(`/promo/${item.id}`)}>
              <LinearGradient
                colors={b?.gradient ?? ["#0B2B73", "#123CA3"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 24, padding: 20, gap: 14, overflow: "hidden" }}
              >
                <View
                  style={{
                    position: "absolute",
                    right: -40,
                    bottom: -40,
                    width: 160,
                    height: 160,
                    borderRadius: 80,
                    backgroundColor: "rgba(255,255,255,0.08)",
                  }}
                />
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Badge label={item.discountLabel} tone="gold" icon={<AppIcon name="sparkles" size={12} color="#946A20" />} />
                  {claimed ? (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
                      <AppIcon name="check" size={12} color="#FFFFFF" />
                      <AppText variant="micro" color="#FFFFFF">Diklaim</AppText>
                    </View>
                  ) : null}
                </View>
                <View style={{ gap: 6 }}>
                  <AppText variant="h3" color="#FFFFFF">{item.title}</AppText>
                  <AppText variant="caption" color="rgba(255,255,255,0.8)">{item.tag}</AppText>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <AppText variant="caption" color="rgba(255,255,255,0.7)">
                    Berlaku s/d {item.expiresAt}
                  </AppText>
                  <View style={{ backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 }}>
                    <AppText variant="micro" color="#FFFFFF">{item.code}</AppText>
                  </View>
                </View>
              </LinearGradient>
            </PressableScale>
          );
        }}
      />
    </SafeAreaView>
  );
}
