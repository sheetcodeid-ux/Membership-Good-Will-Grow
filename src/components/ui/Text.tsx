import React from "react";
import { Text as RNText, type TextProps } from "react-native";
import { type, type TypeToken } from "../../theme/scale";
import { ink } from "../../theme/colors";

interface UiTextProps extends TextProps {
  token?: TypeToken;
  color?: string;
  center?: boolean;
}

/**
 * Text on the rebuilt scale. `AppText` still serves the screens that are on
 * the older measured scale, so the two can coexist while modules move over.
 */
export function UiText({
  token = "body",
  color = ink[900],
  center,
  style,
  ...rest
}: UiTextProps) {
  return (
    <RNText
      style={[type[token], { color }, center ? { textAlign: "center" } : null, style]}
      {...rest}
    />
  );
}
