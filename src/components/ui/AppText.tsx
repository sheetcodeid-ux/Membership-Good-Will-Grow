import React from "react";
import { Text, type TextProps } from "react-native";
import { typography, type TextVariant } from "../../theme/typography";
import { ink } from "../../theme/colors";

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  center?: boolean;
  className?: string;
}

export function AppText({
  variant = "body",
  color = ink[900],
  center,
  style,
  className,
  ...rest
}: AppTextProps) {
  return (
    <Text
      className={className}
      style={[
        typography[variant],
        { color },
        center ? { textAlign: "center" } : null,
        style,
      ]}
      {...rest}
    />
  );
}
