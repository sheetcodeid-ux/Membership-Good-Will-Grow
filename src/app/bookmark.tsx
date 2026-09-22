import React, { useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn } from "react-native-reanimated";
import { Bookmark as BookmarkIcon, Plus, FolderOpen } from "lucide-react-native";
import { AppText, Button } from "../components/ui";
import { AppHeader } from "../components/ui/AppHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { SegmentedTabs } from "../components/ui/SegmentedTabs";
import { PressableScale } from "../components/ui/PressableScale";
import { PostCard } from "../components/PostCard";
import { brand, ink, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { useFeedStore } from "../store/feedStore";
import { useSocialStore } from "../store/socialStore";

export default function BookmarkScreen() {
  const [tab, setTab] = useState("posts");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");

  const posts = useFeedStore((s) => s.posts);
  const bookmarkedIds = useSocialStore((s) => s.bookmarkedPostIds);
  const collections = useSocialStore((s) => s.collections);
  const createCollection = useSocialStore((s) => s.createCollection);

  const saved = posts.filter((p) => bookmarkedIds.includes(p.id));

  const submitCollection = () => {
    if (!name.trim()) return;
    createCollection(name.trim());
    setName("");
    setDialogOpen(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <AppHeader title="Bookmark">
        <SegmentedTabs
          value={tab}
          onChange={setTab}
          tabs={[
            { key: "posts", label: "Semua Post" },
            { key: "collections", label: "Koleksi" },
          ]}
        />
      </AppHeader>

      {tab === "posts" ? (
        <FlatList
          data={saved}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ paddingVertical: 20, gap: 26, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <PostCard post={item} />}
          ListEmptyComponent={
            <EmptyState
              icon={<BookmarkIcon size={54} color={ink[300]} strokeWidth={1.7} />}
              title="Belum ada post yang dibookmark"
              subtitle="Mulai bookmark post favorit Anda!"
            />
          }
        />
      ) : (
        <FlatList
          data={collections}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Button
              label="Buat Koleksi Baru"
              size="lg"
              fullWidth
              icon={<Plus size={19} color="#FFFFFF" />}
              onPress={() => setDialogOpen(true)}
              style={{ backgroundColor: brand[900], borderRadius: 14, marginBottom: 8 }}
            />
          }
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 16,
              }}
            >
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 13,
                  backgroundColor: brand[50],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FolderOpen size={20} color={brand[700]} />
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="titleLg">{item.name}</AppText>
                <AppText variant="caption" color={ink[400]}>
                  {item.postIds.length} post
                </AppText>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <EmptyState
              icon={<BookmarkIcon size={54} color={ink[300]} strokeWidth={1.7} />}
              title="Belum ada koleksi bookmark"
              subtitle="Buat koleksi untuk mengorganisir bookmark Anda"
              style={{ paddingTop: 90 }}
            />
          }
        />
      )}

      {dialogOpen ? (
        <Animated.View entering={FadeIn.duration(160)} style={StyleSheet.absoluteFill}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setDialogOpen(false)}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(10,14,26,0.45)" }]} />
          </Pressable>

          <View
            pointerEvents="box-none"
            style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28 }}
          >
            <View
              style={{
                width: "100%",
                maxWidth: 420,
                backgroundColor: "#FFFFFF",
                borderRadius: 22,
                padding: 22,
                gap: 16,
              }}
            >
              <AppText variant="h3">Buat Koleksi Baru</AppText>
              <AppText variant="body" color={ink[500]}>
                Beri nama koleksi untuk mengelompokkan post yang kamu simpan.
              </AppText>

              <TextInput
                value={name}
                onChangeText={setName}
                autoFocus
                placeholder="Contoh: Kopi favorit"
                placeholderTextColor={ink[300]}
                style={[
                  {
                    height: 52,
                    borderRadius: 14,
                    paddingHorizontal: 16,
                    backgroundColor: ink[50],
                    borderWidth: 1.5,
                    borderColor: ink[200],
                    fontFamily: fontFamilies.medium,
                    fontSize: 15.5,
                    color: ink[900],
                  },
                  Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null,
                ]}
              />

              <View style={{ flexDirection: "row", gap: 12 }}>
                <PressableScale
                  onPress={() => setDialogOpen(false)}
                  style={{
                    flex: 1,
                    height: 48,
                    borderRadius: 999,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1.5,
                    borderColor: ink[200],
                  }}
                >
                  <AppText variant="title" color={ink[600]}>
                    Batal
                  </AppText>
                </PressableScale>
                <View style={{ flex: 1 }}>
                  <Button
                    label="Simpan"
                    fullWidth
                    disabled={!name.trim()}
                    onPress={submitCollection}
                    style={name.trim() ? { backgroundColor: brand[900] } : undefined}
                  />
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}
