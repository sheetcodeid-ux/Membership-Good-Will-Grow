import React, { useEffect } from "react";
import { AppIcon } from "../components/ui/AppIcon";
import { View } from "react-native";
import { router } from "expo-router";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { AppText, Button, Screen } from "../components/ui";
import { success, ink, brand } from "../theme/colors";
import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";
import { getOutlet, outletFullName } from "../data/mock";
import { formatRupiah } from "../utils/format";
import { useCheckout } from "../hooks/useCheckout";

export default function OrderSuccessScreen() {
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0);
  const cart = useCartStore();
  const outletId = useOrderStore((s) => s.outletId);
  const outlet = getOutlet(outletId);
  const { breakdown, coupon } = useCheckout({ paid: true });

  useEffect(() => {
    scale.value = withSpring(1, { damping: 9, stiffness: 140 });
    opacity.value = withTiming(1, { duration: 400 });
  }, [scale, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Screen>
      <View style={{ flex: 1, paddingHorizontal: 24, alignItems: "center", justifyContent: "center", gap: 20 }}>
        <Animated.View
          style={[
            {
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: success[50],
              alignItems: "center",
              justifyContent: "center",
            },
            animStyle,
          ]}
        >
          <View
            style={{
              width: 68,
              height: 68,
              borderRadius: 34,
              backgroundColor: success[500],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppIcon name="check" size={34} color="#FFFFFF" />
          </View>
        </Animated.View>

        <View style={{ gap: 8 }}>
          <AppText variant="h1" center>Pembayaran Berhasil</AppText>
          <AppText variant="body" color={ink[500]} center>
            Pesananmu di {outlet ? outletFullName(outlet) : "outlet"} sedang diproses. Kamu akan mendapat notifikasi saat
            pesanan siap.
          </AppText>
        </View>

        <View style={{ backgroundColor: ink[50], borderRadius: 18, padding: 18, width: "100%", gap: 10 }}>
          {breakdown.couponDiscount > 0 ? (
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
              <AppText variant="caption" color={ink[500]} numberOfLines={1} style={{ flexShrink: 1 }}>
                {coupon?.title ?? "Kupon"}
              </AppText>
              <AppText variant="bodySemibold" color={success[600]}>
                -{formatRupiah(breakdown.couponDiscount)}
              </AppText>
            </View>
          ) : null}
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <AppText variant="caption" color={ink[500]}>Total Pembayaran</AppText>
            <AppText variant="bodySemibold" color={brand[700]}>{formatRupiah(breakdown.finalTotal)}</AppText>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <AppText variant="caption" color={ink[500]}>Metode</AppText>
            <AppText variant="bodyMedium">QRIS</AppText>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 28, gap: 12 }}>
        <Button
          label="Lihat Riwayat Pesanan"
          size="lg"
          fullWidth
          onPress={() => {
            cart.clear();
            router.replace("/order-history");
          }}
        />
        <Button
          label="Kembali ke Beranda"
          variant="ghost"
          fullWidth
          onPress={() => {
            cart.clear();
            router.replace("/(tabs)");
          }}
        />
      </View>
    </Screen>
  );
}
