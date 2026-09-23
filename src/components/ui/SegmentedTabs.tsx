import React, { useCallback, useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { PressableScale } from "./PressableScale";
import { UiText } from "./Text";
import { brand, ink } from "../../theme/colors";
import { HIT_SIZE, space } from "../../theme/scale";

interface SegmentedTabsProps {
  tabs: { key: string; label: string; count?: number }[];
  value: string;
  onChange: (key: string) => void;
}

/**
 * Underlined tabs.
 *
 * The rule is a single view that slides between tabs rather than one per tab
 * being switched on and off, so the selection travels and the eye can follow
 * it. Each tab is a full touch target tall, and counts sit under the label
 * rather than inside it — a label that changes width as its number grows
 * makes the whole row shift.
 */
export function SegmentedTabs({ tabs, value, onChange }: SegmentedTabsProps) {
  const [width, setWidth] = useState(0);
  const index = Math.max(0, tabs.findIndex((t) => t.key === value));
  const segment = width / Math.max(1, tabs.length);
  const x = useSharedValue(0);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width),
    []
  );

  x.value = withSpring(index * segment, { damping: 20, stiffness: 200, mass: 0.7 });

  const ruleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
    width: Math.max(0, segment - space.xxl),
  }));

  return (
    <View onLayout={onLayout}>
      <View style={{ flexDirection: "row" }}>
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            tab={tab}
            active={tab.key === value}
            onPress={() => onChange(tab.key)}
          />
        ))}
      </View>

      <View style={{ height: 3, backgroundColor: ink[100] }}>
        {segment > 0 ? (
          <Animated.View
            style={[
              {
                height: 3,
                borderRadius: 2,
                marginLeft: space.md,
                backgroundColor: brand[800],
              },
              ruleStyle,
            ]}
          />
        ) : null}
      </View>
    </View>
  );
}

function Tab({
  tab,
  active,
  onPress,
}: {
  tab: { key: string; label: string; count?: number };
  active: boolean;
  onPress: () => void;
}) {
  const progress = useSharedValue(active ? 1 : 0);
  progress.value = withTiming(active ? 1 : 0, { duration: 180 });

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [ink[400], brand[800]]),
  }));

  return (
    <PressableScale
      scaleTo={1}
      rippleColor={null}
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        minHeight: HIT_SIZE,
        gap: 1,
      }}
    >
      <Animated.Text
        numberOfLines={1}
        style={[
          {
            fontSize: 14,
            lineHeight: 19,
            fontFamily: active ? "Urbanist_700Bold" : "Urbanist_500Medium",
          },
          labelStyle,
        ]}
      >
        {tab.label}
      </Animated.Text>
      {tab.count !== undefined ? (
        <UiText token="caption" color={active ? brand[600] : ink[400]} style={{ fontSize: 12 }}>
          {tab.count}
        </UiText>
      ) : null}
    </PressableScale>
  );
}
