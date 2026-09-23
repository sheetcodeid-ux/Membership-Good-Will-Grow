import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Bookmark,
  BadgeCheck,
  ChevronRight,
} from "lucide-react-native";
import { AppText } from "./ui/AppText";
import { Avatar } from "./ui/Avatar";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";
import { PressableScale } from "./ui/PressableScale";
import { brand, ink, danger } from "../theme/colors";
import { useFeedStore } from "../store/feedStore";
import { useSocialStore } from "../store/socialStore";
import type { FeedPost } from "../data/types";

function CheckInCard({ outletName }: { outletName: string }) {
  return (
    <PressableScale
      scaleTo={0.99}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 12,
        backgroundColor: brand[50],
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 12,
      }}
    >
      <ImagePlaceholder radius={8} iconSize={14} style={{ width: 54, height: 30 }} />
      <View style={{ flex: 1 }}>
        <AppText variant="caption" color={ink[400]}>
          Check In :
        </AppText>
        <AppText variant="bodySemibold" color={brand[800]} numberOfLines={1}>
          {outletName}
        </AppText>
      </View>
      <ChevronRight size={18} color={brand[700]} />
    </PressableScale>
  );
}

/**
 * Memoised: the feed re-renders whenever a filter or a like changes, and
 * without this every card in the list re-runs its layout for one card's sake.
 */
function PostCardBase({ post }: { post: FeedPost }) {
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const toggleBookmark = useSocialStore((s) => s.toggleBookmark);
  const bookmarked = useSocialStore((s) => s.isBookmarked(post.id));

  const openProfile = () => router.push(`/profile/${post.authorHandle.replace("@", "")}`);

  return (
    <View style={{ flexDirection: "row", gap: 13, paddingHorizontal: 16 }}>
      <PressableScale onPress={openProfile}>
        <Avatar name={post.authorName} size={30} />
      </PressableScale>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <PressableScale onPress={openProfile}>
            <AppText variant="titleLg">{post.authorName}</AppText>
          </PressableScale>
          <BadgeCheck size={13} color={ink[300]} />
          <View style={{ flex: 1 }} />
          <PressableScale hitSlop={10}>
            <MoreHorizontal size={17} color={ink[300]} />
          </PressableScale>
        </View>

        <AppText variant="caption" color={ink[400]}>
          {post.time}
        </AppText>

        <AppText variant="body" color={ink[900]} style={{ marginTop: 10 }}>
          {post.type === "checkin" && post.outletName ? `📍 ${post.outletName}\n` : ""}
          {post.caption}
        </AppText>

        <PressableScale onPress={() => router.push(`/comments/${post.id}`)} scaleTo={0.99}>
          <ImagePlaceholder
            label="Foto Post"
            radius={14}
            iconSize={32}
            style={{ marginTop: 10, height: 258 }}
          />
        </PressableScale>

        {post.type === "checkin" && post.outletName ? (
          <CheckInCard outletName={post.outletName} />
        ) : null}

        <View style={{ flexDirection: "row", alignItems: "center", gap: 20, marginTop: 12 }}>
          <PressableScale
            onPress={() => toggleLike(post.id)}
            style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            hitSlop={8}
          >
            <Heart
              size={17}
              color={post.liked ? danger[500] : ink[400]}
              fill={post.liked ? danger[500] : "transparent"}
            />
            <AppText variant="captionMedium" color={ink[500]}>
              {post.likes}
            </AppText>
          </PressableScale>

          <PressableScale
            onPress={() => router.push(`/comments/${post.id}`)}
            style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            hitSlop={8}
          >
            <MessageCircle size={17} color={brand[700]} fill={brand[700]} />
            <AppText variant="captionMedium" color={ink[500]}>
              {post.comments}
            </AppText>
          </PressableScale>

          <View style={{ flex: 1 }} />

          <PressableScale onPress={() => toggleBookmark(post.id)} hitSlop={10}>
            <Bookmark
              size={17}
              color={bookmarked ? brand[700] : ink[400]}
              fill={bookmarked ? brand[700] : "transparent"}
            />
          </PressableScale>
        </View>
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
