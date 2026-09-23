import React, { useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppIcon, type AppIconName } from "../components/ui/AppIcon";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { FilterChip } from "../components/ui/FilterChip";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, gold, ink, success, surface } from "../theme/colors";
import { HIT_SIZE, radius, space } from "../theme/scale";
import { useNotificationStore } from "../store/notificationStore";
import type { NotificationItem } from "../data/types";

const categories = [
  { key: "all", label: "Semua" },
  { key: "disukai", label: "Disukai" },
  { key: "postingan-disukai", label: "Postingan Disukai" },
  { key: "komentar-disukai", label: "Komentar Disukai" },
  { key: "komentar", label: "Komentar" },
  { key: "mention", label: "Mention Baru" },
  { key: "pengikut", label: "Pengikut Baru" },
  { key: "info", label: "Info" },
  { key: "lainnya", label: "Lainnya" },
];

const iconFor: Record<NotificationItem["kind"], AppIconName> = {
  promo: "gift",
  order: "order",
  member: "crown",
  system: "info",
};

const bgFor: Record<NotificationItem["kind"], string> = {
  promo: gold[50],
  order: brand[50],
  member: gold[50],
  system: ink[100],
};

const tintFor: Record<NotificationItem["kind"], string> = {
  promo: gold[600],
  order: brand[600],
  member: gold[600],
  system: ink[500],
};

export default function NotificationsScreen() {
  const [category, setCategory] = useState("all");
  const items = useNotificationStore((s) => s.items);
  const markRead = useNotificationStore((s) => s.markRead);

  // Only "Info" maps onto the seeded data; the social categories stay empty
  // until those events exist.
  const visible = category === "all" ? items : category === "info" ? items : [];

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <AppHeader title="Notifikasi">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: space.lg, gap: space.sm }}
        >
          {categories.map((c) => (
            <FilterChip
              key={c.key}
              label={c.label}
              active={category === c.key}
              onPress={() => setCategory(c.key)}
            />
          ))}
        </ScrollView>
      </AppHeader>

      <FlatList
        data={visible}
        keyExtractor={(n) => n.id}
        contentContainerStyle={{ padding: space.lg, gap: space.md, flexGrow: 1, paddingBottom: space.xxxl }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const iconName = iconFor[item.kind];
          return (
            <PressableScale
              onPress={() => markRead(item.id)}
              scaleTo={0.99}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: space.md,
                minHeight: HIT_SIZE + space.lg,
                backgroundColor: item.read ? "#FFFFFF" : brand[50],
                borderRadius: radius.lg,
                padding: space.lg,
              }}
            >
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: radius.md,
                  backgroundColor: bgFor[item.kind],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppIcon name={iconName} size={22} color={tintFor[item.kind]} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <UiText token="bodySemibold" style={{ flex: 1 }} numberOfLines={1}>
                    {item.title}
                  </UiText>
                  {!item.read ? (
                    <View
                      style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: success[500] }}
                    />
                  ) : null}
                </View>
                <UiText token="caption" color={ink[500]}>
                  {item.body}
                </UiText>
                <UiText token="caption" color={ink[400]} style={{ fontSize: 12 }}>
                  {item.time}
                </UiText>
              </View>
            </PressableScale>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon={<AppIcon name="bellOff" size={64} color={ink[300]} />}
            title="Belum ada notifikasi"
            subtitle="Notifikasi yang masuk akan muncul di sini."
          />
        }
      />
    </View>
  );
}
