import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { SlidersHorizontal } from "lucide-react-native";
import { AppText } from "./ui/AppText";
import { PressableScale } from "./ui/PressableScale";
import { ShortcutIcon } from "./ShortcutIcon";
import { brand, ink } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { availableShortcuts, requiredShortcuts, useShortcutStore } from "../store/shortcutStore";

/** Quick menu that drops out of the tab bar's menu button. */
export function ShortcutMenu({ onClose }: { onClose: () => void }) {
  const pinned = useShortcutStore((s) => s.pinned);
  const extras = pinned
    .map((id) => availableShortcuts.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => !!s);
  const items = [...requiredShortcuts, ...extras];

  const go = (href: string) => {
    onClose();
    router.push(href as never);
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <Animated.View
          entering={FadeIn.duration(150)}
          style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(10,14,26,0.35)" }]}
        />
      </Pressable>

      <View
        style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end", padding: 16 }}
        pointerEvents="box-none"
      >
        <Animated.View
          entering={ZoomIn.duration(200)}
          style={{
            width: 269,
            maxWidth: "92%",
            marginBottom: 80,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            paddingVertical: 4,
            ...(shadow.lg as object),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 15,
              paddingTop: 12,
              paddingBottom: 6,
            }}
          >
            <AppText variant="h3" style={{ flex: 1 }}>
              Menu Pintas
            </AppText>
            <PressableScale
              onPress={() => go("/shortcuts")}
              hitSlop={10}
            >
              <SlidersHorizontal size={17} color={brand[800]} />
            </PressableScale>
          </View>

          {items.map((item, i) => (
            <View key={item.id}>
              {i > 0 ? (
                <View style={{ height: 1, backgroundColor: ink[100], marginHorizontal: 15 }} />
              ) : null}
              <PressableScale
                onPress={() => go(item.href)}
                scaleTo={0.99}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 13,
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                }}
              >
                {/* Circular tiles here, rounded squares on the settings page —
                    the reference draws the two differently. */}
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: brand[50],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShortcutIcon name={item.icon} size={16} />
                </View>
                <AppText variant="bodyMedium" numberOfLines={1} style={{ flex: 1 }}>
                  {item.label}
                </AppText>
              </PressableScale>
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}
