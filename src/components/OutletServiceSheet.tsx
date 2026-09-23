import React from "react";
import { AppIcon } from "./ui/AppIcon";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { AppText } from "./ui/AppText";
import { PressableScale } from "./ui/PressableScale";
import { BrandLogo } from "./BrandLogo";
import { ServiceTypeRow } from "./ServiceTypeRow";
import { brand, danger, ink } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { getOutlet } from "../data/mock";
import { MAX_ORDER_DISTANCE_KM, useOrderStore } from "../store/orderStore";

function formatDistance(km: number) {
  return km < 1 ? `~${(km * 1000).toFixed(2)} m` : `~${km.toFixed(2)} km`;
}

/**
 * First thing the Order tab shows: confirm which outlet you are ordering from.
 * The reference renders this as a centred dialog, not an edge-to-edge sheet,
 * so the metrics below are taken from that card.
 */
export function OutletServiceSheet() {
  const outletId = useOrderStore((s) => s.outletId);
  const serviceType = useOrderStore((s) => s.serviceType);
  const setServiceType = useOrderStore((s) => s.setServiceType);
  const confirmOutlet = useOrderStore((s) => s.confirmOutlet);

  const outlet = getOutlet(outletId);
  if (!outlet) return null;

  const tooFar = outlet.distanceKm > MAX_ORDER_DISTANCE_KM;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable style={StyleSheet.absoluteFill} onPress={confirmOutlet}>
        <Animated.View
          entering={FadeIn.duration(180)}
          style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(10,14,26,0.45)" }]}
        />
      </Pressable>

      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        pointerEvents="box-none"
      >
        <Animated.View
          entering={ZoomIn.duration(220)}
          style={{
            width: "92%",
            maxWidth: 420,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingTop: 15,
            paddingBottom: 13,
            ...(shadow.lg as object),
          }}
        >
          <AppText style={{ fontSize: 13.5, lineHeight: 19, fontFamily: "Urbanist_600SemiBold" }}>
            Pilih Outlet & Tipe Pembelian
          </AppText>

          <PressableScale
            onPress={() => router.push("/outlet-picker")}
            scaleTo={0.99}
            style={{
              height: 48,
              marginTop: 13,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: brand[50],
              borderRadius: 11,
              paddingHorizontal: 11,
            }}
          >
            <BrandLogo brandId={outlet.brandId} size={24} />
            <View style={{ flex: 1, gap: 1 }}>
              <AppText
                numberOfLines={1}
                style={{ fontSize: 13.5, lineHeight: 18, fontFamily: "Urbanist_700Bold" }}
              >
                {outlet.name}
              </AppText>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <AppText
                  color={ink[500]}
                  style={{ fontSize: 10, lineHeight: 14, fontFamily: "Urbanist_400Regular" }}
                >
                  {outlet.city} •
                </AppText>
                <AppText
                  color={tooFar ? danger[500] : ink[500]}
                  style={{ fontSize: 10, lineHeight: 14, fontFamily: "Urbanist_700Bold" }}
                >
                  {formatDistance(outlet.distanceKm)}
                </AppText>
                {tooFar ? <AppIcon name="alertTriangle" size={11} color={danger[500]} /> : null}
              </View>
            </View>
            <AppIcon name="chevronRight" size={19} color={brand[700]} />
          </PressableScale>

          {tooFar ? (
            <View
              style={{
                height: 33,
                marginTop: 9,
                flexDirection: "row",
                alignItems: "center",
                gap: 9,
                backgroundColor: danger[50],
                borderRadius: 11,
                paddingHorizontal: 11,
              }}
            >
              <AppIcon name="alertCircle" size={16} color={danger[500]} />
              <AppText
                color={danger[500]}
                numberOfLines={1}
                style={{
                  flex: 1,
                  fontSize: 10.5,
                  lineHeight: 14,
                  fontStyle: "italic",
                  fontFamily: "Urbanist_500Medium",
                }}
              >
                Jarak anda terlalu jauh dari outlet:{" "}
                <AppText
                  color={danger[500]}
                  style={{
                    fontSize: 10.5,
                    fontStyle: "italic",
                    fontFamily: "Urbanist_700Bold",
                  }}
                >
                  {MAX_ORDER_DISTANCE_KM.toFixed(1)} km
                </AppText>
              </AppText>
            </View>
          ) : null}

          <View style={{ marginTop: 9 }}>
            <ServiceTypeRow
              value={serviceType}
              onChange={setServiceType}
              available={outlet.services}
            />
          </View>

          <PressableScale
            onPress={confirmOutlet}
            scaleTo={0.98}
            style={{
              height: 37,
              marginTop: 13,
              borderRadius: 10,
              backgroundColor: brand[900],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppText
              color="#FFFFFF"
              style={{ fontSize: 13, lineHeight: 18, fontFamily: "Urbanist_600SemiBold" }}
            >
              Konfirmasi Outlet
            </AppText>
          </PressableScale>
        </Animated.View>
      </View>
    </View>
  );
}
