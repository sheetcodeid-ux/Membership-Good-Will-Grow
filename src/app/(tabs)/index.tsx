import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeOutDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { UiText } from "../../components/ui/Text";
import { Avatar } from "../../components/ui/Avatar";
import { PressableScale } from "../../components/ui/PressableScale";
import { AppIcon } from "../../components/ui/AppIcon";
import { PostCard } from "../../components/PostCard";
import { PostCardSkeleton } from "../../components/ui/Skeleton";
import { HeaderMenu } from "../../components/HeaderMenu";
import { SectionHeader } from "../../components/SectionHeader";
import { PromoCarousel } from "../../components/PromoCarousel";
import { FeedFilter, type FeedFilterOption } from "../../components/FeedFilter";
import { brand, danger, gold, ink, surface } from "../../theme/colors";
import { shadow } from "../../theme/shadows";
import { useResponsive } from "../../theme/responsive";
import { HIT_SIZE, radius, space } from "../../theme/scale";
import { useFeedStore } from "../../store/feedStore";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
const filters: FeedFilterOption[] = [
  { key: "all", label: "Semua", icon: "home" },
  { key: "post", label: "Post", icon: "comment" },
  { key: "checkin", label: "Check-In", icon: "pin" },
];
/** Banner slots the marketing team fills in later. */
const banners = ["Banner Promo 1", "Banner Promo 2", "Banner Promo 3"];
/** Round control sized to the minimum touch target. */
function IconButton({
  name,
  onPress,
  badge,
}: {
  name: "bell" | "more";
  onPress: () => void;
  badge?: boolean;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <PressableScale
      onPress={() => {
        scale.value = withSpring(0.88, { damping: 14, stiffness: 420 });
        scale.value = withSpring(1, { damping: 11, stiffness: 260 });
        onPress();
      }}
      rippleBorderless
      style={{
        width: HIT_SIZE,
        height: HIT_SIZE,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={[
          {
            width: 42,
            height: 42,
            borderRadius: radius.md,
            backgroundColor: ink[50],
            borderWidth: 1,
            borderColor: ink[100],
            alignItems: "center",
            justifyContent: "center",
          },
          style,
        ]}
      >
        <AppIcon name={name} size={21} color={brand[800]} />
        {badge ? (
          <View
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 9,
              height: 9,
              borderRadius: 4.5,
              backgroundColor: danger[500],
              borderWidth: 1.5,
              borderColor: "#FFFFFF",
            }}
          />
        ) : null}
      </Animated.View>
    </PressableScale>
  );
}
export default function HomeScreen() {
  const r = useResponsive();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState("all");
  const [showProfileBanner, setShowProfileBanner] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const posts = useFeedStore((s) => s.posts);
  const loading = useFeedStore((s) => s.loading);
  const refreshing = useFeedStore((s) => s.refreshing);
  const load = useFeedStore((s) => s.load);
  const refresh = useFeedStore((s) => s.refresh);
  const name = useAuthStore((s) => s.name);
  const username = useAuthStore((s) => s.username);
  const unread = useNotificationStore((s) => s.items.some((n) => !n.read));
  const firstName = name.split(" ")[0];
  const visiblePosts = useMemo(() => {
    if (filter === "post") return posts.filter((p) => p.type === "post");
    if (filter === "checkin") return posts.filter((p) => p.type === "checkin");
    return posts;
  }, [posts, filter]);
  // Counts sit on the chips so the filter says what it will show.
  const options = useMemo<FeedFilterOption[]>(
    () =>
      filters.map((f) => ({
        ...f,
        count:
          f.key === "all"
            ? posts.length
            : posts.filter((p) => (f.key === "post" ? p.type === "post" : p.type === "checkin"))
                .length,
      })),
    [posts]
  );
  const openMenu = useCallback(() => setMenuOpen(true), []);
  useEffect(() => {
    load();
  }, [load]);
  /** Drives the header, which tightens as the feed travels under it. */
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const greetingStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 40], [1, 0], "clamp"),
    height: interpolate(scrollY.value, [0, 40], [18, 0], "clamp"),
  }));
  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scrollY.value, [0, 60], [1, 0.82], "clamp") }],
  }));
  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      {/* Header stays put while the feed moves under it, so the way back to
          your own profile and to notifications never scrolls away. */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderBottomLeftRadius: radius.xl,
          borderBottomRightRadius: radius.xl,
          zIndex: 2,
          ...(shadow.sm as object),
        }}
      >
        <SafeAreaView edges={["top"]}>
          <View
            style={{
              width: r.contentWidth,
              alignSelf: "center",
              flexDirection: "row",
              alignItems: "center",
              gap: space.md,
              paddingHorizontal: r.gutter,
              paddingVertical: space.sm,
            }}
          >
            <PressableScale
              onPress={() => router.push(`/profile/${username}` as never)}
              rippleBorderless
            >
              <Animated.View style={avatarStyle}>
                <Avatar name={name} size={44} />
              </Animated.View>
            </PressableScale>
            <View style={{ flex: 1 }}>
              <Animated.View style={greetingStyle}>
                <UiText token="caption" color={ink[400]} numberOfLines={1}>
                  Selamat datang,
                </UiText>
              </Animated.View>
              <UiText token="titleLg" numberOfLines={1}>
                {firstName}
              </UiText>
            </View>
            <IconButton name="bell" badge={unread} onPress={() => router.push("/notifications")} />
            <IconButton name="more" onPress={openMenu} />
          </View>
        </SafeAreaView>
      </View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={brand[700]}
            colors={[brand[700]]}
          />
        }
        contentContainerStyle={{
          paddingBottom: insets.bottom + r.s(170),
          alignItems: "center",
        }}
      >
        <View style={{ width: r.contentWidth }}>
          <View style={{ marginTop: space.lg }}>
            <View style={{ paddingHorizontal: r.gutter }}>
              <SectionHeader
                title="Promo Untukmu"
                subtitle="Penawaran yang sedang berjalan"
                actionLabel="Lihat semua"
                onAction={() => router.push("/promo")}
              />
            </View>
            <PromoCarousel
              slides={banners}
              gutter={r.gutter}
              height={Math.min(220, Math.max(150, r.height * 0.21))}
            />
          </View>
          <View style={{ marginTop: space.xl, paddingHorizontal: r.gutter }}>
            <FeedFilter options={options} value={filter} onChange={setFilter} />
          </View>
          {showProfileBanner ? (
            <Animated.View
              entering={FadeInDown.duration(320).springify().damping(18)}
              exiting={FadeOutDown.duration(200)}
              style={{ paddingHorizontal: r.gutter, marginTop: space.lg }}
            >
              <PressableScale
                onPress={() => router.push("/edit-profile")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: space.md,
                  backgroundColor: gold[50],
                  borderWidth: 1,
                  borderColor: "#F0DDB4",
                  borderRadius: radius.lg,
                  paddingVertical: space.md,
                  paddingHorizontal: space.lg,
                }}
              >
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: radius.sm,
                    backgroundColor: "#FFFFFF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppIcon name="gift" size={22} color={gold[600]} />
                </View>
                <View style={{ flex: 1, gap: 1 }}>
                  <UiText token="bodySemibold" color={brand[900]}>
                    Lengkapi profil kamu
                  </UiText>
                  <UiText token="caption" color={ink[500]}>
                    Selesaikan datamu dan dapatkan reward menarik
                  </UiText>
                </View>
                <PressableScale
                  onPress={() => setShowProfileBanner(false)}
                  hitSlop={14}
                  rippleBorderless
                >
                  <AppIcon name="close" size={20} color={ink[400]} />
                </PressableScale>
              </PressableScale>
            </Animated.View>
          ) : null}
          <View style={{ paddingHorizontal: r.gutter, marginTop: space.xl }}>
            <SectionHeader
              title="Postingan Terbaru"
              subtitle={loading ? "Memuat…" : `${visiblePosts.length} postingan dari komunitas`}
            />
          </View>
          <View style={{ gap: space.md }}>
            {loading
              ? [0, 1].map((i) => <PostCardSkeleton key={i} gutter={r.gutter} />)
              : null}
            {loading ? null : visiblePosts.map((post, i) => (
              <Animated.View
                // Keying on the filter replays the stagger when the list changes.
                key={`${filter}-${post.id}`}
                entering={FadeInDown.delay(Math.min(i, 6) * 55)
                  .duration(360)
                  .springify()
                  .damping(18)}
              >
                <PostCard post={post} />
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.ScrollView>
      <HeaderMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}
