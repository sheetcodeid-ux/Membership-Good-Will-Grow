import React, { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { AppText, Screen } from "../components/ui";
import { PinDots, PinKeypad } from "../components/PinPad";
import { ink } from "../theme/colors";

export default function CreatePinScreen() {
  const [pin, setPin] = useState("");

  const onChange = (next: string) => {
    setPin(next);
    if (next.length === 6) {
      setTimeout(() => {
        router.push({ pathname: "/confirm-pin", params: { pin: next } });
      }, 200);
    }
  };

  return (
    <Screen>
      <View style={{ flex: 1, paddingTop: 40, gap: 40 }}>
        <View style={{ paddingHorizontal: 24, gap: 8 }}>
          <AppText variant="h1" center>
            Buat PIN Akses
          </AppText>
          <AppText variant="body" color={ink[500]} center>
            Buat 6 digit PIN untuk mengamankan akun Good Will Grow kamu.
          </AppText>
        </View>

        <PinDots value={pin} />

        <View style={{ flex: 1 }} />

        <View style={{ paddingBottom: 24 }}>
          <PinKeypad value={pin} onChange={onChange} />
        </View>
      </View>
    </Screen>
  );
}
