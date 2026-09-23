import React, { useState } from "react";
import { Image, ScrollView, View } from "react-native";
import Animated, {
  type SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { PressableScale } from "./ui/PressableScale";
import { ink } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { radius, space } from "../theme/scale";
import type { PromoBanner } from "../data/banners";

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
  slides: PromoBanner[];
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
        // The banner is what casts the shadow on this screen, not the bar
        // riding over it. Hanging it on the bar drew a dark line across the
        // filter row underneath; hanging it here puts the depth where the
        // eye expects it — under the artwork. It lives on this view rather
        // than the clipping one because clipping would crop it away.
        ...(shadow.glass as object),
        backgroundColor: ink[100],
        borderBottomLeftRadius: radius.xl,
        borderBottomRightRadius: radius.xl,
      }}
    >
      <View
        style={{
          flex: 1,
          borderBottomLeftRadius: radius.xl,
          borderBottomRightRadius: radius.xl,
          overflow: "hidden",
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
        {slides.map((slide) => (
          <PressableScale key={slide.id} scaleTo={0.995} rippleColor={null}>
            <Image
              source={slide.source}
              // The art is authored at the same 3:2 the box uses, so "cover"
              // only ever absorbs rounding rather than cropping the subject.
              resizeMode="cover"
              accessible
              accessibilityRole="image"
              accessibilityLabel={slide.label}
              style={{ width, height }}
            />
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
        {slides.map((slide, i) => (
          <Dot key={slide.id} index={i} progress={progress} />
        ))}
      </View>
      </View>
    </View>
  );
}
