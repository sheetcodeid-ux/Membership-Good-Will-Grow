import React, { useState } from "react";
import { View } from "react-native";
import { BottomSheet } from "./ui/BottomSheet";
import { AppIcon, type AppIconName } from "./ui/AppIcon";
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { brand, danger, ink } from "../theme/colors";
import { useSocialStore } from "../store/socialStore";
import { HIT_SIZE, radius, space } from "../theme/scale";

interface Action {
  icon: AppIconName;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

/**
 * The overflow menu on a post.
 *
 * The "..." next to every author was drawn from the start but never opened
 * anything, which is worse than not drawing it: an affordance that does
 * nothing teaches people to stop trying the ones that do.
 */
export function PostMenuSheet({
  postId,
  bookmarked,
  onClose,
  onToggleBookmark,
  onOpenAuthor,
}: {
  postId: string;
  bookmarked: boolean;
  onClose: () => void;
  onToggleBookmark: () => void;
  onOpenAuthor: () => void;
}) {
  const [picking, setPicking] = useState(false);
  const collections = useSocialStore((c) => c.collections);
  const toggleInCollection = useSocialStore((c) => c.toggleInCollection);

  const run = (fn: () => void) => () => {
    fn();
    onClose();
  };

  if (picking) {
    return (
      <BottomSheet title="Simpan ke koleksi" onClose={onClose} showHandle>
        <View style={{ paddingHorizontal: space.lg, paddingBottom: space.lg, gap: space.xs }}>
          {collections.length ? (
            collections.map((c) => {
              const inside = c.postIds.includes(postId);
              return (
                <PressableScale
                  key={c.id}
                  onPress={run(() => toggleInCollection(c.id, postId))}
                  scaleTo={0.99}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: space.lg,
                    minHeight: HIT_SIZE,
                    paddingHorizontal: space.md,
                    borderRadius: radius.md,
                  }}
                >
                  <AppIcon name="folder" size={21} color={brand[700]} />
                  <View style={{ flex: 1 }}>
                    <UiText token="body" color={ink[800]}>
                      {c.name}
                    </UiText>
                    <UiText token="label" color={ink[400]}>
                      {c.postIds.length} post
                    </UiText>
                  </View>
                  {inside ? <AppIcon name="checkCircle" size={20} color={brand[600]} emphasis /> : null}
                </PressableScale>
              );
            })
          ) : (
            <UiText token="body" color={ink[500]} center style={{ paddingVertical: space.xl }}>
              Belum ada koleksi. Buat dulu lewat tab Bookmark.
            </UiText>
          )}
        </View>
      </BottomSheet>
    );
  }

  const actions: Action[] = [
    {
      icon: "bookmark",
      label: bookmarked ? "Hapus dari bookmark" : "Simpan ke bookmark",
      onPress: run(onToggleBookmark),
    },
    { icon: "folder", label: "Simpan ke koleksi", onPress: () => setPicking(true) },
    { icon: "profile", label: "Lihat profil pembuat", onPress: run(onOpenAuthor) },
    { icon: "share", label: "Bagikan post", onPress: run(() => {}) },
    { icon: "eye", label: "Sembunyikan post ini", onPress: run(() => {}) },
    { icon: "ban", label: "Laporkan post", onPress: run(() => {}), danger: true },
  ];

  return (
    <BottomSheet title="Opsi Post" onClose={onClose} showHandle>
      <View style={{ paddingHorizontal: space.lg, paddingBottom: space.lg, gap: space.xs }}>
        {actions.map((a) => (
          <PressableScale
            key={a.label}
            onPress={a.onPress}
            scaleTo={0.99}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: space.lg,
              minHeight: HIT_SIZE,
              paddingHorizontal: space.md,
              borderRadius: radius.md,
            }}
          >
            <AppIcon name={a.icon} size={21} color={a.danger ? danger[500] : brand[700]} />
            <UiText token="body" color={a.danger ? danger[500] : ink[800]}>
              {a.label}
            </UiText>
          </PressableScale>
        ))}
      </View>
    </BottomSheet>
  );
}
