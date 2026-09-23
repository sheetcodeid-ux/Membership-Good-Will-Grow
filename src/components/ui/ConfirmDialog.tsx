import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { AppText } from "./AppText";
import { PressableScale } from "./PressableScale";
import { ink } from "../../theme/colors";
import { shadow } from "../../theme/shadows";

interface ConfirmDialogProps {
  icon?: React.ReactNode;
  title: string;
  /** Body copy, or a custom block when the dialog needs more than a sentence. */
  message?: string;
  children?: React.ReactNode;
  cancelLabel: string;
  confirmLabel: string;
  cancelColor: string;
  confirmColor: string;
  /** Plain text actions (delete prompt) vs filled buttons (order confirm). */
  variant?: "text" | "buttons";
  onCancel: () => void;
  onConfirm: () => void;
}

/** Centred modal used for destructive prompts and the order confirmation. */
export function ConfirmDialog({
  icon,
  title,
  message,
  children,
  cancelLabel,
  confirmLabel,
  cancelColor,
  confirmColor,
  variant = "text",
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onCancel}>
        <Animated.View
          entering={FadeIn.duration(160)}
          style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(10,14,26,0.45)" }]}
        />
      </Pressable>

      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 22 }}
        pointerEvents="box-none"
      >
        <Animated.View
          entering={ZoomIn.duration(200)}
          style={{
            width: "100%",
            maxWidth: 420,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 18,
            ...(shadow.lg as object),
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {icon}
            <AppText variant="h3" style={{ flex: 1 }}>
              {title}
            </AppText>
          </View>

          {message ? (
            <AppText variant="body" color={ink[700]} style={{ marginTop: 12, lineHeight: 20 }}>
              {message}
            </AppText>
          ) : null}
          {children}

          {variant === "text" ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 26,
                marginTop: 20,
                paddingRight: 4,
              }}
            >
              <PressableScale onPress={onCancel} hitSlop={10}>
                <AppText variant="bodySemibold" color={cancelColor}>
                  {cancelLabel}
                </AppText>
              </PressableScale>
              <PressableScale onPress={onConfirm} hitSlop={10}>
                <AppText variant="bodySemibold" color={confirmColor}>
                  {confirmLabel}
                </AppText>
              </PressableScale>
            </View>
          ) : (
            <View style={{ flexDirection: "row", gap: 10, marginTop: 18 }}>
              <PressableScale
                onPress={onCancel}
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: 21,
                  borderWidth: 1.5,
                  borderColor: cancelColor,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText variant="bodySemibold" color={cancelColor}>
                  {cancelLabel}
                </AppText>
              </PressableScale>
              <PressableScale
                onPress={onConfirm}
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: confirmColor,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText variant="bodySemibold" color="#FFFFFF">
                  {confirmLabel}
                </AppText>
              </PressableScale>
            </View>
          )}
        </Animated.View>
      </View>
    </View>
  );
}
