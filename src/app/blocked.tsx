import React from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppHeader } from "../components/ui/AppHeader";
import { AccountEmpty } from "../components/EmptyArt";
import { surface } from "../theme/colors";

export default function BlockedUsersScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader tone="account" title="Daftar Blokir Pengguna" />
      <AccountEmpty
        glyph="userOff"
        title="Belum ada pengguna yang diblokir"
        subtitle="Member yang kamu blokir akan muncul di sini dan bisa kamu buka blokirnya kapan saja."
      />
    </View>
  );
}
