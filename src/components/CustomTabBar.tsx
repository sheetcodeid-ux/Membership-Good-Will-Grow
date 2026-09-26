import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Defs,
  LinearGradient as SvgGradient,
  Path,
  Stop,
} from "react-native-svg";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { PressableScale } from "./ui/PressableScale";
import { glyphPaths, type GlyphName } from "./icons/glyphPaths";
import {
  GlassRim,
  LiquidGlass,
  LiquidGlassGroup,
  liquidGlassAvailable,
} from "./ui/LiquidGlass";
import { brand, iconGrey } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { shadow } from "../theme/shadows";
import { space, TAB_BAR_HEIGHT } from "../theme/scale";
import { useResponsive } from "../theme/responsive";
import { useUiStore } from "../store/uiStore";
import { useBlurTargetStore } from "../store/blurTargetStore";

/** Sized so every tab clears the 48pt minimum touch target. */
const FAB_SIZE = 60;
const ICON = 24;
/** Inset of the bar's contents, and of the droplet inside its tab. */
const BAR_PAD = 5;
const DROP_INSET = 4;
/** Never narrower than the longest label plus a margin each side. */
const DROP_MIN_W = 60;

const tabs: Record<string, { glyph: GlyphName; label: string }> = {
  index: { glyph: "tabHome", label: "Home" },
  order: { glyph: "tabOrder", label: "Order" },
  member: { glyph: "tabMember", label: "Member" },
  profile: { glyph: "tabProfile", label: "Profile" },
};

/** The floating action button changes with the tab you are on. */
const fabActions: Record<
  string,
  { glyph: GlyphName; onPress?: () => void; opensMenu?: boolean }
> = {
  index: { glyph: "compose", onPress: () => router.push("/create-post") },
  order: { glyph: "cart", onPress: () => router.push("/cart") },
  member: { glyph: "tabMenu", opensMenu: true },
  profile: { glyph: "tabMenu", opensMenu: true },
};

/**
 * A tab glyph in its two states, cross-faded: flat grey at rest, and when
 * selected a brand gradient lit from the top — the one spot of colour in
 * the bar, as the reference keeps its green for the current tab alone.
 */
function TabGlyph({
  name,
  progress,
}: {
  name: GlyphName;
  progress: SharedValue<number>;
}) {
  const id = `tabGrad-${name}`;
  const on = useAnimatedStyle(() => ({ opacity: progress.value }));
  const off = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));
  return (
    <View style={{ width: ICON, height: ICON }}>
      <Animated.View style={[StyleSheet.absoluteFill, off]}>
        <Svg width={ICON} height={ICON} viewBox="0 0 24 24">
          <Path d={glyphPaths[name]} fill={iconGrey} fillRule="evenodd" />
        </Svg>
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, on]}>
        <Svg width={ICON} height={ICON} viewBox="0 0 24 24">
          <Defs>
            <SvgGradient id={id} x1="0.2" y1="0" x2="0.8" y2="1">
              <Stop offset="0" stopColor="#5C82E6" />
              <Stop offset="0.55" stopColor={brand[600]} />
              <Stop offset="1" stopColor={brand[900]} />
            </SvgGradient>
          </Defs>
          <Path d={glyphPaths[name]} fill={`url(#${id})`} fillRule="evenodd" />
        </Svg>
      </Animated.View>
    </View>
  );
}

/**
 * One tab. The whole cell is the target; the icon lifts a little and the
 * label firms up as it becomes current. The selection itself is the
 * droplet the bar slides underneath, not something each tab draws.
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
  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, { duration: 220 });
  }, [focused, progress]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -progress.value * 1 },
      { scale: 1 + progress.value * 0.06 },
    ],
  }));
  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ["#5E6371", brand[800]]),
  }));

  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.9}
      rippleBorderless
      style={{
        flex: 1,
        height: TAB_BAR_HEIGHT - BAR_PAD * 2,
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Animated.View style={iconStyle}>
        <TabGlyph name={tab.glyph} progress={progress} />
      </Animated.View>
      <Animated.Text
        style={[
          {
            fontSize: 11,
            lineHeight: 13,
            fontFamily: focused ? fontFamilies.bold : fontFamilies.medium,
          },
          { textAlign: "center" },
          labelStyle,
        ]}
      >
        {tab.label}
      </Animated.Text>
    </PressableScale>
  );
}

/**
 * The selection: a lens of lighter glass that slides from tab to tab. On
 * the way it stretches along its path and thins a touch, then settles
 * with a little wobble — the way a drop of liquid moves, and the way the
 * current iOS tab bar carries its selection.
 */
