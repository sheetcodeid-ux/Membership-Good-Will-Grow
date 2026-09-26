import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { AccountEmpty } from "../components/EmptyArt";
import { LABEL_INK, RULE } from "../components/AccountMenu";
import { brand, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { coupons } from "../data/mock";
import { CouponTicket } from "../components/CouponTicket";
import { CouponSheet } from "../components/CouponSheet";
import { tapPress, tapSelect } from "../utils/haptics";
import type { Coupon } from "../data/types";
import { useScrolled } from "../hooks/useScrolled";

const EDGE = 13.5;

type Tab = "mine" | "available";

/** Two-way switch under the bar, in the filter chips' style. */
function TabPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={() => {
        tapSelect();
        onPress();
      }}
      scaleTo={0.97}
      style={{
        flex: 1,
        height: 38,
        borderRadius: 19,
        borderWidth: active ? 1.5 : 1,
        borderColor: active ? brand[600] : RULE,
        backgroundColor: active ? "#EEF3FF" : "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <UiText
        color={active ? brand[700] : LABEL_INK}
        style={{
          fontSize: 14,
          lineHeight: 18,
          fontFamily: active ? fontFamilies.bold : fontFamilies.semibold,
        }}
      >
        {label}
      </UiText>
    </PressableScale>
  );
}

export default function CouponsScreen() {
  const scroll = useScrolled();
  const [tab, setTab] = useState<Tab>("mine");
  const [open, setOpen] = useState<Coupon | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader tone="account" title="Kupon Saya" divider={scroll.scrolled} />

      <View
        style={{
          flexDirection: "row",
          gap: 8,
          paddingHorizontal: EDGE,
          paddingTop: 12,
          paddingBottom: 4,
        }}
      >
        <TabPill
          label={`Kupon saya (${coupons.length})`}
          active={tab === "mine"}
          onPress={() => setTab("mine")}
        />
        <TabPill
          label="Kupon tersedia"
          active={tab === "available"}
          onPress={() => setTab("available")}
        />
      </View>

      {tab === "mine" ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={scroll.onScroll}
          scrollEventThrottle={scroll.scrollEventThrottle}
          contentContainerStyle={{
            paddingHorizontal: EDGE,
            paddingTop: 10,
            paddingBottom: 40,
            gap: 10,
          }}
        >
          {[...coupons]
            .sort(
              (a, b) =>
                Number(a.used) - Number(b.used) || a.daysLeft - b.daysLeft,
            )
            .map((coupon) => (
              <CouponTicket
                key={coupon.id}
                coupon={coupon}
                onPress={() => {
                  tapPress();
                  setOpen(coupon);
                }}
              />
            ))}
        </ScrollView>
      ) : (
        <AccountEmpty
          glyph="ticket"
          title="Belum ada kupon tersedia"
          subtitle="Kupon yang bisa dibeli akan muncul di sini. Sambil menunggu, lihat promo yang sedang jalan."
          action={{
            label: "Lihat promo",
            onPress: () => router.push("/promo"),
          }}
        />
      )}

      {open ? (
        <CouponSheet coupon={open} onClose={() => setOpen(null)} />
      ) : null}
    </View>
  );
}
