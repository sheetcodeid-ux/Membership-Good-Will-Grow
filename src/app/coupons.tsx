import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { Glyph } from "../components/icons/Glyph";
import { BrandLogo } from "../components/BrandLogo";
import { AccountEmpty } from "../components/EmptyArt";
import {
  LABEL_INK,
  QUIET_INK,
  RULE,
  WARN_INK,
} from "../components/AccountMenu";
import { brand, success, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { coupons, getBrand } from "../data/mock";
import { showToast } from "../store/toastStore";
import { tapPress, tapSelect } from "../utils/haptics";
import type { Coupon } from "../data/types";
import { useScrolled } from "../hooks/useScrolled";

const EDGE = 13.5;
const CARD_H = 108;
const ART_W = 104;
const NOTCH = 8;

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

/**
 * A coupon as a paper ticket: the artwork on the stub, a perforation with
 * a notch bitten out at each end, the offer on the right. White with the
 * cards' hairline rather than a solid navy slab, so it sits with the rest
 * of the account pages.
 */
function TicketCard({ coupon }: { coupon: Coupon }) {
  const urgent = coupon.daysLeft <= 1;
  const brand_ = getBrand(coupon.brandId);
  return (
    <PressableScale
      scaleTo={0.99}
      style={{
        height: CARD_H,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: RULE,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        flexDirection: "row",
      }}
    >
      {/* Stand-in art until the real coupon artwork arrives: the brand's
          own gradient, a faint coupon mark and the logo on a white disc. */}
      <LinearGradient
        colors={brand_?.gradient ?? [brand[600], brand[400]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: ART_W, alignItems: "center", justifyContent: "center" }}
      >
        <View
          style={{
            position: "absolute",
            right: -14,
            bottom: -16,
            opacity: 0.16,
          }}
        >
          <Glyph name="ticketPercent" size={78} color="#FFFFFF" />
        </View>
        <View
          style={{
            position: "absolute",
            left: -20,
            top: -20,
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: "rgba(255,255,255,0.12)",
          }}
        />
        <View
          style={{
            width: 54,
            height: 54,
            borderRadius: 27,
            backgroundColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BrandLogo brandId={coupon.brandId} size={36} />
        </View>
        <UiText
          color="#FFFFFF"
          numberOfLines={1}
          style={{
            marginTop: 6,
            fontSize: 11,
            lineHeight: 14,
            fontFamily: fontFamilies.bold,
            opacity: 0.95,
          }}
        >
          {brand_?.shortName}
        </UiText>
      </LinearGradient>

      {/* perforation, with the page showing through a notch at each end */}
      <View style={{ width: 0 }}>
        <View
          style={{
            position: "absolute",
            top: NOTCH + 4,
            bottom: NOTCH + 4,
            left: -0.75,
            borderLeftWidth: 1.5,
            borderStyle: "dashed",
            borderColor: "#D5D8DE",
          }}
        />
        {[-NOTCH - 1, CARD_H - NOTCH - 1].map((top) => (
          <View
            key={top}
            style={{
              position: "absolute",
              top,
              left: -NOTCH,
              width: NOTCH * 2,
              height: NOTCH * 2,
              borderRadius: NOTCH,
              backgroundColor: surface,
              borderWidth: 1,
              borderColor: RULE,
            }}
          />
        ))}
      </View>

      <View
        style={{
          flex: 1,
          paddingLeft: 14,
          paddingRight: 14,
          paddingTop: 12,
          paddingBottom: 12,
        }}
      >
        <UiText
          color={LABEL_INK}
          numberOfLines={2}
          style={{
            fontSize: 15,
            lineHeight: 19,
            fontFamily: fontFamilies.bold,
          }}
        >
          {coupon.title}
        </UiText>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Glyph name="clock" size={13} color={urgent ? WARN_INK : QUIET_INK} />
          <UiText
            color={urgent ? WARN_INK : QUIET_INK}
            style={{
              fontSize: 12,
              lineHeight: 16,
              fontFamily: fontFamilies.semibold,
            }}
          >
            {urgent
              ? "Segera berakhir · 1 hari lagi"
              : `Berlaku ${coupon.daysLeft} hari lagi`}
          </UiText>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 6,
          }}
        >
          <View
            style={{
              borderRadius: 6,
              paddingHorizontal: 7,
              paddingVertical: 2,
              backgroundColor: coupon.used ? "#F2F3F5" : success[50],
            }}
          >
            <UiText
              color={coupon.used ? QUIET_INK : success[600]}
              style={{
                fontSize: 11.5,
                lineHeight: 15,
                fontFamily: fontFamilies.bold,
              }}
            >
              {coupon.used ? "Sudah dipakai" : "Belum dipakai"}
            </UiText>
          </View>
          <View style={{ flex: 1 }} />
          {coupon.used ? null : (
            <PressableScale
              scaleTo={0.94}
              hitSlop={6}
              onPress={() => {
                tapPress();
                showToast("Pilih menu, kupon bisa dipakai saat bayar", "info");
                router.push("/order");
              }}
              style={{
                height: 28,
                paddingHorizontal: 14,
                borderRadius: 14,
                backgroundColor: brand[600],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UiText
                color="#FFFFFF"
                style={{
                  fontSize: 13,
                  lineHeight: 16,
                  fontFamily: fontFamilies.bold,
                }}
              >
                Pakai
              </UiText>
            </PressableScale>
          )}
        </View>
      </View>
    </PressableScale>
  );
}

export default function CouponsScreen() {
  const scroll = useScrolled();
  const [tab, setTab] = useState<Tab>("mine");

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
              <TicketCard key={coupon.id} coupon={coupon} />
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
    </View>
  );
}
