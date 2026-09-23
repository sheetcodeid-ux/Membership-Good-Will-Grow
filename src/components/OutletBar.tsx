import React from "react";
import { View } from "react-native";
import { Bike, Coffee, ShoppingBag } from "lucide-react-native";
import { AppText } from "./ui/AppText";
import { BrandLogo } from "./BrandLogo";
import { brand, ink } from "../theme/colors";
import { outletFullName } from "../data/mock";
import type { Outlet, ServiceType } from "../data/types";

const serviceMeta: Record<ServiceType, { label: string; icon: typeof Coffee }> = {
  dine_in: { label: "Dine In", icon: Coffee },
  takeaway: { label: "Take Away", icon: ShoppingBag },
  delivery: { label: "Delivery", icon: Bike },
};

/** Outlet strip that sits under the header on Keranjang and Checkout. */
export function OutletBar({ outlet, serviceType }: { outlet?: Outlet; serviceType: ServiceType }) {
  if (!outlet) return null;
  const { label, icon: Icon } = serviceMeta[serviceType];
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
          <Icon size={14} color="#FFFFFF" />
          <AppText variant="bodySemibold" color="#FFFFFF">
            {label}
          </AppText>
        </View>
      </View>
    </View>
  );
}
