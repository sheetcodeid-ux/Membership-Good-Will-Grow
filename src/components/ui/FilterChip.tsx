import React from "react";
import { PressableScale } from "./PressableScale";
import { AppText } from "./AppText";
import { brand, ink } from "../../theme/colors";

/** Outlined pill, as used by the notification categories. */
export function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      style={{
        height: 34,
        paddingHorizontal: 17,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: active ? brand[700] : ink[200],
        backgroundColor: "#FFFFFF",
      }}
    >
      <AppText
        color={active ? brand[700] : ink[500]}
        style={{
          fontSize: 13,
          lineHeight: 18,
          fontFamily: active ? "Urbanist_600SemiBold" : "Urbanist_500Medium",
        }}
      >
        {label}
      </AppText>
    </PressableScale>
  );
}
