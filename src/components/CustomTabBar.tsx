import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import {
  House,
  ShoppingBasket,
  BadgeCheck,
  CircleUser,
  Feather,
  ShoppingCart,
  Menu,
  type LucideIcon,
} from "lucide-react-native";
import { PressableScale } from "./ui/PressableScale";
import { AppText } from "./ui/AppText";
import { brand, ink } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { useUiStore } from "../store/uiStore";

const BAR_HEIGHT = 54;
const FAB_SIZE = 55;

const tabs: Record<string, { icon: LucideIcon; label: string }> = {
  index: { icon: House, label: "Home" },
  order: { icon: ShoppingBasket, label: "Order" },
  member: { icon: BadgeCheck, label: "Member" },
  profile: { icon: CircleUser, label: "Profile" },
};

/** The floating action button changes with the tab you are on. On Member and
 *  Profile it opens the quick menu instead of navigating. */
const fabActions: Record<string, { icon: LucideIcon; onPress?: () => void; opensMenu?: boolean }> = {
  index: { icon: Feather, onPress: () => router.push("/create-post") },
  order: { icon: ShoppingCart, onPress: () => router.push("/cart") },
  member: { icon: Menu, opensMenu: true },
  profile: { icon: Menu, opensMenu: true },
};

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const openShortcuts = useUiStore((s) => s.openShortcuts);
  const activeName = state.routes[state.index]?.name ?? "index";
  const fab = fabActions[activeName] ?? fabActions.index;
  const FabIcon = fab.icon;
  const onFabPress = fab.opensMenu ? openShortcuts : fab.onPress;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingBottom: insets.bottom + 10,
      }}
    >
      <View
        style={{
          flex: 1,
          height: BAR_HEIGHT,
          borderRadius: BAR_HEIGHT / 2,
          backgroundColor: "#FFFFFF",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 6,
          ...(shadow.lg as object),
        }}
      >
        {state.routes.map((route, i) => {
          const tab = tabs[route.name];
          if (!tab) return null;

          const focused = state.index === i;
          const Icon = tab.icon;
          const tint = focused ? brand[700] : ink[400];

          return (
            <PressableScale
              key={route.key}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
              }}
              style={{
                flex: 1,
                height: BAR_HEIGHT - 10,
                borderRadius: (BAR_HEIGHT - 10) / 2,
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                backgroundColor: focused ? brand[50] : "transparent",
              }}
            >
              <Icon size={19} color={tint} strokeWidth={focused ? 2.3 : 1.9} />
              <AppText variant="micro" color={tint}>
                {tab.label}
              </AppText>
            </PressableScale>
          );
        })}
      </View>

      <PressableScale
        onPress={onFabPress}
        style={{
          width: FAB_SIZE,
          height: FAB_SIZE,
          borderRadius: FAB_SIZE / 2,
          overflow: "hidden",
          ...(shadow.brand as object),
        }}
      >
        <LinearGradient
          colors={[brand[600], brand[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <FabIcon size={23} color="#FFFFFF" strokeWidth={2} />
        </LinearGradient>
      </PressableScale>
    </View>
  );
}
