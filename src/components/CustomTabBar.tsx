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
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { AppIcon, type AppIconName } from "./ui/AppIcon";
import { LiquidGlass, LiquidGlassGroup, liquidGlassAvailable } from "./ui/LiquidGlass";
import { brand, ink } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { radius, space, TAB_BAR_HEIGHT } from "../theme/scale";
import { useResponsive } from "../theme/responsive";
import { useUiStore } from "../store/uiStore";

/** Sized so every tab clears the 48pt minimum touch target. */
const FAB_SIZE = 60;

const tabs: Record<string, { icon: AppIconName; label: string }> = {
  index: { icon: "home", label: "Home" },
  order: { icon: "order", label: "Order" },
  member: { icon: "member", label: "Member" },
  profile: { icon: "profile", label: "Profile" },
};

/** The floating action button changes with the tab you are on. */
const fabActions: Record<
  string,
  { icon: AppIconName; onPress?: () => void; opensMenu?: boolean }
> = {
  index: { icon: "compose", onPress: () => router.push("/create-post") },
  order: { icon: "cart", onPress: () => router.push("/cart") },
  member: { icon: "menu", opensMenu: true },
  profile: { icon: "menu", opensMenu: true },
};

/**
 * One tab.
 *
 * The selected state is carried by a filled pill that grows into place, and
 * the icon lifts a couple of points as it takes over — enough to read as a
 * change of place without the bar jumping around. The whole cell is the
 * target, so there is no small icon to aim at.
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
  progress.value = withSpring(focused ? 1 : 0, { damping: 17, stiffness: 210 });

  const pillStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["rgba(255,255,255,0)", "rgba(255,255,255,0.42)"]
    ),
    transform: [{ scale: 0.94 + progress.value * 0.06 }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -progress.value * 1.5 }],
  }));

  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.94}
      rippleBorderless
      style={{ flex: 1, height: TAB_BAR_HEIGHT - space.md }}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            borderRadius: radius.pill,
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          },
          pillStyle,
        ]}
      >
        <Animated.View style={iconStyle}>
          <AppIcon
            name={tab.icon}
            size={22}
            color={focused ? brand[800] : ink[500]}
            emphasis={focused}
          />
        </Animated.View>
        <UiText
          token="label"
          color={focused ? brand[800] : ink[500]}
          style={{ fontSize: 11, lineHeight: 13 }}
        >
          {tab.label}
        </UiText>
      </Animated.View>
    </PressableScale>
  );
}

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const openShortcuts = useUiStore((s) => s.openShortcuts);
  const activeName = state.routes[state.index]?.name ?? "index";
  const fab = fabActions[activeName] ?? fabActions.index;
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
        // Stays with the content column instead of stretching across a
        // tablet, where a bar the full width puts the tabs further apart
        // than a thumb can reach.
        width: r.contentWidth + FAB_SIZE + space.xl,
        maxWidth: "100%",
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: space.sm,
        paddingHorizontal: space.md,
        paddingBottom: insets.bottom + space.md,
      }}
    >
      <LiquidGlass
        radius={TAB_BAR_HEIGHT / 2}
        interactive
        style={{
          flex: 1,
          height: TAB_BAR_HEIGHT,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: space.xs + 2,
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
          fabSpin.value = withTiming(90, { duration: 150 });
          fabSpin.value = withSpring(0, { damping: 11, stiffness: 200 });
          onFabPress?.();
        }}
        scaleTo={0.92}
        style={{
          width: FAB_SIZE,
          height: FAB_SIZE,
          borderRadius: FAB_SIZE / 2,
          overflow: "hidden",
          ...(shadow.brand as object),
        }}
      >
        {liquidGlassAvailable ? (
          <LiquidGlass
            radius={FAB_SIZE / 2}
            interactive
            tint="rgba(11,43,115,0.55)"
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Animated.View style={fabStyle}>
              <AppIcon name={fab.icon} size={30} color="#FFFFFF" emphasis />
            </Animated.View>
          </LiquidGlass>
        ) : (
          <LinearGradient
            colors={[brand[500], brand[900]]}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Animated.View style={fabStyle}>
              <AppIcon name={fab.icon} size={30} color="#FFFFFF" emphasis />
            </Animated.View>
          </LinearGradient>
        )}
      </PressableScale>
    </LiquidGlassGroup>
  );
}
