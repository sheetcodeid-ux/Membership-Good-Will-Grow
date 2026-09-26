import { useCallback, useState } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

/**
 * Whether a list has moved off its top, for the bar's hairline. Only
 * re-renders when that answer flips, not on every scroll event.
 */
export function useScrolled(threshold = 4) {
  const [scrolled, setScrolled] = useState(false);
  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const past = e.nativeEvent.contentOffset.y > threshold;
      setScrolled((was) => (was === past ? was : past));
    },
    [threshold],
  );
  return { scrolled, onScroll, scrollEventThrottle: 16 } as const;
}
