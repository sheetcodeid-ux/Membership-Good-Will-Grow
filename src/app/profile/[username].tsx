import React, { useMemo, useState } from "react";
import { FlatList, TextInput, View, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../../components/ui/Text";
import { AppHeader } from "../../components/ui/AppHeader";
import { Avatar } from "../../components/ui/Avatar";
import { EmptyState } from "../../components/ui/EmptyState";
import { SegmentedTabs } from "../../components/ui/SegmentedTabs";
import { PressableScale } from "../../components/ui/PressableScale";
import { AppIcon } from "../../components/ui/AppIcon";
import { PostCard } from "../../components/PostCard";
import { MemberRow } from "../../components/MemberRow";
import { brand, ink, surface } from "../../theme/colors";
import { fontFamilies } from "../../theme/typography";
import { HIT_SIZE, radius, space } from "../../theme/scale";
import { members } from "../../data/mock";
import { useAuthStore } from "../../store/authStore";
import { useFeedStore } from "../../store/feedStore";
import { useSocialStore } from "../../store/socialStore";

export default function MemberProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const me = useAuthStore();
  const posts = useFeedStore((s) => s.posts);
  const followingIds = useSocialStore((s) => s.followingIds);
  const toggleFollow = useSocialStore((s) => s.toggleFollow);

  const [tab, setTab] = useState("posts");
  const [query, setQuery] = useState("");

  const isMe = username === me.username;
  const member = members.find((m) => m.username === username);

  const name = isMe ? me.name : (member?.name ?? username);
  const bio = isMe ? me.bio : member?.bio;

  const memberPosts = useMemo(
    () => posts.filter((p) => p.authorHandle.replace("@", "") === username),
    [posts, username]
  );

  const followers = useMemo(
    () => members.filter((m) => m.username !== username).slice(0, member?.followersCount ?? 0),
    [username, member?.followersCount]
  );
  const following = useMemo(
    () =>
      isMe
        ? members.filter((m) => followingIds.includes(m.id))
        : members.filter((m) => m.username !== username).slice(0, member?.followingCount ?? 0),
    [isMe, followingIds, username, member?.followingCount]
  );

  const counts = {
    posts: isMe ? memberPosts.length : (member?.postsCount ?? memberPosts.length),
    followers: isMe ? 0 : (member?.followersCount ?? 0),
    following: isMe ? followingIds.length : (member?.followingCount ?? 0),
  };

  const peopleList = (tab === "followers" ? followers : following).filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.username.toLowerCase().includes(query.toLowerCase())
  );

  const isFollowing = member ? followingIds.includes(member.id) : false;

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <AppHeader
        title={`@${username}`}
        right={
          isMe ? (
            <PressableScale onPress={() => router.push("/edit-profile")} hitSlop={10}>
              <AppIcon name="compose" size={22} color={brand[700]} />
            </PressableScale>
          ) : undefined
        }
      >
        <View style={{ paddingHorizontal: space.xl, paddingTop: space.sm, paddingBottom: space.lg }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.lg }}>
            <Avatar uri={isMe ? me.avatarUri : undefined} name={name} size={78} />

            {/* Counts read as a row of three, which is what people scan for
                on a profile before they read anything else. */}
            <View style={{ flex: 1, flexDirection: "row" }}>
              {(
                [
                  ["Postingan", counts.posts, "posts"],
                  ["Pengikut", counts.followers, "followers"],
                  ["Mengikuti", counts.following, "following"],
                ] as const
              ).map(([label, count, key]) => (
                <PressableScale
                  key={label}
                  onPress={() => setTab(key)}
                  rippleColor={null}
                  style={{ flex: 1, alignItems: "center", paddingVertical: space.xs }}
                >
                  <UiText token="h3" color={ink[900]}>
                    {count}
                  </UiText>
                  <UiText token="caption" color={ink[400]}>
                    {label}
                  </UiText>
                </PressableScale>
              ))}
            </View>
          </View>

          <View style={{ marginTop: space.md, gap: 2 }}>
            <UiText token="h3">{name}</UiText>
            <UiText token="caption" color={ink[400]}>
              @{username}
            </UiText>
            {bio ? (
              <UiText token="body" color={ink[600]} style={{ marginTop: space.xs }}>
                {bio}
              </UiText>
            ) : isMe ? (
              <PressableScale onPress={() => router.push("/edit-profile")} rippleColor={null}>
                <UiText token="body" color={brand[600]} style={{ marginTop: space.xs }}>
                  Tambahkan bio
                </UiText>
              </PressableScale>
            ) : null}
          </View>

          {!isMe && member ? (
            <PressableScale
              onPress={() => toggleFollow(member.id)}
              style={{
                marginTop: space.lg,
                height: HIT_SIZE,
                borderRadius: radius.md,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: space.sm,
                borderWidth: isFollowing ? 1.5 : 0,
                borderColor: ink[200],
                backgroundColor: isFollowing ? "#FFFFFF" : brand[900],
              }}
            >
              <AppIcon
                name={isFollowing ? "member" : "profile"}
                size={19}
                color={isFollowing ? ink[600] : "#FFFFFF"}
                emphasis={isFollowing}
              />
              <UiText token="bodySemibold" color={isFollowing ? ink[600] : "#FFFFFF"}>
                {isFollowing ? "Mengikuti" : "Ikuti"}
              </UiText>
            </PressableScale>
          ) : null}
        </View>

        <SegmentedTabs
          value={tab}
          onChange={setTab}
          tabs={[
            { key: "posts", label: "Postingan" },
            { key: "followers", label: "Pengikut" },
            { key: "following", label: "Mengikuti" },
          ]}
        />
      </AppHeader>

      {tab === "posts" ? (
        <FlatList
          data={memberPosts}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ paddingVertical: space.lg, gap: space.md, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <PostCard post={item} />}
          ListEmptyComponent={
            <EmptyState
              icon={<AppIcon name="postAdd" size={64} color={brand[300]} />}
              title="Belum ada post"
              subtitle={isMe ? "Mulai bagikan momenmu!" : "Member ini belum membagikan apa pun."}
              style={{ paddingTop: 80 }}
            />
          }
        />
      ) : (
        <FlatList
          data={peopleList}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: space.lg, gap: space.md, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: space.md,
                backgroundColor: "#FFFFFF",
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: ink[100],
                paddingHorizontal: space.lg,
                height: HIT_SIZE + 4,
              }}
            >
              <AppIcon name="search" size={20} color={ink[400]} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={
                  tab === "followers" ? "Cari pengikut..." : "Cari akun yang diikuti..."
                }
                placeholderTextColor={ink[300]}
                style={[
                  {
                    flex: 1,
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
          }
          renderItem={({ item }) => (
            <MemberRow member={item} actionLabel={tab === "following" ? "Mengikuti" : undefined} />
          )}
          ListEmptyComponent={
            <EmptyState
              icon={<AppIcon name="users" size={64} color={ink[300]} />}
              title={tab === "followers" ? "Belum ada pengikut" : "Belum mengikuti siapa pun"}
              style={{ paddingTop: 60 }}
            />
          }
        />
      )}
    </View>
  );
}
