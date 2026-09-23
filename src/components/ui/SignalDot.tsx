import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { danger } from "../../theme/colors";

/**
 * Unread marker that pings.
 *
 * A static dot is easy to walk past; a ring that expands out of it and fades
 * catches the eye the way a radar sweep does, without ever moving the button
 * it sits on. Rendered only when there is something to read — an idle pulse
 * with nothing behind it trains people to ignore it.
 */
export function SignalDot({ size = 9, ringSize = 22 }: { size?: number; ringSize?: number }) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withDelay(
      400,
      withRepeat(
        withTiming(1, { duration: 1700, easing: Easing.out(Easing.quad) }),
        -1,
        false
      )
    );
  }, [pulse]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: (1 - pulse.value) * 0.55,
    transform: [{ scale: 0.35 + pulse.value * 0.65 }],
  }));

  return (
    <View
      style={{
        position: "absolute",
        top: -ringSize / 2 + size / 2 + 4,
        right: -ringSize / 2 + size / 2 + 4,
        width: ringSize,
        height: ringSize,
        alignItems: "center",
        justifyContent: "center",
      }}
      pointerEvents="none"
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            backgroundColor: danger[500],
          },
          ringStyle,
        ]}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: danger[500],
          borderWidth: 1.6,
          borderColor: "#FFFFFF",
        }}
      />
    </View>
  );
}
