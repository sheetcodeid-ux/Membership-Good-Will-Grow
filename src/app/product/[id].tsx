import React, { useMemo, useState } from "react";
import { View, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { X } from "lucide-react-native";
import { AppText, Button, Divider, QuantityStepper, Input } from "../../components/ui";
import { PressableScale } from "../../components/ui/PressableScale";
import { MediaTile } from "../../components/ui/MediaTile";
import { brand, ink } from "../../theme/colors";
import { getMenuItem, getBrand } from "../../data/mock";
import { formatRupiah } from "../../utils/format";
import { useCartStore } from "../../store/cartStore";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getMenuItem(id);
  const brandInfo = getBrand(item?.brandId);
  const [qty, setQty] = useState(1);
  const [toppingQty, setToppingQty] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const addLine = useCartStore((s) => s.addLine);

  const toppingsTotal = useMemo(() => {
    if (!item?.toppings) return 0;
    return item.toppings.reduce((sum, t) => sum + t.price * (toppingQty[t.id] ?? 0), 0);
  }, [toppingQty, item]);

  const total = item ? (item.price + toppingsTotal) * qty : 0;

  if (!item) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <AppText>Menu tidak ditemukan.</AppText>
      </View>
    );
  }

  const submit = () => {
    const toppingIds: string[] = [];
    Object.entries(toppingQty).forEach(([tid, q]) => {
      for (let i = 0; i < q; i++) toppingIds.push(tid);
    });
    addLine(item, qty, toppingIds, notes || undefined);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: "hidden" }}>
      <View style={{ alignItems: "center", paddingTop: 10 }}>
        <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: ink[200] }} />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 20, paddingTop: 6 }}>
        <PressableScale
          onPress={() => router.back()}
          style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: ink[50], alignItems: "center", justifyContent: "center" }}
        >
          <X size={18} color={ink[700]} />
        </PressableScale>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, gap: 20, paddingBottom: 40 }}>
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <MediaTile
            colors={brandInfo?.gradient ?? [brand[600], brand[400]]}
            icon={item.categoryId === "food" ? "drumstick" : item.categoryId === "pastry" ? "cake" : "coffee"}
            size={80}
            radius={20}
            iconSize={34}
          />
          <View style={{ flex: 1, gap: 4 }}>
            <AppText variant="h3">{item.name}</AppText>
            <AppText variant="caption" color={ink[500]}>{item.description}</AppText>
            <AppText variant="titleLg" color={brand[700]}>{formatRupiah(item.price)}</AppText>
          </View>
        </View>

        <Divider />

        {item.toppings && item.toppings.length > 0 ? (
          <View style={{ gap: 14 }}>
            <View style={{ gap: 4 }}>
              <AppText variant="titleLg">Topping CW</AppText>
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#FFF4E0",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                }}
              >
                <AppText variant="caption" color="#D6860A">
                  Bisa pilih lebih dari 1 item
                </AppText>
              </View>
            </View>

            {item.toppings.map((t) => (
              <View key={t.id} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyMedium">{t.name}</AppText>
                  <AppText variant="caption" color={ink[500]}>{formatRupiah(t.price)}</AppText>
                </View>
                <QuantityStepper
                  value={toppingQty[t.id] ?? 0}
                  onChange={(v) => setToppingQty((prev) => ({ ...prev, [t.id]: v }))}
                />
              </View>
            ))}
          </View>
        ) : null}

        <Divider />

        <Input
          label="Catatan (opsional)"
          placeholder="Contoh: less sugar, extra ice"
          value={notes}
          onChangeText={setNotes}
        />
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          padding: 20,
          paddingBottom: 28,
          borderTopWidth: 1,
          borderTopColor: ink[100],
        }}
      >
        <View>
          <AppText variant="caption" color={ink[500]}>Total</AppText>
          <AppText variant="h3" color={brand[700]}>{formatRupiah(total)}</AppText>
        </View>
        <QuantityStepper value={qty} onChange={setQty} min={1} />
        <View style={{ flex: 1 }}>
          <Button label="Tambah ke Keranjang" fullWidth onPress={submit} />
        </View>
      </View>
    </View>
  );
}
