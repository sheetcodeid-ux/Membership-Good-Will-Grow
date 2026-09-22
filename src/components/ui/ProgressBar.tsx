import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { brand, ink } from "../../theme/colors";

interface ProgressBarProps {
  progress: number; // 0..1
  color?: string;
  trackColor?: string;
  height?: number;
}

export function ProgressBar({
  progress,
  color = brand[600],
  trackColor = ink[100],
  height = 8,
}: ProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.max(0, Math.min(1, progress)) * 100, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, width]);

  const style = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View
      style={{
        height,
        borderRadius: height,
        backgroundColor: trackColor,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={[{ height, borderRadius: height, backgroundColor: color }, style]}
      />
    </View>
  );
}
