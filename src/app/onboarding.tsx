import React, { useCallback, useRef, useState } from "react";
import { Dimensions, FlatList, View, type ViewToken } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Users, Gift, ShoppingBag, Sparkles } from "lucide-react-native";
import { AppText, Button } from "../components/ui";
import { useAuthStore } from "../store/authStore";

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "membership",
    icon: Sparkles,
    title: "Membership Tanpa Batas",
    body: "Rasakan keuntungan membership dari mana saja. Kumpulkan reward di setiap outlet Good Will Grow dan naik level untuk benefit lebih besar.",
    colors: ["#0B2B73", "#123CA3"] as [string, string],
  },
  {
    key: "feeds",
    icon: Users,
    title: "Terhubung Lewat Feeds",
    body: "Bagikan momen serumu, tag teman, dan temukan cerita seru dari member lain di komunitas Good Will Grow.",
    colors: ["#123CA3", "#4066C2"] as [string, string],
  },
  {
    key: "promo",
    icon: Gift,
    title: "Promo Eksklusif",
    body: "Akses lebih dulu ke promo terbaru, giveaway, dan hadiah keren dari seluruh outlet Good Will Grow.",
    colors: ["#0D2F7E", "#123CA3"] as [string, string],
  },
  {
    key: "order",
    icon: ShoppingBag,
    title: "Self Order, Tanpa Antre",
    body: "Order langsung dari genggamanmu. Pilih menu, bayar, dan ambil pesanan tanpa perlu antre di kasir.",
    colors: ["#081E50", "#0B2B73"] as [string, string],
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  const onViewableChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
  }, []);

  const isLast = index === slides.length - 1;

  const goNext = () => {
    if (isLast) {
      completeOnboarding();
      router.replace("/login");
    } else {
      listRef.current?.scrollToIndex({ index: index + 1 });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0B2B73" }}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        renderItem={({ item }) => {
          const Icon = item.icon;
          return (
            <LinearGradient
              colors={item.colors}
              style={{ width, flex: 1 }}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.9, y: 1 }}
            >
              <SafeAreaView style={{ flex: 1, paddingHorizontal: 28 }}>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 28 }}>
                  <View
                    style={{
                      width: 108,
                      height: 108,
                      borderRadius: 32,
                      backgroundColor: "rgba(255,255,255,0.12)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={48} color="#FFFFFF" strokeWidth={1.6} />
                  </View>
                  <View style={{ gap: 12 }}>
                    <AppText variant="h1" color="#FFFFFF" center>
                      {item.title}
                    </AppText>
                    <AppText
                      variant="body"
                      color="rgba(255,255,255,0.78)"
                      center
                      style={{ paddingHorizontal: 8 }}
                    >
                      {item.body}
                    </AppText>
                  </View>
                </View>
              </SafeAreaView>
            </LinearGradient>
          );
        }}
      />

      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, paddingBottom: 36 }}>
        <SafeAreaView edges={["bottom"]} style={{ paddingHorizontal: 28, gap: 24 }}>
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 8 }}>
            {slides.map((s, i) => (
              <View
                key={s.key}
                style={{
                  width: i === index ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === index ? "#FFFFFF" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </View>
          <Button
            label={isLast ? "Masuk / Daftar" : "Lanjut"}
            variant="light"
            size="lg"
            fullWidth
            onPress={goNext}
          />
          {!isLast ? (
            <Button
              label="Lewati"
              variant="ghost"
              onPress={() => {
                completeOnboarding();
                router.replace("/login");
              }}
              style={{ alignSelf: "center" }}
            />
          ) : null}
        </SafeAreaView>
      </View>
    </View>
  );
}