function Droplet({ index, tabW }: { index: number; tabW: number }) {
  const pos = useSharedValue(index);
  const stretch = useSharedValue(0);
  useEffect(() => {
    pos.value = withSpring(index, { damping: 21, stiffness: 190, mass: 0.9 });
    stretch.value = withSequence(
      withTiming(1, { duration: 140 }),
      withSpring(0, { damping: 9, stiffness: 160 }),
    );
  }, [index, pos, stretch]);

  // On a narrow phone a tab is barely wider than "Member", so the droplet
  // may spill a little past its tab rather than cut through the label.
  const w = Math.max(tabW - DROP_INSET * 2, DROP_MIN_W);
  const h = TAB_BAR_HEIGHT - BAR_PAD * 2 - DROP_INSET * 2 + 4;
  const x = useDerivedValue(() => BAR_PAD + pos.value * tabW + (tabW - w) / 2);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { scaleX: 1 + stretch.value * 0.22 },
      { scaleY: 1 - stretch.value * 0.08 },
    ],
  }));

  if (tabW <= 0) return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          left: 0,
          top: BAR_PAD + DROP_INSET - 2,
          width: w,
          height: h,
          borderRadius: h / 2,
          overflow: "hidden",
          backgroundColor: "rgba(64,102,194,0.12)",
        },
        style,
      ]}
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.55)", "rgba(255,255,255,0.08)"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <GlassRim radius={h / 2} strength={0.9} />
    </Animated.View>
  );
}

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const openShortcuts = useUiStore((s) => s.openShortcuts);
  const activeName = state.routes[state.index]?.name ?? "index";
  const fab = fabActions[activeName] ?? fabActions.index;
  const onFabPress = fab.opensMenu ? openShortcuts : fab.onPress;
  const [barW, setBarW] = useState(0);
  const blurTarget = useBlurTargetStore(
    (s) => s.targets[state.routes[state.index]?.key ?? ""],
  );

  const tabRoutes = state.routes.filter((route) => tabs[route.name]);
  const activeTab = tabRoutes.findIndex(
    (route) => route.key === state.routes[state.index]?.key,
  );
  const tabW = barW > 0 ? (barW - BAR_PAD * 2) / tabRoutes.length : 0;

  const fabSpin = useSharedValue(0);
  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${fabSpin.value}deg` }],
  }));

  const fabGlyph = (
    <Animated.View style={fabStyle}>
      <Svg width={28} height={28} viewBox="0 0 24 24">
        <Path d={glyphPaths[fab.glyph]} fill="#FFFFFF" fillRule="evenodd" />
      </Svg>
    </Animated.View>
  );

  return (
    <>
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
          blurTarget={blurTarget}
          intensity={100}
          frost={0.84}
          style={{
            flex: 1,
            height: TAB_BAR_HEIGHT,
            ...(shadow.lg as object),
          }}
        >
          <View
            onLayout={(e) => setBarW(e.nativeEvent.layout.width)}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: BAR_PAD,
            }}
          >
            {activeTab >= 0 ? <Droplet index={activeTab} tabW={tabW} /> : null}
            {tabRoutes.map((route) => {
              const focused = route.key === state.routes[state.index]?.key;
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
                    if (!focused && !event.defaultPrevented)
                      navigation.navigate(route.name);
                  }}
                />
              );
            })}
          </View>
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
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {fabGlyph}
            </LiquidGlass>
          ) : (
            <LinearGradient
              colors={["#5C82E6", brand[600], brand[900]]}
              locations={[0, 0.5, 1]}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.85, y: 1 }}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* glass cap: a soft sheen over the top half and the same
                specular rim as the bar, so the button reads as a bead of
                tinted glass beside it */}
              <LinearGradient
                colors={["rgba(255,255,255,0.32)", "rgba(255,255,255,0)"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.6 }}
                style={StyleSheet.absoluteFill}
              />
              <GlassRim radius={FAB_SIZE / 2} strength={0.8} />
              {fabGlyph}
            </LinearGradient>
          )}
        </PressableScale>
      </LiquidGlassGroup>
    </>
  );
}
