import React from "react";
import { View } from "react-native";
import { AppText } from "./AppText";
import { brand, success, warning, danger, gold, ink } from "../../theme/colors";

type Tone = "brand" | "success" | "warning" | "danger" | "gold" | "neutral";

const toneMap: Record<Tone, { bg: string; fg: string }> = {
  brand: { bg: brand[50], fg: brand[700] },
  success: { bg: success[50], fg: success[600] },
  warning: { bg: warning[50], fg: warning[600] },
  danger: { bg: danger[50], fg: danger[600] },
  gold: { bg: gold[100], fg: gold[700] },
  neutral: { bg: ink[100], fg: ink[600] },
};

interface BadgeProps {
  label: string;
  tone?: Tone;
  icon?: React.ReactNode;
}

export function Badge({ label, tone = "brand", icon }: BadgeProps) {
  const t = toneMap[tone];
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: t.bg,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        alignSelf: "flex-start",
      }}
    >
      {icon}
      <AppText variant="captionMedium" color={t.fg}>
        {label}
      </AppText>
    </View>
  );
}
