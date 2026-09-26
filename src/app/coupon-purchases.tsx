import React from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { Glyph } from "../components/icons/Glyph";
import { BrandLogo } from "../components/BrandLogo";
import { AccountEmpty } from "../components/EmptyArt";
import {
  AccountCard,
  AccountSection,
  LABEL_INK,
  QUIET_INK,
  RULE,
} from "../components/AccountMenu";
import { surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { useCouponStore } from "../store/couponStore";
import { useScrolled } from "../hooks/useScrolled";

export default function CouponPurchasesScreen() {
  const purchases = useCouponStore((s) => s.purchases);
  const scroll = useScrolled();
  const spent = purchases.reduce((n, p) => n + p.pricePoints, 0);

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader
        tone="account"
        title="Riwayat Pembelian Kupon"
        divider={scroll.scrolled}
      />
      {purchases.length === 0 ? (
        <AccountEmpty
          glyph="ticketPercent"
          title="Belum ada pembelian kupon"
          subtitle="Tukar poinmu dengan kupon. Setiap penukaran tercatat di sini, lengkap dengan tanggal dan poinnya."
          action={{
            label: "Tukar poin",
            onPress: () => router.push("/coupons?tab=available"),
          }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={scroll.onScroll}
          scrollEventThrottle={scroll.scrollEventThrottle}
          contentContainerStyle={{ paddingHorizontal: 13.5, paddingBottom: 40 }}
        >
          <AccountSection
            title={`${purchases.length} kupon · ${spent.toLocaleString("id-ID")} poin ditukar`}
          />
          <AccountCard>
            {purchases.map((p, i) => (
              <PressableScale
                key={p.id}
                scaleTo={0.99}
                onPress={() => router.push("/coupons")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderTopWidth: i > 0 ? 1 : 0,
                  borderTopColor: RULE,
                }}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    borderWidth: 1,
                    borderColor: RULE,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {p.brandId ? (
                    <BrandLogo brandId={p.brandId} size={24} />
                  ) : (
                    <Glyph name="ticketPercent" size={18} color={QUIET_INK} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <UiText
                    color={LABEL_INK}
                    numberOfLines={1}
                    style={{
                      fontSize: 15,
                      lineHeight: 19,
                      fontFamily: fontFamilies.semibold,
                    }}
                  >
                    {p.title}
                  </UiText>
                  <UiText
                    color={QUIET_INK}
                    style={{
                      marginTop: 2,
                      fontSize: 12.5,
                      lineHeight: 16,
                      fontFamily: fontFamilies.medium,
                    }}
                  >
                    {p.date} · Ditukar dengan poin
                  </UiText>
                </View>
                <UiText
                  color="#702B00"
                  style={{
                    fontSize: 14,
                    lineHeight: 18,
                    fontFamily: fontFamilies.extrabold,
                  }}
                >
                  -{p.pricePoints.toLocaleString("id-ID")}
                </UiText>
              </PressableScale>
            ))}
          </AccountCard>
        </ScrollView>
      )}
    </View>
  );
}
