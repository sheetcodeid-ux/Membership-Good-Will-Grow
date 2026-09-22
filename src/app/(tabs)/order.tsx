import React, { useMemo, useState } from "react";
import { Platform, ScrollView, TextInput, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Cake,
  ChevronDown,
  ChevronRight,
  Coffee,
  Cookie,
  CupSoda,
  Drumstick,
  Gift,
  Plus,
  Search,
  Ticket,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react-native";
import { AppText } from "../../components/ui/AppText";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";
import { PressableScale } from "../../components/ui/PressableScale";
import { BrandLogo } from "../../components/BrandLogo";
import { ServiceTypeRow } from "../../components/ServiceTypeRow";
import { brand, danger, ink, surface } from "../../theme/colors";
import { shadow } from "../../theme/shadows";
import { formatRupiah } from "../../utils/format";
import { categories, getOutlet, menuItems } from "../../data/mock";
import { MAX_ORDER_DISTANCE_KM, useOrderStore } from "../../store/orderStore";
import { useCartStore } from "../../store/cartStore";
import type { MenuCategory } from "../../data/types";

const categoryIcons: Record<MenuCategory["icon"], LucideIcon> = {
  coffee: Coffee,
  cup: CupSoda,
  drumstick: Drumstick,
  cake: Cake,
  soup: CupSoda,
  gift: Gift,
  ticket: Ticket,
  cookie: Cookie,
};

export default function OrderScreen() {
  const insets = useSafeAreaInsets();
  const outletId = useOrderStore((s) => s.outletId);
  const serviceType = useOrderStore((s) => s.serviceType);
  const setServiceType = useOrderStore((s) => s.setServiceType);
  const reopenOutletSheet = useOrderStore((s) => s.reopenOutletSheet);
  const addLine = useCartStore((s) => s.addLine);

  const [category, setCategory] = useState(categories[0].id);
  const [query, setQuery] = useState("");
  const [couponVisible, setCouponVisible] = useState(true);

  const outlet = getOutlet(outletId);

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menuItems.filter((m) => {
      if (q) return m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
      return m.categoryId === category;
    });
  }, [category, query]);

  const tooFar = (outlet?.distanceKm ?? 0) > MAX_ORDER_DISTANCE_KM;
  const activeCategory = categories.find((c) => c.id === category);

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderBottomLeftRadius: 22,
          borderBottomRightRadius: 22,
        }}
      >
        <SafeAreaView edges={["top"]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              height: 54,
            }}
          >
            <AppText variant="h2" color={brand[700]} style={{ flex: 1 }}>
              Daftar Menu
            </AppText>
            <PressableScale
              onPress={() => router.push("/order-history")}
              style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
              hitSlop={8}
            >
              <AppText variant="bodySemibold" color={brand[700]}>
                Riwayat Pesanan
              </AppText>
              <ChevronRight size={17} color={brand[700]} />
            </PressableScale>
          </View>

          <View style={{ paddingHorizontal: 16, paddingBottom: 14, gap: 12 }}>
            <PressableScale
              onPress={reopenOutletSheet}
              scaleTo={0.99}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: brand[50],
                borderRadius: 14,
                paddingVertical: 11,
                paddingHorizontal: 12,
              }}
            >
              <BrandLogo brandId={outlet?.brandId} size={32} />
              <View style={{ flex: 1 }}>
                <AppText variant="titleLg" numberOfLines={1}>
                  {outlet?.name ?? "Pilih outlet"}
                </AppText>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <AppText variant="caption" color={ink[500]}>
                    {outlet?.city} •
                  </AppText>
                  <AppText
                    variant="caption"
                    color={tooFar ? danger[500] : ink[500]}
                    style={{ fontFamily: "Urbanist_700Bold" }}
                  >
                    {outlet ? `${(outlet.distanceKm * 1000).toFixed(2)} m` : ""}
                  </AppText>
                  {tooFar ? <TriangleAlert size={13} color={danger[500]} /> : null}
                </View>
              </View>
              <ChevronDown size={22} color={brand[700]} />
            </PressableScale>

            <ServiceTypeRow
              value={serviceType}
              onChange={setServiceType}
              available={outlet?.services}
            />
          </View>
        </SafeAreaView>
      </View>

      <View style={{ flex: 1, flexDirection: "row" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 14,
            paddingLeft: 12,
            paddingRight: 10,
            gap: 10,
            paddingBottom: insets.bottom + 120,
          }}
          style={{ width: 95, flexGrow: 0, borderRightWidth: 1.5, borderRightColor: brand[100] }}
        >
          {categories.map((c) => {
            const Icon = categoryIcons[c.icon];
            const active = category === c.id && !query;
            return (
              <PressableScale
                key={c.id}
                onPress={() => {
                  setQuery("");
                  setCategory(c.id);
                }}
                scaleTo={0.97}
                style={{
                  height: 74,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  paddingHorizontal: 4,
                  backgroundColor: active ? brand[900] : "#FFFFFF",
                  ...(shadow.xs as object),
                }}
              >
                <Icon size={22} color={active ? "#FFFFFF" : brand[600]} strokeWidth={1.9} />
                <AppText
                  numberOfLines={1}
                  color={active ? "#FFFFFF" : ink[700]}
                  style={{ fontSize: 11, lineHeight: 14, fontFamily: "Urbanist_600SemiBold" }}
                >
                  {c.name}
                </AppText>
              </PressableScale>
            );
          })}
        </ScrollView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 14,
            paddingBottom: insets.bottom + 120,
            gap: 12,
          }}
          style={{ flex: 1 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: "#FFFFFF",
              borderRadius: 14,
              paddingHorizontal: 14,
              height: 44,
            }}
          >
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Ketik untuk mencari menu"
              placeholderTextColor={ink[300]}
              style={[
                {
                  flex: 1,
                  minWidth: 0,
                  padding: 0,
                  fontFamily: "Urbanist_400Regular",
                  fontSize: 14,
                  color: ink[900],
                },
                Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null,
              ]}
            />
            <Search size={19} color={brand[700]} />
          </View>

          <AppText variant="h3" color={ink[900]}>
            {query ? `Hasil "${query}"` : activeCategory?.name}
          </AppText>

          {visibleItems.length === 0 ? (
            <AppText variant="caption" color={ink[400]} style={{ paddingTop: 8 }}>
              Menu tidak ditemukan.
            </AppText>
          ) : null}

          {visibleItems.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                backgroundColor: "#FFFFFF",
                borderRadius: 14,
                overflow: "hidden",
                ...(shadow.xs as object),
              }}
            >
              <PressableScale onPress={() => router.push(`/product/${item.id}`)} scaleTo={0.99}>
                <ImagePlaceholder radius={0} iconSize={22} style={{ width: 76, height: 92 }} />
              </PressableScale>
              <View style={{ flex: 1, padding: 11, justifyContent: "space-between" }}>
                <View style={{ gap: 2 }}>
                  <AppText variant="titleLg" numberOfLines={2}>
                    {item.name}
                  </AppText>
                  <AppText variant="micro" color={ink[400]} numberOfLines={1}>
                    {item.description}
                  </AppText>
                </View>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <AppText variant="titleLg" style={{ flex: 1 }}>
                    {formatRupiah(item.price)}
                  </AppText>
                  <PressableScale
                    onPress={() => addLine(item, 1, [])}
                    style={{
                      width: 27,
                      height: 27,
                      borderRadius: 8,
                      backgroundColor: brand[900],
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Plus size={17} color="#FFFFFF" strokeWidth={2.6} />
                  </PressableScale>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {couponVisible ? (
        <View style={{ position: "absolute", right: 14, bottom: insets.bottom + 86 }}>
          <PressableScale onPress={() => router.push("/promo")} scaleTo={0.96}>
            <ImagePlaceholder
              label="Sticker Kupon"
              radius={14}
              iconSize={20}
              style={{ width: 104, height: 62 }}
            />
          </PressableScale>
          <PressableScale
            onPress={() => setCouponVisible(false)}
            hitSlop={10}
            style={{
              position: "absolute",
              top: -9,
              left: -9,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              ...(shadow.sm as object),
            }}
          >
            <X size={13} color={ink[500]} strokeWidth={2.4} />
          </PressableScale>
        </View>
      ) : null}
    </View>
  );
}
