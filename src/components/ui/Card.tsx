import React from "react";
import { View, type ViewStyle } from "react-native";
import { PressableScale } from "./PressableScale";
import { shadow } from "../../theme/shadows";
import { ink } from "../../theme/colors";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  padded?: boolean;
  bordered?: boolean;
  elevation?: "xs" | "sm" | "md" | "lg" | "none";
}

export function Card({
  children,
  onPress,
  style,
  padded = true,
  bordered = false,
  elevation = "sm",
}: CardProps) {
  const base: ViewStyle = {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: padded ? 16 : 0,
    borderWidth: bordered ? 1 : 0,
    borderColor: ink[100],
    ...(shadow[elevation] as object),
  };

  if (onPress) {
    return (
      <PressableScale onPress={onPress} style={[base, style] as ViewStyle[]}>
        {children}
      </PressableScale>
    );
  }

  return <View style={[base, style]}>{children}</View>;
}
