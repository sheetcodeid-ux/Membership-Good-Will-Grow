import React from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppHeader } from "../components/ui/AppHeader";
import { AccountEmpty } from "../components/EmptyArt";
import { surface } from "../theme/colors";

export default function CouponPurchasesScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader tone="account" title="Riwayat Pembelian Kupon" />
      <AccountEmpty
        glyph="ticketPercent"
        title="Belum ada pembelian kupon"
        subtitle="Kupon yang kamu beli akan tercatat di sini, lengkap dengan tanggal dan harganya."
      />
    </View>
  );
}
