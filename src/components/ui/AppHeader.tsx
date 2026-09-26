import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppIcon } from "./AppIcon";
import { Glyph } from "../icons/Glyph";
import { PressableScale } from "./PressableScale";
import { UiText } from "./Text";
import { brand } from "../../theme/colors";
import { fontFamilies } from "../../theme/typography";
import { HIT_SIZE, radius, space } from "../../theme/scale";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
  /** Screens opened as a sheet use a close cross instead of a back chevron. */
  leftIcon?: "back" | "close";
  /**
   * "account" is the bar of the screens under Akun Saya: the pale blue
   * the profile's own bar fades into on scroll, square-cornered, a bold
   * near-black title and a solid arrow — so opening a page from the
   * profile keeps the same bar in place and only the title changes.
   */
  tone?: "default" | "account";
  /**
   * Account bar only: the page has scrolled. The bar turns warm yellow
   * and gains a hairline, so it stands apart from the content under it.
   */
  divider?: boolean;
  children?: React.ReactNode;
}

/**
 * Colour of the account bar; the profile tab fades into the same one. A
 * pale brand blue, a step deeper than the sky of the account scene, so the
 * bar reads as its own band over the scene yet belongs to it.
 */
export const ACCOUNT_BAR = "#D9E5FF";
/**
 * What every top bar turns to once its page scrolls: a soft yellow, the
 * way the reference's bar reads while you move down a page.
 */
export const ACCOUNT_BAR_SCROLLED = "#FFEE80";
const ACCOUNT_INK = "#202020";

/**
 * White bar with rounded bottom corners, used on every inner screen.
 *
 * The back control is a full touch target rather than a bare glyph, and the
 * bar is tall enough for the rebuilt type scale to sit comfortably.
 */
export function AppHeader({
  title,
  showBack = true,
  onBack,
  right,
  leftIcon = "back",
  tone = "default",
  divider = false,
  children,
}: AppHeaderProps) {
  const scrolled = useSharedValue(divider ? 1 : 0);
  useEffect(() => {
    scrolled.value = withTiming(divider ? 1 : 0, { duration: 220 });
  }, [divider, scrolled]);
  const barStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrolled.value,
      [0, 1],
      [ACCOUNT_BAR, ACCOUNT_BAR_SCROLLED],
    ),
    borderBottomColor: interpolateColor(
      scrolled.value,
      [0, 1],
      [ACCOUNT_BAR, "rgba(0,0,0,0.06)"],
    ),
  }));

  if (tone === "account") {
    return (
      <Animated.View style={[{ borderBottomWidth: 1, zIndex: 2 }, barStyle]}>
        <SafeAreaView edges={["top"]}>
          {/* Same geometry as the profile's bar: 56.5 tall, the title's
              centre 32 below the status bar. */}
          <View
            style={{
              height: 56.5,
              paddingTop: 7.5,
              paddingBottom: 0,
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 3.3,
              paddingRight: space.md,
            }}
          >
            {showBack ? (
              <PressableScale
                onPress={onBack ?? (() => router.back())}
                rippleBorderless
                // The arrow's ink starts 16 in and the title at 42, as
                // measured on the reference bar.
                style={{
                  width: 40,
                  height: HIT_SIZE,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Glyph
                  name={leftIcon === "close" ? "close" : "arrowRight"}
                  rotate={leftIcon === "close" ? 0 : 180}
                  size={22}
                  color={ACCOUNT_INK}
                />
              </PressableScale>
            ) : (
              <View style={{ width: space.lg }} />
            )}
            {title ? (
              <UiText
                token="titleLg"
                color={ACCOUNT_INK}
                numberOfLines={1}
                style={{
                  flex: 1,
                  marginLeft: showBack ? -1.3 : 0,
                  fontFamily: fontFamilies.bold,
                }}
              >
                {title}
              </UiText>
            ) : (
              <View style={{ flex: 1 }} />
            )}
            {right}
          </View>
          {children}
        </SafeAreaView>
      </Animated.View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderBottomLeftRadius: radius.xl,
        borderBottomRightRadius: radius.xl,
      }}
    >
      <SafeAreaView edges={["top"]}>
        <View
          style={{
            height: 60,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: space.sm,
            gap: space.xs,
          }}
        >
          {showBack ? (
            <PressableScale
              onPress={onBack ?? (() => router.back())}
              rippleBorderless
              style={{
                width: HIT_SIZE,
                height: HIT_SIZE,
                borderRadius: HIT_SIZE / 2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppIcon
                name={leftIcon === "close" ? "close" : "chevronRight"}
                rotate={leftIcon === "close" ? 0 : 180}
                size={leftIcon === "close" ? 23 : 26}
                color={brand[800]}
              />
            </PressableScale>
          ) : (
            <View style={{ width: space.sm }} />
          )}

          {title ? (
            <UiText
              token="h3"
              color={brand[900]}
              numberOfLines={1}
              style={{ flex: 1 }}
            >
              {title}
            </UiText>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          {right}
          <View style={{ width: space.sm }} />
        </View>
        {children}
      </SafeAreaView>
    </View>
  );
}
