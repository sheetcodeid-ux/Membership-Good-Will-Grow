import React from "react";
import { View, FlatList } from "react-native";
import { Gift, ShoppingBag, Crown, Info } from "lucide-react-native";
import { Screen, ScreenHeader, AppText, Card } from "../components/ui";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, ink, gold, success } from "../theme/colors";
import { useNotificationStore } from "../store/notificationStore";
import type { NotificationItem } from "../data/types";

const iconMap: Record<NotificationItem["kind"], typeof Gift> = {
  promo: Gift,
  order: ShoppingBag,
  member: Crown,
  system: Info,
};

const bgMap: Record<NotificationItem["kind"], string> = {
  promo: gold[50],
  order: brand[50],
  member: gold[50],
  system: ink[100],
};

const colorMap: Record<NotificationItem["kind"], string> = {
  promo: gold[600],
  order: brand[600],
  member: gold[600],
  system: ink[500],
};

export default function NotificationsScreen() {
  const items = useNotificationStore((s) => s.items);
  const markRead = useNotificationStore((s) => s.markRead);

  return (
    <Screen>
      <ScreenHeader title="Notifikasi" />
      <FlatList
        data={items}
        keyExtractor={(n) => n.id}
        contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 40 }}
        renderItem={({ item }) => {
          const Icon = iconMap[item.kind];
          return (
            <PressableScale onPress={() => markRead(item.id)}>
              <Card style={{ flexDirection: "row", gap: 12, backgroundColor: item.read ? "#FFFFFF" : "#F5F8FF" }}>
                <View style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: bgMap[item.kind], alignItems: "center", justifyContent: "center" }}>
                  <Icon size={19} color={colorMap[item.kind]} />
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <AppText variant="bodySemibold" style={{ flex: 1 }} numberOfLines={1}>
                      {item.title}
                    </AppText>
                    {!item.read ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: success[500] }} /> : null}
                  </View>
                  <AppText variant="caption" color={ink[500]}>{item.body}</AppText>
                  <AppText variant="micro" color={ink[400]}>{item.time}</AppText>
                </View>
              </Card>
            </PressableScale>
          );
        }}
      />
    </Screen>
  );
}
