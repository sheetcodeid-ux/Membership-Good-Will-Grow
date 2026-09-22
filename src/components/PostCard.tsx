import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Heart, MessageCircle, MoreHorizontal, MapPin, BadgeCheck } from "lucide-react-native";
import { AppText } from "./ui/AppText";
import { Avatar } from "./ui/Avatar";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";
import { PressableScale } from "./ui/PressableScale";
import { ink, danger } from "../theme/colors";
import { useFeedStore } from "../store/feedStore";
import type { FeedPost } from "../data/types";

export function PostCard({ post }: { post: FeedPost }) {
  const toggleLike = useFeedStore((s) => s.toggleLike);

  return (
    <View style={{ flexDirection: "row", gap: 13, paddingHorizontal: 16 }}>
      <Avatar name={post.authorName} size={34} />

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <AppText variant="titleLg">{post.authorName}</AppText>
          <BadgeCheck size={15} color={ink[300]} />
          <View style={{ flex: 1 }} />
          <PressableScale hitSlop={10}>
            <MoreHorizontal size={19} color={ink[300]} />
          </PressableScale>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          {post.type === "checkin" ? <MapPin size={11} color={ink[400]} /> : null}
          <AppText variant="caption" color={ink[400]} numberOfLines={1} style={{ flex: 1 }}>
            {post.type === "checkin" ? `${post.outletName} · ${post.time}` : post.time}
          </AppText>
        </View>

        <AppText variant="body" color={ink[900]} style={{ marginTop: 10 }}>
          {post.caption}
        </AppText>

        <PressableScale onPress={() => router.push(`/post/${post.id}`)} scaleTo={0.99}>
          <ImagePlaceholder
            label="Foto Post"
            radius={14}
            iconSize={32}
            style={{ marginTop: 12, height: 300 }}
          />
        </PressableScale>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 20, marginTop: 12 }}>
          <PressableScale
            onPress={() => toggleLike(post.id)}
            style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            hitSlop={8}
          >
            <Heart
              size={19}
              color={post.liked ? danger[500] : ink[400]}
              fill={post.liked ? danger[500] : "transparent"}
            />
            <AppText variant="captionMedium" color={ink[500]}>
              {post.likes}
            </AppText>
          </PressableScale>

          <PressableScale
            onPress={() => router.push(`/post/${post.id}`)}
            style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            hitSlop={8}
          >
            <MessageCircle size={19} color={ink[400]} />
            <AppText variant="captionMedium" color={ink[500]}>
              {post.comments}
            </AppText>
          </PressableScale>
        </View>
      </View>
    </View>
  );
}
