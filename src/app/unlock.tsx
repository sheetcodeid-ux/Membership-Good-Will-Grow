import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AppText } from "../components/ui";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { PinDots, PinKeypad } from "../components/PinPad";
import { danger, ink, surface } from "../theme/colors";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";
import { tapError } from "../utils/haptics";

export default function AccessPinScreen() {
  const [pin, setPin] = useState("");
  const [wrong, setWrong] = useState(false);
  const [shake, setShake] = useState(0);
  const pinCode = useAuthStore((s) => s.pinCode);
  const unlock = useAuthStore((s) => s.unlock);
  const openPromo = useUiStore((s) => s.openPromo);
  // Short phones (SE-sized) close the gaps so the keypad and "Lupa PIN"
  // still fit without scrolling.
  const { height } = useWindowDimensions();
  const roomy = height >= 740;

  const onChange = (next: string) => {
    setWrong(false);
    setPin(next);
    if (next.length === 6) {
      // Checked only against a PIN set on this device.
      if (pinCode && next !== pinCode) {
        tapError();
        setWrong(true);
        setShake((n) => n + 1);
        setTimeout(() => setPin(""), 420);
        return;
      }
      setTimeout(() => {
        unlock();
        router.replace("/(tabs)");
        openPromo();
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
              marginTop: roomy ? 46 : 20,
              fontSize: roomy ? 25 : 22,
              lineHeight: roomy ? 32 : 28,
              fontFamily: "Urbanist_700Bold",
            }}
          >
            Masukkan PIN Good Will Grow
          </AppText>

          <View style={{ marginTop: roomy ? 64 : 24 }}>
            <PinDots value={pin} error={wrong} shake={shake} />
            {/* Hangs under the dots without taking room of its own. */}
            {wrong ? (
              <AppText
                variant="bodyMedium"
                color={danger[500]}
                center
                style={{ position: "absolute", top: 32, left: 0, right: 0 }}
              >
                PIN salah, coba lagi.
              </AppText>
            ) : null}
          </View>

          <View style={{ flex: 1, minHeight: 44 }} />

          <PinKeypad value={pin} onChange={onChange} />

          <PressableScale
            onPress={() => router.replace("/welcome")}
            style={{ alignSelf: "center", marginTop: roomy ? 30 : 16 }}
            hitSlop={10}
          >
            <AppText variant="bodyMedium" color={ink[400]}>
              Lupa PIN Akses?
            </AppText>
          </PressableScale>

          <View style={{ height: roomy ? 34 : 16 }} />
        </View>
      </SafeAreaView>
    </View>
  );
}
