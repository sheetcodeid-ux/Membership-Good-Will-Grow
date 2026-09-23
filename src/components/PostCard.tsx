import React, { useEffect } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { UiText } from "./ui/Text";
import { Avatar } from "./ui/Avatar";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";
import { PressableScale } from "./ui/PressableScale";
import { AppIcon } from "./ui/AppIcon";
import { BrandLogo } from "./BrandLogo";
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

function CheckInCard({
  outletName,
  brandId,
  s,
}: {
  outletName: string;
  brandId?: string;
  s: (n: number) => number;
}) {
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
        {/* The partner's own mark says where this is far faster than a pin. */}
        <View
          style={{
            width: s(38),
            height: s(38),
            borderRadius: s(12),
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: ink[100],
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <BrandLogo brandId={brandId} size={s(30)} />
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

  const burst = useSharedValue(0);
  const burstStyle = useAnimatedStyle(() => ({
    opacity: burst.value,
    transform: [{ scale: 0.6 + burst.value * 0.55 }],
  }));

  const like = () => {
    if (!post.liked) toggleLike(post.id);
  };

  // A double tap likes and throws a heart; a single tap still opens comments,
  // but only once the double tap has been ruled out.
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(like)();
      burst.value = withSequence(
        withTiming(1, { duration: 130 }),
        withDelay(280, withTiming(0, { duration: 220 }))
      );
    });

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => runOnJS(openComments)());

  const mediaGesture = Gesture.Exclusive(doubleTap, singleTap);

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
            <AppIcon name="verified" size={r.s(16)} color={brand[500]} />
          </View>
          <UiText token="caption" color={ink[400]}>
            {post.time}
          </UiText>
        </View>

        <PressableScale hitSlop={10} rippleBorderless>
          <AppIcon name="more" size={r.s(18)} color={ink[300]} />
        </PressableScale>
      </View>

      <UiText token="body" color={ink[800]} style={{ marginTop: space.md }}>
        {post.caption}
      </UiText>

      <GestureDetector gesture={mediaGesture}>
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

          {/* Heart thrown by a double tap, then cleared. */}
          <Animated.View
            style={[
              {
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
              },
              burstStyle,
            ]}
            pointerEvents="none"
          >
            <AppIcon name="heart" size={r.s(96)} color="#FFFFFF" emphasis />
          </Animated.View>
        </View>
      </GestureDetector>

      {post.type === "checkin" && post.outletName ? (
        <CheckInCard outletName={post.outletName} brandId={post.brandId} s={r.s} />
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
