import React from "react";
import { View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles, Check, Copy, ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText, Button, Screen, Divider, ScreenHeader } from "../../components/ui";
import { PressableScale } from "../../components/ui/PressableScale";
import { Badge } from "../../components/ui/Badge";
import { ink } from "../../theme/colors";
import { getPromo, getBrand } from "../../data/mock";
import { usePromoStore } from "../../store/promoStore";

export default function PromoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const promo = getPromo(id);
  const brandInfo = getBrand(promo?.brandId);
  const claim = usePromoStore((s) => s.claim);
  const claimed = usePromoStore((s) => (promo ? s.isClaimed(promo.id) : false));

  if (!promo) {
    return (
      <Screen>
        <ScreenHeader title="Promo" />
        <AppText style={{ padding: 20 }}>Promo tidak ditemukan.</AppText>
      </Screen>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <LinearGradient colors={brandInfo?.gradient ?? ["#0B2B73", "#123CA3"]} style={{ paddingBottom: 28 }}>
        <SafeAreaView edges={["top"]}>
          <View style={{ paddingHorizontal: 20, paddingTop: 14 }}>
            <PressableScale
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                backgroundColor: "rgba(255,255,255,0.16)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronLeft size={22} color="#FFFFFF" />
            </PressableScale>
          </View>
        </SafeAreaView>
        <View style={{ paddingHorizontal: 24, paddingTop: 16, gap: 12 }}>
          <Badge label={promo.discountLabel} tone="gold" icon={<Sparkles size={12} color="#946A20" />} />
          <AppText variant="h1" color="#FFFFFF">{promo.title}</AppText>
          <AppText variant="body" color="rgba(255,255,255,0.8)">{promo.tag}</AppText>
        </View>
      </LinearGradient>

      <View style={{ flex: 1, padding: 20, gap: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: ink[50], borderRadius: 16, padding: 16 }}>
          <View>
            <AppText variant="caption" color={ink[500]}>Kode Promo</AppText>
            <AppText variant="h3">{promo.code}</AppText>
          </View>
          <PressableScale style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#FFFFFF", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}>
            <Copy size={14} color={ink[700]} />
            <AppText variant="captionMedium">Salin</AppText>
          </PressableScale>
        </View>

        <View style={{ gap: 8 }}>
          <AppText variant="titleLg">Deskripsi</AppText>
          <AppText variant="body" color={ink[600]}>{promo.description}</AppText>
        </View>

        <Divider />

        <View style={{ gap: 10 }}>
          <AppText variant="titleLg">Syarat & Ketentuan</AppText>
          {promo.terms.map((t, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 8 }}>
              <AppText variant="body" color={ink[500]}>•</AppText>
              <AppText variant="body" color={ink[600]} style={{ flex: 1 }}>{t}</AppText>
            </View>
          ))}
        </View>

        <View style={{ flex: 1 }} />

        <Button
          label={claimed ? "Sudah Diklaim" : "Klaim Promo"}
          size="lg"
          fullWidth
          disabled={claimed}
          icon={claimed ? <Check size={18} color={ink[400]} /> : undefined}
          onPress={() => claim(promo.id)}
          style={{ marginBottom: 8 }}
        />
      </View>
    </View>
  );
}
