import React, { useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AppText } from "../components/ui";
import { AppHeader } from "../components/ui/AppHeader";
import { PinDots, PinKeypad } from "../components/PinPad";
import { danger, ink, surface } from "../theme/colors";
import { useAuthStore } from "../store/authStore";

export default function ConfirmPinScreen() {
  const { pin: originalPin } = useLocalSearchParams<{ pin: string }>();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const setPinStore = useAuthStore((s) => s.setPin);
  const loginSuccess = useAuthStore((s) => s.loginSuccess);

  const onChange = (next: string) => {
    setError(false);
    setPin(next);
    if (next.length === 6) {
      if (next === originalPin) {
        setPinStore();
        loginSuccess();
        setTimeout(() => router.replace("/(tabs)"), 180);
      } else {
        setError(true);
        setTimeout(() => setPin(""), 420);
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Konfirmasi PIN" />

      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          <AppText
            center
            color={ink[950]}
            style={{ marginTop: 46, fontSize: 25, lineHeight: 32, fontFamily: "Urbanist_700Bold" }}
          >
            Konfirmasi PIN
          </AppText>
          <AppText
            variant="body"
            color={error ? danger[500] : ink[500]}
            center
            style={{ marginTop: 10 }}
          >
            {error ? "PIN tidak sama, coba lagi." : "Masukkan ulang 6 digit PIN kamu"}
          </AppText>

          <View style={{ marginTop: 52 }}>
            <PinDots value={pin} error={error} />
          </View>

          <View style={{ flex: 1 }} />

          <PinKeypad value={pin} onChange={onChange} />
          <View style={{ height: 34 }} />
        </View>
      </SafeAreaView>
    </View>
  );
}
