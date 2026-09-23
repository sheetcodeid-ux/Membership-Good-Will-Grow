import React from "react";
import { AppIcon } from "./ui/AppIcon";
import { View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { PressableScale } from "./ui/PressableScale";
import { AppText } from "./ui/AppText";
import { Badge } from "./ui/Badge";
import type { Promo } from "../data/types";

export function PromoBannerCard({ promo }: { promo: Promo }) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 72, 340);

  return (
    <PressableScale onPress={() => router.push(`/promo/${promo.id}`)} style={{ width: cardWidth }}>
      <LinearGradient
        colors={["#0B2B73", "#123CA3", "#4066C2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          padding: 20,
          height: 148,
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            right: -30,
            top: -30,
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Badge label={promo.discountLabel} tone="gold" icon={<AppIcon name="sparkles" size={12} color="#946A20" />} />
        </View>
        <View style={{ gap: 4 }}>
          <AppText variant="titleLg" color="#FFFFFF" numberOfLines={2}>
            {promo.title}
          </AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.75)">
            Berlaku s/d {promo.expiresAt}
          </AppText>
        </View>
      </LinearGradient>
    </PressableScale>
  );
}
