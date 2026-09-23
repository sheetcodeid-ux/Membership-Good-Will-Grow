import React, { useCallback, useState } from "react";
import { ScrollView, View, type LayoutChangeEvent } from "react-native";
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
import { brand, ink } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { radius, space } from "../theme/scale";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

/** Indicator that tracks the scroll offset rather than the settled page. */
function Dot({ index, progress }: { index: number; progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const nearness = Math.max(0, 1 - Math.abs(progress.value - index));
    return {
      width: interpolate(nearness, [0, 1], [6, 22]),
      backgroundColor: interpolateColor(nearness, [0, 1], [ink[300], brand[900]]),
    };
  });
  return <Animated.View style={[{ height: 6, borderRadius: 3 }, style]} />;
}

/** One slide, which shrinks slightly as it leaves the centre. */
function Slide({
  label,
  index,
  progress,
  width,
  height,
}: {
  label: string;
  index: number;
  progress: SharedValue<number>;
  width: number;
  height: number;
}) {
  const style = useAnimatedStyle(() => {
    const distance = Math.abs(progress.value - index);
    return {
      transform: [{ scale: interpolate(distance, [0, 1], [1, 0.94], "clamp") }],
      opacity: interpolate(distance, [0, 1], [1, 0.72], "clamp"),
    };
  });

  return (
    <Animated.View style={[{ width, height }, style]}>
      <PressableScale scaleTo={0.985} rippleColor={null} style={{ flex: 1 }}>
        <ImagePlaceholder
          label={label}
          radius={radius.xl}
          iconSize={34}
          style={{ flex: 1, ...(shadow.xs as object) }}
        />
      </PressableScale>
    </Animated.View>
  );
}

/**
 * Promo carousel.
 *
 * Inset cards rather than a full-bleed band: the edge of the next slide stays
 * visible, which is what tells someone there is more to swipe without a
 * caption saying so. Slides settle with `snapToInterval` so a card always
 * lands centred, and the one leaving centre shrinks a little so the eye
 * stays on the one arriving.
 */
export function PromoCarousel({
  slides,
  gutter,
  height,
}: {
  slides: string[];
  gutter: number;
  height: number;
}) {
  const [containerWidth, setContainerWidth] = useState(0);
  const progress = useSharedValue(0);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width),
    []
  );

  /** Card leaves room for the neighbour's edge on both sides. */
  const peek = space.xl;
  const cardWidth = containerWidth > 0 ? containerWidth - gutter * 2 - peek : 0;
  const interval = cardWidth + space.md;

  const onScroll = useAnimatedScrollHandler((e) => {
    progress.value = e.contentOffset.x / Math.max(1, interval);
  });

  return (
    <View onLayout={onLayout}>
      {cardWidth > 0 ? (
        <AnimatedScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          snapToInterval={interval}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: gutter + peek / 2,
            gap: space.md,
          }}
        >
          {slides.map((label, i) => (
            <Slide
              key={label}
              label={label}
              index={i}
              progress={progress}
              width={cardWidth}
              height={height}
            />
          ))}
        </AnimatedScrollView>
      ) : (
        <View style={{ height }} />
      )}

      <View
        style={{
          flexDirection: "row",
          alignSelf: "center",
          alignItems: "center",
          gap: space.sm - 2,
          marginTop: space.md,
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
