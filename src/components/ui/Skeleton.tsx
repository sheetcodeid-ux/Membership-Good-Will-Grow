import React, { useEffect } from "react";
import { View, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { ink } from "../../theme/colors";
import { radius, space } from "../../theme/scale";

/**
 * Loading placeholder that breathes rather than sits still.
 *
 * A blank screen while content loads reads as a broken app; a shape that
 * pulses reads as one that is working. Opacity is animated rather than a
 * sliding highlight because it costs one node instead of a mask plus a
 * gradient, and at this size the difference is not visible.
 */
export function Skeleton({
  width,
  height,
  rounded = radius.sm,
  style,
}: {
  width?: number | `${number}%`;
  height: number;
  rounded?: number;
  style?: ViewStyle;
}) {
  const pulse = useSharedValue(0.55);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 820, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [pulse]);

  const animated = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: rounded, backgroundColor: ink[200] },
        animated,
        style,
      ]}
    />
  );
}

/** One placeholder post, laid out to the same rhythm as the real card. */
export function PostCardSkeleton({ gutter }: { gutter: number }) {
  return (
    <View
      style={{
        marginHorizontal: gutter,
        backgroundColor: "#FFFFFF",
        borderRadius: radius.xl,
        padding: space.lg,
        gap: space.md,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
        <Skeleton width={42} height={42} rounded={21} />
        <View style={{ gap: 6 }}>
          <Skeleton width={128} height={13} />
          <Skeleton width={72} height={11} />
        </View>
      </View>
      <Skeleton width="92%" height={13} />
      <Skeleton width="64%" height={13} />
      <Skeleton width="100%" height={200} rounded={radius.lg} />
      <View style={{ flexDirection: "row", gap: space.xl }}>
        <Skeleton width={54} height={16} />
        <Skeleton width={54} height={16} />
      </View>
    </View>
  );
}
