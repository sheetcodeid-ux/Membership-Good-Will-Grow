import React from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Svg, { Circle, Path } from "react-native-svg";
import { AppHeader } from "../components/ui/AppHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { ink, surface } from "../theme/colors";

/** Outlined "no entry" ring, matching the reference's empty mark. */
function EmptyBan({ size = 92 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={10.2} stroke={ink[300]} strokeWidth={1.7} fill="none" />
      <Path d="M5.2 18.8 18.8 5.2" stroke={ink[300]} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

export default function BlockedUsersScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Daftar Blokir Pengguna" />
      <EmptyState
        icon={<EmptyBan />}
        title="Belum ada pengguna yang diblokir"
        subtitle="Pengguna yang Anda blokir akan muncul di sini"
        style={{ marginTop: -120 }}
      />
    </View>
  );
}
