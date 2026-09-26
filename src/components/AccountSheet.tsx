import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { Glyph } from "./icons/Glyph";
import { LABEL_INK, QUIET_INK, RULE } from "./AccountMenu";
import { fontFamilies } from "../theme/typography";

/**
 * The account pages' bottom sheet: a dimmed backdrop that fades in, a
 * white card that slides up with a grab handle, an optional title with a
 * round close button, the content, and an optional footer that stays put
 * while the content scrolls. A Modal, so it covers the tab bar too.
 *
 * The content should be a ScrollView (or anything with flexShrink) when it
 * may be taller than the card.
 */
export function AccountSheet({
  title,
  onClose,
  maxHeightRatio = 0.88,
  footer,
  children,
}: {
  title?: string;
  onClose: () => void;
  maxHeightRatio?: number;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      transparent
      visible
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          entering={FadeIn.duration(200)}
          style={StyleSheet.absoluteFill}
        >
          <Pressable
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "rgba(10,14,26,0.5)" },
            ]}
            onPress={onClose}
          />
        </Animated.View>

        <View
          style={{ flex: 1, justifyContent: "flex-end" }}
          pointerEvents="box-none"
        >
          <Animated.View
            entering={SlideInDown.duration(300)}
            style={{
              maxHeight: height * maxHeightRatio,
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              overflow: "hidden",
            }}
          >
            <View
              style={{ alignItems: "center", paddingTop: 10, paddingBottom: 4 }}
            >
              <View
                style={{
                  width: 40,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: "#DADDE3",
                }}
              />
            </View>

            {title ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: 18,
                  paddingRight: 14,
                  paddingTop: 8,
                  paddingBottom: 6,
                }}
              >
                <UiText
                  color={LABEL_INK}
                  style={{
                    flex: 1,
                    fontSize: 18,
                    lineHeight: 23,
                    fontFamily: fontFamilies.extrabold,
                  }}
                >
                  {title}
                </UiText>
                <PressableScale
                  onPress={onClose}
                  hitSlop={10}
                  scaleTo={0.9}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "#F2F3F5",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Glyph name="close" size={14} color={QUIET_INK} />
                </PressableScale>
              </View>
            ) : null}

            <View style={{ flexShrink: 1 }}>{children}</View>

            {footer ? (
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: RULE,
                  paddingHorizontal: 16,
                  paddingTop: 12,
                  paddingBottom: Math.max(insets.bottom, 12),
                }}
              >
                {footer}
              </View>
            ) : (
              <View style={{ height: insets.bottom }} />
            )}
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}
