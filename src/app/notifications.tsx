import React, { useMemo, useState } from "react";
import { ScrollView, SectionList, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppIcon, type AppIconName } from "../components/ui/AppIcon";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { FilterChip } from "../components/ui/FilterChip";
import { PressableScale } from "../components/ui/PressableScale";
import { Avatar } from "../components/ui/Avatar";
import { SignalDot } from "../components/ui/SignalDot";
import { brand, danger, gold, ink, surface } from "../theme/colors";
import { radius, space } from "../theme/scale";
import { shadow } from "../theme/shadows";
import { useResponsive } from "../theme/responsive";
import { useNotificationStore } from "../store/notificationStore";
import type { NotificationItem, NotificationKind } from "../data/types";

/**
 * Each chip names the kinds it shows. The list used to be labels alone, with
 * only "Semua" and "Info" wired to anything, so seven of the nine opened an
 * empty screen — a filter that lies about what it has.
 */
const categories: { key: string; label: string; kinds?: NotificationKind[] }[] = [
  { key: "all", label: "Semua" },
  { key: "disukai", label: "Disukai", kinds: ["like", "post-like", "comment-like"] },
  { key: "postingan-disukai", label: "Postingan Disukai", kinds: ["post-like"] },
  { key: "komentar-disukai", label: "Komentar Disukai", kinds: ["comment-like"] },
  { key: "komentar", label: "Komentar", kinds: ["comment"] },
  { key: "mention", label: "Mention", kinds: ["mention"] },
  { key: "pengikut", label: "Pengikut Baru", kinds: ["follow"] },
  { key: "info", label: "Info", kinds: ["promo", "order", "member", "system"] },
];

const iconFor: Record<NotificationKind, AppIconName> = {
  promo: "gift",
  order: "order",
  member: "crown",
  system: "info",
  like: "heart",
  "post-like": "heart",
  "comment-like": "heart",
  comment: "comment",
  mention: "atSign",
  follow: "userPlus",
};

/**
 * Each kind gets a gradient rather than a flat tile.
 *
 * Four rows of the same grey square is what made this list read as a
 * settings screen; the gradient is what lets the eye sort a promo from an
 * order before reading either.
 */
const tileFor: Record<NotificationKind, [string, string]> = {
  promo: [gold[300], gold[600]],
  order: [brand[500], brand[700]],
  member: [gold[500], "#B4752A"],
  system: [ink[300], ink[500]],
  like: [danger[500], danger[600]],
  "post-like": [danger[500], danger[600]],
  "comment-like": [danger[500], danger[600]],
  comment: [brand[400], brand[600]],
  mention: ["#5B8DEF", brand[700]],
  follow: ["#3FA37A", "#2E7D5B"],
};

function NotificationCard({
  item,
  index,
  onPress,
}: {
  item: NotificationItem;
  index: number;
  onPress: () => void;
}) {
  const unread = !item.read;
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 6) * 45).duration(280)}>
      <PressableScale
        onPress={onPress}
        scaleTo={0.985}
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: space.md,
          backgroundColor: "#FFFFFF",
          borderRadius: radius.lg,
          padding: space.lg,
          // Unread carries a rule down its leading edge instead of a wash
          // across the whole card: the tint made a read row look disabled,
          // where the rule just marks the ones still waiting.
          borderLeftWidth: unread ? 3 : 0,
          borderLeftColor: brand[600],
          ...(shadow.xs as object),
        }}
      >
        {/* A member's notification leads with their face and carries the
            kind as a small badge; the app's own notifications have no face
            to show, so the tile is the mark. */}
        <View style={{ width: 44, height: 44 }}>
          {item.actorName ? (
            <Avatar name={item.actorName} size={44} />
          ) : (
            <LinearGradient
              colors={tileFor[item.kind]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.md,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppIcon name={iconFor[item.kind]} size={21} color="#FFFFFF" />
            </LinearGradient>
          )}
          {item.actorName ? (
            <LinearGradient
              colors={tileFor[item.kind]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: "absolute",
                right: -2,
                bottom: -2,
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: "#FFFFFF",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppIcon name={iconFor[item.kind]} size={10} color="#FFFFFF" emphasis />
            </LinearGradient>
          ) : null}
        </View>

        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <UiText
              token={unread ? "bodySemibold" : "bodyMedium"}
              color={unread ? brand[900] : ink[700]}
              style={{ flex: 1, minWidth: 0 }}
              numberOfLines={1}
            >
              {item.title}
            </UiText>
          </View>
          <UiText token="caption" color={ink[500]}>
            {item.body}
          </UiText>
          <UiText token="label" color={ink[400]} style={{ marginTop: 2 }}>
            {item.time}
          </UiText>
        </View>

        {/* The unread dot and the chevron share one column on the card's
            centre line. Leaving the dot up in the title row put the two
            marks on different lines at different heights, which read as
            scattered rather than as a pair. */}
        {unread || item.href ? (
          <View
            style={{
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              width: 18,
              gap: space.xs,
            }}
          >
            {unread ? <SignalDot size={8} ringSize={14} inline /> : null}
            {item.href ? <AppIcon name="chevronRight" size={17} color={ink[300]} /> : null}
          </View>
        ) : null}
      </PressableScale>
    </Animated.View>
  );
}

export default function NotificationsScreen() {
  const [category, setCategory] = useState("all");
  const r = useResponsive();
  const items = useNotificationStore((s) => s.items);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const unread = items.filter((n) => !n.read).length;

  /**
   * Unread first, under their own heading. A single flat list makes you scan
   * every row for the dot; splitting it means the thing you opened the screen
   * for is the first thing on it.
   */
  const sections = useMemo(() => {
    const kinds = categories.find((c) => c.key === category)?.kinds;
    const visible = kinds ? items.filter((n) => kinds.includes(n.kind)) : items;
    const fresh = visible.filter((n) => !n.read);
    const seen = visible.filter((n) => n.read);
    return [
      ...(fresh.length ? [{ title: "Baru", data: fresh }] : []),
      ...(seen.length ? [{ title: "Sebelumnya", data: seen }] : []),
    ];
  }, [category, items]);

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <AppHeader
        title="Notifikasi"
        right={
          unread ? (
            <PressableScale
              onPress={markAllRead}
              scaleTo={0.95}
              style={{
                paddingHorizontal: space.md,
                paddingVertical: space.sm,
                borderRadius: radius.pill,
                backgroundColor: brand[50],
              }}
            >
              <UiText token="label" color={brand[700]}>
                Tandai dibaca
              </UiText>
            </PressableScale>
          ) : undefined
        }
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: r.gutter,
            paddingBottom: space.lg,
            gap: space.sm,
          }}
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

      <SectionList
        sections={sections}
        keyExtractor={(n) => n.id}
        contentContainerStyle={{
          padding: r.gutter,
          paddingBottom: space.xxxl * 2,
          gap: space.md,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: space.sm,
              paddingTop: section.title === "Baru" ? 0 : space.md,
              paddingBottom: space.xs,
            }}
          >
            <UiText token="label" color={ink[500]}>
              {section.title.toUpperCase()}
            </UiText>
            <View style={{ flex: 1, height: 1, backgroundColor: ink[200] }} />
            <UiText token="label" color={ink[400]}>
              {section.data.length}
            </UiText>
          </View>
        )}
        renderItem={({ item, index }) => (
          <NotificationCard
            item={item}
            index={index}
            onPress={() => {
              markRead(item.id);
              if (item.href) router.push(item.href as never);
            }}
          />
        )}
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
