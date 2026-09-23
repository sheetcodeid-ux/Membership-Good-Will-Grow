import React, { useMemo, useState } from "react";
import { AppIcon } from "../components/ui/AppIcon";
import { Platform, ScrollView, TextInput, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { PressableScale } from "../components/ui/PressableScale";
import { BrandLogo } from "../components/BrandLogo";
import { OutletInfoSheet } from "../components/OutletInfoSheet";
import { brand, danger, ink, success, surface } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { brands, outlets } from "../data/mock";
import { useOrderStore } from "../store/orderStore";
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

function formatDistance(km: number) {
  return km < 1 ? `~${(km * 1000).toFixed(2)} m` : `~${km.toFixed(2)} km`;
}

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
          o.city.toLowerCase().includes(q)
      )
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [brandId, query]);

  const activeBrandIndex = brands.findIndex((b) => b.id === brandId);
  // Same rail as Daftar Menu: hairline for the whole column, darker segment
  // parked beside the brand currently selected.
  const indicatorTop = 14 + activeBrandIndex * (SIDE_CARD_H + SIDE_GAP) - sideScrollY;

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

      <AppHeader title="Pilih Outlet">
        <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              backgroundColor: brand[50],
              borderRadius: 14,
              paddingHorizontal: 12,
              height: 44,
            }}
          >
            <AppIcon name="store" size={17} color={brand[600]} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Ketik untuk mencari outlet"
              placeholderTextColor={ink[400]}
              style={[
                {
                  flex: 1,
                  minWidth: 0,
                  padding: 0,
                  fontFamily: "Urbanist_400Regular",
                  fontSize: 12.5,
                  color: ink[900],
                },
                Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null,
              ]}
            />
            <AppIcon name="search" size={18} color={brand[700]} />
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
                  setQuery("");
                  setBrandId(b.id);
                }}
                scaleTo={0.97}
                style={{
                  width: SIDE_CARD_W,
                  height: SIDE_CARD_H,
                  borderRadius: 14,
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1.5,
                  borderColor: active ? brand[600] : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                  ...(shadow.xs as object),
                }}
              >
                <BrandLogo brandId={b.id} size={44} />
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
            width: 1.5,
            backgroundColor: brand[100],
          }}
        />
        {!query ? (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: RAIL_X - 0.5,
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
          contentContainerStyle={{ paddingLeft: 22, paddingRight: 12, paddingVertical: 12, gap: 10, flexGrow: 1 }}
          style={{ flex: 1 }}
        >
          {visible.length === 0 ? (
            <EmptyState
              icon={<AppIcon name="store" size={50} color={ink[300]} />}
              title="Outlet tidak ditemukan"
              subtitle="Coba kata kunci lain."
              style={{ paddingTop: 50 }}
            />
          ) : null}

          {visible.map((o) => {
            const isSelected = o.id === selectedId;
            return (
              <PressableScale
                key={o.id}
                onPress={() => choose(o)}
                scaleTo={0.99}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 14,
                  padding: 10,
                  gap: 6,
                  borderWidth: 1.5,
                  borderColor: isSelected ? brand[600] : "transparent",
                  ...(shadow.xs as object),
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <BrandLogo brandId={o.brandId} size={25} />
                  <View style={{ flex: 1 }} />
                  {isSelected ? (
                    <View
                      style={{
                        backgroundColor: brand[50],
                        borderRadius: 7,
                        paddingHorizontal: 7,
                        paddingVertical: 3,
                      }}
                    >
                      <AppText variant="micro" color={brand[700]}>
                        Outlet Terpilih
                      </AppText>
                    </View>
                  ) : null}
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <AppText variant="h3" numberOfLines={1} style={{ flexShrink: 1 }}>
                    {o.name}
                  </AppText>
                  <View
                    style={{
                      backgroundColor: o.isOpen ? success[50] : ink[100],
                      borderRadius: 6,
                      paddingHorizontal: 7,
                      paddingVertical: 2,
                    }}
                  >
                    <AppText variant="micro" color={o.isOpen ? success[600] : ink[500]}>
                      {o.isOpen ? "Available" : "Tutup"}
                    </AppText>
                  </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <AppIcon name="cart" size={12} color={ink[400]} />
                  <AppText variant="caption" color={ink[600]} numberOfLines={1}>
                    {o.services.map((s) => serviceLabels[s]).join(", ")}
                  </AppText>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <AppIcon name="pin" size={12} color={ink[400]} />
                  <AppText
                    variant="caption"
                    color={ink[600]}
                    numberOfLines={1}
                    style={{ flexShrink: 1 }}
                  >
                    {o.address}
                  </AppText>
                  <AppText variant="caption" color={ink[400]}>
                    •
                  </AppText>
                  <AppText
                    variant="caption"
                    color={danger[500]}
                    numberOfLines={1}
                    style={{ fontFamily: "Urbanist_700Bold", flexShrink: 0 }}
                  >
                    {formatDistance(o.distanceKm)}
                  </AppText>
                </View>

                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <View style={{ flex: 1, gap: 8 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <AppIcon name="building" size={12} color={ink[400]} />
                      <AppText variant="caption" color={ink[600]}>
                        {o.city}
                      </AppText>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <AppIcon name="clock" size={12} color={ink[400]} />
                      <AppText variant="caption" color={ink[600]}>
                        {o.hours}
                      </AppText>
                    </View>
                  </View>
                  <PressableScale
                    onPress={() => setInfoOutlet(o)}
                    hitSlop={8}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 7,
                      backgroundColor: brand[900],
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AppIcon name="info" size={12} color="#FFFFFF" />
                  </PressableScale>
                </View>
              </PressableScale>
            );
          })}
        </ScrollView>
      </View>

      {infoOutlet ? (
        <OutletInfoSheet outlet={infoOutlet} onClose={() => setInfoOutlet(null)} />
      ) : null}
    </View>
  );
}
