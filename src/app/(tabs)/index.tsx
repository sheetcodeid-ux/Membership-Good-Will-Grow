import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Image, RefreshControl, View, type LayoutChangeEvent } from "react-native";
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
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { UiText } from "../../components/ui/Text";
import { Avatar } from "../../components/ui/Avatar";
import { PressableScale } from "../../components/ui/PressableScale";
import { AppIcon } from "../../components/ui/AppIcon";
import { SignalDot } from "../../components/ui/SignalDot";
import { LiquidGlass } from "../../components/ui/LiquidGlass";
import { PostCard } from "../../components/PostCard";
import { PostCardSkeleton } from "../../components/ui/Skeleton";
import { HeaderMenu } from "../../components/HeaderMenu";
import { PromoCarousel } from "../../components/PromoCarousel";
import { promoBanners } from "../../data/banners";
import { FeedFilter, type FeedFilterOption } from "../../components/FeedFilter";
import { brand, gold, ink, surface } from "../../theme/colors";
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

const PILL_HEIGHT = 52;
/**
 * The bar's corner at rest. Deliberately tighter than the cards below it: on
 * a 52pt bar the card radius turns the ends into half-circles, which reads as
 * a pill floating on the banner rather than as a bar resting against it.
 */
const BAR_RADIUS = 13;

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
      {badge ? <SignalDot /> : null}
    </PressableScale>
  );
}

export default function HomeScreen() {
  const r = useResponsive();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState("all");
  const [showProfileBanner, setShowProfileBanner] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  /**
   * Read inside worklets, so it has to be a shared value. Holding it in React
   * state meant the animated styles closed over the 0 they were created with
   * and the bar never actually reached full width when it landed.
   */
  const pillRestY = useSharedValue(0);
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
    transform: [{ translateY: Math.max(stuckY, pillRestY.value - scrollY.value) }],
  }));

  /**
   * On the way up the bar loses its side margins and its top corners, so it
   * arrives as a header spanning the screen rather than a pill parked at the
   * top. The glass fades out underneath as a solid white takes over, which is
   * what keeps the status bar area readable once content is passing behind.
   */
  const stuck = useDerivedValue(() => {
    const rest = pillRestY.value;
    if (rest <= stuckY) return 0;
    const y = Math.max(stuckY, rest - scrollY.value);
    return (rest - y) / (rest - stuckY);
  });

  /**
   * marginLeft/marginRight rather than the shorthand: the shorthand is
   * expanded once at style-resolution time, so every frame Reanimated wrote
   * afterwards landed on a property nothing reads and the bar stayed inset by
   * a gutter no matter how far it had climbed.
   *
   * The radii are split across two layers. A view cannot both cast a shadow
   * and clip its children on iOS, so the outer layer carries the margins and
   * the shadow, and the inner one — same curve, no shadow — does the
   * clipping.
   */
  const shellStyle = useAnimatedStyle(() => ({
    marginLeft: interpolate(stuck.value, [0, 1], [r.gutter, 0], "clamp"),
    marginRight: interpolate(stuck.value, [0, 1], [r.gutter, 0], "clamp"),
    borderTopLeftRadius: interpolate(stuck.value, [0, 1], [BAR_RADIUS, 0], "clamp"),
    borderTopRightRadius: interpolate(stuck.value, [0, 1], [BAR_RADIUS, 0], "clamp"),
    borderBottomLeftRadius: interpolate(stuck.value, [0, 1], [BAR_RADIUS, radius.lg], "clamp"),
    borderBottomRightRadius: interpolate(stuck.value, [0, 1], [BAR_RADIUS, radius.lg], "clamp"),
  }));

  const clipStyle = useAnimatedStyle(() => ({
    borderTopLeftRadius: interpolate(stuck.value, [0, 1], [BAR_RADIUS, 0], "clamp"),
    borderTopRightRadius: interpolate(stuck.value, [0, 1], [BAR_RADIUS, 0], "clamp"),
    borderBottomLeftRadius: interpolate(stuck.value, [0, 1], [BAR_RADIUS, radius.lg], "clamp"),
    borderBottomRightRadius: interpolate(stuck.value, [0, 1], [BAR_RADIUS, radius.lg], "clamp"),
    overflow: "hidden" as const,
  }));

  const solidStyle = useAnimatedStyle(() => ({
    opacity: interpolate(stuck.value, [0.45, 1], [0, 1], "clamp"),
  }));

  /**
   * The bar's contents travel with its edges. Once it spans the screen the
   * avatar and the overflow button sit on the page gutter, in line with
   * everything below them; while it is still a pill they tuck back in.
   */
  const rowPadStyle = useAnimatedStyle(() => ({
    paddingLeft: interpolate(stuck.value, [0, 1], [space.sm + 2, r.gutter], "clamp"),
    paddingRight: interpolate(stuck.value, [0, 1], [space.sm + 2, r.gutter], "clamp"),
  }));

  /** The landed bar covers the status bar too, so it needs that height back. */
  const padStyle = useAnimatedStyle(() => ({
    height: interpolate(stuck.value, [0, 1], [0, insets.top], "clamp"),
  }));

  const onPillLayout = useCallback(
    (e: LayoutChangeEvent) => {
      pillRestY.value = e.nativeEvent.layout.y;
    },
    [pillRestY]
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
            slides={promoBanners}
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
        <View style={{ width: "100%", maxWidth: Math.max(r.contentWidth, 520), alignSelf: "center" }} pointerEvents="box-none">
        <Animated.View
          style={[shellStyle, shadow.glass as object]}
          pointerEvents="box-none"
        >
        <Animated.View style={clipStyle} pointerEvents="box-none">
        <LiquidGlass radius={0} interactive>
          {/* Opaque layer that takes over as the bar lands. */}
          <Animated.View
            style={[
              { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "#FFFFFF" },
              solidStyle,
            ]}
            pointerEvents="none"
          />
          <Animated.View style={padStyle} />
          <Animated.View
            style={[
              {
                height: PILL_HEIGHT,
                flexDirection: "row",
                alignItems: "center",
                gap: space.sm,
              },
              rowPadStyle,
            ]}
          >
            <PressableScale
              onPress={() => router.push(`/profile/${username}` as never)}
              rippleBorderless
            >
              <Avatar name={name} size={32} />
            </PressableScale>

            <View style={{ flex: 1 }} />

            {/* Absolutely centred: the avatar on one side and two buttons on
                the other leave uneven space, so a flex box would sit the
                lockup left of the true centre. */}
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
              pointerEvents="none"
            >
              <Image
                source={require("../../../assets/brand/logo-kawan.png")}
                resizeMode="contain"
                accessible
                accessibilityRole="image"
                accessibilityLabel="Good Will Grow"
                style={{ width: 104, height: 28 }}
              />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: space.xs + 2 }}>
              <GlassButton onPress={() => router.push("/notifications")} badge={unread}>
                <AppIcon name="bell" size={19} color={brand[800]} />
              </GlassButton>
              <GlassButton onPress={openMenu}>
                <AppIcon name="more" size={19} color={brand[800]} />
              </GlassButton>
            </View>
          </Animated.View>
        </LiquidGlass>
        </Animated.View>
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
