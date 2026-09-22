import React from "react";
import { ActivityIndicator, Pressable, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AppText } from "./AppText";
import { brand, ink } from "../../theme/colors";
import { shadow } from "../../theme/shadows";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "dark" | "light" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const sizeMap: Record<Size, { height: number; paddingX: number; textVariant: "title" | "body" | "titleLg" }> = {
  sm: { height: 38, paddingX: 14, textVariant: "body" },
  md: { height: 48, paddingX: 20, textVariant: "title" },
  lg: { height: 56, paddingX: 24, textVariant: "titleLg" },
};

function variantStyle(variant: Variant, disabled?: boolean) {
  if (disabled) {
    return { bg: ink[100], textColor: ink[400], borderColor: "transparent", shadow: shadow.none };
  }
  switch (variant) {
    case "primary":
      return { bg: brand[600], textColor: "#FFFFFF", borderColor: "transparent", shadow: shadow.brand };
    case "secondary":
      return { bg: brand[50], textColor: brand[700], borderColor: "transparent", shadow: shadow.none };
    case "outline":
      return { bg: "transparent", textColor: brand[700], borderColor: brand[200], shadow: shadow.none };
    case "ghost":
      return { bg: "transparent", textColor: brand[700], borderColor: "transparent", shadow: shadow.none };
    case "dark":
      return { bg: ink[900], textColor: "#FFFFFF", borderColor: "transparent", shadow: shadow.md };
    case "light":
      return { bg: "#FFFFFF", textColor: brand[700], borderColor: "transparent", shadow: shadow.md };
    case "danger":
      return { bg: "#E11D48", textColor: "#FFFFFF", borderColor: "transparent", shadow: shadow.sm };
  }
}

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  fullWidth,
  icon,
  iconRight,
  style,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const v = variantStyle(variant, disabled);
  const s = sizeMap[size];

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      disabled={disabled || loading}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 18, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 260 });
      }}
      onPress={onPress}
      style={[
        animStyle,
        {
          height: s.height,
          paddingHorizontal: s.paddingX,
          backgroundColor: v.bg,
          borderRadius: 999,
          borderWidth: v.borderColor === "transparent" ? 0 : 1.5,
          borderColor: v.borderColor,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
          width: fullWidth ? "100%" : undefined,
          ...(v.shadow as object),
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.textColor} />
      ) : (
        <>
          {icon}
          <AppText variant={s.textVariant} color={v.textColor}>
            {label}
          </AppText>
          {iconRight}
        </>
      )}
    </AnimatedPressable>
  );
}
