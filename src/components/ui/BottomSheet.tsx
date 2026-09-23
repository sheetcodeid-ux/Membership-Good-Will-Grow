import React from "react";
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { SlideInDown } from "react-native-reanimated";
import { AppText } from "./AppText";
import { PressableScale } from "./PressableScale";
import { AppIcon } from "./AppIcon";
import { ink } from "../../theme/colors";

interface BottomSheetProps {
  title?: string;
  onClose: () => void;
  /** Shows the small drag pill above the title, as the outlet sheet does. */
  showHandle?: boolean;
  showClose?: boolean;
  /** Fraction of the screen the card may grow to before it scrolls. */
  maxHeightRatio?: number;
  backgroundColor?: string;
  children: React.ReactNode;
}

/**
 * Dim backdrop plus a rounded card that slides up from the bottom edge.
 *
 * Wrapped in a Modal, which is the only way it can cover the tab bar. The
 * sheet is rendered inside a screen, and the navigator draws the tab bar
 * over every screen — so an absolutely-positioned sheet came up *underneath*
 * the tabs and the profile banner, and its lower options were unreachable.
 */
export function BottomSheet({
  title,
  onClose,
  showHandle = false,
  showClose = true,
  maxHeightRatio = 0.86,
  backgroundColor = "#FFFFFF",
  children,
}: BottomSheetProps) {
  const { height } = useWindowDimensions();

  return (
    <Modal
      transparent
      visible
      animationType="none"
      statusBarTranslucent
      // Android's hardware back should dismiss a sheet, not the screen under it.
      onRequestClose={onClose}
    >
      <View style={StyleSheet.absoluteFill}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(10,14,26,0.5)" }]} />
      </Pressable>

      <View style={{ flex: 1, justifyContent: "flex-end" }} pointerEvents="box-none">
        <Animated.View
          entering={SlideInDown.duration(280)}
          style={{
            maxHeight: height * maxHeightRatio,
            backgroundColor,
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
          }}
        >
          {showHandle ? (
            <View style={{ alignItems: "center", paddingTop: 10 }}>
              <View
                style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: ink[200] }}
              />
            </View>
          ) : null}

          {title ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 22,
                paddingTop: showHandle ? 18 : 24,
                paddingBottom: 6,
              }}
            >
              <AppText variant="h3" style={{ flex: 1 }}>
                {title}
              </AppText>
              {showClose ? (
                <PressableScale onPress={onClose} hitSlop={12}>
                  <AppIcon name="close" size={24} color={ink[600]} />
                </PressableScale>
              ) : null}
            </View>
          ) : null}

          <SafeAreaView edges={["bottom"]}>{children}</SafeAreaView>
        </Animated.View>
      </View>
      </View>
    </Modal>
  );
}
