import React, { useMemo, useState } from "react";
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
import Animated, { SlideInDown } from "react-native-reanimated";
import { MessageSquare, Send, X } from "lucide-react-native";
import { AppText } from "../../components/ui";
import { Avatar } from "../../components/ui/Avatar";
import { EmptyState } from "../../components/ui/EmptyState";
import { PressableScale } from "../../components/ui/PressableScale";
import { brand, ink } from "../../theme/colors";
import { fontFamilies } from "../../theme/typography";
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
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    addComment(postId, text.trim());
    setText("");
  };

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
            height: "68%",
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
          }}
        >
          <View style={{ alignItems: "center", paddingTop: 10 }}>
            <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: ink[200] }} />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 10,
            }}
          >
            <AppText variant="h3" style={{ flex: 1 }}>
              Komentar
            </AppText>
            <PressableScale onPress={() => router.back()} hitSlop={12}>
              <X size={22} color={ink[500]} />
            </PressableScale>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(c) => c.id}
            contentContainerStyle={{ padding: 20, paddingTop: 6, gap: 16, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Avatar name={item.authorName} size={34} />
                <View style={{ flex: 1, backgroundColor: ink[50], borderRadius: 14, padding: 12 }}>
                  <AppText variant="bodySemibold">{item.authorName}</AppText>
                  <AppText variant="body" color={ink[700]}>
                    {item.text}
                  </AppText>
                  <AppText variant="micro" color={ink[400]} style={{ marginTop: 4 }}>
                    {item.time}
                  </AppText>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <EmptyState
                icon={<MessageSquare size={50} color={ink[300]} strokeWidth={1.7} />}
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
                gap: 10,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <Avatar name={name} size={34} />
              <View
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 22,
                  borderWidth: 1.5,
                  borderColor: ink[200],
                  justifyContent: "center",
                  paddingHorizontal: 16,
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
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: text.trim() ? brand[900] : ink[200],
                }}
              >
                <Send size={19} color="#FFFFFF" />
              </PressableScale>
            </View>
          </SafeAreaView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}
