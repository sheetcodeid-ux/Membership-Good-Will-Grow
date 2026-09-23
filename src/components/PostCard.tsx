import React, { useEffect } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Bookmark,
  BadgeCheck,
  ChevronRight,
  MapPin,
} from "lucide-react-native";
import { AppText } from "./ui/AppText";
import { Avatar } from "./ui/Avatar";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";
import { PressableScale } from "./ui/PressableScale";
import { brand, ink, danger } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { useResponsive } from "../theme/responsive";
import { useFeedStore } from "../store/feedStore";
import { useSocialStore } from "../store/socialStore";
import type { FeedPost } from "../data/types";

/**
 * Action with a mark that reacts when it turns on: a quick overshoot rather
 * than an instant colour swap, so tapping it feels like it registered.
 */
function ReactionButton({
  active,
  onPress,
  children,
  count,
  size,
}: {
  active: boolean;
  onPress: () => void;
  children: React.ReactNode;
  count?: number;
  size: number;
}) {
  const pop = useSharedValue(1);

  useEffect(() => {
    if (active) {
      pop.value = withSequence(
        withTiming(1.32, { duration: 110 }),
        withSpring(1, { damping: 9, stiffness: 340 })
      );
    }
  }, [active, pop]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));

  return (
    <PressableScale
      onPress={onPress}
      hitSlop={10}
      rippleBorderless
      style={{ flexDirection: "row", alignItems: "center", gap: size * 0.35 }}
    >
      <Animated.View style={style}>{children}</Animated.View>
      {count !== undefined ? (
        <AppText variant="captionMedium" color={active ? ink[700] : ink[500]}>
          {count}
        </AppText>
      ) : null}
    </PressableScale>
  );
}

function CheckInCard({ outletName, s }: { outletName: string; s: (n: number) => number }) {
  return (
    <PressableScale
      scaleTo={0.99}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: s(12),
        marginTop: s(12),
        borderRadius: s(14),
        overflow: "hidden",
        borderWidth: 1,
        borderColor: brand[100],
      }}
    >
      <LinearGradient
        colors={[brand[50], "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: s(12),
          paddingVertical: s(10),
          paddingHorizontal: s(12),
        }}
      >
        <View
          style={{
            width: s(34),
            height: s(34),
            borderRadius: s(11),
            backgroundColor: brand[900],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MapPin size={s(17)} color="#FFFFFF" fill="#FFFFFF" strokeWidth={1.6} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="caption" color={ink[400]}>
            Check In
          </AppText>
          <AppText variant="bodySemibold" color={brand[800]} numberOfLines={1}>
            {outletName}
          </AppText>
        </View>
        <ChevronRight size={s(18)} color={brand[700]} strokeWidth={2.2} />
      </LinearGradient>
    </PressableScale>
  );
}

/**
 * Memoised: the feed re-renders whenever a filter or a like changes, and
 * without this every card in the list re-runs its layout for one card's sake.
 */
function PostCardBase({ post }: { post: FeedPost }) {
  const r = useResponsive();
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const toggleBookmark = useSocialStore((s) => s.toggleBookmark);
  const bookmarked = useSocialStore((s) => s.isBookmarked(post.id));

  const openProfile = () => router.push(`/profile/${post.authorHandle.replace("@", "")}`);
  const openComments = () => router.push(`/comments/${post.id}`);

  return (
    <View
      style={{
        marginHorizontal: r.gutter,
        backgroundColor: "#FFFFFF",
        borderRadius: r.s(20),
        padding: r.s(14),
        ...(shadow.sm as object),
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: r.s(11) }}>
        <PressableScale onPress={openProfile} rippleBorderless>
          <Avatar name={post.authorName} size={r.s(38)} />
        </PressableScale>

        <View style={{ flex: 1, gap: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: r.s(5) }}>
            <PressableScale onPress={openProfile} rippleColor={null}>
              <AppText variant="titleLg" numberOfLines={1}>
                {post.authorName}
              </AppText>
            </PressableScale>
            <BadgeCheck size={r.s(14)} color={brand[500]} fill={brand[500]} strokeWidth={0} />
          </View>
          <AppText variant="caption" color={ink[400]}>
            {post.time}
          </AppText>
        </View>

        <PressableScale hitSlop={10} rippleBorderless>
          <MoreHorizontal size={r.s(18)} color={ink[300]} />
        </PressableScale>
      </View>

      {post.type === "checkin" && post.outletName ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: r.s(5),
            marginTop: r.s(11),
          }}
        >
          <MapPin size={r.s(13)} color={danger[500]} fill={danger[500]} strokeWidth={0} />
          <AppText variant="captionMedium" color={ink[600]} numberOfLines={1}>
            {post.outletName}
          </AppText>
        </View>
      ) : null}

      <AppText
        variant="body"
        color={ink[800]}
        style={{ marginTop: r.s(9), lineHeight: r.s(19) }}
      >
        {post.caption}
      </AppText>

      <PressableScale onPress={openComments} scaleTo={0.995} rippleColor={null}>
        <View
          style={{
            marginTop: r.s(12),
            borderRadius: r.s(16),
            overflow: "hidden",
          }}
        >
          <ImagePlaceholder
            label="Foto Post"
            radius={r.s(16)}
            iconSize={r.s(32)}
            style={{ height: r.s(252) }}
          />
          {/* Scrim so anything laid over the artwork stays readable. */}
          <LinearGradient
            colors={["transparent", "rgba(8,30,80,0.28)"]}
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: r.s(70) }}
            pointerEvents="none"
          />
        </View>
      </PressableScale>

      {post.type === "checkin" && post.outletName ? (
        <CheckInCard outletName={post.outletName} s={r.s} />
      ) : null}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: r.s(18),
          marginTop: r.s(13),
        }}
      >
        <ReactionButton
          active={!!post.liked}
          onPress={() => toggleLike(post.id)}
          count={post.likes}
          size={r.s(18)}
        >
          <Heart
            size={r.s(19)}
            color={post.liked ? danger[500] : ink[400]}
            fill={post.liked ? danger[500] : "transparent"}
            strokeWidth={post.liked ? 0 : 1.9}
          />
        </ReactionButton>

        <ReactionButton
          active={false}
          onPress={openComments}
          count={post.comments}
          size={r.s(18)}
        >
          <MessageCircle size={r.s(19)} color={ink[400]} strokeWidth={1.9} />
        </ReactionButton>

        <View style={{ flex: 1 }} />

        <ReactionButton
          active={bookmarked}
          onPress={() => toggleBookmark(post.id)}
          size={r.s(18)}
        >
          <Bookmark
            size={r.s(19)}
            color={bookmarked ? brand[700] : ink[400]}
            fill={bookmarked ? brand[700] : "transparent"}
            strokeWidth={bookmarked ? 0 : 1.9}
          />
        </ReactionButton>
      </View>
    </View>
  );
}

export const PostCard = React.memo(
  PostCardBase,
  (a, b) =>
    a.post.id === b.post.id &&
    a.post.liked === b.post.liked &&
    a.post.likes === b.post.likes &&
    a.post.bookmarked === b.post.bookmarked &&
    a.post.comments === b.post.comments
);
