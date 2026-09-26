import React, { useEffect } from "react";
import { View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { PressableScale } from "./ui/PressableScale";
import { AppText } from "./ui/AppText";
import { brand, ink, danger } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { tapSelect } from "../utils/haptics";

const GAP = 18;
const MAX_KEY = 96;
/** The keypad spans ~80% of the screen width, as in the reference. */
const GRID_RATIO = 0.8;

interface PinKeypadProps {
  length?: number;
  value: string;
  onChange: (next: string) => void;
}

/** One PIN dot: pops in as it fills, settles back as it empties. */
function Dot({ filled, error }: { filled: boolean; error?: boolean }) {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = filled
      ? withSequence(
          withTiming(1.28, { duration: 90 }),
          withSpring(1, { damping: 12, stiffness: 260 }),
        )
      : withTiming(1, { duration: 120 });
  }, [filled, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View
      style={[
        {
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: error ? danger[500] : filled ? brand[900] : ink[300],
        },
        style,
      ]}
    />
  );
}

/**
 * The row of PIN dots. Bump `shake` (any new number) to shake the row
 * sideways, the way a wrong PIN is refused.
 */
export function PinDots({
  length = 6,
  value,
  error,
  shake = 0,
}: {
  length?: number;
  value: string;
  error?: boolean;
  shake?: number;
}) {
  const x = useSharedValue(0);
  useEffect(() => {
    if (!shake) return;
    x.value = withSequence(
      withTiming(-10, { duration: 45 }),
      withRepeat(withTiming(10, { duration: 80 }), 3, true),
      withTiming(0, { duration: 45 }),
    );
  }, [shake, x]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  return (
    <Animated.View style={[{ flexDirection: "row", justifyContent: "center", gap: 14 }, style]}>
      {Array.from({ length }).map((_, i) => (
        <Dot key={i} filled={i < value.length} error={error} />
      ))}
    </Animated.View>
  );
}

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

/**
 * Flat navy backspace key with a white cross: a wide rounded body, a shallow
 * left tip, and every corner curved.
 */
const BACKSPACE_BODY =
  "M0.93 8.46 L4.66 2.23 Q6 0 8.6 0 L22.8 0 Q26 0 26 3.2 L26 16.8 Q26 20 22.8 20 " +
  "L8.6 20 Q6 20 4.66 17.77 L0.93 11.54 Q0 10 0.93 8.46 Z";

function BackspaceIcon({ width = 46 }: { width?: number }) {
  return (
    <Svg width={width} height={(width * 20) / 26} viewBox="0 0 26 20">
      <Path d={BACKSPACE_BODY} fill={brand[900]} />
      <Path
        d="M11 5 21 15M21 5 11 15"
        stroke="#FFFFFF"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function PinKeypad({ length = 6, value, onChange }: PinKeypadProps) {
  const { width } = useWindowDimensions();
  const key = Math.min(MAX_KEY, (Math.min(width, 520) * GRID_RATIO - GAP * 2) / 3);

  const press = (k: string) => {
    if (k === "") return;
    tapSelect();
    if (k === "del") {
      onChange(value.slice(0, -1));
      return;
    }
    if (value.length < length) onChange(value + k);
  };

  return (
    <View
      style={{
        width: key * 3 + GAP * 2,
        alignSelf: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: GAP,
      }}
    >
      {keys.map((k, i) => {
        if (k === "") {
          return <View key={`spacer-${i}`} style={{ width: key, height: key }} />;
        }

        if (k === "del") {
          return (
            <PressableScale
              key="del"
              onPress={() => press(k)}
              style={{ width: key, height: key, alignItems: "center", justifyContent: "center" }}
            >
              <BackspaceIcon width={Math.round(key * 0.43)} />
            </PressableScale>
          );
        }

        return (
          <PressableScale
            key={k}
            onPress={() => press(k)}
            style={{
              width: key,
              height: key,
              borderRadius: 22,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              ...(shadow.sm as object),
            }}
          >
            <AppText
              color={ink[950]}
              style={{
                fontSize: Math.round(key * 0.36),
                lineHeight: Math.round(key * 0.46),
                fontFamily: "Urbanist_600SemiBold",
              }}
            >
              {k}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}
