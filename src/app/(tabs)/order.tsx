import React from "react";
import { View, FlatList } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { History, MapPin, Clock } from "lucide-react-native";
import { AppText } from "../../components/ui/AppText";
import { Card } from "../../components/ui/Card";
import { PressableScale } from "../../components/ui/PressableScale";
import { Badge } from "../../components/ui/Badge";
import { MediaTile } from "../../components/ui/MediaTile";
import { SectionHeader } from "../../components/SectionHeader";
import { ink } from "../../theme/colors";
import { brands, outlets } from "../../data/mock";

export default function OrderLandingScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16, flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <AppText variant="h2">Self Order</AppText>
          <AppText variant="caption" color={ink[500]}>
            Pilih brand, order langsung tanpa antre
          </AppText>
        </View>
        <PressableScale
          onPress={() => router.push("/order-history")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: ink[50],
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 14,
          }}
        >
          <History size={16} color={ink[700]} />
          <AppText variant="captionMedium" color={ink[700]}>
            Riwayat
          </AppText>
        </PressableScale>
      </View>

      <FlatList
        data={outlets.filter((o) => o.isOpen).slice(0, 3)}
        keyExtractor={(o) => o.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
        ListHeaderComponent={
          <View style={{ gap: 20, marginBottom: 20 }}>
            <View style={{ paddingHorizontal: 20, flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
              {brands.map((b) => (
                <PressableScale
                  key={b.id}
                  onPress={() => router.push(`/outlet-picker?brandId=${b.id}`)}
                  style={{
                    width: "47%",
                    backgroundColor: ink[50],
                    borderRadius: 20,
                    padding: 16,
                    gap: 12,
                  }}
                >
                  <MediaTile
                    colors={b.gradient}
                    icon={b.category === "coffee" ? "coffee" : "drumstick"}
                    size={48}
                    radius={14}
                    iconSize={22}
                  />
                  <View>
                    <AppText variant="title" numberOfLines={1}>
                      {b.name}
                    </AppText>
                    <AppText variant="caption" color={ink[500]} numberOfLines={1}>
                      {b.tagline}
                    </AppText>
                  </View>
                </PressableScale>
              ))}
            </View>
            <SectionHeader title="Outlet Terdekat" />
          </View>
        }
        renderItem={({ item }) => {
          const b = brands.find((x) => x.id === item.brandId)!;
          return (
            <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
              <Card onPress={() => router.push(`/menu/${item.id}`)} style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
                <MediaTile colors={b.gradient} icon={b.category === "coffee" ? "coffee" : "drumstick"} size={52} radius={16} iconSize={24} />
                <View style={{ flex: 1, gap: 4 }}>
                  <AppText variant="titleLg" numberOfLines={1}>
                    {item.name}
                  </AppText>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <MapPin size={12} color={ink[400]} />
                    <AppText variant="caption" color={ink[500]} numberOfLines={1} style={{ flex: 1 }}>
                      {item.address} · {item.distanceKm} km
                    </AppText>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Clock size={12} color={ink[400]} />
                    <AppText variant="caption" color={ink[500]}>
                      {item.hours}
                    </AppText>
                  </View>
                </View>
                <Badge label="Buka" tone="success" />
              </Card>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
