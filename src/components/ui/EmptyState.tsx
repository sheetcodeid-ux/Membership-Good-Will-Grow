import React from "react";
import { View, type ViewStyle } from "react-native";
import { UiText } from "./Text";
import { ink } from "../../theme/colors";
import { space } from "../../theme/scale";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export function EmptyState({ icon, title, subtitle, style }: EmptyStateProps) {
  return (
    <View
      style={[
        { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: space.xxxl, gap: space.sm },
        style,
      ]}
    >
      {icon}
      <UiText token="h3" color={ink[700]} center style={{ marginTop: space.lg }}>
        {title}
      </UiText>
      {subtitle ? (
        <UiText token="body" color={ink[400]} center>
          {subtitle}
        </UiText>
      ) : null}
    </View>
  );
}
