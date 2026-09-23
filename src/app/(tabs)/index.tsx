import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, View, type LayoutChangeEvent } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeOutDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { UiText } from "../../components/ui/Text";
import { Avatar } from "../../components/ui/Avatar";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";
import { PressableScale } from "../../components/ui/PressableScale";
import { AppIcon } from "../../components/ui/AppIcon";
import { LiquidGlass } from "../../components/ui/LiquidGlass";
import { PostCard } from "../../components/PostCard";
import { PostCardSkeleton } from "../../components/ui/Skeleton";
import { HeaderMenu } from "../../components/HeaderMenu";
import { SectionHeader } from "../../components/SectionHeader";
import { PromoCarousel } from "../../components/PromoCarousel";
import { FeedFilter, type FeedFilterOption } from "../../components/FeedFilter";
import { brand, danger, gold, ink, surface } from "../../theme/colors";
import { shadow } from "../../theme/shadows";
import { useResponsive } from "../../theme/responsive";
import { radius, space } from "../../theme/scale";
import { useFeedStore } from "../../store/feedStore";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";

const filters: FeedFilterOption[] = [
  { key: "all", label: "Semua", icon: "stack" },
  { key: "post", label: "Post", icon: "photoPost" },
  { key: "checkin", label: "Check-In", icon: "pin" },
];

/** Banner slots the marketing team fills in later. */
const banners = ["Banner Promo 1", "Banner Promo 2", "Banner Promo 3"];

const PILL_HEIGHT = 56;

export default function HomeScreen() {
  const r = useResponsive();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState("all");
  const [showProfileBanner, setShowProfileBanner] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pillRestY, setPillRestY] = useState(0);
  const posts = useFeedStore((s) => s.posts);
  const loading = useFeedStore((s) => s.loading);
  const refreshing = useFeedStore((s) => s.refreshing);
  const load = useFeedStore((s) => s.load);
  const refresh = useFeedStore((s) => s.refresh);
  const name = useAuthStore((s) => s.name);
  const username = useAuthStore((s) => s.username);
  const unread = useNotificationStore((s) => s.items.some((n) => !n.read));

  useEffect(() => {
    load();
  }, [load]);

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

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  /** Where the bar comes to rest once it has climbed to the top. */
  const stuckY = insets.top + space.xs;

  /**
   * The bar rides with the page until it reaches the top, then stays. Driving
   * it off the scroll offset rather than swapping a sticky header in keeps it
   * one continuous movement — there is no frame where it jumps between two
   * positions.
   */
  const liftStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.max(stuckY, pillRestY - scrollY.value) }],
  }));

  /** Tightens as it lands, so it reads as a bar rather than a floating pill. */
  const insetStyle = useAnimatedStyle(() => {
    const y = Math.max(stuckY, pillRestY - scrollY.value);
    const stuck = pillRestY > stuckY ? (pillRestY - y) / (pillRestY - stuckY) : 0;
    return {
      marginHorizontal: interpolate(stuck, [0, 1], [r.gutter, space.sm], "clamp"),
    };
  });

  const onPillLayout = useCallback(
    (e: LayoutChangeEvent) => setPillRestY(e.nativeEvent.layout.y),
    []
  );

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

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
            progressViewOffset={insets.top + PILL_HEIGHT}
          />
        }
        contentContainerStyle={{
          paddingTop: insets.top + space.sm,
          paddingBottom: insets.bottom + r.s(170),
          alignItems: "center",
        }}
      >
        <View style={{ width: r.contentWidth }}>
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

          {/* Reserves the bar's slot in the flow; the bar itself is drawn in
              the overlay below so it can climb without the page reflowing. */}
          <View
            onLayout={onPillLayout}
            style={{ height: PILL_HEIGHT, marginTop: space.lg }}
          />

          <View style={{ paddingHorizontal: r.gutter }}>
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
            {loading ? [0, 1].map((i) => <PostCardSkeleton key={i} gutter={r.gutter} />) : null}
            {loading
              ? null
              : visiblePosts.map((post, i) => (
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

      {/* Glass bar: avatar, lockup, overflow — fixed positions, as before. */}
      <Animated.View
        style={[
          { position: "absolute", top: 0, left: 0, right: 0, zIndex: 5 },
          liftStyle,
        ]}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[{ width: r.contentWidth, alignSelf: "center" }, insetStyle]}
          pointerEvents="box-none"
        >
        <LiquidGlass radius={radius.xl} interactive style={{ height: PILL_HEIGHT, ...(shadow.sm as object) }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: space.md,
            }}
          >
            <PressableScale
              onPress={() => router.push(`/profile/${username}` as never)}
              rippleBorderless
            >
              <Avatar name={name} size={36} />
            </PressableScale>

            {/* Brand lockup supplied later. */}
            <View style={{ flex: 1, alignItems: "center" }}>
              <ImagePlaceholder radius={radius.sm} iconSize={18} style={{ width: 118, height: 30 }} />
            </View>

            <PressableScale
              onPress={openMenu}
              rippleBorderless
              style={{
                width: 40,
                height: 40,
                borderRadius: radius.md,
                backgroundColor: "rgba(155,185,255,0.5)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppIcon name="more" size={20} color={brand[800]} />
              {unread ? (
                <View
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 9,
                    height: 9,
                    borderRadius: 4.5,
                    backgroundColor: danger[500],
                    borderWidth: 1.5,
                    borderColor: "#FFFFFF",
                  }}
                />
              ) : null}
            </PressableScale>
          </View>
        </LiquidGlass>
        </Animated.View>
      </Animated.View>

      <HeaderMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}
