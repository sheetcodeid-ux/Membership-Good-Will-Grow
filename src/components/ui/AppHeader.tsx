import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppIcon } from "./AppIcon";
import { PressableScale } from "./PressableScale";
import { UiText } from "./Text";
import { brand } from "../../theme/colors";
import { HIT_SIZE, radius, space } from "../../theme/scale";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
  /** Screens opened as a sheet use a close cross instead of a back chevron. */
  leftIcon?: "back" | "close";
  children?: React.ReactNode;
}

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
  children,
}: AppHeaderProps) {
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
            <UiText token="h3" color={brand[900]} numberOfLines={1} style={{ flex: 1 }}>
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
