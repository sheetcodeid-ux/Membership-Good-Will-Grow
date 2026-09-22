import React from "react";
import { View, type ViewStyle } from "react-native";
import { AppText } from "./AppText";
import { ink } from "../../theme/colors";

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
        { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 6 },
        style,
      ]}
    >
      {icon}
      <AppText
        center
        color={ink[600]}
        style={{ marginTop: 14, fontSize: 17, lineHeight: 24, fontFamily: "Urbanist_600SemiBold" }}
      >
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="body" color={ink[400]} center>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}
