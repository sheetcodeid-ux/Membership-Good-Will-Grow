import React, { useState } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { X, Phone } from "lucide-react-native";
import { PressableScale } from "../components/ui/PressableScale";
import { AppText, Button, Input, Screen } from "../components/ui";
import { brand, ink } from "../theme/colors";
import { useAuthStore } from "../store/authStore";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(true);
  const setPhoneStore = useAuthStore((s) => s.setPhone);

  const canSubmit = phone.length >= 8 && agree;

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, gap: 28 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              backgroundColor: brand[600],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppText variant="h2" color="#FFFFFF">
              GWG
            </AppText>
          </View>

          <View style={{ gap: 8 }}>
            <AppText variant="h1">Masuk ke Akun{"\n"}Good Will Grow</AppText>
            <AppText variant="body" color={ink[500]}>
              Silakan masuk dengan nomor WhatsApp yang terdaftar. Pastikan nomor kamu aktif.
            </AppText>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{
                width: 68,
                height: 54,
                borderRadius: 16,
                backgroundColor: ink[50],
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1.5,
                borderColor: ink[200],
              }}
            >
              <AppText variant="titleLg">+62</AppText>
            </View>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="82354860207"
                keyboardType="number-pad"
                value={phone}
                onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, ""))}
                left={<Phone size={18} color={ink[400]} />}
                right={
                  phone.length > 0 ? (
                    <PressableScale onPress={() => setPhone("")}>
                      <X size={18} color={ink[400]} />
                    </PressableScale>
                  ) : undefined
                }
              />
            </View>
          </View>

          <PressableScale
            onPress={() => setAgree((a) => !a)}
            style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 7,
                marginTop: 2,
                backgroundColor: agree ? brand[600] : "#FFFFFF",
                borderWidth: 1.5,
                borderColor: agree ? brand[600] : ink[300],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {agree ? <AppText variant="micro" color="#FFFFFF">✓</AppText> : null}
            </View>
            <AppText variant="caption" color={ink[500]} style={{ flex: 1 }}>
              Dengan melanjutkan ke aplikasi Good Will Grow, kamu menyetujui Syarat dan Ketentuan
              dan Kebijakan Privasi kami.
            </AppText>
          </PressableScale>

          <View style={{ flex: 1 }} />

          <Button
            label="Kirim Kode OTP"
            fullWidth
            size="lg"
            disabled={!canSubmit}
            onPress={() => {
              setPhoneStore(phone);
              router.push("/otp");
            }}
            style={{ marginBottom: 24 }}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
