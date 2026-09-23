import React from "react";
import { AppIcon, type AppIconName } from "./AppIcon";
import { type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export type TileIcon =
  | "coffee"
  | "cup"
  | "drumstick"
  | "cake"
  | "soup"
  | "gift"
  | "ticket"
  | "cookie";

const iconMap: Record<TileIcon, AppIconName> = {
  coffee: "coffee",
  cup: "coldCup",
  drumstick: "drumstick",
  cake: "cake",
  soup: "soup",
  gift: "gift",
  ticket: "ticket",
  cookie: "cookie",
};

interface MediaTileProps {
  icon?: TileIcon;
  colors?: [string, string];
  size?: number;
  radius?: number;
  iconSize?: number;
  style?: ViewStyle;
}

export function MediaTile({
  icon = "coffee",
  colors = ["#123CA3", "#4066C2"],
  size = 64,
  radius = 16,
  iconSize,
  style,
}: MediaTileProps) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <AppIcon name={iconMap[icon]} size={iconSize ?? size * 0.42} color="rgba(255,255,255,0.92)" />
    </LinearGradient>
  );
}
