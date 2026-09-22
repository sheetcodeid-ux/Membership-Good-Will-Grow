import React, { useState } from "react";
import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MoreHorizontal, Gift, X } from "lucide-react-native";
import { AppText } from "../../components/ui/AppText";
import { Avatar } from "../../components/ui/Avatar";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";
import { PressableScale } from "../../components/ui/PressableScale";
import { PostCard } from "../../components/PostCard";
import { HeaderMenu } from "../../components/HeaderMenu";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const posts = useFeedStore((s) => s.posts);
  const name = useAuthStore((s) => s.name);
  const username = useAuthStore((s) => s.username);

  // Measured off the reference: the banner covers ~31.5% of the screen and the
  // header pill straddles its bottom edge, which is what the blur picks up.
  const bannerHeight = Math.min(320, Math.max(220, height * 0.315));

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
        scrollEventThrottle={16}
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
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
              // Clears the header pill, which overlaps the banner's bottom edge.
              bottom: 34,
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

        <View
          style={{
            marginHorizontal: 16,
            marginTop: -22,
            height: 50,
            borderRadius: 20,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.55)",
            ...(shadow.xs as object),
          }}
        >
          <BlurView intensity={45} tint="light" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={["rgba(210,224,255,0.45)", "rgba(255,255,255,0.35)", "rgba(219,230,255,0.45)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 9,
            }}
          >
            <PressableScale onPress={() => router.push(`/profile/${username}` as never)}>
              <Avatar name={name} size={26} />
            </PressableScale>
            {/* Brand lockup supplied later. */}
            <ImagePlaceholder radius={6} iconSize={13} style={{ width: 96, height: 21 }} />
            <PressableScale
              onPress={() => setMenuOpen((v) => !v)}
              style={{
                width: 30,
                height: 30,
                borderRadius: 10,
                backgroundColor: "rgba(155,185,255,0.55)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MoreHorizontal size={17} color={brand[800]} />
            </PressableScale>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          style={{ marginTop: 12, flexGrow: 0 }}
        >
          {filters.map((f) => {
            const active = filter === f;
            return (
              <PressableScale
                key={f}
                onPress={() => setFilter(f)}
                style={{
                  height: 24,
                  paddingHorizontal: 11,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: active ? brand[900] : ink[100],
                }}
              >
                <AppText
                  color={active ? "#FFFFFF" : ink[600]}
                  style={{ fontSize: 11, lineHeight: 15, fontFamily: "Urbanist_600SemiBold" }}
                >
                  {f}
                </AppText>
              </PressableScale>
            );
          })}
        </ScrollView>

        <View style={{ marginTop: 20, gap: 28 }}>
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
            left: 12,
            right: 12,
            bottom: insets.bottom + 80,
            flexDirection: "row",
            alignItems: "center",
            gap: 11,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            paddingVertical: 10,
            paddingHorizontal: 12,
            ...(shadow.md as object),
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 9,
              backgroundColor: gold[50],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Gift size={15} color={gold[600]} />
          </View>
          <AppText
            color={brand[700]}
            style={{ flex: 1, fontSize: 11.5, lineHeight: 16, fontFamily: "Urbanist_600SemiBold" }}
          >
            Lengkapi profil anda, dapatkan reward menarik
          </AppText>
          <PressableScale onPress={() => setShowProfileBanner(false)} hitSlop={12}>
            <X size={16} color={ink[400]} />
          </PressableScale>
        </PressableScale>
      ) : null}

      {menuOpen ? (
        <HeaderMenu
          // Bottom edge of the header pill, following the scroll position.
          top={bannerHeight - 22 + 50 + 3 - scrollY}
          onClose={() => setMenuOpen(false)}
        />
      ) : null}
    </View>
  );
}
