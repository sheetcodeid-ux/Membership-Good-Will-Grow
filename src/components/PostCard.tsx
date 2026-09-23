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
import { UiText } from "./ui/Text";
import { Avatar } from "./ui/Avatar";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";
import { PressableScale } from "./ui/PressableScale";
import { AppIcon } from "./ui/AppIcon";
import { brand, ink, danger } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { useResponsive } from "../theme/responsive";
import { radius, space } from "../theme/scale";
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
        <UiText token="captionMedium" color={active ? ink[700] : ink[500]}>
          {count}
        </UiText>
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
          <AppIcon name="pin" size={s(18)} color="#FFFFFF" emphasis />
        </View>
        <View style={{ flex: 1 }}>
          <UiText token="caption" color={ink[400]}>
            Check In
          </UiText>
          <UiText token="bodySemibold" color={brand[800]} numberOfLines={1}>
            {outletName}
          </UiText>
        </View>
        <AppIcon name="chevronRight" size={s(18)} color={brand[700]} />
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
        borderRadius: radius.xl,
        padding: space.lg,
        ...(shadow.sm as object),
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
        <PressableScale onPress={openProfile} rippleBorderless>
          <Avatar name={post.authorName} size={r.s(42)} />
        </PressableScale>

        <View style={{ flex: 1, gap: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: r.s(5) }}>
            <PressableScale onPress={openProfile} rippleColor={null}>
              <UiText token="titleLg" numberOfLines={1}>
                {post.authorName}
              </UiText>
            </PressableScale>
            <AppIcon name="member" size={r.s(15)} color={brand[500]} emphasis />
          </View>
          <UiText token="caption" color={ink[400]}>
            {post.time}
          </UiText>
        </View>

        <PressableScale hitSlop={10} rippleBorderless>
          <AppIcon name="more" size={r.s(18)} color={ink[300]} />
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
          <AppIcon name="pin" size={r.s(14)} color={danger[500]} emphasis />
          <UiText token="captionMedium" color={ink[600]} numberOfLines={1}>
            {post.outletName}
          </UiText>
        </View>
      ) : null}

      <UiText token="body" color={ink[800]} style={{ marginTop: space.sm + 2 }}>
        {post.caption}
      </UiText>

      <PressableScale onPress={openComments} scaleTo={0.995} rippleColor={null}>
        <View
          style={{
            marginTop: space.md,
            borderRadius: radius.lg,
            overflow: "hidden",
          }}
        >
          <ImagePlaceholder
            label="Foto Post"
            radius={radius.lg}
            iconSize={r.s(32)}
            style={{ height: r.s(240) }}
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
          gap: space.xl,
          marginTop: space.lg,
        }}
      >
        <ReactionButton
          active={!!post.liked}
          onPress={() => toggleLike(post.id)}
          count={post.likes}
          size={r.s(18)}
        >
          <AppIcon
            name="heart"
            size={r.s(21)}
            color={post.liked ? danger[500] : ink[400]}
            emphasis={!!post.liked}
          />
        </ReactionButton>

        <ReactionButton
          active={false}
          onPress={openComments}
          count={post.comments}
          size={r.s(18)}
        >
          <AppIcon name="comment" size={r.s(21)} color={ink[400]} />
        </ReactionButton>

        <View style={{ flex: 1 }} />

        <ReactionButton
          active={bookmarked}
          onPress={() => toggleBookmark(post.id)}
          size={r.s(18)}
        >
          <AppIcon
            name="bookmark"
            size={r.s(21)}
            color={bookmarked ? brand[700] : ink[400]}
            emphasis={bookmarked}
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
