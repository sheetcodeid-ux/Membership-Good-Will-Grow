import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { PersonStanding, Armchair, AlertTriangle } from "lucide-react-native";
import { Screen, ScreenHeader, AppText, Card, Button, Input, Divider } from "../components/ui";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, ink, warning } from "../theme/colors";
import { useCartStore } from "../store/cartStore";
import { getOutlet, outletFullName } from "../data/mock";
import { formatRupiah } from "../utils/format";

export default function CheckoutScreen() {
  const cart = useCartStore();
  const outlet = cart.outletId ? getOutlet(cart.outletId) : undefined;
  const isDineIn = cart.fulfillment === "dine_in";

  return (
    <Screen scroll>
      <ScreenHeader title="Selesaikan Pesanan" />

      <View style={{ paddingHorizontal: 20, gap: 20 }}>
        <Card style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <AppText variant="titleLg">{outlet ? outletFullName(outlet) : "-"}</AppText>
            <AppText variant="caption" color={ink[500]}>{outlet?.city}</AppText>
          </View>
          <View style={{ backgroundColor: brand[600], paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
            <AppText variant="captionMedium" color="#FFFFFF">
              {cart.fulfillment === "dine_in" ? "Dine In" : cart.fulfillment === "takeaway" ? "Take Away" : "Delivery"}
            </AppText>
          </View>
        </Card>

        {isDineIn ? (
          <View style={{ gap: 12 }}>
            <AppText variant="h3">Opsi Pengambilan</AppText>
            <PressableScale
              onPress={() => cart.setPickupMethod("self")}
              style={{
                flexDirection: "row",
                gap: 12,
                alignItems: "center",
                backgroundColor: ink[50],
                borderRadius: 16,
                padding: 14,
                borderWidth: 1.5,
                borderColor: cart.pickupMethod === "self" ? brand[500] : "transparent",
              }}
            >
              <PersonStanding size={20} color={ink[700]} />
              <View style={{ flex: 1 }}>
                <AppText variant="bodySemibold">Ambil Sendiri</AppText>
                <AppText variant="caption" color={ink[500]}>Ambil pesanan di kasir</AppText>
              </View>
              <RadioDot active={cart.pickupMethod === "self"} />
            </PressableScale>

            <PressableScale
              onPress={() => cart.setPickupMethod("table")}
              style={{
                gap: 12,
                backgroundColor: ink[50],
                borderRadius: 16,
                padding: 14,
                borderWidth: 1.5,
                borderColor: cart.pickupMethod === "table" ? brand[500] : "transparent",
              }}
            >
              <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                <Armchair size={20} color={ink[700]} />
                <View style={{ flex: 1 }}>
                  <AppText variant="bodySemibold">Antar ke Meja</AppText>
                  <AppText variant="caption" color={ink[500]}>Antar ke mejamu</AppText>
                </View>
                <RadioDot active={cart.pickupMethod === "table"} />
              </View>
              {cart.pickupMethod === "table" ? (
                <Input
                  placeholder="Contoh: Nomor 23 Pojok Outdoor"
                  value={cart.tableNote}
                  onChangeText={cart.setTableNote}
                />
              ) : null}
            </PressableScale>
          </View>
        ) : null}

        <View style={{ gap: 12 }}>
          <AppText variant="h3">Ringkasan Pesanan</AppText>
          <Card style={{ gap: 12 }}>
            {cart.lines.map((line) => (
              <View key={line.lineId} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <AppText variant="body" style={{ flex: 1 }} numberOfLines={1}>
                  {line.qty}x {line.menuItem.name}
                </AppText>
                <AppText variant="bodyMedium">{formatRupiah(cart.lineTotal(line))}</AppText>
              </View>
            ))}
            <Divider />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <AppText variant="bodySemibold">Subtotal</AppText>
              <AppText variant="bodySemibold">{formatRupiah(cart.subtotal())}</AppText>
            </View>
          </Card>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            backgroundColor: warning[50],
            padding: 14,
            borderRadius: 16,
            alignItems: "flex-start",
          }}
        >
          <AlertTriangle size={16} color="#D6860A" />
          <AppText variant="caption" color="#946A20" style={{ flex: 1 }}>
            Pastikan outlet dan pesananmu sudah sesuai ya! Pesanan yang sudah dikonfirmasi tidak dapat
            dibatalkan.
          </AppText>
        </View>

        <Button
          label="Lanjutkan ke Pembayaran"
          size="lg"
          fullWidth
          onPress={() => router.push("/payment")}
          style={{ marginBottom: 32 }}
        />
      </View>
    </Screen>
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
