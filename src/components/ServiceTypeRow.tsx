import React from "react";
import { AppIcon, type AppIconName } from "./ui/AppIcon";
import { View } from "react-native";
import { AppText } from "./ui/AppText";
import { PressableScale } from "./ui/PressableScale";
import { brand, ink } from "../theme/colors";
import type { ServiceType } from "../data/types";

const options: { key: ServiceType; label: string; icon: AppIconName }[] = [
  { key: "dine_in", label: "Dine In", icon: "coffee" },
  { key: "takeaway", label: "Take Away", icon: "order" },
  { key: "delivery", label: "Delivery", icon: "scooter" },
];

interface ServiceTypeRowProps {
  value: ServiceType;
  onChange: (value: ServiceType) => void;
  /** Types this outlet does not offer are shown dimmed and are not tappable. */
  available?: ServiceType[];
}

/** Dine In / Take Away / Delivery pills with a radio dot on the right.
 *  Sized off the reference: 32pt tall, 7pt apart, 11pt label. */
export function ServiceTypeRow({ value, onChange, available }: ServiceTypeRowProps) {
  return (
    <View style={{ flexDirection: "row", gap: 7 }}>
      {options.map(({ key, label, icon }) => {
        const enabled = !available || available.includes(key);
        const active = value === key;
        return (
          <PressableScale
            key={key}
            onPress={() => enabled && onChange(key)}
            scaleTo={0.97}
            style={{
              flex: 1,
              opacity: enabled ? 1 : 0.4,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              height: 32,
              paddingHorizontal: 3,
              borderRadius: 16,
              backgroundColor: active ? brand[50] : ink[50],
            }}
          >
            <AppIcon name={icon} size={12} color={active ? brand[700] : ink[500]} />
            <AppText
              numberOfLines={1}
              color={active ? brand[800] : ink[600]}
              style={{ fontSize: 10.5, lineHeight: 14, fontFamily: "Urbanist_500Medium" }}
            >
              {label}
            </AppText>
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                borderWidth: 1.5,
                borderColor: active ? brand[700] : ink[300],
                backgroundColor: active ? brand[700] : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {active ? (
                <View
                  style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: "#FFFFFF" }}
                />
              ) : null}
            </View>
          </PressableScale>
        );
      })}
    </View>
  );
}
