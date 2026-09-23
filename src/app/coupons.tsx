import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Svg, { Path, Rect } from "react-native-svg";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { PressableScale } from "../components/ui/PressableScale";
import { SegmentedTabs } from "../components/ui/SegmentedTabs";
import { BrandLogo } from "../components/BrandLogo";
import { brand, ink, surface } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { coupons } from "../data/mock";
import type { Coupon } from "../data/types";

/* Ticket metrics, taken as ratios off the reference card (2.87 : 1). */
const CARD_H = 114;
const PHOTO_W = 118;
/** How far the seam swings in and out, and the length of one full swing. */
const WAVE_AMP = 8;
const WAVE_PERIOD = CARD_H / 7.5;

/**
 * The seam is a wave, not holes punched in a straight edge: the coloured
 * panel bulges out and is bitten back in equal measure. Each half period is
 * one smooth S, which makes the lobes read as rounded rather than as teeth.
 */
function seamPath(amp: number, period: number, height: number) {
  const half = period / 2;
  let d = "M 0 0";
  let x = 0;
  for (let y = 0; y < height; y += half) {
    const next = x === 0 ? amp : 0;
    d += ` C ${x} ${y + half * 0.52}, ${next} ${y + half * 0.48}, ${next} ${y + half}`;
    x = next;
  }
  return `${d} L 0 ${height} Z`;
}

/** Two overlapping tickets, drawn for the empty state. */
function EmptyTickets({ size = 120 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 0.72} viewBox="0 0 120 86">
      <Rect
        x={14}
        y={6}
        width={80}
        height={46}
        rx={7}
        transform="rotate(-8 54 29)"
        fill={brand[300]}
      />
      <Path
        d="M20 34h74a7 7 0 0 1 7 7v4a7 7 0 0 0 0 14v4a7 7 0 0 1-7 7H20a7 7 0 0 1-7-7v-4a7 7 0 0 0 0-14v-4a7 7 0 0 1 7-7Z"
        fill={brand[200]}
      />
      <Path
        d="M52 43l14 0-9 9 5 0-14 0 9-9-5 0Z"
        fill="#E8B838"
        transform="translate(4 4) scale(1.5)"
      />
    </Svg>
  );
}

function TicketCard({ coupon }: { coupon: Coupon }) {
  return (
    <PressableScale
      scaleTo={0.99}
      style={{
        height: CARD_H,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        ...(shadow.xs as object),
      }}
    >
      <ImagePlaceholder
        radius={0}
        iconSize={22}
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: PHOTO_W }}
      />
      <View style={{ position: "absolute", top: 8, left: 8 }}>
        <BrandLogo brandId={coupon.brandId} size={18} />
      </View>

      <View
        style={{
          position: "absolute",
          // Starts a wave's width early so the panel can bulge into the photo.
          left: PHOTO_W - WAVE_AMP,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: brand[900],
          overflow: "hidden",
          paddingLeft: WAVE_AMP + 15,
          paddingRight: 14,
          paddingTop: 11,
          paddingBottom: 12,
        }}
      >
        <AppText
          color="#FFFFFF"
          numberOfLines={2}
          style={{ fontSize: 16, lineHeight: 21, fontFamily: "Urbanist_700Bold" }}
        >
          {coupon.title}
        </AppText>
        <View style={{ flex: 1 }} />
        <AppText
          color="rgba(255,255,255,0.92)"
          style={{ fontSize: 11.5, lineHeight: 16, fontFamily: "Urbanist_400Regular" }}
        >
          Tersisa {coupon.daysLeft} hari
        </AppText>
        <AppText
          color="rgba(255,255,255,0.5)"
          style={{ fontSize: 11.5, lineHeight: 16, fontFamily: "Urbanist_400Regular" }}
        >
          {coupon.used ? "Sudah Digunakan" : "Belum Digunakan"}
        </AppText>

        <Svg
          width={WAVE_AMP}
          height={CARD_H}
          pointerEvents="none"
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <Path d={seamPath(WAVE_AMP, WAVE_PERIOD, CARD_H)} fill={surface} />
        </Svg>
      </View>
    </PressableScale>
  );
}

export default function CouponsScreen() {
  const [tab, setTab] = useState("member");
  const mine = coupons;

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <AppHeader title="Daftar Kupon">
        <SegmentedTabs
          value={tab}
          onChange={setTab}
          tabs={[
            { key: "member", label: "Member Kupon" },
            { key: "tersedia", label: "Kupon Tersedia" },
          ]}
        />
      </AppHeader>

      {tab === "member" ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 30 }}
        >
          {mine.map((coupon) => (
            <TicketCard key={coupon.id} coupon={coupon} />
          ))}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 14, paddingHorizontal: 32 }}>
          <EmptyTickets />
          <AppText variant="h3" color={ink[500]} center>
            Belum ada kupon tersedia
          </AppText>
          <AppText variant="body" color={ink[400]} center>
            Tidak ada kupon yang dapat dibeli saat ini
          </AppText>
        </View>
      )}
    </View>
  );
}
