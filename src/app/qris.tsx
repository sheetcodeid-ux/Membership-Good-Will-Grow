import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Download, RefreshCw } from "lucide-react-native";
import { Screen, ScreenHeader, AppText, Button, Card } from "../components/ui";
import { brand, danger, ink } from "../theme/colors";
import { useCartStore } from "../store/cartStore";
import { useMemberStore } from "../store/memberStore";
import { computeBreakdown } from "../utils/pricing";
import { formatRupiah } from "../utils/format";

function QrPlaceholder() {
  const cells = 9;
  const seed = 13;
  return (
    <View
      style={{
        width: 220,
        height: 220,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 12,
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {Array.from({ length: cells * cells }).map((_, i) => {
        const on = (i * seed + Math.floor(i / cells) * 7) % 5 < 2;
        const isCorner =
          (i < cells * 3 && i % cells < 3) ||
          (i < cells * 3 && i % cells >= cells - 3) ||
          (i >= cells * (cells - 3) && i % cells < 3);
        return (
          <View
            key={i}
            style={{
              width: `${100 / cells}%`,
              height: `${100 / cells}%`,
              padding: 1,
            }}
          >
            <View
              style={{
                flex: 1,
                borderRadius: 1,
                backgroundColor: isCorner || on ? ink[900] : "transparent",
              }}
            />
          </View>
        );
      })}
    </View>
  );
}

export default function QrisScreen() {
  const [seconds, setSeconds] = useState(600);
  const cart = useCartStore();
  const points = useMemberStore((s) => s.points);
  const breakdown = computeBreakdown(cart.subtotal(), cart.usePoints, points);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <Screen scroll>
      <ScreenHeader title="Pembayaran" />
      <View style={{ paddingHorizontal: 20, gap: 20, alignItems: "center" }}>
        <AppText variant="bodyMedium">
          Waktu tersisa: <AppText variant="bodySemibold" color={danger[500]}>{mm}:{ss}</AppText>
        </AppText>

        <Card style={{ alignItems: "center", gap: 16, width: "100%" }}>
          <AppText variant="titleLg">Scan QR Code untuk Bayar</AppText>
          <View style={{ backgroundColor: ink[50], borderRadius: 16, padding: 16, width: "100%", alignItems: "center" }}>
            <AppText variant="caption" color={ink[500]}>Total Pembayaran</AppText>
            <AppText variant="h2" color={brand[700]}>{formatRupiah(breakdown.finalTotal)}</AppText>
          </View>
          <QrPlaceholder />
          <AppText variant="caption" color={ink[400]}>QRIS · Standar Pembayaran Nasional</AppText>
        </Card>

        <Button label="Download QR Code" variant="secondary" fullWidth icon={<Download size={16} color={brand[700]} />} />
        <Button
          label="Cek Status"
          variant="outline"
          fullWidth
          icon={<RefreshCw size={16} color={brand[700]} />}
          onPress={() => router.replace("/order-success")}
        />
      </View>
    </Screen>
  );
}
