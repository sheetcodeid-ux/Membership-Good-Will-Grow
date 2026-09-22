import React, { useMemo, useState } from "react";
import { FlatList, TextInput, View, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Search, Pencil, UserPlus, FilePlus2, Users } from "lucide-react-native";
import { AppText } from "../../components/ui";
import { AppHeader } from "../../components/ui/AppHeader";
import { Avatar } from "../../components/ui/Avatar";
import { EmptyState } from "../../components/ui/EmptyState";
import { SegmentedTabs } from "../../components/ui/SegmentedTabs";
import { PressableScale } from "../../components/ui/PressableScale";
import { PostCard } from "../../components/PostCard";
import { MemberRow } from "../../components/MemberRow";
import { brand, ink, surface } from "../../theme/colors";
import { fontFamilies } from "../../theme/typography";
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
              <Pencil size={20} color={brand[700]} />
            </PressableScale>
          ) : undefined
        }
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 4 }}>
          <View style={{ flexDirection: "row", gap: 14 }}>
            <Avatar name={name} size={62} />
            <View style={{ flex: 1, paddingTop: 2 }}>
              <AppText variant="h3">{name}</AppText>
              <AppText variant="caption" color={ink[400]}>
                @{username}
              </AppText>
              {bio ? (
                <AppText variant="caption" color={ink[600]} style={{ marginTop: 4 }}>
                  {bio}
                </AppText>
              ) : isMe ? (
                <PressableScale onPress={() => router.push("/edit-profile")}>
                  <AppText variant="caption" color={ink[400]} style={{ marginTop: 4 }}>
                    Tambahkan bio
                  </AppText>
                </PressableScale>
              ) : null}
            </View>

            {!isMe && member ? (
              <PressableScale
                onPress={() => toggleFollow(member.id)}
                style={{
                  height: 38,
                  paddingHorizontal: 16,
                  borderRadius: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 7,
                  backgroundColor: isFollowing ? ink[100] : brand[900],
                }}
              >
                <AppText variant="bodySemibold" color={isFollowing ? ink[600] : "#FFFFFF"}>
                  {isFollowing ? "Mengikuti" : "Ikuti"}
                </AppText>
                {!isFollowing ? <UserPlus size={15} color="#FFFFFF" /> : null}
              </PressableScale>
            ) : null}
          </View>
        </View>

        <SegmentedTabs
          value={tab}
          onChange={setTab}
          tabs={[
            { key: "posts", label: `Postingan (${counts.posts})` },
            { key: "followers", label: `Pengikut (${counts.followers})` },
            { key: "following", label: `Mengikuti (${counts.following})` },
          ]}
        />
      </AppHeader>

      {tab === "posts" ? (
        <FlatList
          data={memberPosts}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ paddingVertical: 20, gap: 26, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <PostCard post={item} />}
          ListEmptyComponent={
            <EmptyState
              icon={<FilePlus2 size={54} color={brand[300]} strokeWidth={1.8} />}
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
          contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                paddingHorizontal: 16,
                height: 52,
              }}
            >
              <Search size={20} color={ink[400]} />
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
              icon={<Users size={54} color={ink[300]} strokeWidth={1.8} />}
              title={tab === "followers" ? "Belum ada pengikut" : "Belum mengikuti siapa pun"}
              style={{ paddingTop: 60 }}
            />
          }
        />
      )}
    </View>
  );
}
