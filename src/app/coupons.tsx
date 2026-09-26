import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { CountUp } from "../components/ui/CountUp";
import { Glyph } from "../components/icons/Glyph";
import { BrandLogo } from "../components/BrandLogo";
import { AccountEmpty } from "../components/EmptyArt";
import { CouponTicket } from "../components/CouponTicket";
import { CouponSheet } from "../components/CouponSheet";
import { LABEL_INK, QUIET_INK, RULE } from "../components/AccountMenu";
import { brand, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { brands } from "../data/mock";
import { useCouponStore } from "../store/couponStore";
import { useMemberStore } from "../store/memberStore";
import { showToast } from "../store/toastStore";
import { tapError, tapPress, tapSelect, tapSuccess } from "../utils/haptics";
import type { Coupon, CouponOffer } from "../data/types";
import { useScrolled } from "../hooks/useScrolled";

const EDGE = 13.5;
const STRIP_INK = "#702B00";
const GOLD = ["#FFDD00", "#FFDD00", "#FFFDEF"] as const;

type Tab = "mine" | "available";

/** Two-way switch under the bar, in the filter chips' style. */
function TabPill({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count?: number;
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
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
      {count !== undefined ? (
        <View
          style={{
            minWidth: 20,
            height: 18,
            paddingHorizontal: 5,
            borderRadius: 9,
            backgroundColor: active ? brand[600] : "#E9ECF2",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UiText
            color={active ? "#FFFFFF" : QUIET_INK}
            style={{
              fontSize: 11,
              lineHeight: 14,
              fontFamily: fontFamilies.bold,
            }}
          >
            {count}
          </UiText>
        </View>
      ) : null}
    </PressableScale>
  );
}

/** Brand filter chip, with the brand's logo; "Semua" has none. */
function BrandChip({
  brandId,
  label,
  active,
  onPress,
}: {
  brandId?: string;
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
      scaleTo={0.96}
      style={{
        height: 32,
        paddingLeft: brandId ? 6 : 12,
        paddingRight: 12,
        borderRadius: 16,
        borderWidth: active ? 1.5 : 1,
        borderColor: active ? brand[600] : RULE,
        backgroundColor: active ? "#EEF3FF" : "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      {brandId ? <BrandLogo brandId={brandId} size={20} /> : null}
      <UiText
        color={active ? brand[700] : LABEL_INK}
        style={{
          fontSize: 13,
          lineHeight: 17,
          fontFamily: active ? fontFamilies.bold : fontFamilies.semibold,
        }}
      >
        {label}
      </UiText>
    </PressableScale>
  );
}

/** Shape a coupon on sale as a ticket, so both tabs draw the same card. */
function offerAsCoupon(offer: CouponOffer): Coupon {
  return {
    id: offer.id,
    brandId: offer.brandId,
    title: offer.title,
    daysLeft: offer.validDays,
    used: false,
    detail: offer.detail,
  };
}

export default function CouponsScreen() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const scroll = useScrolled();
  const [tab, setTab] = useState<Tab>(
    params.tab === "available" ? "available" : "mine",
  );
  const [brandFilter, setBrandFilter] = useState<string | undefined>();
  const [open, setOpen] = useState<Coupon | null>(null);
  const [openOffer, setOpenOffer] = useState<CouponOffer | null>(null);

  const mine = useCouponStore((s) => s.mine);
  const latestId = useCouponStore((s) => s.latestId);
  const offers = useCouponStore((s) => s.offers);
  const buy = useCouponStore((s) => s.buy);
  const points = useMemberStore((s) => s.points);

  // Brands the member actually holds coupons for, in the brand list's order.
  const heldBrands = brands.filter((b) => mine.some((c) => c.brandId === b.id));
  const shown = [...mine]
    .filter((c) => !brandFilter || c.brandId === brandFilter)
    .sort(
      (a, b) =>
        Number(b.id === latestId) - Number(a.id === latestId) ||
        Number(a.used) - Number(b.used) ||
        a.daysLeft - b.daysLeft,
    );
  const soon = mine.filter((c) => !c.used && c.daysLeft <= 1).length;

  const purchase = (offer: CouponOffer) => {
    const coupon = buy(offer.id);
    if (!coupon) {
      tapError();
      showToast("Poinmu belum cukup untuk kupon ini", "error");
      return;
    }
    tapSuccess();
    setOpenOffer(null);
    setBrandFilter(undefined);
    setTab("mine");
    showToast(`${offer.title} masuk ke Kupon saya`);
  };

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
          label="Kupon saya"
          count={mine.length}
          active={tab === "mine"}
          onPress={() => setTab("mine")}
        />
        <TabPill
          label="Tukar poin"
          count={offers.length}
          active={tab === "available"}
          onPress={() => setTab("available")}
        />
      </View>

      {tab === "mine" ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={scroll.onScroll}
          scrollEventThrottle={scroll.scrollEventThrottle}
          contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
        >
          {heldBrands.length > 1 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexGrow: 0 }}
              contentContainerStyle={{
                paddingHorizontal: EDGE,
                paddingTop: 8,
                gap: 8,
              }}
            >
              <BrandChip
                label="Semua"
                active={!brandFilter}
                onPress={() => setBrandFilter(undefined)}
              />
              {heldBrands.map((b) => (
                <BrandChip
                  key={b.id}
                  brandId={b.id}
                  label={b.shortName}
                  active={brandFilter === b.id}
                  onPress={() => setBrandFilter(b.id)}
                />
              ))}
            </ScrollView>
          ) : null}

          {soon > 0 && !brandFilter ? (
            <View
              style={{
                marginHorizontal: EDGE,
                marginTop: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#F3DFA2",
                backgroundColor: "#FFF8E1",
                paddingHorizontal: 12,
                paddingVertical: 9,
              }}
            >
              <Glyph name="clock" size={15} color="#A34500" />
              <UiText
                color="#A34500"
                style={{
                  flex: 1,
                  fontSize: 13,
                  lineHeight: 17,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                {soon} kupon habis dalam 1 hari. Pakai sebelum hangus, ya!
              </UiText>
            </View>
          ) : null}

          {shown.length === 0 ? (
            <AccountEmpty
              glyph="ticket"
              title="Belum ada kupon"
              subtitle="Tukar poinmu dengan kupon, atau cek promo yang sedang jalan."
              action={{
                label: "Tukar poin",
                onPress: () => setTab("available"),
              }}
            />
          ) : (
            <View style={{ paddingHorizontal: EDGE, paddingTop: 10, gap: 10 }}>
              {shown.map((coupon) => (
                <CouponTicket
                  key={coupon.id}
                  coupon={coupon}
                  fresh={coupon.id === latestId}
                  onPress={() => {
                    tapPress();
                    setOpen(coupon);
                  }}
                />
              ))}
            </View>
          )}
        </ScrollView>
      ) : (
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
          {/* The balance the prices are paid from, in the points gold. */}
          <LinearGradient
            colors={GOLD}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: "rgba(255,255,255,0.6)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Glyph name="coins" size={18} color={STRIP_INK} />
            </View>
            <View style={{ flex: 1 }}>
              <UiText
                color={STRIP_INK}
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                Poin yang bisa ditukar
              </UiText>
              <CountUp
                value={points}
                format={(n) => `${n.toLocaleString("id-ID")} poin`}
                color={STRIP_INK}
                style={{
                  fontSize: 19,
                  lineHeight: 24,
                  fontFamily: fontFamilies.extrabold,
                }}
              />
            </View>
            <PressableScale
              onPress={() => router.push("/points-history")}
              hitSlop={8}
              style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
            >
              <UiText
                color={STRIP_INK}
                style={{
                  fontSize: 13,
                  lineHeight: 17,
                  fontFamily: fontFamilies.bold,
                }}
              >
                Riwayat
              </UiText>
              <Glyph name="chevronRight" size={11} color={STRIP_INK} />
            </PressableScale>
          </LinearGradient>

          {[...offers]
            .sort((a, b) => a.pricePoints - b.pricePoints)
            .map((offer) => (
              <CouponTicket
                key={offer.id}
                coupon={offerAsCoupon(offer)}
                price={offer.pricePoints}
                onPress={() => {
                  tapPress();
                  setOpenOffer(offer);
                }}
              />
            ))}
        </ScrollView>
      )}

      {open ? (
        <CouponSheet coupon={open} onClose={() => setOpen(null)} />
      ) : null}
      {openOffer ? (
        <CouponSheet
          coupon={offerAsCoupon(openOffer)}
          onClose={() => setOpenOffer(null)}
          offer={{
            price: openOffer.pricePoints,
            onBuy: () => purchase(openOffer),
          }}
        />
      ) : null}
    </View>
  );
}
