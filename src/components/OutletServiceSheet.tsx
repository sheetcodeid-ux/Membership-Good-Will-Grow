import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { ChevronRight, CircleAlert, TriangleAlert } from "lucide-react-native";
import { AppText } from "./ui/AppText";
import { BottomSheet } from "./ui/BottomSheet";
import { PressableScale } from "./ui/PressableScale";
import { BrandLogo } from "./BrandLogo";
import { ServiceTypeRow } from "./ServiceTypeRow";
import { brand, danger, ink } from "../theme/colors";
import { getOutlet } from "../data/mock";
import { MAX_ORDER_DISTANCE_KM, useOrderStore } from "../store/orderStore";

function formatDistance(km: number) {
  return km < 1 ? `~${(km * 1000).toFixed(2)} m` : `~${km.toFixed(2)} km`;
}

/** First thing the Order tab shows: confirm which outlet you are ordering from. */
export function OutletServiceSheet() {
  const outletId = useOrderStore((s) => s.outletId);
  const serviceType = useOrderStore((s) => s.serviceType);
  const setServiceType = useOrderStore((s) => s.setServiceType);
  const confirmOutlet = useOrderStore((s) => s.confirmOutlet);

  const outlet = getOutlet(outletId);
  if (!outlet) return null;

  const tooFar = outlet.distanceKm > MAX_ORDER_DISTANCE_KM;

  return (
    <BottomSheet
      title="Pilih Outlet & Tipe Pembelian"
      onClose={confirmOutlet}
      showClose={false}
      maxHeightRatio={0.7}
    >
      <View style={{ paddingHorizontal: 22, paddingTop: 12, paddingBottom: 20, gap: 14 }}>
        <PressableScale
          onPress={() => router.push("/outlet-picker")}
          scaleTo={0.99}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            backgroundColor: brand[50],
            borderRadius: 14,
            paddingVertical: 12,
            paddingHorizontal: 14,
          }}
        >
          <BrandLogo brandId={outlet.brandId} size={34} />
          <View style={{ flex: 1 }}>
            <AppText variant="titleLg" numberOfLines={1}>
              {outlet.name}
            </AppText>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <AppText variant="caption" color={ink[500]}>
                {outlet.city} •
              </AppText>
              <AppText
                variant="caption"
                color={tooFar ? danger[500] : ink[500]}
                style={{ fontFamily: "Urbanist_700Bold" }}
              >
                {formatDistance(outlet.distanceKm)}
              </AppText>
              {tooFar ? <TriangleAlert size={13} color={danger[500]} /> : null}
            </View>
          </View>
          <ChevronRight size={22} color={brand[700]} />
        </PressableScale>

        {tooFar ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              backgroundColor: danger[50],
              borderRadius: 14,
              paddingVertical: 14,
              paddingHorizontal: 14,
            }}
          >
            <CircleAlert size={20} color={danger[500]} />
            <AppText
              variant="caption"
              color={danger[500]}
              style={{ flex: 1, fontStyle: "italic" }}
            >
              Jarak anda terlalu jauh dari outlet:{" "}
              <AppText
                variant="caption"
                color={danger[500]}
                style={{ fontStyle: "italic", fontFamily: "Urbanist_700Bold" }}
              >
                {MAX_ORDER_DISTANCE_KM.toFixed(1)} km
              </AppText>
            </AppText>
          </View>
        ) : null}

        <ServiceTypeRow
          value={serviceType}
          onChange={setServiceType}
          available={outlet.services}
        />

        <PressableScale
          onPress={confirmOutlet}
          scaleTo={0.98}
          style={{
            height: 56,
            borderRadius: 16,
            backgroundColor: brand[900],
            alignItems: "center",
            justifyContent: "center",
            marginTop: 2,
          }}
        >
          <AppText variant="titleLg" color="#FFFFFF">
            Konfirmasi Outlet
          </AppText>
        </PressableScale>
      </View>
    </BottomSheet>
  );
}
