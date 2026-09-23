import React from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Svg, { Path } from "react-native-svg";
import { AppHeader } from "../components/ui/AppHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { ink, surface } from "../theme/colors";

/** Outlined ticket, matching the reference's empty mark. */
function EmptyTicket({ size = 92 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 0.62} viewBox="0 0 24 15">
      <Path
        d="M3.4 1.1h17.2a2 2 0 0 1 2 2v1.3a2.2 2.2 0 0 0 0 6.2v1.3a2 2 0 0 1-2 2H3.4a2 2 0 0 1-2-2v-1.3a2.2 2.2 0 0 0 0-6.2V3.1a2 2 0 0 1 2-2Z"
        stroke={ink[300]}
        strokeWidth={1.6}
        fill="none"
      />
    </Svg>
  );
}

export default function CouponPurchasesScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Riwayat Pembelian Kupon" />
      <EmptyState
        icon={<EmptyTicket />}
        title="Belum ada riwayat pembelian"
        subtitle="Riwayat pembelian kupon Anda akan muncul di sini"
        style={{ marginTop: -120 }}
      />
    </View>
  );
}
