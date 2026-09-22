import React from "react";
import { type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Coffee,
  CupSoda,
  Drumstick,
  Cake,
  Soup,
  Gift,
  Ticket,
  Cookie,
  type LucideIcon,
} from "lucide-react-native";

export type TileIcon =
  | "coffee"
  | "cup"
  | "drumstick"
  | "cake"
  | "soup"
  | "gift"
  | "ticket"
  | "cookie";

const iconMap: Record<TileIcon, LucideIcon> = {
  coffee: Coffee,
  cup: CupSoda,
  drumstick: Drumstick,
  cake: Cake,
  soup: Soup,
  gift: Gift,
  ticket: Ticket,
  cookie: Cookie,
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
  const Icon = iconMap[icon];
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
      <Icon size={iconSize ?? size * 0.42} color="rgba(255,255,255,0.92)" strokeWidth={1.8} />
    </LinearGradient>
  );
}
