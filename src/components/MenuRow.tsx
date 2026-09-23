import React from "react";
import { AppIcon } from "./ui/AppIcon";
import { View } from "react-native";
import { PressableScale } from "./ui/PressableScale";
import { AppText } from "./ui/AppText";
import { brand, ink } from "../theme/colors";

interface MenuRowProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  danger?: boolean;
  right?: React.ReactNode;
}

export function MenuRow({ icon, label, subtitle, onPress, danger, right }: MenuRowProps) {
  return (
    <PressableScale
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 14,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 13,
          backgroundColor: danger ? "#FDE8ED" : brand[50],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="bodySemibold" color={danger ? "#C21A40" : ink[900]}>
          {label}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color={ink[500]}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right ?? (onPress ? <AppIcon name="chevronRight" size={18} color={ink[300]} /> : null)}
    </PressableScale>
  );
}
