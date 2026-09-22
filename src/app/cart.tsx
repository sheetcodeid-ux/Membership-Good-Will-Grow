import React from "react";
import { View, ScrollView } from "react-native";
import { router } from "expo-router";
import { X, Trash2 } from "lucide-react-native";
import { AppText, Button, Divider, QuantityStepper } from "../components/ui";
import { PressableScale } from "../components/ui/PressableScale";
import { MediaTile } from "../components/ui/MediaTile";
import { brand, ink } from "../theme/colors";
import { formatRupiah } from "../utils/format";
import { useCartStore } from "../store/cartStore";
import { getOutlet, getBrand, toppingPool, outletFullName } from "../data/mock";

export default function CartScreen() {
  const cart = useCartStore();
  const outlet = cart.outletId ? getOutlet(cart.outletId) : undefined;
  const brandInfo = getBrand(outlet?.brandId);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: "hidden" }}>
      <View style={{ alignItems: "center", paddingTop: 10 }}>
        <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: ink[200] }} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 10 }}>
        <AppText variant="h3" style={{ flex: 1 }}>Keranjang</AppText>
        <PressableScale
          onPress={() => router.back()}
          style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: ink[50], alignItems: "center", justifyContent: "center" }}
        >
          <X size={18} color={ink[700]} />
        </PressableScale>
      </View>

      {cart.lines.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 8, padding: 20 }}>
          <AppText variant="body" color={ink[500]} center>
            Keranjang kamu masih kosong. Yuk pilih menu favoritmu.
          </AppText>
          <Button label="Cari Menu" variant="secondary" onPress={() => router.replace("/order")} />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} showsVerticalScrollIndicator={false}>
            {outlet ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <MediaTile colors={brandInfo?.gradient ?? [brand[600], brand[400]]} icon="coffee" size={36} radius={11} iconSize={16} />
                <AppText variant="titleLg">{outletFullName(outlet)}</AppText>
              </View>
            ) : null}
            <Divider />
            {cart.lines.map((line) => {
              const toppingNames = line.toppingIds
                .reduce<string[]>((acc, id) => {
                  const t = toppingPool.find((tp) => tp.id === id);
                  if (t) acc.push(t.name);
                  return acc;
                }, [])
                .join(", ");
              return (
                <View key={line.lineId} style={{ gap: 8 }}>
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <AppText variant="titleLg">{line.menuItem.name}</AppText>
                      {toppingNames ? (
                        <AppText variant="caption" color={ink[500]} numberOfLines={2}>
                          + {toppingNames}
                        </AppText>
                      ) : null}
                      {line.notes ? (
                        <AppText variant="caption" color={ink[400]}>
                          Catatan: {line.notes}
                        </AppText>
                      ) : null}
                    </View>
                    <PressableScale onPress={() => cart.removeLine(line.lineId)}>
                      <Trash2 size={17} color={ink[400]} />
                    </PressableScale>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <QuantityStepper
                      value={line.qty}
                      onChange={(v) => cart.updateLineQty(line.lineId, v)}
                    />
                    <AppText variant="bodySemibold" color={brand[700]}>
                      {formatRupiah(cart.lineTotal(line))}
                    </AppText>
                  </View>
                  <Divider />
                </View>
              );
            })}
          </ScrollView>

          <View style={{ padding: 20, paddingBottom: 28, gap: 14, borderTopWidth: 1, borderTopColor: ink[100] }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <AppText variant="body" color={ink[500]}>Subtotal</AppText>
              <AppText variant="h3">{formatRupiah(cart.subtotal())}</AppText>
            </View>
            <Button label="Lanjutkan ke Checkout" size="lg" fullWidth onPress={() => router.push("/checkout")} />
          </View>
        </>
      )}
    </View>
  );
}
