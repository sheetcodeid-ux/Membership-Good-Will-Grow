import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppHeader } from "../components/ui/AppHeader";
import { Glyph } from "../components/icons/Glyph";
import { AccountMenu, AccountSection } from "../components/AccountMenu";
import { danger, iconGrey, surface } from "../theme/colors";

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader tone="account" title="Pengaturan" />

      <View style={{ paddingHorizontal: 13.5 }}>
        <AccountSection title="Akun" />
        <AccountMenu
          items={[
            {
              icon: <Glyph name="pause" size={21} color={iconGrey} />,
              label: "Nonaktifkan akun sementara",
              onPress: () => router.push("/deactivate-account"),
            },
            {
              icon: <Glyph name="trash" size={21} color={danger[500]} />,
              label: "Hapus akun",
              tone: danger[500],
              onPress: () => router.push("/delete-account"),
            },
          ]}
        />
      </View>
    </View>
  );
}
