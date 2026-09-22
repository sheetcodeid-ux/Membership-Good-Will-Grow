import React, { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { AppText, Screen } from "../components/ui";
import { PinDots, PinKeypad } from "../components/PinPad";
import { brand, ink } from "../theme/colors";
import { useAuthStore } from "../store/authStore";

export default function UnlockScreen() {
  const [pin, setPin] = useState("");
  const unlock = useAuthStore((s) => s.unlock);
  const name = useAuthStore((s) => s.name);

  const onChange = (next: string) => {
    setPin(next);
    if (next.length === 6) {
      setTimeout(() => {
        unlock();
        router.replace("/(tabs)");
      }, 200);
    }
  };

  return (
    <Screen>
      <View style={{ flex: 1, paddingTop: 56, gap: 36 }}>
        <View style={{ alignItems: "center", gap: 12 }}>
          <View
            style={{
              width: 76,
              height: 76,
              borderRadius: 24,
              backgroundColor: brand[600],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppText variant="h2" color="#FFFFFF">
              {name.charAt(0)}
            </AppText>
          </View>
          <AppText variant="h2">Halo, {name.split(" ")[0]}</AppText>
          <AppText variant="body" color={ink[500]}>
            Masukkan PIN untuk melanjutkan
          </AppText>
        </View>

        <PinDots value={pin} />

        <View style={{ flex: 1 }} />

        <View style={{ paddingBottom: 16 }}>
          <PinKeypad value={pin} onChange={onChange} />
        </View>

        <AppText
          variant="bodySemibold"
          color={brand[600]}
          center
          onPress={() => router.replace("/login")}
          style={{ paddingBottom: 24 }}
        >
          Masuk dengan nomor lain
        </AppText>
      </View>
    </Screen>
  );
}
