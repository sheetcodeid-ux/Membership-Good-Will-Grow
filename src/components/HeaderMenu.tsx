import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { Search, Bookmark, Bell, type LucideIcon } from "lucide-react-native";
import { AppText } from "./ui/AppText";
import { PressableScale } from "./ui/PressableScale";
import { brand, ink } from "../theme/colors";
import { shadow } from "../theme/shadows";

const items: { icon: LucideIcon; label: string; href?: string }[] = [
  { icon: Search, label: "Cari" },
  { icon: Bookmark, label: "Bookmark" },
  { icon: Bell, label: "Notifikasi", href: "/notifications" },
];

/** Overflow menu that drops out of the header pill's ⋯ button. */
export function HeaderMenu({ top, onClose }: { top: number; onClose: () => void }) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      <Animated.View
        entering={FadeIn.duration(140)}
        style={{
          position: "absolute",
          top,
          right: 25,
          width: 170,
          borderRadius: 12,
          backgroundColor: "#FFFFFF",
          paddingVertical: 4,
          ...(shadow.lg as object),
        }}
      >
        {items.map(({ icon: Icon, label, href }) => (
          <PressableScale
            key={label}
            onPress={() => {
              onClose();
              if (href) router.push(href as never);
            }}
            style={{
              height: 37,
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              paddingHorizontal: 18,
            }}
          >
            <Icon size={18} color={brand[600]} strokeWidth={2} />
            <AppText variant="bodyMedium" color={ink[900]}>
              {label}
            </AppText>
          </PressableScale>
        ))}
      </Animated.View>
    </View>
  );
}
