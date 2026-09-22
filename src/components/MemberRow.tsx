import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { AppText } from "./ui/AppText";
import { Avatar } from "./ui/Avatar";
import { PressableScale } from "./ui/PressableScale";
import { brand, ink } from "../theme/colors";
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
        gap: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 14,
      }}
    >
      <Avatar name={member.name} size={44} />
      <View style={{ flex: 1 }}>
        <AppText variant="titleLg" numberOfLines={1}>
          {member.name}
        </AppText>
        <AppText variant="caption" color={ink[400]} numberOfLines={1}>
          @{member.username}
        </AppText>
      </View>

      <PressableScale
        onPress={() => toggleFollow(member.id)}
        style={{
          minWidth: 96,
          height: 38,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 14,
          backgroundColor: following ? ink[100] : brand[900],
        }}
      >
        <AppText variant="bodySemibold" color={following ? ink[600] : "#FFFFFF"}>
          {actionLabel ?? (following ? "Mengikuti" : "Ikuti")}
        </AppText>
      </PressableScale>
    </PressableScale>
  );
}
