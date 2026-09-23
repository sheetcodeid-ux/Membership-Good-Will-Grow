import React, { useCallback, useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { AppIcon, type AppIconName } from "./ui/AppIcon";
import { brand, ink } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { radius, space } from "../theme/scale";

export interface FeedFilterOption {
  key: string;
  label: string;
  icon: AppIconName;
  count?: number;
}

/**
 * Feed filter.
 *
 * A platform segmented control was tried here and looked like a settings
 * row: flat, grey, and indistinguishable from the operating system's own
 * chrome. This carries the brand instead — a recessed track with a gradient
 * thumb that slides between segments on a spring, each segment holding its
 * icon, its label and its count.
 *
 * The thumb is one view that moves, not a background per segment, so the
 * selection travels rather than blinking from one slot to the next.
 */
export function FeedFilter({
  options,
  value,
  onChange,
}: {
  options: FeedFilterOption[];
  value: string;
  onChange: (key: string) => void;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const index = Math.max(0, options.findIndex((o) => o.key === value));
  const thumbX = useSharedValue(0);
  const pad = 4;
  const segment = trackWidth > 0 ? (trackWidth - pad * 2) / options.length : 0;

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width),
    []
  );

  thumbX.value = withSpring(index * segment, { damping: 19, stiffness: 190, mass: 0.7 });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
    width: segment,
  }));

  return (
    <View
      onLayout={onLayout}
      style={{
        height: 44,
        borderRadius: radius.md,
        backgroundColor: ink[100],
        padding: pad,
        flexDirection: "row",
        // A hairline inside the track reads as recessed rather than raised.
        borderWidth: 1,
        borderColor: ink[200],
      }}
    >
      {segment > 0 ? (
        <Animated.View
          style={[
            {
              position: "absolute",
              left: pad,
              top: pad,
              bottom: pad,
              borderRadius: radius.sm,
              overflow: "hidden",
              ...(shadow.sm as object),
            },
            thumbStyle,
          ]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={[brand[600], brand[900]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      ) : null}

      {options.map((option, i) => (
        <Segment
          key={option.key}
          option={option}
          selected={i === index}
          onPress={() => onChange(option.key)}
        />
      ))}
    </View>
  );
}

function Segment({
  option,
  selected,
  onPress,
}: {
  option: FeedFilterOption;
  selected: boolean;
  onPress: () => void;
}) {
  const progress = useSharedValue(selected ? 1 : 0);
  progress.value = withTiming(selected ? 1 : 0, { duration: 200 });

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [ink[500], "#FFFFFF"]),
  }));

  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.96}
      rippleColor={null}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: space.xs + 1,
      }}
    >
      <AppIcon
        name={option.icon}
        size={16}
        color={selected ? "#FFFFFF" : ink[500]}
        emphasis={selected}
      />
      <Animated.Text
        numberOfLines={1}
        style={[
          { fontSize: 12.5, lineHeight: 16, fontFamily: "Urbanist_600SemiBold" },
          labelStyle,
        ]}
      >
        {option.label}
      </Animated.Text>
      {option.count !== undefined ? (
        <View
          style={{
            minWidth: 18,
            paddingHorizontal: 4,
            height: 16,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: selected ? "rgba(255,255,255,0.24)" : ink[200],
          }}
        >
          <UiText
            token="caption"
            color={selected ? "#FFFFFF" : ink[600]}
            style={{ fontSize: 11, lineHeight: 14 }}
          >
            {option.count}
          </UiText>
        </View>
      ) : null}
    </PressableScale>
  );
}
