import React, { useMemo, useState } from "react";
import { Platform, ScrollView, TextInput, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { BrandLogo } from "../components/BrandLogo";
import { Glyph, type GlyphName } from "../components/icons/Glyph";
import { AccountEmpty } from "../components/EmptyArt";
import { LABEL_INK, QUIET_INK, RULE } from "../components/AccountMenu";
import { fontFamilies } from "../theme/typography";
import { tapSelect } from "../utils/haptics";
import { formatDistance } from "../utils/format";
import { OutletInfoSheet } from "../components/OutletInfoSheet";
import { brand, danger, success, surface } from "../theme/colors";
import { brands, outlets } from "../data/mock";
import { MAX_ORDER_DISTANCE_KM, useOrderStore } from "../store/orderStore";
import type { Outlet, ServiceType } from "../data/types";

const serviceLabels: Record<ServiceType, string> = {
  dine_in: "Dine In",
  takeaway: "Take Away",
  delivery: "Delivery",
};

/* Sidebar metrics, mirroring the Daftar Menu rail. */
const SIDE_PAD = 12;
const SIDE_CARD_W = 64;
const SIDE_CARD_H = 62;
const SIDE_GAP = 10;
const RAIL_X = SIDE_PAD + SIDE_CARD_W + 12;

export default function OutletPickerScreen() {
  const selectedId = useOrderStore((s) => s.outletId);
  const setOutlet = useOrderStore((s) => s.setOutlet);
  const reopenOutletSheet = useOrderStore((s) => s.reopenOutletSheet);

  const [brandId, setBrandId] = useState(brands[0].id);
  const [query, setQuery] = useState("");
  const [infoOutlet, setInfoOutlet] = useState<Outlet | null>(null);
  const [sideScrollY, setSideScrollY] = useState(0);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return outlets
      .filter((o) => (q ? true : o.brandId === brandId))
      .filter(
        (o) =>
          !q ||
          o.name.toLowerCase().includes(q) ||
          o.address.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q),
      )
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [brandId, query]);

  const activeBrandIndex = brands.findIndex((b) => b.id === brandId);
  // Same rail as Daftar Menu: hairline for the whole column, darker segment
  // parked beside the brand currently selected.
  const indicatorTop =
    14 + activeBrandIndex * (SIDE_CARD_H + SIDE_GAP) - sideScrollY;

  const choose = (outlet: Outlet) => {
    setOutlet(outlet.id);
    // Sending the member back through the confirm sheet keeps the purchase
    // type in sync with the outlet they just picked.
    reopenOutletSheet();
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader tone="account" title="Pilih Outlet">
        <View style={{ paddingHorizontal: 13.5, paddingBottom: 12 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: "#FFFFFF",
              borderRadius: 23,
              borderWidth: 1,
              borderColor: "#C9D6F5",
              paddingHorizontal: 14,
              height: 46,
            }}
          >
            <Glyph name="search" size={16} color={QUIET_INK} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Cari outlet atau alamat"
              placeholderTextColor="#8A93A6"
              style={[
                {
                  flex: 1,
                  minWidth: 0,
                  padding: 0,
                  fontFamily: fontFamilies.medium,
                  fontSize: 15,
                  color: LABEL_INK,
                },
                Platform.OS === "web"
                  ? ({ outlineStyle: "none" } as object)
                  : null,
              ]}
            />
            {query ? (
              <PressableScale onPress={() => setQuery("")} hitSlop={8}>
                <Glyph name="closeCircle" size={16} color="#8A93A6" />
              </PressableScale>
            ) : null}
          </View>
        </View>
      </AppHeader>

      <View style={{ flex: 1, flexDirection: "row" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e) => setSideScrollY(e.nativeEvent.contentOffset.y)}
          contentContainerStyle={{
            paddingTop: 14,
            paddingBottom: 24,
            paddingLeft: SIDE_PAD,
            gap: SIDE_GAP,
          }}
          style={{ width: SIDE_PAD + SIDE_CARD_W, flexGrow: 0 }}
        >
          {brands.map((b) => {
            const active = !query && brandId === b.id;
            return (
              <PressableScale
                key={b.id}
                onPress={() => {
                  tapSelect();
                  setQuery("");
                  setBrandId(b.id);
                }}
                scaleTo={0.97}
                style={{
                  width: SIDE_CARD_W,
                  height: SIDE_CARD_H,
                  borderRadius: 16,
                  backgroundColor: active ? "#F3F7FF" : "#FFFFFF",
                  borderWidth: active ? 1.5 : 1,
                  borderColor: active ? brand[600] : RULE,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BrandLogo brandId={b.id} size={42} />
              </PressableScale>
            );
          })}
        </ScrollView>

        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: RAIL_X,
            top: 0,
            bottom: 0,
            width: 1,
            backgroundColor: RULE,
          }}
        />
        {!query ? (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: RAIL_X - 1,
              top: indicatorTop,
              width: 3,
              height: SIDE_CARD_H,
              borderRadius: 2,
              backgroundColor: brand[600],
            }}
          />
        ) : null}

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingLeft: 22,
            paddingRight: 13.5,
            paddingVertical: 14,
            gap: 10,
            flexGrow: 1,
          }}
          style={{ flex: 1 }}
        >
          {visible.length === 0 ? (
            <AccountEmpty
              glyph="store"
              title="Outlet tidak ditemukan"
              subtitle="Coba kata kunci lain, misalnya nama jalan."
            />
          ) : null}

          {visible.map((o) => {
            const isSelected = o.id === selectedId;
            const far = o.distanceKm > MAX_ORDER_DISTANCE_KM;
            const line = (
              glyph: GlyphName,
              text: string,
              extra?: React.ReactNode,
            ) => (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Glyph name={glyph} size={13} color="#8A93A6" />
                <UiText
                  color={QUIET_INK}
                  numberOfLines={1}
                  style={{
                    flexShrink: 1,
                    fontSize: 13,
                    lineHeight: 18,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  {text}
                </UiText>
                {extra}
              </View>
            );
            return (
              <PressableScale
                key={o.id}
                onPress={() => choose(o)}
                scaleTo={0.99}
                style={{
                  backgroundColor: isSelected ? "#F3F7FF" : "#FFFFFF",
                  borderRadius: 16,
                  padding: 12,
                  gap: 6,
                  borderWidth: isSelected ? 1.5 : 1,
                  borderColor: isSelected ? brand[600] : RULE,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <BrandLogo brandId={o.brandId} size={24} />
                  <UiText
                    color={LABEL_INK}
                    numberOfLines={1}
                    style={{
                      flexShrink: 1,
                      fontSize: 16,
                      lineHeight: 21,
                      fontFamily: fontFamilies.extrabold,
                    }}
                  >
                    {o.name}
                  </UiText>
                  <View
                    style={{
                      backgroundColor: o.isOpen ? success[50] : "#F2F3F5",
                      borderRadius: 8,
                      paddingHorizontal: 7,
                      paddingVertical: 1,
                    }}
                  >
                    <UiText
                      color={o.isOpen ? success[600] : QUIET_INK}
                      style={{
                        fontSize: 11.5,
                        lineHeight: 15,
                        fontFamily: fontFamilies.bold,
                      }}
                    >
                      {o.isOpen ? "Buka" : "Tutup"}
                    </UiText>
                  </View>
                  <View style={{ flex: 1 }} />
                  {isSelected ? (
                    <Glyph name="checkCircle" size={18} color={brand[600]} />
                  ) : null}
                </View>

                {line(
                  "pin",
                  o.address,
                  <UiText
                    color={far ? danger[500] : QUIET_INK}
                    numberOfLines={1}
                    style={{
                      flexShrink: 0,
                      fontSize: 13,
                      lineHeight: 18,
                      fontFamily: fontFamilies.bold,
                    }}
                  >
                    · {formatDistance(o.distanceKm)}
                  </UiText>,
                )}
                {line(
                  "store",
                  o.services.map((s) => serviceLabels[s]).join(", "),
                )}

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>{line("clock", o.hours)}</View>
                  <PressableScale
                    onPress={() => setInfoOutlet(o)}
                    hitSlop={8}
                    scaleTo={0.92}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      borderRadius: 12,
                      paddingHorizontal: 9,
                      paddingVertical: 3,
                      backgroundColor: "#EAF0FF",
                    }}
                  >
                    <Glyph name="info" size={12} color={brand[700]} />
                    <UiText
                      color={brand[700]}
                      style={{
                        fontSize: 12,
                        lineHeight: 16,
                        fontFamily: fontFamilies.bold,
                      }}
                    >
                      Info
                    </UiText>
                  </PressableScale>
                </View>
              </PressableScale>
            );
          })}
        </ScrollView>
      </View>

      {infoOutlet ? (
        <OutletInfoSheet
          outlet={infoOutlet}
          onClose={() => setInfoOutlet(null)}
        />
      ) : null}
    </View>
  );
}
