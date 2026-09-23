import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import Animated, {
  type SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";
import { PressableScale } from "./ui/PressableScale";
import { ink } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { space } from "../theme/scale";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

/** Indicator that tracks the scroll offset rather than the settled page. */
function Dot({ index, progress }: { index: number; progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const nearness = Math.max(0, 1 - Math.abs(progress.value - index));
    return {
      width: interpolate(nearness, [0, 1], [6, 22]),
      backgroundColor: interpolateColor(nearness, [0, 1], ["rgba(255,255,255,0.6)", "#FFFFFF"]),
    };
  });
  return <Animated.View style={[{ height: 6, borderRadius: 3 }, style]} />;
}

/**
 * Promo banner: full-bleed pages that fill the width of the screen.
 *
 * The dots sit on the artwork rather than below it, so the banner keeps the
 * whole of its height. They are white with a translucent off state, since
 * they have to hold up over whatever photograph lands behind them.
 */
export function PromoCarousel({
  slides,
  width,
  height,
}: {
  slides: string[];
  width: number;
  height: number;
}) {
  const progress = useSharedValue(0);
  const [, setPage] = useState(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    progress.value = e.contentOffset.x / Math.max(1, width);
  });

  return (
    <View
      style={{
        height,
        // Lifts the banner off the page, so the bar that overlaps its lower
        // edge has something to sit against.
        ...(shadow.md as object),
        backgroundColor: ink[100],
      }}
    >
      <AnimatedScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        onMomentumScrollEnd={(e) =>
          setPage(Math.round(e.nativeEvent.contentOffset.x / Math.max(1, width)))
        }
      >
        {slides.map((label) => (
          <PressableScale key={label} scaleTo={0.995} rippleColor={null}>
            <ImagePlaceholder label={label} radius={0} iconSize={38} style={{ width, height }} />
          </PressableScale>
        ))}
      </AnimatedScrollView>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: space.xxxl + space.sm,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: space.sm - 2,
        }}
        pointerEvents="none"
      >
        {slides.map((label, i) => (
          <Dot key={label} index={i} progress={progress} />
        ))}
      </View>
    </View>
  );
}
