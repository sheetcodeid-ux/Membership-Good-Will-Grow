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

const CARD_H = 104;
/** Diameter of the notches punched along the ticket's seam. */
const NOTCH = 9;

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
        flexDirection: "row",
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        ...(shadow.xs as object),
      }}
    >
      <View style={{ width: CARD_H * 1.16 }}>
        <ImagePlaceholder radius={0} iconSize={20} style={{ flex: 1 }} />
        <View style={{ position: "absolute", top: 6, left: 6 }}>
          <BrandLogo brandId={coupon.brandId} size={18} />
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: brand[900], paddingHorizontal: 15, paddingVertical: 12 }}>
        <AppText variant="h3" color="#FFFFFF" numberOfLines={2}>
          {coupon.title}
        </AppText>
        <View style={{ flex: 1 }} />
        <AppText variant="caption" color="rgba(255,255,255,0.88)">
          Tersisa {coupon.daysLeft} hari
        </AppText>
        <AppText variant="caption" color="rgba(255,255,255,0.55)">
          {coupon.used ? "Sudah Digunakan" : "Belum Digunakan"}
        </AppText>
      </View>

      {/* Notches punched along the seam, in the page colour. */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: CARD_H * 1.16 - NOTCH / 2,
          top: 0,
          bottom: 0,
          justifyContent: "space-around",
        }}
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <View
            key={i}
            style={{
              width: NOTCH,
              height: NOTCH,
              borderRadius: NOTCH / 2,
              backgroundColor: ink[200],
            }}
          />
        ))}
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
