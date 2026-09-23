import React from "react";
import { AppIcon, type AppIconName } from "./ui/AppIcon";
import { View } from "react-native";
import { AppText } from "./ui/AppText";
import { BrandLogo } from "./BrandLogo";
import { brand, ink } from "../theme/colors";
import { outletFullName } from "../data/mock";
import type { Outlet, ServiceType } from "../data/types";

const serviceMeta: Record<ServiceType, { label: string; icon: AppIconName }> = {
  dine_in: { label: "Dine In", icon: "coffee" },
  takeaway: { label: "Take Away", icon: "order" },
  delivery: { label: "Delivery", icon: "bike" },
};

/** Outlet strip that sits under the header on Keranjang and Checkout. */
export function OutletBar({ outlet, serviceType }: { outlet?: Outlet; serviceType: ServiceType }) {
  if (!outlet) return null;
  const { label, icon } = serviceMeta[serviceType];
  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: brand[50],
          borderRadius: 12,
          paddingVertical: 9,
          paddingHorizontal: 10,
        }}
      >
        <BrandLogo brandId={outlet.brandId} size={26} />
        <View style={{ flex: 1 }}>
          <AppText variant="titleLg" numberOfLines={1}>
            {outletFullName(outlet)}
          </AppText>
          <AppText variant="caption" color={ink[500]}>
            {outlet.city}
          </AppText>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            backgroundColor: brand[900],
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 13,
          }}
        >
          <AppIcon name={icon} size={14} color="#FFFFFF" />
          <AppText variant="bodySemibold" color="#FFFFFF">
            {label}
          </AppText>
        </View>
      </View>
    </View>
  );
}
