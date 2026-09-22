import React, { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AppText } from "../components/ui";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { PinDots, PinKeypad } from "../components/PinPad";
import { ink, surface } from "../theme/colors";
import { useAuthStore } from "../store/authStore";

export default function AccessPinScreen() {
  const [pin, setPin] = useState("");
  const unlock = useAuthStore((s) => s.unlock);

  const onChange = (next: string) => {
    setPin(next);
    if (next.length === 6) {
      setTimeout(() => {
        unlock();
        router.replace("/(tabs)");
      }, 180);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Akses Pin" />

      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          <AppText
            center
            color={ink[950]}
            style={{
              marginTop: 46,
              fontSize: 25,
              lineHeight: 32,
              fontFamily: "Urbanist_700Bold",
            }}
          >
            Masukkan PIN Good Will Grow
          </AppText>

          <View style={{ marginTop: 64 }}>
            <PinDots value={pin} />
          </View>

          <View style={{ marginTop: 58 }}>
            <PinKeypad value={pin} onChange={onChange} />
          </View>

          <PressableScale
            onPress={() => router.replace("/welcome")}
            style={{ alignSelf: "center", marginTop: 34 }}
            hitSlop={10}
          >
            <AppText variant="bodyMedium" color={ink[400]}>
              Lupa PIN Akses?
            </AppText>
          </PressableScale>

          <View style={{ flex: 1 }} />
        </View>
      </SafeAreaView>
    </View>
  );
}
