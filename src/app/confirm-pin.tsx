import React, { useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { AppText, Screen } from "../components/ui";
import { PinDots, PinKeypad } from "../components/PinPad";
import { ink, danger } from "../theme/colors";
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
        setTimeout(() => router.replace("/(tabs)"), 200);
      } else {
        setError(true);
        setTimeout(() => setPin(""), 400);
      }
    }
  };

  return (
    <Screen>
      <View style={{ flex: 1, paddingTop: 40, gap: 40 }}>
        <View style={{ paddingHorizontal: 24, gap: 8 }}>
          <AppText variant="h1" center>
            Konfirmasi PIN
          </AppText>
          <AppText variant="body" color={error ? danger[500] : ink[500]} center>
            {error ? "PIN tidak sama, coba lagi." : "Masukkan ulang 6 digit PIN kamu."}
          </AppText>
        </View>

        <PinDots value={pin} error={error} />

        <View style={{ flex: 1 }} />

        <View style={{ paddingBottom: 24 }}>
          <PinKeypad value={pin} onChange={onChange} />
        </View>
      </View>
    </Screen>
  );
}
