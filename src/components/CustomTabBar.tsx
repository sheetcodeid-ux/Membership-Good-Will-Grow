import React from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
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
import { LiquidGlass, LiquidGlassGroup, liquidGlassAvailable } from "./ui/LiquidGlass";
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
/**
 * One tab. The selected pill grows and tints with a spring rather than
 * snapping, so moving between tabs reads as the highlight sliding across the
 * glass instead of blinking from one slot to the next.
 */
function TabButton({
  name,
  focused,
  onPress,
}: {
  name: string;
  focused: boolean;
  onPress: () => void;
}) {
  const tab = tabs[name];
  const progress = useSharedValue(focused ? 1 : 0);
  progress.value = withSpring(focused ? 1 : 0, { damping: 16, stiffness: 180 });
  const pillStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["rgba(255,255,255,0)", "rgba(255,255,255,0.68)"]
    ),
    transform: [{ scale: 0.96 + progress.value * 0.04 }],
  }));
  const Icon = tab.icon;
  const tint = focused ? brand[700] : ink[500];
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.93}
      style={{ flex: 1, height: BAR_HEIGHT - 10 }}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            borderRadius: (BAR_HEIGHT - 10) / 2,
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          },
          pillStyle,
        ]}
      >
        <Icon size={19} color={tint} strokeWidth={focused ? 2.3 : 1.9} />
        <AppText variant="micro" color={tint}>
          {tab.label}
        </AppText>
      </Animated.View>
    </PressableScale>
  );
}
export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const openShortcuts = useUiStore((s) => s.openShortcuts);
  const activeName = state.routes[state.index]?.name ?? "index";
  const fab = fabActions[activeName] ?? fabActions.index;
  const FabIcon = fab.icon;
  const onFabPress = fab.opensMenu ? openShortcuts : fab.onPress;
  const fabSpin = useSharedValue(0);
  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${fabSpin.value}deg` }],
  }));
  return (
    <LiquidGlassGroup
      spacing={18}
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
      <LiquidGlass
        radius={BAR_HEIGHT / 2}
        interactive
        style={{
          flex: 1,
          height: BAR_HEIGHT,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 6,
          ...(shadow.lg as object),
        }}
      >
        {state.routes.map((route, i) => {
          if (!tabs[route.name]) return null;
          const focused = state.index === i;
          return (
            <TabButton
              key={route.key}
              name={route.name}
              focused={focused}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
              }}
            />
          );
        })}
      </LiquidGlass>
      <PressableScale
        onPress={() => {
          // A quarter turn and back, so the button acknowledges the press.
          fabSpin.value = withTiming(90, { duration: 160 });
          fabSpin.value = withSpring(0, { damping: 11, stiffness: 190 });
          onFabPress?.();
        }}
        style={{
          width: FAB_SIZE,
          height: FAB_SIZE,
          borderRadius: FAB_SIZE / 2,
          overflow: "hidden",
          ...(shadow.brand as object),
        }}
      >
        {liquidGlassAvailable ? (
          // On iOS 26 the button is glass too, so it can merge with the bar.
          <LiquidGlass
            radius={FAB_SIZE / 2}
            interactive
            tint="rgba(11,43,115,0.55)"
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Animated.View style={fabStyle}>
              <FabIcon size={23} color="#FFFFFF" strokeWidth={2} />
            </Animated.View>
          </LiquidGlass>
        ) : (
          <LinearGradient
            colors={[brand[600], brand[900]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Animated.View style={fabStyle}>
              <FabIcon size={23} color="#FFFFFF" strokeWidth={2} />
            </Animated.View>
          </LinearGradient>
        )}
      </PressableScale>
    </LiquidGlassGroup>
  );
}
