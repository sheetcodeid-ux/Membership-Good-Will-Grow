import React from "react";
import { Pressable, type PressableProps, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { platform } from "../../theme/responsive";
import { brand } from "../../theme/colors";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends PressableProps {
  scaleTo?: number;
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  /** Android ripple colour; pass null to suppress the ripple entirely. */
  rippleColor?: string | null;
  /** Ripple drawn inside the view's bounds rather than overflowing it. */
  rippleBorderless?: boolean;
}

/**
 * Press feedback that answers immediately.
 *
 * The press-down uses a short linear ramp rather than a spring: a spring has
 * to accelerate before it moves, which reads as lag on a tap even though the
 * handler already fired. The release keeps the spring, where the overshoot
 * feels alive instead of slow. Android also gets its native ripple, since
 * that is the feedback the platform's users are looking for.
 *
 * `pressRetentionOffset` keeps the press alive when a finger drifts, so a tap
 * during a scroll does not silently do nothing.
 */
export function PressableScale({
  scaleTo = 0.97,
  style,
  onPressIn,
  onPressOut,
  children,
  rippleColor,
  rippleBorderless = false,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const ripple =
    platform.usesRipple && rippleColor !== null
      ? { color: rippleColor ?? brand[100], borderless: rippleBorderless, foreground: true }
      : undefined;

  return (
    <AnimatedPressable
      android_ripple={ripple}
      pressRetentionOffset={{ top: 12, bottom: 12, left: 12, right: 12 }}
      onPressIn={(e) => {
        scale.value = withTiming(scaleTo, { duration: 70 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: 13, stiffness: 320, mass: 0.5 });
        onPressOut?.(e);
      }}
      style={[animStyle, style]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
