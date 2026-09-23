import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, View, type LayoutChangeEvent } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeOutDown,
  SlideInDown,
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

const PILL_HEIGHT = 52;

/** Round control inside the glass bar, with an optional unread dot. */
function GlassButton({
  children,
  onPress,
  badge,
}: {
  children: React.ReactNode;
  onPress: () => void;
  badge?: boolean;
}) {
  return (
    <PressableScale
      onPress={onPress}
      rippleBorderless
      style={{
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: "rgba(155,185,255,0.5)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
      {badge ? (
        <View
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: danger[500],
            borderWidth: 1.4,
            borderColor: "#FFFFFF",
          }}
        />
      ) : null}
    </PressableScale>
  );
}

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
  const stuckY = 0;

  /**
   * The bar rides with the page until it reaches the top, then stays. Driving
   * it off the scroll offset rather than swapping a sticky header in keeps it
   * one continuous movement — there is no frame where it jumps between two
   * positions.
   */
  const liftStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.max(stuckY, pillRestY - scrollY.value) }],
  }));

  /**
   * On the way up the bar loses its side margins and its top corners, so it
   * arrives as a header spanning the screen rather than a pill parked at the
   * top. The glass fades out underneath as a solid white takes over, which is
   * what keeps the status bar area readable once content is passing behind.
   */
  const stuckProgress = (y: number) =>
    pillRestY > stuckY ? (pillRestY - y) / (pillRestY - stuckY) : 0;

  const insetStyle = useAnimatedStyle(() => {
    const y = Math.max(stuckY, pillRestY - scrollY.value);
    const stuck = stuckProgress(y);
    return {
      marginHorizontal: interpolate(stuck, [0, 1], [r.gutter, 0], "clamp"),
      borderTopLeftRadius: interpolate(stuck, [0, 1], [radius.lg, 0], "clamp"),
      borderTopRightRadius: interpolate(stuck, [0, 1], [radius.lg, 0], "clamp"),
      borderBottomLeftRadius: radius.lg,
      borderBottomRightRadius: radius.lg,
      overflow: "hidden" as const,
    };
  });

  const solidStyle = useAnimatedStyle(() => {
    const y = Math.max(stuckY, pillRestY - scrollY.value);
    return { opacity: interpolate(stuckProgress(y), [0.45, 1], [0, 1], "clamp") };
  });

  /** The landed bar covers the status bar too, so it needs that height back. */
  const padStyle = useAnimatedStyle(() => {
    const y = Math.max(stuckY, pillRestY - scrollY.value);
    return { height: interpolate(stuckProgress(y), [0, 1], [0, insets.top], "clamp") };
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
          paddingTop: 0,
          paddingBottom: insets.bottom + r.s(170),
          alignItems: "center",
        }}
      >
        <View style={{ width: r.contentWidth }}>
          <PromoCarousel
            slides={banners}
            width={r.contentWidth}
            height={Math.min(300, Math.max(210, r.height * 0.3))}
          />

          {/* Reserves the bar's slot in the flow; the bar itself is drawn in
              the overlay below so it can climb without the page reflowing. */}
          <View
            onLayout={onPillLayout}
            style={{ height: PILL_HEIGHT, marginTop: -PILL_HEIGHT * 0.55 }}
          />

          <View style={{ paddingHorizontal: r.gutter, marginTop: space.md }}>
            <FeedFilter options={options} value={filter} onChange={setFilter} />
          </View>

          <View style={{ gap: space.md, marginTop: space.lg }}>
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
        <View style={{ width: r.contentWidth, alignSelf: "center" }} pointerEvents="box-none">
        <Animated.View style={insetStyle} pointerEvents="box-none">
        <LiquidGlass radius={0} interactive style={{ ...(shadow.sm as object) }}>
          {/* Opaque layer that takes over as the bar lands. */}
          <Animated.View
            style={[
              { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "#FFFFFF" },
              solidStyle,
            ]}
            pointerEvents="none"
          />
          <Animated.View style={padStyle} />
          <View
            style={{
              height: PILL_HEIGHT,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: space.sm + 2,
              gap: space.sm,
            }}
          >
            <PressableScale
              onPress={() => router.push(`/profile/${username}` as never)}
              rippleBorderless
            >
              <Avatar name={name} size={32} />
            </PressableScale>

            {/* Brand lockup supplied later. */}
            <View style={{ flex: 1, alignItems: "center" }}>
              <ImagePlaceholder radius={radius.sm} iconSize={16} style={{ width: 104, height: 26 }} />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: space.xs + 2 }}>
              <GlassButton onPress={() => router.push("/notifications")} badge={unread}>
                <AppIcon name="bell" size={19} color={brand[800]} />
              </GlassButton>
              <GlassButton onPress={openMenu}>
                <AppIcon name="more" size={19} color={brand[800]} />
              </GlassButton>
            </View>
          </View>
        </LiquidGlass>
        </Animated.View>
        </View>
      </Animated.View>

      {showProfileBanner ? (
        <Animated.View
          entering={SlideInDown.delay(450).springify().damping(17)}
          exiting={FadeOutDown.duration(200)}
          style={{
            position: "absolute",
            alignSelf: "center",
            width: r.contentWidth - space.xxl,
            bottom: insets.bottom + r.s(86),
            zIndex: 4,
          }}
        >
          <PressableScale
            onPress={() => router.push("/edit-profile")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: space.md,
              backgroundColor: "#FFFFFF",
              borderRadius: radius.pill,
              paddingVertical: space.sm + 2,
              paddingHorizontal: space.sm + 2,
              ...(shadow.md as object),
            }}
          >
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: gold[100],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppIcon name="gift" size={19} color={gold[500]} />
            </View>
            <UiText
              token="caption"
              color={brand[700]}
              numberOfLines={2}
              style={{ flex: 1, fontFamily: "Urbanist_600SemiBold" }}
            >
              Lengkapi profil anda, dapatkan reward menarik
            </UiText>
            <PressableScale
              onPress={() => setShowProfileBanner(false)}
              hitSlop={14}
              rippleBorderless
            >
              <AppIcon name="close" size={17} color={ink[400]} />
            </PressableScale>
          </PressableScale>
        </Animated.View>
      ) : null}

      <HeaderMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}
