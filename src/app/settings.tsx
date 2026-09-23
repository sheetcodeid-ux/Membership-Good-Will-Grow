import React from "react";
import { AppIcon } from "../components/ui/AppIcon";
import { View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, danger, ink, surface } from "../theme/colors";
import { shadow } from "../theme/shadows";

function Row({
  label,
  color,
  onPress,
}: {
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.99}
      style={{
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
      }}
    >
      <AppText color={color} style={{ flex: 1, fontSize: 15, lineHeight: 20 }}>
        {label}
      </AppText>
      <AppIcon name="chevronRight" size={18} color={color} />
    </PressableScale>
  );
}

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Pengaturan" />

      <View style={{ padding: 16 }}>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            paddingVertical: 4,
            ...(shadow.xs as object),
          }}
        >
          <Row
            label="Nonaktifkan Akun Sementara"
            color={brand[800]}
            onPress={() => router.push("/deactivate-account")}
          />
          <View style={{ height: 1, backgroundColor: ink[100], marginHorizontal: 18 }} />
          <Row
            label="Hapus Akun"
            color={danger[500]}
            onPress={() => router.push("/delete-account")}
          />
        </View>
      </View>
    </View>
  );
}
