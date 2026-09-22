import React, { useMemo, useState } from "react";
import { View, FlatList } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Search, MapPin, Clock, Info } from "lucide-react-native";
import { Screen, ScreenHeader, AppText, Card, Input, Badge } from "../components/ui";
import { MediaTile } from "../components/ui/MediaTile";
import { ink } from "../theme/colors";
import { brands, outlets, getBrand } from "../data/mock";

export default function OutletPickerScreen() {
  const { brandId } = useLocalSearchParams<{ brandId?: string }>();
  const [query, setQuery] = useState("");
  const brand = getBrand(brandId);

  const list = useMemo(() => {
    return outlets
      .filter((o) => (brandId ? o.brandId === brandId : true))
      .filter((o) => o.name.toLowerCase().includes(query.toLowerCase()));
  }, [brandId, query]);

  return (
    <Screen>
      <ScreenHeader title="Pilih Outlet" subtitle={brand?.name} />
      <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
        <Input
          placeholder="Ketik untuk mencari outlet"
          value={query}
          onChangeText={setQuery}
          left={<Search size={18} color={ink[400]} />}
        />
      </View>

      <FlatList
        data={list}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const b = brands.find((x) => x.id === item.brandId)!;
          return (
            <Card onPress={() => router.push(`/menu/${item.id}`)} style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                <MediaTile colors={b.gradient} icon={b.category === "coffee" ? "coffee" : "drumstick"} size={48} radius={14} iconSize={22} />
                <View style={{ flex: 1 }}>
                  <AppText variant="titleLg" numberOfLines={1}>
                    {item.name}
                  </AppText>
                  <AppText variant="caption" color={ink[500]}>
                    {item.city}
                  </AppText>
                </View>
                <Badge label={item.isOpen ? "Available" : "Tutup"} tone={item.isOpen ? "success" : "neutral"} />
              </View>
              <View style={{ gap: 6 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <MapPin size={13} color={ink[400]} />
                  <AppText variant="caption" color={ink[500]} style={{ flex: 1 }} numberOfLines={1}>
                    {item.address} · ~{item.distanceKm} km
                  </AppText>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Clock size={13} color={ink[400]} />
                  <AppText variant="caption" color={ink[500]}>
                    {item.hours}
                  </AppText>
                </View>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {item.services.map((s) => (
                  <Badge
                    key={s}
                    tone="brand"
                    label={s === "dine_in" ? "Dine In" : s === "takeaway" ? "Take Away" : "Delivery"}
                  />
                ))}
              </View>
            </Card>
          );
        }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingTop: 60, gap: 8 }}>
            <Info size={28} color={ink[300]} />
            <AppText variant="body" color={ink[400]}>
              Outlet tidak ditemukan
            </AppText>
          </View>
        }
      />
    </Screen>
  );
}
