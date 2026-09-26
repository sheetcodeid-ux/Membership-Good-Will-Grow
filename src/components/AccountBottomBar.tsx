import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { RULE } from "./AccountMenu";
import { brand, danger } from "../theme/colors";
import { fontFamilies } from "../theme/typography";

/**
 * The action bar at the foot of an account page: white, a hairline above,
 * one full-width pill. "danger" draws it outlined in red rather than
 * filled, so an irreversible action never looks like the default one.
 */
export function AccountBottomBar({
  label,
  onPress,
  tone = "primary",
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  tone?: "primary" | "danger";
  /** Dims the pill and ignores presses, e.g. while nothing has changed. */
  disabled?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const danger_ = tone === "danger";
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: RULE,
        paddingHorizontal: 13.5,
        paddingTop: 12,
        paddingBottom: Math.max(insets.bottom, 12),
      }}
    >
      <PressableScale
        onPress={onPress}
        disabled={disabled}
        scaleTo={0.98}
        style={{
          opacity: disabled ? 0.4 : 1,
          height: 48,
          borderRadius: 24,
          backgroundColor: danger_ ? "#FFFFFF" : brand[600],
          borderWidth: danger_ ? 1.5 : 0,
          borderColor: danger[500],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <UiText
          color={danger_ ? danger[500] : "#FFFFFF"}
          style={{
            fontSize: 16,
            lineHeight: 20,
            fontFamily: fontFamilies.bold,
          }}
        >
          {label}
        </UiText>
      </PressableScale>
    </View>
  );
}
