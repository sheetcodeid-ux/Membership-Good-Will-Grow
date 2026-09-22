import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { Home, ShoppingBag, Ticket, Crown, User } from "lucide-react-native";
import { PressableScale } from "./ui/PressableScale";
import { AppText } from "./ui/AppText";
import { brand, ink } from "../theme/colors";
import { shadow } from "../theme/shadows";

const icons: Record<string, typeof Home> = {
  index: Home,
  order: ShoppingBag,
  promo: Ticket,
  member: Crown,
  profile: User,
};

const labels: Record<string, string> = {
  index: "Beranda",
  order: "Order",
  promo: "Promo",
  member: "Member",
  profile: "Profil",
};

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: insets.bottom + 10,
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        paddingVertical: 10,
        paddingHorizontal: 8,
        justifyContent: "space-between",
        ...(shadow.lg as object),
      }}
    >
      {state.routes.map((route, i) => {
        const focused = state.index === i;
        const Icon = icons[route.name] ?? Home;
        const label = labels[route.name] ?? route.name;

        return (
          <PressableScale
            key={route.key}
            onPress={() => {
              const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
            }}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              paddingVertical: 8,
              borderRadius: 18,
              backgroundColor: focused ? brand[50] : "transparent",
              marginHorizontal: 3,
            }}
          >
            <Icon size={22} color={focused ? brand[600] : ink[400]} strokeWidth={focused ? 2.2 : 1.8} />
            <AppText variant="micro" color={focused ? brand[700] : ink[400]}>
              {label}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}
