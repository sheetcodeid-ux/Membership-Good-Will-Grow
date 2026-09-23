import React, { useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn } from "react-native-reanimated";
import { Button } from "../components/ui";
import { AppIcon } from "../components/ui/AppIcon";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { SegmentedTabs } from "../components/ui/SegmentedTabs";
import { PressableScale } from "../components/ui/PressableScale";
import { PostCard } from "../components/PostCard";
import { brand, gold, ink, surface } from "../theme/colors";
import { radius, space, type as typeScale } from "../theme/scale";
import { shadow } from "../theme/shadows";
import { useResponsive } from "../theme/responsive";
import { useFeedStore } from "../store/feedStore";
import { useSocialStore } from "../store/socialStore";

export default function BookmarkScreen() {
  const [tab, setTab] = useState("posts");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const r = useResponsive();

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
          contentContainerStyle={{
            paddingVertical: space.xl,
            paddingBottom: space.xxxl * 2,
            gap: space.xxl,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            saved.length ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: space.sm,
                  paddingHorizontal: r.gutter,
                  marginBottom: -space.sm,
                }}
              >
                <UiText token="label" color={ink[500]}>
                  TERSIMPAN
                </UiText>
                <View style={{ flex: 1, height: 1, backgroundColor: ink[200] }} />
                <UiText token="label" color={ink[400]}>
                  {saved.length} post
                </UiText>
              </View>
            ) : null
          }
          renderItem={({ item }) => <PostCard post={item} />}
          ListEmptyComponent={
            <EmptyState
              icon={<AppIcon name="bookmark" size={54} color={ink[300]} />}
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
              icon={<AppIcon name="plus" size={19} color="#FFFFFF" />}
              onPress={() => setDialogOpen(true)}
              style={{ backgroundColor: brand[900], borderRadius: 14, marginBottom: 8 }}
            />
          }
          renderItem={({ item, index }) => {
            // Folders differ only by name, which is nothing to aim at in a
            // long list. The spine colour cycles so each one keeps a place
            // you can find again without reading.
            const spine = [brand[600], gold[600], brand[800], "#2E7D5B"][index % 4];
            return (
              <PressableScale
                scaleTo={0.99}
                onPress={() => router.push(`/collection/${item.id}`)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: space.lg,
                  backgroundColor: "#FFFFFF",
                  borderRadius: radius.lg,
                  padding: space.lg,
                  ...(shadow.xs as object),
                }}
              >
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: radius.md,
                    backgroundColor: `${spine}14`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppIcon name="folder" size={21} color={spine} />
                </View>
                <View style={{ flex: 1, gap: 1 }}>
                  <UiText token="titleLg" color={brand[900]} numberOfLines={1}>
                    {item.name}
                  </UiText>
                  <UiText token="caption" color={ink[400]}>
                    {item.postIds.length} post tersimpan
                  </UiText>
                </View>
                <AppIcon name="chevronRight" size={18} color={ink[300]} />
              </PressableScale>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              icon={<AppIcon name="bookmark" size={54} color={ink[300]} />}
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
              <UiText token="h3">Buat Koleksi Baru</UiText>
              <UiText token="body" color={ink[500]}>
                Beri nama koleksi untuk mengelompokkan post yang kamu simpan.
              </UiText>

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
                    fontFamily: typeScale.bodyMedium.fontFamily,
                    fontSize: typeScale.bodyMedium.fontSize,
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
                  <UiText token="title" color={ink[600]}>
                    Batal
                  </UiText>
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
