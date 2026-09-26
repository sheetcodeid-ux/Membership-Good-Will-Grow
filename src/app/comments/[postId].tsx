import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, SlideInDown } from "react-native-reanimated";
import { AppIcon } from "../../components/ui/AppIcon";
import { UiText } from "../../components/ui/Text";
import { Avatar } from "../../components/ui/Avatar";
import { EmptyState } from "../../components/ui/EmptyState";
import { PressableScale } from "../../components/ui/PressableScale";
import { brand, danger, ink } from "../../theme/colors";
import { fontFamilies } from "../../theme/typography";
import { HIT_SIZE, radius, space } from "../../theme/scale";
import { useFeedStore } from "../../store/feedStore";
import { useAuthStore } from "../../store/authStore";

export default function CommentsSheet() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  // Select the raw list: a filtering selector would return a fresh array on
  // every render and loop the store subscription.
  const allComments = useFeedStore((s) => s.comments);
  const comments = useMemo(
    () => allComments.filter((c) => c.postId === postId),
    [allComments, postId]
  );
  const addComment = useFeedStore((s) => s.addComment);
  const name = useAuthStore((s) => s.name);
  const avatarUri = useAuthStore((s) => s.avatarUri);
  const [text, setText] = useState("");
  const toggleCommentLike = useFeedStore((s) => s.toggleCommentLike);

  /**
   * Two taps inside one JS tick both read the same `text`, because React has
   * not re-rendered with the cleared value yet — which posted the comment
   * twice. The latch is set synchronously so the second tap of a burst sees
   * it, and released on the next tick once the state has settled.
   */
  const sending = useRef(false);
  const send = useCallback(() => {
    const value = text.trim();
    if (!value || sending.current) return;
    sending.current = true;
    addComment(postId, value);
    setText("");
    setTimeout(() => {
      sending.current = false;
    }, 0);
  }, [text, addComment, postId]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />

      <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(10,14,26,0.5)" }]} />
      </Pressable>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "flex-end" }}
        pointerEvents="box-none"
      >
        <Animated.View
          entering={SlideInDown.duration(300)}
          style={{
            height: "72%",
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
          }}
        >
          <View style={{ alignItems: "center", paddingTop: 10 }}>
            <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: ink[200] }} />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: space.xl,
              paddingTop: space.lg,
              paddingBottom: space.md,
            }}
          >
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: space.sm }}>
              <UiText token="h2">Komentar</UiText>
              {comments.length ? (
                <View
                  style={{
                    minWidth: 24,
                    paddingHorizontal: space.sm,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: brand[50],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UiText token="label" color={brand[700]}>
                    {comments.length}
                  </UiText>
                </View>
              ) : null}
            </View>
            <PressableScale
              onPress={() => router.back()}
              rippleBorderless
              style={{
                width: HIT_SIZE,
                height: HIT_SIZE,
                borderRadius: HIT_SIZE / 2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppIcon name="close" size={24} color={ink[500]} />
            </PressableScale>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(c) => c.id}
            contentContainerStyle={{ padding: space.xl, paddingTop: space.sm, gap: space.lg, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInDown.delay(Math.min(index, 6) * 40).duration(240)}
                style={{ flexDirection: "row", gap: space.md }}
              >
                <Avatar name={item.authorName} size={38} />
                <View style={{ flex: 1, gap: space.xs }}>
                  <View
                    style={{
                      backgroundColor: ink[50],
                      // Square off the corner nearest the avatar. A bubble
                      // rounded on all four floats free of its author; one
                      // corner pinned points back at who said it.
                      borderRadius: radius.lg,
                      borderTopLeftRadius: space.xs,
                      paddingHorizontal: space.lg,
                      paddingVertical: space.md,
                      gap: 1,
                    }}
                  >
                    <UiText token="bodySemibold" color={brand[900]}>
                      {item.authorName}
                    </UiText>
                    <UiText token="body" color={ink[700]}>
                      {item.text}
                    </UiText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: space.lg,
                      paddingLeft: space.sm,
                    }}
                  >
                    <UiText token="label" color={ink[400]}>
                      {item.time}
                    </UiText>
                    <PressableScale
                      onPress={() => toggleCommentLike(item.id)}
                      rippleBorderless
                      scaleTo={0.9}
                      hitSlop={8}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center", gap: space.xs }}>
                        <AppIcon
                          name="heart"
                          size={14}
                          color={item.liked ? danger[500] : ink[400]}
                          emphasis={item.liked}
                        />
                        <UiText token="label" color={item.liked ? danger[500] : ink[400]}>
                          {item.likes > 0 ? `${item.likes} suka` : "Suka"}
                        </UiText>
                      </View>
                    </PressableScale>
                  </View>
                </View>
              </Animated.View>
            )}
            ListEmptyComponent={
              <EmptyState
                icon={<AppIcon name="comment" size={62} color={ink[300]} />}
                title="Belum ada komentar"
                subtitle="Jadilah yang pertama berkomentar!"
                style={{ paddingTop: 40 }}
              />
            }
          />

          <SafeAreaView edges={["bottom"]} style={{ borderTopWidth: 1, borderTopColor: ink[100] }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: space.md,
                paddingHorizontal: space.lg,
                paddingVertical: space.md,
              }}
            >
              <Avatar uri={avatarUri} name={name} size={40} />
              <View
                style={{
                  flex: 1,
                  height: HIT_SIZE,
                  borderRadius: HIT_SIZE / 2,
                  borderWidth: 1.5,
                  borderColor: ink[200],
                  backgroundColor: ink[50],
                  justifyContent: "center",
                  paddingHorizontal: space.xl,
                }}
              >
                <TextInput
                  value={text}
                  onChangeText={setText}
                  onSubmitEditing={send}
                  placeholder="Tulis komentar..."
                  placeholderTextColor={ink[300]}
                  style={[
                    {
                      minWidth: 0,
                      padding: 0,
                      fontFamily: fontFamilies.regular,
                      fontSize: 15,
                      color: ink[900],
                    },
                    Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null,
                  ]}
                />
              </View>
              <PressableScale
                onPress={send}
                style={{
                  width: HIT_SIZE,
                  height: HIT_SIZE,
                  borderRadius: HIT_SIZE / 2,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: text.trim() ? brand[900] : ink[200],
                }}
              >
                <AppIcon name="send" size={21} color="#FFFFFF" emphasis />
              </PressableScale>
            </View>
          </SafeAreaView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}
