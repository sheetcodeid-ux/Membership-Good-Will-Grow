import React, { useState } from "react";
import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
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
  withTiming,
} from "react-native-reanimated";
import { MoreHorizontal, Gift, X } from "lucide-react-native";
import { AppText } from "../../components/ui/AppText";
import { Avatar } from "../../components/ui/Avatar";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";
import { PressableScale } from "../../components/ui/PressableScale";
import { PostCard } from "../../components/PostCard";
import { HeaderMenu } from "../../components/HeaderMenu";
import { brand, gold, ink, surface } from "../../theme/colors";
import { shadow } from "../../theme/shadows";
import { useFeedStore } from "../../store/feedStore";
import { useAuthStore } from "../../store/authStore";

const filters = ["Semua Feed", "Post", "Check-In"];

/** Banner slots the marketing team fills in later. */
const banners = ["Banner Promo 1", "Banner Promo 2", "Banner Promo 3"];

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

/**
 * One page indicator. Rather than snapping between states it tracks the
 * carousel's scroll offset, so the active dot stretches and fades as the page
 * turns instead of after it.
 */
function Dot({ index, progress }: { index: number; progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const distance = Math.abs(progress.value - index);
    const nearness = Math.max(0, 1 - distance);
    return {
      width: interpolate(nearness, [0, 1], [5, 18]),
      backgroundColor: interpolateColor(nearness, [0, 1], [ink[300], brand[900]]),
    };
  });

  return <Animated.View style={[{ height: 5, borderRadius: 3 }, style]} />;
}

/** Feed filter chip whose fill eases between states. */
function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const progress = useSharedValue(active ? 1 : 0);
  progress.value = withTiming(active ? 1 : 0, { duration: 220 });

  const pillStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [ink[100], brand[900]]),
  }));
  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [ink[600], "#FFFFFF"]),
  }));

  return (
    <PressableScale onPress={onPress} scaleTo={0.94}>
      <Animated.View
        style={[
          {
            height: 24,
            paddingHorizontal: 11,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
          },
          pillStyle,
        ]}
      >
        <Animated.Text
          style={[
            { fontSize: 11, lineHeight: 15, fontFamily: "Urbanist_600SemiBold" },
            labelStyle,
          ]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </PressableScale>
  );
}

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState(filters[0]);
  const [showProfileBanner, setShowProfileBanner] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const posts = useFeedStore((s) => s.posts);
  const name = useAuthStore((s) => s.name);
  const username = useAuthStore((s) => s.username);

  /** Page position of the promo carousel, in pages, updated on the UI thread. */
  const bannerProgress = useSharedValue(0);
  const menuScale = useSharedValue(1);

  const onBannerScroll = useAnimatedScrollHandler((event) => {
    bannerProgress.value = event.contentOffset.x / Math.max(1, width);
  });

  const menuButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: menuScale.value }],
  }));

  // Measured off the reference: the banner covers ~31.5% of the screen and the
  // header pill straddles its bottom edge, which is what the blur picks up.
  const bannerHeight = Math.min(320, Math.max(220, height * 0.315));

  const visiblePosts = posts.filter((p) => {
    if (filter === "Post") return p.type === "post";
    if (filter === "Check-In") return p.type === "checkin";
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 170 }}
      >
        <View>
          <AnimatedScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onBannerScroll}
            scrollEventThrottle={16}
            style={{ height: bannerHeight }}
          >
            {banners.map((label) => (
              <ImagePlaceholder
                key={label}
                label={label}
                radius={0}
                iconSize={40}
                style={{ height: bannerHeight, width }}
              />
            ))}
          </AnimatedScrollView>

          <View
            style={{
              position: "absolute",
              // Clears the header pill, which overlaps the banner's bottom edge.
              bottom: 34,
              alignSelf: "center",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
            pointerEvents="none"
          >
            {banners.map((label, i) => (
              <Dot key={label} index={i} progress={bannerProgress} />
            ))}
          </View>
        </View>

        <View
          style={{
            marginHorizontal: 16,
            marginTop: -22,
            height: 50,
            borderRadius: 20,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.55)",
            ...(shadow.xs as object),
          }}
        >
          <BlurView intensity={45} tint="light" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={["rgba(210,224,255,0.45)", "rgba(255,255,255,0.35)", "rgba(219,230,255,0.45)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 9,
            }}
          >
            <PressableScale onPress={() => router.push(`/profile/${username}` as never)}>
              <Avatar name={name} size={26} />
            </PressableScale>
            {/* Brand lockup supplied later. */}
            <ImagePlaceholder radius={6} iconSize={13} style={{ width: 96, height: 21 }} />
            <PressableScale
              onPress={() => {
                menuScale.value = withSpring(0.9, { damping: 14, stiffness: 320 });
                menuScale.value = withSpring(1, { damping: 12, stiffness: 240 });
                setMenuOpen(true);
              }}
              hitSlop={8}
            >
              <Animated.View
                style={[
                  {
                    width: 30,
                    height: 30,
                    borderRadius: 10,
                    backgroundColor: "rgba(155,185,255,0.55)",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  menuButtonStyle,
                ]}
              >
                <MoreHorizontal size={17} color={brand[800]} />
              </Animated.View>
            </PressableScale>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          style={{ marginTop: 12, flexGrow: 0 }}
        >
          {filters.map((f) => (
            <FilterPill key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
          ))}
        </ScrollView>

        <View style={{ marginTop: 20, gap: 28 }}>
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
      </ScrollView>

      {showProfileBanner ? (
        <Animated.View
          entering={SlideInDown.delay(400).springify().damping(17)}
          exiting={FadeOutDown.duration(200)}
          style={{
            position: "absolute",
            left: 12,
            right: 12,
            bottom: insets.bottom + 80,
          }}
        >
          <PressableScale
            onPress={() => router.push("/edit-profile")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 11,
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              paddingVertical: 10,
              paddingHorizontal: 12,
              ...(shadow.md as object),
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 9,
                backgroundColor: gold[50],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Gift size={15} color={gold[600]} />
            </View>
            <AppText
              color={brand[700]}
              style={{ flex: 1, fontSize: 11.5, lineHeight: 16, fontFamily: "Urbanist_600SemiBold" }}
            >
              Lengkapi profil anda, dapatkan reward menarik
            </AppText>
            <PressableScale onPress={() => setShowProfileBanner(false)} hitSlop={12}>
              <X size={16} color={ink[400]} />
            </PressableScale>
          </PressableScale>
        </Animated.View>
      ) : null}

      <HeaderMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}
