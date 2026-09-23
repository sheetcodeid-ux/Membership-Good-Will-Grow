import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { BottomSheet } from "@expo/ui";
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { AppIcon, type AppIconName } from "./ui/AppIcon";
import { brand, ink } from "../theme/colors";
import { HIT_SIZE, radius, space } from "../theme/scale";

const items: { icon: AppIconName; label: string; hint: string; href: string }[] = [
  {
    icon: "search",
    label: "Cari Member",
    hint: "Temukan dan ikuti member lain",
    href: "/search-member",
  },
  { icon: "bookmark", label: "Bookmark", hint: "Postingan yang kamu simpan", href: "/bookmark" },
  { icon: "bell", label: "Notifikasi", hint: "Aktivitas terbaru untukmu", href: "/notifications" },
];

/**
 * Overflow menu behind the header pill's ⋯ button.
 *
 * Presented through `@expo/ui`'s BottomSheet, so the drag handle, the rubber
 * band and the dismiss gesture are the platform's own. Rows are a full
 * touch-target tall rather than the height of their text.
 */
export function HeaderMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <BottomSheet
      isPresented={open}
      onDismiss={onClose}
      showDragIndicator
      containerColor="#FFFFFF"
      contentPadding={{ top: space.sm, bottom: space.xxl, left: space.lg, right: space.lg }}
    >
      <View>
        <UiText token="h3" style={{ marginBottom: space.md, paddingHorizontal: space.xs }}>
          Menu
        </UiText>

        {items.map(({ icon, label, hint, href }) => (
          <PressableScale
            key={label}
            scaleTo={0.985}
            onPress={() => {
              onClose();
              router.push(href as never);
            }}
            style={{
              minHeight: HIT_SIZE + space.sm,
              flexDirection: "row",
              alignItems: "center",
              gap: space.lg,
              paddingHorizontal: space.xs,
              borderRadius: radius.md,
            }}
          >
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: radius.md,
                backgroundColor: brand[50],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppIcon name={icon} size={22} color={brand[700]} emphasis />
            </View>
            <View style={{ flex: 1, gap: 1 }}>
              <UiText token="bodySemibold">{label}</UiText>
              <UiText token="caption" color={ink[500]}>
                {hint}
              </UiText>
            </View>
            <AppIcon name="chevronRight" size={20} color={ink[300]} />
          </PressableScale>
        ))}
      </View>
    </BottomSheet>
  );
}
