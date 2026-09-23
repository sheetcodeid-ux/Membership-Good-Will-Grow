import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  type SharedValue,
  FadeInDown,
  FadeOutDown,
  SlideInDown,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { UiText } from "../../components/ui/Text";
import { Avatar } from "../../components/ui/Avatar";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";
import { PressableScale } from "../../components/ui/PressableScale";
import { AppIcon } from "../../components/ui/AppIcon";
import { LiquidGlass } from "../../components/ui/LiquidGlass";
import { PostCard } from "../../components/PostCard";
import { HeaderMenu } from "../../components/HeaderMenu";
import { FeedFilter, type FeedFilterOption } from "../../components/FeedFilter";
import { brand, gold, ink, surface } from "../../theme/colors";
import { shadow } from "../../theme/shadows";
import { useResponsive } from "../../theme/responsive";
import { radius, space } from "../../theme/scale";
import { useFeedStore } from "../../store/feedStore";
import { useAuthStore } from "../../store/authStore";

const filters: FeedFilterOption[] = [
  { key: "all", label: "Semua", icon: "home" },
  { key: "post", label: "Post", icon: "comment" },
  { key: "checkin", label: "Check-In", icon: "pin" },
];

/** Banner slots the marketing team fills in later. */
const banners = ["Banner Promo 1", "Banner Promo 2", "Banner Promo 3"];

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

/**
 * One page indicator. Rather than snapping between states it tracks the
 * carousel's scroll offset, so the active dot stretches and fades as the page
 * turns instead of after it.
 */
function Dot({
  index,
  progress,
  size,
}: {
  index: number;
  progress: SharedValue<number>;
  size: number;
}) {
  const style = useAnimatedStyle(() => {
    const nearness = Math.max(0, 1 - Math.abs(progress.value - index));
    return {
      width: interpolate(nearness, [0, 1], [size, size * 3.6]),
      backgroundColor: interpolateColor(nearness, [0, 1], [ink[400], brand[900]]),
    };
  });

  return <Animated.View style={[{ height: size, borderRadius: size / 2 }, style]} />;
}

export default function HomeScreen() {
  const r = useResponsive();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState("all");
  const [showProfileBanner, setShowProfileBanner] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const posts = useFeedStore((s) => s.posts);
  const name = useAuthStore((s) => s.name);
  const username = useAuthStore((s) => s.username);

  const bannerProgress = useSharedValue(0);
  const menuScale = useSharedValue(1);

  // The carousel pages on the content column, which is narrower than the
  // window once the screen is wide enough to centre it.
  const pageWidth = r.contentWidth;

  const onBannerScroll = useAnimatedScrollHandler((event) => {
    bannerProgress.value = event.contentOffset.x / Math.max(1, pageWidth);
  });

  const menuButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: menuScale.value }],
  }));

  // Measured off the reference at 31.5% of the screen, then bounded so the
  // banner neither swallows a tall phone nor vanishes on a short one.
  const bannerHeight = Math.min(360, Math.max(200, r.height * 0.315));
  const pillHeight = r.s(56);

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

  const openMenu = useCallback(() => {
    menuScale.value = withSpring(0.9, { damping: 14, stiffness: 400 });
    menuScale.value = withSpring(1, { damping: 12, stiffness: 260 });
    setMenuOpen(true);
  }, [menuScale]);

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + r.s(170),
          alignItems: "center",
        }}
      >
        {/* Content column: full width on phones, centred and capped beyond. */}
        <View style={{ width: pageWidth }}>
          <View>
            <AnimatedScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onBannerScroll}
              scrollEventThrottle={16}
              decelerationRate="fast"
              style={{ height: bannerHeight }}
            >
              {banners.map((label) => (
                <ImagePlaceholder
                  key={label}
                  label={label}
                  radius={0}
                  iconSize={r.s(40)}
                  style={{ height: bannerHeight, width: pageWidth }}
                />
              ))}
            </AnimatedScrollView>

            <View
              style={{
                position: "absolute",
                bottom: pillHeight * 0.68,
                alignSelf: "center",
                flexDirection: "row",
                alignItems: "center",
                gap: r.s(6),
              }}
              pointerEvents="none"
            >
              {banners.map((label, i) => (
                <Dot key={label} index={i} progress={bannerProgress} size={r.s(5)} />
              ))}
            </View>
          </View>

          <LiquidGlass
            radius={radius.xl}
            interactive
            style={{
              marginHorizontal: r.gutter,
              marginTop: -pillHeight * 0.46,
              height: pillHeight,
              ...(shadow.xs as object),
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: space.md,
              }}
            >
              <PressableScale
                onPress={() => router.push(`/profile/${username}` as never)}
                hitSlop={10}
                rippleBorderless
              >
                <Avatar name={name} size={r.s(32)} />
              </PressableScale>
              {/* Brand lockup supplied later. */}
              <ImagePlaceholder
                radius={6}
                iconSize={r.s(13)}
                style={{ width: r.s(104), height: r.s(24) }}
              />
              <PressableScale onPress={openMenu} hitSlop={10} rippleBorderless>
                <Animated.View
                  style={[
                    {
                      width: r.s(38),
                      height: r.s(38),
                      borderRadius: radius.md,
                      backgroundColor: "rgba(155,185,255,0.55)",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                    menuButtonStyle,
                  ]}
                >
                  <AppIcon name="more" size={r.s(19)} color={brand[800]} emphasis />
                </Animated.View>
              </PressableScale>
            </View>
          </LiquidGlass>

          <View style={{ marginTop: space.lg, paddingHorizontal: r.gutter }}>
            <FeedFilter options={options} value={filter} onChange={setFilter} />
          </View>

          <View style={{ marginTop: space.lg, gap: space.md }}>
            {visiblePosts.map((post, i) => (
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
      </ScrollView>

      {showProfileBanner ? (
        <Animated.View
          entering={SlideInDown.delay(400).springify().damping(17)}
          exiting={FadeOutDown.duration(200)}
          style={{
            position: "absolute",
            alignSelf: "center",
            width: pageWidth - r.gutter * 1.5,
            bottom: insets.bottom + r.s(88),
          }}
        >
          <PressableScale
            onPress={() => router.push("/edit-profile")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: space.md,
              backgroundColor: "#FFFFFF",
              borderRadius: radius.lg,
              paddingVertical: space.md,
              paddingHorizontal: space.lg,
              ...(shadow.md as object),
            }}
          >
            <View
              style={{
                width: r.s(36),
                height: r.s(36),
                borderRadius: radius.sm,
                backgroundColor: gold[50],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppIcon name="gift" size={r.s(19)} color={gold[600]} emphasis />
            </View>
            <UiText token="bodySemibold" color={brand[700]} numberOfLines={2} style={{ flex: 1 }}>
              Lengkapi profil anda, dapatkan reward menarik
            </UiText>
            <PressableScale
              onPress={() => setShowProfileBanner(false)}
              hitSlop={14}
              rippleBorderless
            >
              <AppIcon name="close" size={r.s(20)} color={ink[400]} />
            </PressableScale>
          </PressableScale>
        </Animated.View>
      ) : null}

      <HeaderMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}
