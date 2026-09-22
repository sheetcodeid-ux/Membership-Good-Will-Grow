import React from "react";
import { View, FlatList } from "react-native";
import { Screen, ScreenHeader, AppText, Card, Badge } from "../components/ui";
import { MediaTile } from "../components/ui/MediaTile";
import { ink, brand } from "../theme/colors";
import { orderHistory, getBrand } from "../data/mock";
import { formatRupiah } from "../utils/format";

const statusTone = {
  completed: "success",
  processing: "warning",
  cancelled: "danger",
} as const;

const statusLabel = {
  completed: "Selesai",
  processing: "Diproses",
  cancelled: "Dibatalkan",
} as const;

export default function OrderHistoryScreen() {
  return (
    <Screen>
      <ScreenHeader title="Riwayat Pesanan" />
      <FlatList
        data={orderHistory}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const b = getBrand(item.brandId);
          return (
            <Card style={{ flexDirection: "row", gap: 12 }}>
              <MediaTile colors={b?.gradient ?? [brand[600], brand[400]]} icon="coffee" size={48} radius={14} iconSize={20} />
              <View style={{ flex: 1, gap: 3 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <AppText variant="titleLg" numberOfLines={1} style={{ flex: 1 }}>
                    {item.outletName}
                  </AppText>
                  <Badge label={statusLabel[item.status]} tone={statusTone[item.status]} />
                </View>
                <AppText variant="caption" color={ink[500]}>{item.date}</AppText>
                <AppText variant="caption" color={ink[500]} numberOfLines={1}>{item.items}</AppText>
                <AppText variant="bodySemibold" color={brand[700]}>{formatRupiah(item.total)}</AppText>
              </View>
            </Card>
          );
        }}
      />
    </Screen>
  );
}
