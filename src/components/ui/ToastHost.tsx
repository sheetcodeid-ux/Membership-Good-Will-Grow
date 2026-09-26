import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { UiText } from "./Text";
import { Glyph, type GlyphName } from "../icons/Glyph";
import { useToastStore, type ToastTone } from "../../store/toastStore";
import { fontFamilies } from "../../theme/typography";

const VISIBLE_MS = 2200;
/**
 * Height above the bottom inset. High enough to clear the floating tab bar
 * and the action bars at the foot of cart, checkout and form pages.
 */
const LIFT = 100;

const toneGlyph: Record<ToastTone, GlyphName> = {
  success: "checkCircle",
  info: "info",
  error: "alertCircle",
};
const toneColor: Record<ToastTone, string> = {
  success: "#6BE09A",
  info: "#9BB9FF",
  error: "#FF8A8A",
};

/**
 * The app's one toast: a dark pill that rises from the bottom, says what
 * just happened, and sinks away on its own. Mounted once at the root.
 */
export function ToastHost() {
  const toast = useToastStore((s) => s.toast);
  const hide = useToastStore((s) => s.hide);
  const insets = useSafeAreaInsets();
  // Keep the last toast on screen while it animates out.
  const [shown, setShown] = useState(toast);
  if (toast && toast !== shown) setShown(toast);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!toast) {
      progress.value = withTiming(0, { duration: 180 });
      return;
    }
    progress.value = 0;
    progress.value = withSpring(1, { damping: 16, stiffness: 220 });
    const t = setTimeout(() => hide(toast.id), VISIBLE_MS);
    return () => clearTimeout(t);
  }, [toast, hide, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: (1 - progress.value) * 24 },
      { scale: 0.96 + progress.value * 0.04 },
    ],
  }));

  if (!shown) return null;
  const bottom = insets.bottom + LIFT;

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[
          {
            maxWidth: 340,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingLeft: 13,
            paddingRight: 16,
            paddingVertical: 11,
            borderRadius: 22,
            backgroundColor: "rgba(32,32,32,0.94)",
          },
          style,
        ]}
      >
        <Glyph
          name={toneGlyph[shown.tone]}
          size={17}
          color={toneColor[shown.tone]}
        />
        <UiText
          color="#FFFFFF"
          numberOfLines={2}
          style={{
            flexShrink: 1,
            fontSize: 14,
            lineHeight: 18,
            fontFamily: fontFamilies.semibold,
          }}
        >
          {shown.message}
        </UiText>
      </Animated.View>
    </View>
  );
}
