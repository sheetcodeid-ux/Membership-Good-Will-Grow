import React, { useState } from "react";
import { Platform, Share, View } from "react-native";
import { BottomSheet } from "./ui/BottomSheet";
import { AppIcon, type AppIconName } from "./ui/AppIcon";
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { brand, danger, ink } from "../theme/colors";
import { useSocialStore } from "../store/socialStore";
import { useFeedStore } from "../store/feedStore";
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
/** Why someone is reporting a post. No backend yet, so this is the record. */
const REPORT_REASONS = [
  "Spam atau penipuan",
  "Ujaran kebencian",
  "Konten dewasa",
  "Informasi palsu",
  "Lainnya",
];

export function PostMenuSheet({
  postId,
  authorName,
  caption,
  bookmarked,
  onClose,
  onToggleBookmark,
  onOpenAuthor,
}: {
  postId: string;
  authorName: string;
  caption: string;
  bookmarked: boolean;
  onClose: () => void;
  onToggleBookmark: () => void;
  onOpenAuthor: () => void;
}) {
  const [view, setView] = useState<"menu" | "collections" | "report">("menu");
  const collections = useSocialStore((c) => c.collections);
  const toggleInCollection = useSocialStore((c) => c.toggleInCollection);
  const hidePost = useFeedStore((f) => f.hidePost);
  const reportPost = useFeedStore((f) => f.reportPost);

  /**
   * The platform share sheet where there is one. On web `Share` is a no-op
   * rather than an error, so the text goes to the clipboard instead and the
   * button still does something rather than appearing to work.
   */
  const share = async () => {
    const message = `${authorName}: ${caption}`;
    try {
      if (Platform.OS === "web") {
        const nav = globalThis.navigator as Navigator | undefined;
        if (nav?.share) await nav.share({ text: message });
        else await nav?.clipboard?.writeText(message);
      } else {
        await Share.share({ message });
      }
    } catch {
      // Dismissing the share sheet rejects on iOS; that is not a failure.
    }
  };

  const run = (fn: () => void) => () => {
    fn();
    onClose();
  };

  if (view === "report") {
    return (
      <BottomSheet title="Laporkan post" onClose={onClose} showHandle>
        <View style={{ paddingHorizontal: space.lg, paddingBottom: space.lg, gap: space.xs }}>
          <UiText token="caption" color={ink[500]} style={{ paddingHorizontal: space.md }}>
            Pilih alasan. Post akan disembunyikan dari beranda kamu.
          </UiText>
          {REPORT_REASONS.map((reason) => (
            <PressableScale
              key={reason}
              onPress={run(() => reportPost(postId, reason))}
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
              <AppIcon name="ban" size={20} color={danger[500]} />
              <UiText token="body" color={ink[800]} style={{ flex: 1 }}>
                {reason}
              </UiText>
              <AppIcon name="chevronRight" size={17} color={ink[300]} />
            </PressableScale>
          ))}
        </View>
      </BottomSheet>
    );
  }

  if (view === "collections") {
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
    { icon: "folder", label: "Simpan ke koleksi", onPress: () => setView("collections") },
    { icon: "profile", label: "Lihat profil pembuat", onPress: run(onOpenAuthor) },
    { icon: "share", label: "Bagikan post", onPress: run(share) },
    { icon: "eye", label: "Sembunyikan post ini", onPress: run(() => hidePost(postId)) },
    { icon: "ban", label: "Laporkan post", onPress: () => setView("report"), danger: true },
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
