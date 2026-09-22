import React, { useState } from "react";
import { View, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Heart, Send, MapPin } from "lucide-react-native";
import { Screen, ScreenHeader, AppText, Input } from "../../components/ui";
import { Avatar } from "../../components/ui/Avatar";
import { MediaTile } from "../../components/ui/MediaTile";
import { PressableScale } from "../../components/ui/PressableScale";
import { brand, ink, danger } from "../../theme/colors";
import { getPost, getBrand } from "../../data/mock";
import { useFeedStore } from "../../store/feedStore";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const post = getPost(id);
  const brandInfo = getBrand(post?.brandId);
  const comments = useFeedStore((s) => (post ? s.commentsFor(post.id) : []));
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const addComment = useFeedStore((s) => s.addComment);
  const [text, setText] = useState("");

  if (!post) {
    return (
      <Screen>
        <ScreenHeader title="Post" />
        <AppText style={{ padding: 20 }}>Post tidak ditemukan.</AppText>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title="Post" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <FlatList
          data={comments}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={
            <View style={{ paddingHorizontal: 20, gap: 14, marginBottom: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Avatar name={post.authorName} size={44} />
                <View style={{ flex: 1 }}>
                  <AppText variant="titleLg">{post.authorName}</AppText>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    {post.type === "checkin" ? <MapPin size={12} color={ink[400]} /> : null}
                    <AppText variant="caption" color={ink[500]}>
                      {post.type === "checkin" ? `${post.outletName} · ${post.time}` : post.time}
                    </AppText>
                  </View>
                </View>
              </View>

              <AppText variant="body">{post.caption}</AppText>

              {brandInfo ? (
                <MediaTile
                  colors={brandInfo.gradient}
                  icon={brandInfo.category === "coffee" ? "coffee" : "drumstick"}
                  radius={18}
                  iconSize={48}
                  style={{ height: 220, width: "100%" }}
                />
              ) : null}

              <View style={{ flexDirection: "row", alignItems: "center", gap: 20, paddingTop: 6 }}>
                <PressableScale onPress={() => toggleLike(post.id)} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Heart size={20} color={post.liked ? danger[500] : ink[400]} fill={post.liked ? danger[500] : "transparent"} />
                  <AppText variant="bodyMedium" color={ink[600]}>{post.likes} suka</AppText>
                </PressableScale>
                <AppText variant="bodyMedium" color={ink[600]}>{post.comments} komentar</AppText>
              </View>

              <View style={{ height: 1, backgroundColor: ink[100] }} />
              <AppText variant="titleLg">Komentar</AppText>
            </View>
          }
          renderItem={({ item }) => (
            <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 14 }}>
              <Avatar name={item.authorName} size={34} />
              <View style={{ flex: 1, backgroundColor: ink[50], borderRadius: 14, padding: 12 }}>
                <AppText variant="bodySemibold">{item.authorName}</AppText>
                <AppText variant="body" color={ink[700]}>{item.text}</AppText>
                <AppText variant="micro" color={ink[400]} style={{ marginTop: 4 }}>{item.time}</AppText>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <AppText variant="caption" color={ink[400]} style={{ paddingHorizontal: 20 }}>
              Jadi yang pertama berkomentar
            </AppText>
          }
        />

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: ink[100] }}>
          <View style={{ flex: 1 }}>
            <Input placeholder="Tulis komentar..." value={text} onChangeText={setText} />
          </View>
          <PressableScale
            onPress={() => {
              if (!text.trim()) return;
              addComment(post.id, text.trim());
              setText("");
            }}
            style={{ width: 46, height: 46, borderRadius: 15, backgroundColor: brand[600], alignItems: "center", justifyContent: "center" }}
          >
            <Send size={18} color="#FFFFFF" />
          </PressableScale>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
