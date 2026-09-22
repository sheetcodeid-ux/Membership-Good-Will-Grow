import React, { useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MoreHorizontal, Gift, X } from "lucide-react-native";
import { AppText } from "../../components/ui/AppText";
import { Avatar } from "../../components/ui/Avatar";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";
import { PressableScale } from "../../components/ui/PressableScale";
import { PostCard } from "../../components/PostCard";
import { brand, gold, ink, surface } from "../../theme/colors";
import { shadow } from "../../theme/shadows";
import { useFeedStore } from "../../store/feedStore";
import { useAuthStore } from "../../store/authStore";

const filters = ["Semua Feed", "Post", "Check-In"];

export default function HomeScreen() {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState(filters[0]);
  const [showProfileBanner, setShowProfileBanner] = useState(true);
  const posts = useFeedStore((s) => s.posts);
  const name = useAuthStore((s) => s.name);

  const bannerHeight = Math.min(310, Math.max(215, height * 0.3));

  const visiblePosts = posts.filter((p) => {
    if (filter === "Post") return p.type === "post";
    if (filter === "Check-In") return p.type === "checkin";
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 170 }}
      >
        <View>
          <ImagePlaceholder
            label="Banner Promo"
            radius={0}
            iconSize={40}
            style={{ height: bannerHeight, width: "100%" }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 12,
              alignSelf: "center",
              flexDirection: "row",
              gap: 6,
            }}
          >
            <View style={{ width: 18, height: 5, borderRadius: 3, backgroundColor: brand[900] }} />
            <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: ink[300] }} />
            <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: ink[300] }} />
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 6 }}>
          <LinearGradient
            colors={["rgba(219,230,255,0.95)", "rgba(255,255,255,0.95)", "rgba(226,232,255,0.95)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 46,
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 8,
              ...(shadow.xs as object),
            }}
          >
            <Avatar name={name} size={30} />
            {/* Brand lockup supplied later. */}
            <ImagePlaceholder radius={7} iconSize={14} style={{ width: 104, height: 24 }} />
            <PressableScale
              style={{
                width: 32,
                height: 32,
                borderRadius: 11,
                backgroundColor: brand[100],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MoreHorizontal size={18} color={brand[700]} />
            </PressableScale>
          </LinearGradient>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          style={{ marginTop: 18, flexGrow: 0 }}
        >
          {filters.map((f) => {
            const active = filter === f;
            return (
              <PressableScale
                key={f}
                onPress={() => setFilter(f)}
                style={{
                  height: 34,
                  paddingHorizontal: 18,
                  borderRadius: 17,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: active ? brand[900] : ink[100],
                }}
              >
                <AppText variant="bodySemibold" color={active ? "#FFFFFF" : ink[600]}>
                  {f}
                </AppText>
              </PressableScale>
            );
          })}
        </ScrollView>

        <View style={{ marginTop: 24, gap: 28 }}>
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>
      </ScrollView>

      {showProfileBanner ? (
        <PressableScale
          onPress={() => router.push("/edit-profile")}
          style={{
            position: "absolute",
            left: 11,
            right: 11,
            bottom: insets.bottom + 82,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            backgroundColor: "#FFFFFF",
            borderRadius: 18,
            paddingVertical: 12,
            paddingHorizontal: 14,
            ...(shadow.md as object),
          }}
        >
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 11,
              backgroundColor: gold[50],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Gift size={18} color={gold[600]} />
          </View>
          <AppText variant="bodySemibold" color={brand[700]} style={{ flex: 1 }}>
            Lengkapi profil anda, dapatkan reward menarik
          </AppText>
          <PressableScale onPress={() => setShowProfileBanner(false)} hitSlop={12}>
            <X size={20} color={ink[400]} />
          </PressableScale>
        </PressableScale>
      ) : null}
    </View>
  );
}
