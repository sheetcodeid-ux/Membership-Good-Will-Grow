import React, { useMemo, useState } from "react";
import { Platform, ScrollView, TextInput, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronDown, ChevronRight, Plus, Search, TriangleAlert, X } from "lucide-react-native";
import { AppText } from "../../components/ui/AppText";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";
import { PressableScale } from "../../components/ui/PressableScale";
import { BrandLogo } from "../../components/BrandLogo";
import { CategoryIcon } from "../../components/CategoryIcons";
import { ServiceTypeRow } from "../../components/ServiceTypeRow";
import { brand, danger, ink, surface } from "../../theme/colors";
import { shadow } from "../../theme/shadows";
import { formatRupiah } from "../../utils/format";
import { categories, getOutlet, menuItems } from "../../data/mock";
import { MAX_ORDER_DISTANCE_KM, useOrderStore } from "../../store/orderStore";
import { useCartStore } from "../../store/cartStore";

/* Metrics measured off the reference screenshot at 360pt width. */
const GUTTER = 14;
const SIDE_CARD_W = 67;
const SIDE_CARD_H = 53;
const SIDE_GAP = 10;
const SIDE_PAD_TOP = 14;
/** Left edge of the product column; the indicator bar sits in between. */
const CONTENT_X = 107;
const INDICATOR_X = 94;

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
  const [sideScrollY, setSideScrollY] = useState(0);

  const outlet = getOutlet(outletId);
  const searching = query.trim().length > 0;

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menuItems.filter((m) =>
      q
        ? m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
        : m.categoryId === category
    );
  }, [category, query]);

  const tooFar = (outlet?.distanceKm ?? 0) > MAX_ORDER_DISTANCE_KM;
  const activeIndex = categories.findIndex((c) => c.id === category);
  const activeCategory = categories[activeIndex];
  // The bar tracks the active card as the sidebar scrolls, so it always sits
  // beside the selected category rather than acting as a static divider.
  const indicatorTop = SIDE_PAD_TOP + activeIndex * (SIDE_CARD_H + SIDE_GAP) - sideScrollY;

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderBottomLeftRadius: 18,
          borderBottomRightRadius: 18,
        }}
      >
        <SafeAreaView edges={["top"]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: GUTTER,
              height: 42,
            }}
          >
            <AppText
              color={brand[700]}
              style={{
                flex: 1,
                fontSize: 14,
                lineHeight: 19,
                fontFamily: "Urbanist_500Medium",
              }}
            >
              Daftar Menu
            </AppText>
            <PressableScale
              onPress={() => router.push("/order-history")}
              style={{ flexDirection: "row", alignItems: "center", gap: 1 }}
              hitSlop={10}
            >
              <AppText
                color={brand[700]}
                style={{ fontSize: 12.5, lineHeight: 17, fontFamily: "Urbanist_500Medium" }}
              >
                Riwayat Pesanan
              </AppText>
              <ChevronRight size={15} color={brand[700]} />
            </PressableScale>
          </View>

          <View style={{ paddingHorizontal: GUTTER, paddingBottom: 9, gap: 14 }}>
            <PressableScale
              onPress={reopenOutletSheet}
              scaleTo={0.99}
              style={{
                height: 52,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: brand[50],
                borderRadius: 12,
                paddingHorizontal: 11,
              }}
            >
              <BrandLogo brandId={outlet?.brandId} size={24} />
              <View style={{ flex: 1, gap: 1 }}>
                <AppText
                  numberOfLines={1}
                  style={{ fontSize: 14.5, lineHeight: 19, fontFamily: "Urbanist_700Bold" }}
                >
                  {outlet?.name ?? "Pilih outlet"}
                </AppText>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <AppText
                    color={ink[500]}
                    style={{ fontSize: 10.5, lineHeight: 14, fontFamily: "Urbanist_400Regular" }}
                  >
                    {outlet?.city} •
                  </AppText>
                  <AppText
                    color={tooFar ? danger[500] : ink[500]}
                    style={{ fontSize: 10.5, lineHeight: 14, fontFamily: "Urbanist_700Bold" }}
                  >
                    {outlet ? `${(outlet.distanceKm * 1000).toFixed(2)} m` : ""}
                  </AppText>
                  {tooFar ? <TriangleAlert size={11} color={danger[500]} /> : null}
                </View>
              </View>
              <ChevronDown size={19} color={brand[700]} />
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
          scrollEventThrottle={16}
          onScroll={(e) => setSideScrollY(e.nativeEvent.contentOffset.y)}
          contentContainerStyle={{
            paddingTop: SIDE_PAD_TOP,
            paddingLeft: GUTTER,
            gap: SIDE_GAP,
            paddingBottom: insets.bottom + 110,
          }}
          style={{ width: GUTTER + SIDE_CARD_W, flexGrow: 0 }}
        >
          {categories.map((c) => {
            const active = c.id === category && !searching;
            return (
              <PressableScale
                key={c.id}
                onPress={() => {
                  setQuery("");
                  setCategory(c.id);
                }}
                scaleTo={0.97}
                style={{
                  width: SIDE_CARD_W,
                  height: SIDE_CARD_H,
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  paddingHorizontal: 3,
                  backgroundColor: active ? brand[900] : "#FFFFFF",
                  ...(shadow.xs as object),
                }}
              >
                <CategoryIcon name={c.icon} size={23} color={active ? "#FFFFFF" : brand[800]} />
                <AppText
                  numberOfLines={1}
                  color={active ? "#FFFFFF" : ink[700]}
                  style={{ fontSize: 10, lineHeight: 13, fontFamily: "Urbanist_500Medium" }}
                >
                  {c.name}
                </AppText>
              </PressableScale>
            );
          })}
        </ScrollView>

        {/* Active-category indicator, parked outside the scroller so it is not
            clipped while still following the selected card. */}
        {!searching && indicatorTop > -SIDE_CARD_H ? (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: INDICATOR_X,
              top: indicatorTop,
              width: 2.5,
              height: SIDE_CARD_H,
              borderRadius: 2,
              backgroundColor: brand[900],
            }}
          />
        ) : null}

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingLeft: CONTENT_X - (GUTTER + SIDE_CARD_W),
            paddingRight: 11,
            paddingTop: SIDE_PAD_TOP,
            paddingBottom: insets.bottom + 110,
            gap: 10,
          }}
          style={{ flex: 1 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#FFFFFF",
              borderRadius: 14,
              paddingHorizontal: 13,
              height: 29,
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
                  fontSize: 11.5,
                  color: ink[900],
                },
                Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null,
              ]}
            />
            <Search size={15} color={brand[700]} />
          </View>

          <AppText
            color={ink[900]}
            style={{ fontSize: 13, lineHeight: 18, fontFamily: "Urbanist_700Bold" }}
          >
            {searching ? `Hasil "${query.trim()}"` : activeCategory?.name}
          </AppText>

          {visibleItems.length === 0 ? (
            <AppText variant="caption" color={ink[400]}>
              Menu tidak ditemukan.
            </AppText>
          ) : null}

          {visibleItems.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                height: 72,
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                overflow: "hidden",
                ...(shadow.xs as object),
              }}
            >
              <PressableScale
                onPress={() => router.push(`/product/${item.id}`)}
                scaleTo={0.99}
                style={{ width: 76, height: "100%" }}
              >
                <ImagePlaceholder radius={0} iconSize={20} style={{ flex: 1 }} />
              </PressableScale>
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 9,
                  paddingVertical: 7,
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <AppText
                    numberOfLines={1}
                    style={{ fontSize: 11.5, lineHeight: 16, fontFamily: "Urbanist_600SemiBold" }}
                  >
                    {item.name}
                  </AppText>
                  <AppText
                    numberOfLines={1}
                    color={ink[400]}
                    style={{ fontSize: 9.5, lineHeight: 13, fontFamily: "Urbanist_400Regular" }}
                  >
                    {item.description}
                  </AppText>
                </View>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <AppText
                    style={{
                      flex: 1,
                      fontSize: 11,
                      lineHeight: 15,
                      fontFamily: "Urbanist_700Bold",
                    }}
                  >
                    {formatRupiah(item.price)}
                  </AppText>
                  <PressableScale
                    onPress={() => addLine(item, 1, [])}
                    hitSlop={14}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 5,
                      backgroundColor: brand[900],
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Plus size={11} color="#FFFFFF" strokeWidth={3} />
                  </PressableScale>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {couponVisible ? (
        <View style={{ position: "absolute", right: 11, bottom: insets.bottom + 78 }}>
          <PressableScale onPress={() => router.push("/promo")} scaleTo={0.96}>
            <ImagePlaceholder
              label="Sticker Kupon"
              radius={12}
              iconSize={16}
              style={{ width: 88, height: 52 }}
            />
          </PressableScale>
          <PressableScale
            onPress={() => setCouponVisible(false)}
            hitSlop={12}
            style={{
              position: "absolute",
              top: -8,
              left: -8,
              width: 19,
              height: 19,
              borderRadius: 10,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              ...(shadow.sm as object),
            }}
          >
            <X size={11} color={ink[500]} strokeWidth={2.6} />
          </PressableScale>
        </View>
      ) : null}
    </View>
  );
}
