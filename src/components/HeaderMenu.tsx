import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { BottomSheet } from "@expo/ui";
import { AppText } from "./ui/AppText";
import { PressableScale } from "./ui/PressableScale";
import { AppIcon, type AppIconName } from "./ui/AppIcon";
import { brand, ink } from "../theme/colors";

const items: { icon: AppIconName; label: string; hint: string; href: string }[] = [
  { icon: "search", label: "Cari Member", hint: "Temukan dan ikuti member lain", href: "/search-member" },
  { icon: "bookmark", label: "Bookmark", hint: "Postingan yang kamu simpan", href: "/bookmark" },
  { icon: "bell", label: "Notifikasi", hint: "Aktivitas terbaru untukmu", href: "/notifications" },
];

/**
 * Overflow menu behind the header pill's ⋯ button.
 *
 * Presented through `@expo/ui`'s BottomSheet, so the drag handle, the rubber
 * band and the dismiss gesture are the platform's own — a real sheet on iOS
 * and Android, and a drawer on web — instead of the hand-rolled dropdown this
 * used to be.
 */
export function HeaderMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <BottomSheet
      isPresented={open}
      onDismiss={onClose}
      showDragIndicator
      containerColor="#FFFFFF"
      contentPadding={{ top: 6, bottom: 22, left: 16, right: 16 }}
    >
      <View style={{ gap: 4 }}>
        <AppText variant="h3" color={ink[900]} style={{ marginBottom: 6, paddingHorizontal: 4 }}>
          Menu
        </AppText>

        {items.map(({ icon, label, hint, href }) => (
          <PressableScale
            key={label}
            scaleTo={0.99}
            onPress={() => {
              onClose();
              router.push(href as never);
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 13,
              paddingVertical: 11,
              paddingHorizontal: 4,
            }}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: brand[50],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppIcon name={icon} size={18} color={brand[700]} emphasis />
            </View>
            <View style={{ flex: 1, gap: 1 }}>
              <AppText variant="bodySemibold" color={ink[900]}>
                {label}
              </AppText>
              <AppText variant="caption" color={ink[500]}>
                {hint}
              </AppText>
            </View>
            <AppIcon name="chevronRight" size={16} color={ink[300]} />
          </PressableScale>
        ))}
      </View>
    </BottomSheet>
  );
}
