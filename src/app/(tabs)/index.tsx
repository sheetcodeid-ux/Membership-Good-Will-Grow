import React, { useState } from "react";
import { View, ScrollView, FlatList } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, ShoppingBag, Ticket, Crown, PenSquare } from "lucide-react-native";
import { AppText } from "../../components/ui/AppText";
import { Avatar } from "../../components/ui/Avatar";
import { Chip } from "../../components/ui/Chip";
import { PressableScale } from "../../components/ui/PressableScale";
import { SectionHeader } from "../../components/SectionHeader";
import { PromoBannerCard } from "../../components/PromoBannerCard";
import { PostCard } from "../../components/PostCard";
import { brand, ink, gold } from "../../theme/colors";
import { promos } from "../../data/mock";
import { useFeedStore } from "../../store/feedStore";
import { useAuthStore } from "../../store/authStore";
import { useMemberStore } from "../../store/memberStore";
import { useNotificationStore } from "../../store/notificationStore";

const filters = ["Semua Feed", "Post", "Check-In"];

export default function HomeScreen() {
  const [filter, setFilter] = useState(filters[0]);
  const posts = useFeedStore((s) => s.posts);
  const name = useAuthStore((s) => s.name);
  const tier = useMemberStore((s) => s.currentTier());
  const unread = useNotificationStore((s) => s.unreadCount());

  const filteredPosts = posts.filter((p) => {
    if (filter === "Post") return p.type === "post";
    if (filter === "Check-In") return p.type === "checkin";
    return true;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 16,
          gap: 12,
        }}
      >
        <Avatar name={name} size={46} />
        <View style={{ flex: 1 }}>
          <AppText variant="caption" color={ink[500]}>
            Selamat datang,
          </AppText>
          <AppText variant="titleLg" numberOfLines={1}>
            {name}
          </AppText>
        </View>
        <PressableScale
          onPress={() => router.push("/member")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: gold[50],
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 14,
          }}
        >
          <Crown size={14} color={gold[600]} />
          <AppText variant="captionMedium" color={gold[700]}>
            {tier.name}
          </AppText>
        </PressableScale>
        <PressableScale
          onPress={() => router.push("/notifications")}
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            backgroundColor: ink[50],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bell size={19} color={ink[700]} />
          {unread > 0 ? (
            <View
              style={{
                position: "absolute",
                top: 8,
                right: 9,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#E11D48",
              }}
            />
          ) : null}
        </PressableScale>
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(p) => p.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130, gap: 14 }}
        ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 20 }}>
            <PostCard post={item} />
          </View>
        )}
        ListHeaderComponent={
          <View style={{ gap: 20, marginBottom: 8 }}>
            <View style={{ gap: 12 }}>
              <SectionHeader
                title="Promo untuk kamu"
                onAction={() => router.push("/promo")}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
              >
                {promos.map((p) => (
                  <PromoBannerCard key={p.id} promo={p} />
                ))}
              </ScrollView>
            </View>

            <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 12 }}>
              <QuickAction
                icon={<ShoppingBag size={20} color={brand[600]} />}
                label="Order Sekarang"
                onPress={() => router.push("/order")}
              />
              <QuickAction
                icon={<Ticket size={20} color={brand[600]} />}
                label="Voucher Saya"
                onPress={() => router.push("/promo")}
              />
              <QuickAction
                icon={<Crown size={20} color={brand[600]} />}
                label="Poin Saya"
                onPress={() => router.push("/points-history")}
              />
            </View>

            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20 }}>
                <AppText variant="h3">Feeds Komunitas</AppText>
                <PressableScale
                  onPress={() => router.push("/create-post")}
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <PenSquare size={15} color={brand[600]} />
                  <AppText variant="captionMedium" color={brand[600]}>
                    Buat Post
                  </AppText>
                </PressableScale>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
              >
                {filters.map((f) => (
                  <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
                ))}
              </ScrollView>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: "center",
        gap: 8,
        backgroundColor: ink[50],
        borderRadius: 18,
        paddingVertical: 14,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 13,
          backgroundColor: "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </View>
      <AppText variant="micro" color={ink[600]} center>
        {label}
      </AppText>
    </PressableScale>
  );
}
