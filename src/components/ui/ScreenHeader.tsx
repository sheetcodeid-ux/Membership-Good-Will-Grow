import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { PressableScale } from "./PressableScale";
import { AppText } from "./AppText";
import { AppIcon } from "./AppIcon";
import { ink } from "../../theme/colors";

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  right?: React.ReactNode;
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  showBack = true,
  right,
}: ScreenHeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 14,
        gap: 12,
      }}
    >
      {showBack ? (
        <PressableScale
          onPress={onBack ?? (() => router.back())}
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            backgroundColor: ink[50],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppIcon name="chevronRight" rotate={180} size={22} color={ink[900]} />
        </PressableScale>
      ) : null}
      <View style={{ flex: 1 }}>
        {title ? (
          <AppText variant="titleLg" numberOfLines={1}>
            {title}
          </AppText>
        ) : null}
        {subtitle ? (
          <AppText variant="caption" color={ink[500]} numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right}
    </View>
  );
}
