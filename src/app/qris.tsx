import React, { useEffect, useState } from "react";
import { AppIcon } from "../components/ui/AppIcon";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, danger, ink, surface } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { formatRupiah } from "../utils/format";
import { computeBreakdown } from "../utils/pricing";
import { useCartStore } from "../store/cartStore";
import { useMemberStore } from "../store/memberStore";
import { useOrderStore } from "../store/orderStore";

const PAY_WINDOW_SECONDS = 10 * 60;

const steps = [
  "Buka aplikasi mobile banking atau e-wallet",
  "Pilih menu scan QR atau bayar dengan QRIS",
  "Scan QR Code di atas",
  "Konfirmasi pembayaran",
  "Pembayaran akan diverifikasi otomatis",
];

export default function QrisScreen() {
  const subtotal = useCartStore((s) => s.subtotal());
  const usePoints = useCartStore((s) => s.usePoints);
  const points = useMemberStore((s) => s.points);
  const breakdown = computeBreakdown(subtotal, usePoints, points);

  const [remaining, setRemaining] = useState(PAY_WINDOW_SECONDS);

  useEffect(() => {
    const id = setInterval(() => setRemaining((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  // Minted when the order was confirmed, so it stays put while the clock ticks.
  const receipt = useOrderStore((s) => s.receipt);

  const mmss = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(
    remaining % 60
  ).padStart(2, "0")}`;

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Pembayaran" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 14 }}
      >
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 6 }}>
          <AppText variant="bodySemibold" color={ink[800]}>
            Waktu tersisa:
          </AppText>
          <AppText variant="bodySemibold" color={danger[500]}>
            {mmss}
          </AppText>
        </View>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 15,
            padding: 16,
            alignItems: "center",
            gap: 14,
            ...(shadow.xs as object),
          }}
        >
          <AppText variant="h3">Scan QR Code untuk Bayar</AppText>

          <View
            style={{
              alignSelf: "stretch",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              backgroundColor: brand[50],
              borderRadius: 10,
              paddingVertical: 12,
            }}
          >
            <AppText variant="body" color={ink[500]}>
              Total Pembayaran:
            </AppText>
            <AppText variant="h3" color={brand[800]}>
              {formatRupiah(breakdown.finalTotal)}
            </AppText>
          </View>

          <ImagePlaceholder
            label="QR Code"
            radius={8}
            iconSize={32}
            style={{ width: "88%", aspectRatio: 1 }}
          />

          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ImagePlaceholder radius={4} iconSize={12} style={{ width: 92, height: 24 }} />
            <ImagePlaceholder radius={4} iconSize={12} style={{ width: 34, height: 24 }} />
          </View>
        </View>

        <View style={{ alignItems: "center", gap: 10 }}>
          <PressableScale
            onPress={() => {}}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 9,
              height: 42,
              paddingHorizontal: 24,
              borderRadius: 21,
              backgroundColor: brand[900],
            }}
          >
            <AppIcon name="download" size={16} color="#FFFFFF" />
            <AppText variant="titleLg" color="#FFFFFF">
              Download QR Code
            </AppText>
          </PressableScale>

          <PressableScale
            onPress={() => router.replace("/order-success")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 9,
              height: 40,
              paddingHorizontal: 22,
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: brand[700],
            }}
          >
            <AppIcon name="refresh" size={15} color={brand[700]} />
            <AppText variant="titleLg" color={brand[700]}>
              Check Status
            </AppText>
          </PressableScale>
        </View>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 15,
            padding: 14,
            gap: 12,
            ...(shadow.xs as object),
          }}
        >
          <AppText variant="h3">Detail Pembayaran</AppText>
          <Field label="Total Pembayaran">
            <AppText variant="h3" color={brand[800]}>
              {formatRupiah(breakdown.finalTotal)}
            </AppText>
          </Field>
          <Field label="Order Number">
            <AppText variant="body" color={ink[800]}>
              {receipt?.orderNumber ?? "-"}
            </AppText>
          </Field>
          <Field label="Nomor Nota">
            <AppText variant="body" color={ink[800]}>
              {receipt?.nota ?? "-"}
            </AppText>
          </Field>
        </View>

        <View
          style={{
            backgroundColor: "#EAF3FC",
            borderWidth: 1.2,
            borderColor: "#BBD8F2",
            borderRadius: 15,
            padding: 14,
            gap: 8,
          }}
        >
          <AppText variant="h3" color="#1F6FB2">
            Cara Pembayaran
          </AppText>
          {steps.map((step, index) => (
            <AppText key={step} variant="body" color="#2A7BC0">
              {index + 1}. {step}
            </AppText>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 3 }}>
      <AppText variant="caption" color={ink[400]}>
        {label}
      </AppText>
      {children}
    </View>
  );
}
