import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Heart, MessageCircle, MapPin, Share2 } from "lucide-react-native";
import { Card } from "./ui/Card";
import { AppText } from "./ui/AppText";
import { Avatar } from "./ui/Avatar";
import { MediaTile } from "./ui/MediaTile";
import { PressableScale } from "./ui/PressableScale";
import { ink, danger } from "../theme/colors";
import { getBrand } from "../data/mock";
import { useFeedStore } from "../store/feedStore";
import type { FeedPost } from "../data/types";

export function PostCard({ post }: { post: FeedPost }) {
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const brandInfo = getBrand(post.brandId);

  return (
    <Card style={{ gap: 12 }} onPress={() => router.push(`/post/${post.id}`)}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Avatar name={post.authorName} size={42} />
        <View style={{ flex: 1 }}>
          <AppText variant="titleLg">{post.authorName}</AppText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            {post.type === "checkin" ? <MapPin size={12} color={ink[400]} /> : null}
            <AppText variant="caption" color={ink[500]} numberOfLines={1}>
              {post.type === "checkin" ? post.outletName : post.time}
            </AppText>
            {post.type === "checkin" ? (
              <AppText variant="caption" color={ink[400]}>
                · {post.time}
              </AppText>
            ) : null}
          </View>
        </View>
      </View>

      <AppText variant="body" color={ink[800]}>
        {post.caption}
      </AppText>

      {brandInfo ? (
        <MediaTile
          colors={brandInfo.gradient}
          icon={brandInfo.category === "coffee" ? "coffee" : "drumstick"}
          radius={16}
          iconSize={40}
          style={{ height: 160, width: "100%" }}
        />
      ) : null}

      <View style={{ flexDirection: "row", alignItems: "center", gap: 20, paddingTop: 4 }}>
        <PressableScale
          onPress={() => toggleLike(post.id)}
          style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
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
        >
          <MessageCircle size={19} color={ink[400]} />
          <AppText variant="captionMedium" color={ink[500]}>
            {post.comments}
          </AppText>
        </PressableScale>
        <View style={{ flex: 1 }} />
        <PressableScale>
          <Share2 size={18} color={ink[400]} />
        </PressableScale>
      </View>
    </Card>
  );
}
