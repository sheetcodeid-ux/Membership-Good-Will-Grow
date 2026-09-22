import React, { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AppText } from "../components/ui";
import { AppHeader } from "../components/ui/AppHeader";
import { PinDots, PinKeypad } from "../components/PinPad";
import { ink, surface } from "../theme/colors";

export default function CreatePinScreen() {
  const [pin, setPin] = useState("");

  const onChange = (next: string) => {
    setPin(next);
    if (next.length === 6) {
      setTimeout(() => {
        router.push({ pathname: "/confirm-pin", params: { pin: next } });
      }, 180);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Buat PIN" />

      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          <AppText
            center
            color={ink[950]}
            style={{ marginTop: 46, fontSize: 25, lineHeight: 32, fontFamily: "Urbanist_700Bold" }}
          >
            Buat PIN Good Will Grow
          </AppText>
          <AppText variant="body" color={ink[500]} center style={{ marginTop: 10 }}>
            6 digit PIN untuk mengamankan akunmu
          </AppText>

          <View style={{ marginTop: 52 }}>
            <PinDots value={pin} />
          </View>

          <View style={{ flex: 1 }} />

          <PinKeypad value={pin} onChange={onChange} />
          <View style={{ height: 34 }} />
        </View>
      </SafeAreaView>
    </View>
  );
}
