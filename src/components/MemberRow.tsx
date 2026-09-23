import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { UiText } from "./ui/Text";
import { Avatar } from "./ui/Avatar";
import { PressableScale } from "./ui/PressableScale";
import { brand, ink } from "../theme/colors";
import { HIT_SIZE, radius, space } from "../theme/scale";
import { useSocialStore } from "../store/socialStore";
import type { Member } from "../data/types";

/** White card with the member's identity and a follow toggle. */
export function MemberRow({ member, actionLabel }: { member: Member; actionLabel?: string }) {
  const toggleFollow = useSocialStore((s) => s.toggleFollow);
  const following = useSocialStore((s) => s.isFollowing(member.id));

  return (
    <PressableScale
      scaleTo={0.99}
      onPress={() => router.push(`/profile/${member.username}`)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: space.md,
        backgroundColor: "#FFFFFF",
        borderRadius: radius.lg,
        paddingVertical: space.md,
        paddingHorizontal: space.lg,
      }}
    >
      <Avatar name={member.name} size={52} />
      <View style={{ flex: 1 }}>
        <UiText token="titleLg" numberOfLines={1}>
          {member.name}
        </UiText>
        <UiText token="caption" color={ink[400]} numberOfLines={1}>
          @{member.username}
        </UiText>
      </View>

      <PressableScale
        onPress={() => toggleFollow(member.id)}
        style={{
          minWidth: 104,
          height: HIT_SIZE - 4,
          borderRadius: radius.md,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: space.lg,
          backgroundColor: following ? ink[100] : brand[900],
        }}
      >
        <UiText token="bodySemibold" color={following ? ink[600] : "#FFFFFF"}>
          {actionLabel ?? (following ? "Mengikuti" : "Ikuti")}
        </UiText>
      </PressableScale>
    </PressableScale>
  );
}
