import React from "react";
import { FlatList, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppIcon } from "../../components/ui/AppIcon";
import { UiText } from "../../components/ui/Text";
import { AppHeader } from "../../components/ui/AppHeader";
import { EmptyState } from "../../components/ui/EmptyState";
import { PostCard } from "../../components/PostCard";
import { ink, surface } from "../../theme/colors";
import { space } from "../../theme/scale";
import { useResponsive } from "../../theme/responsive";
import { useFeedStore } from "../../store/feedStore";
import { useSocialStore } from "../../store/socialStore";

/** The posts inside one bookmark collection. */
export default function CollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const r = useResponsive();
  const posts = useFeedStore((s) => s.posts);
  const collection = useSocialStore((s) => s.collections.find((c) => c.id === id));

  const items = posts.filter((p) => collection?.postIds.includes(p.id));

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title={collection?.name ?? "Koleksi"} />

      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{
          paddingVertical: space.xl,
          paddingBottom: space.xxxl * 2,
          gap: space.xxl,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          items.length ? (
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
                DI KOLEKSI INI
              </UiText>
              <View style={{ flex: 1, height: 1, backgroundColor: ink[200] }} />
              <UiText token="label" color={ink[400]}>
                {items.length} post
              </UiText>
            </View>
          ) : null
        }
        renderItem={({ item }) => <PostCard post={item} />}
        ListEmptyComponent={
          <EmptyState
            icon={<AppIcon name="folder" size={60} color={ink[300]} />}
            title="Koleksi ini masih kosong"
            subtitle={'Buka menu "..." di sebuah post, lalu pilih Simpan ke koleksi.'}
          />
        }
      />
    </View>
  );
}
