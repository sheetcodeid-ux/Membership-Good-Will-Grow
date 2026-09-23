import React from "react";
import { ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppIcon } from "../../components/ui/AppIcon";
import { UiText } from "../../components/ui/Text";
import { AppHeader } from "../../components/ui/AppHeader";
import { EmptyState } from "../../components/ui/EmptyState";
import { PressableScale } from "../../components/ui/PressableScale";
import { BrandLogo } from "../../components/BrandLogo";
import { brand, danger, ink, success, surface } from "../../theme/colors";
import { radius, space } from "../../theme/scale";
import { shadow } from "../../theme/shadows";
import { useResponsive } from "../../theme/responsive";
import { outlets, brands } from "../../data/mock";

const serviceLabel: Record<string, string> = {
  dine_in: "Dine In",
  takeaway: "Take Away",
  delivery: "Delivery",
};

/**
 * The outlet behind a check-in.
 *
 * The check-in chip on a post has always carried a chevron, which promises a
 * destination; until now there was none, and a chevron that goes nowhere
 * teaches people to stop trying the ones that do.
 */
export default function OutletScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const r = useResponsive();
  const outlet = outlets.find((o) => o.id === id);
  const brandName = brands.find((b) => b.id === outlet?.brandId)?.name ?? "";

  if (!outlet) {
    return (
      <View style={{ flex: 1, backgroundColor: surface }}>
        <StatusBar style="dark" />
        <AppHeader title="Outlet" />
        <EmptyState
          icon={<AppIcon name="store" size={60} color={ink[300]} />}
          title="Outlet tidak ditemukan"
          subtitle="Outlet ini mungkin sudah tidak beroperasi."
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title={outlet.name} />

      <ScrollView
        contentContainerStyle={{
          padding: r.gutter,
          paddingBottom: space.xxxl * 2,
          gap: space.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: space.lg,
            backgroundColor: "#FFFFFF",
            borderRadius: radius.lg,
            padding: space.lg,
            ...(shadow.xs as object),
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: radius.md,
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: ink[100],
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <BrandLogo brandId={outlet.brandId} size={44} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <UiText token="h3" color={brand[900]} numberOfLines={1}>
              {outlet.name}
            </UiText>
            <UiText token="caption" color={ink[500]}>
              {brandName} · {outlet.city}
            </UiText>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.xs }}>
              <View
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: outlet.isOpen ? success[500] : danger[500],
                }}
              />
              <UiText token="label" color={outlet.isOpen ? success[500] : danger[500]}>
                {outlet.isOpen ? `Buka · ${outlet.hours}` : `Tutup · buka ${outlet.opensAt}`}
              </UiText>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: radius.lg,
            padding: space.lg,
            gap: space.lg,
            ...(shadow.xs as object),
          }}
        >
          <View style={{ flexDirection: "row", gap: space.md }}>
            <AppIcon name="pin" size={19} color={brand[600]} />
            <UiText token="body" color={ink[700]} style={{ flex: 1 }}>
              {outlet.addressFull}
            </UiText>
          </View>
          <View style={{ flexDirection: "row", gap: space.md }}>
            <AppIcon name="clock" size={19} color={brand[600]} />
            <UiText token="body" color={ink[700]} style={{ flex: 1 }}>
              Setiap hari {outlet.hours}
            </UiText>
          </View>
          <View style={{ flexDirection: "row", gap: space.md }}>
            <AppIcon name="order" size={19} color={brand[600]} />
            <UiText token="body" color={ink[700]} style={{ flex: 1 }}>
              {outlet.services.map((s) => serviceLabel[s] ?? s).join(" · ")}
            </UiText>
          </View>
        </View>

        {outlet.appOrderAvailable ? (
          <PressableScale
            onPress={() => router.push("/order")}
            style={{
              height: 52,
              borderRadius: radius.pill,
              backgroundColor: brand[900],
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: space.sm,
            }}
          >
            <AppIcon name="order" size={19} color="#FFFFFF" />
            <UiText token="title" color="#FFFFFF">
              Pesan dari outlet ini
            </UiText>
          </PressableScale>
        ) : null}
      </ScrollView>
    </View>
  );
}
