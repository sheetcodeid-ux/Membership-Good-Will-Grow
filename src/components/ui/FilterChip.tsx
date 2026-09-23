import React from "react";
import { PressableScale } from "./PressableScale";
import { UiText } from "./Text";
import { brand, ink } from "../../theme/colors";
import { radius, space } from "../../theme/scale";

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
        height: 40,
        paddingHorizontal: space.lg,
        borderRadius: radius.pill,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: active ? brand[900] : ink[200],
        backgroundColor: active ? brand[900] : "#FFFFFF",
      }}
    >
      <UiText
        token={active ? "captionMedium" : "caption"}
        color={active ? "#FFFFFF" : ink[600]}
        style={active ? { fontFamily: "Urbanist_600SemiBold" } : undefined}
      >
        {label}
      </UiText>
    </PressableScale>
  );
}
