import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
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
import { coupons } from "../data/mock";
import type { Coupon } from "../data/types";

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
      onPress={onPress}
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
      <View style={{ width: ART_W }}>
        <ImagePlaceholder radius={0} iconSize={22} style={{ flex: 1 }} />
        <View
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BrandLogo brandId={coupon.brandId} size={17} />
        </View>
      </View>

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
            Berlaku {coupon.daysLeft} hari lagi
          </UiText>
        </View>
        <View
          style={{
            alignSelf: "flex-start",
            marginTop: 6,
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
      </View>
    </PressableScale>
  );
}

export default function CouponsScreen() {
  const [tab, setTab] = useState<Tab>("mine");

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader tone="account" title="Kupon Saya" />

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
          contentContainerStyle={{
            paddingHorizontal: EDGE,
            paddingTop: 10,
            paddingBottom: 40,
            gap: 10,
          }}
        >
          {coupons.map((coupon) => (
            <TicketCard key={coupon.id} coupon={coupon} />
          ))}
        </ScrollView>
      ) : (
        <AccountEmpty
          glyph="ticket"
          title="Belum ada kupon tersedia"
          subtitle="Kupon yang bisa dibeli akan muncul di sini. Cek lagi nanti, ya."
        />
      )}
    </View>
  );
}
