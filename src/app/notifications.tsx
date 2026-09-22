import React, { useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { BellOff, Gift, ShoppingBag, Crown, Info } from "lucide-react-native";
import { AppText } from "../components/ui";
import { AppHeader } from "../components/ui/AppHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { FilterChip } from "../components/ui/FilterChip";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, gold, ink, success, surface } from "../theme/colors";
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

const iconFor: Record<NotificationItem["kind"], typeof Gift> = {
  promo: Gift,
  order: ShoppingBag,
  member: Crown,
  system: Info,
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
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 14, gap: 10 }}
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
        contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const Icon = iconFor[item.kind];
          return (
            <PressableScale
              onPress={() => markRead(item.id)}
              scaleTo={0.99}
              style={{
                flexDirection: "row",
                gap: 12,
                backgroundColor: item.read ? "#FFFFFF" : brand[50],
                borderRadius: 16,
                padding: 14,
              }}
            >
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 13,
                  backgroundColor: bgFor[item.kind],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={19} color={tintFor[item.kind]} />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <AppText variant="bodySemibold" style={{ flex: 1 }} numberOfLines={1}>
                    {item.title}
                  </AppText>
                  {!item.read ? (
                    <View
                      style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: success[500] }}
                    />
                  ) : null}
                </View>
                <AppText variant="caption" color={ink[500]}>
                  {item.body}
                </AppText>
                <AppText variant="micro" color={ink[400]}>
                  {item.time}
                </AppText>
              </View>
            </PressableScale>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon={<BellOff size={54} color={ink[300]} strokeWidth={1.7} />}
            title="Belum ada notifikasi"
            subtitle="Notifikasi yang masuk akan muncul di sini."
          />
        }
      />
    </View>
  );
}
