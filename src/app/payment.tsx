import React from "react";
import { AppIcon } from "../components/ui/AppIcon";
import { View } from "react-native";
import { router } from "expo-router";
import { Screen, ScreenHeader, AppText, Card, Button, Divider } from "../components/ui";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, ink, gold } from "../theme/colors";
import { useCartStore } from "../store/cartStore";
import { useMemberStore } from "../store/memberStore";
import { computeBreakdown } from "../utils/pricing";
import { formatRupiah } from "../utils/format";

export default function PaymentScreen() {
  const cart = useCartStore();
  const points = useMemberStore((s) => s.points);
  const breakdown = computeBreakdown(cart.subtotal(), cart.usePoints, points);

  return (
    <Screen scroll>
      <ScreenHeader title="Pembayaran" />

      <View style={{ paddingHorizontal: 20, gap: 20 }}>
        <Card style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: ink[50],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppIcon name="qr" size={22} color={ink[700]} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="bodySemibold">QRIS</AppText>
            <AppText variant="caption" color={ink[500]}>
              Kode QRIS akan ditampilkan saat checkout. Scan dengan bank atau dompet digital kamu.
            </AppText>
          </View>
          <RadioDot active />
        </Card>

        <View style={{ gap: 12 }}>
          <AppText variant="h3">Potongan Biaya Produk</AppText>
          <Card style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <AppIcon name="ticket" size={18} color={ink[500]} />
            <AppText variant="bodyMedium" style={{ flex: 1 }}>
              Kupon
            </AppText>
            <PressableScale
              onPress={() => router.push("/promo")}
              style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: brand[50], borderRadius: 10 }}
            >
              <AppText variant="captionMedium" color={brand[700]}>Pilih</AppText>
            </PressableScale>
          </Card>
        </View>

        <Card style={{ gap: 12 }}>
          <AppText variant="titleLg">Detail Pembayaran</AppText>
          <Row label="Nominal Belanja" value={formatRupiah(breakdown.subtotal)} />
          <Divider />
          <Row label="Sub Total" value={formatRupiah(breakdown.subtotal)} bold />
          <Row label="Pajak (PB1 10%)" value={formatRupiah(breakdown.tax)} />
          <Row label="Pembulatan" value={formatRupiah(breakdown.rounding)} />
          {cart.usePoints ? <Row label="Potongan Poin" value={`- ${formatRupiah(breakdown.pointsDiscount)}`} /> : null}
          <Divider />
          <Row label="Total Bayar" value={formatRupiah(breakdown.finalTotal)} bold large />
        </Card>

        <PressableScale
          onPress={cart.toggleUsePoints}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            backgroundColor: gold[50],
            borderRadius: 16,
            padding: 14,
          }}
        >
          <AppIcon name="coins" size={18} color={gold[600]} />
          <AppText variant="bodyMedium" style={{ flex: 1 }} color={gold[700]}>
            {points.toLocaleString("id-ID")} Poin · Gunakan Poin
          </AppText>
          <View
            style={{
              width: 44,
              height: 26,
              borderRadius: 13,
              backgroundColor: cart.usePoints ? brand[600] : ink[200],
              padding: 3,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: "#FFFFFF",
                alignSelf: cart.usePoints ? "flex-end" : "flex-start",
              }}
            />
          </View>
        </PressableScale>

        <Button
          label={`Bayar · ${formatRupiah(breakdown.finalTotal)}`}
          size="lg"
          fullWidth
          onPress={() => router.push("/qris")}
          style={{ marginBottom: 32 }}
        />
      </View>
    </Screen>
  );
}

function Row({ label, value, bold, large }: { label: string; value: string; bold?: boolean; large?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <AppText variant={bold ? "bodySemibold" : "body"} color={ink[600]}>
        {label}
      </AppText>
      <AppText variant={large ? "h3" : bold ? "bodySemibold" : "body"} color={large ? brand[700] : ink[900]}>
        {value}
      </AppText>
    </View>
  );
}

function RadioDot({ active }: { active: boolean }) {
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: active ? brand[600] : ink[300],
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {active ? <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: brand[600] }} /> : null}
    </View>
  );
}
