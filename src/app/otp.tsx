import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { router } from "expo-router";
import { AppText, Button, Screen } from "../components/ui";
import { brand, ink } from "../theme/colors";
import { useAuthStore } from "../store/authStore";

const LENGTH = 6;

export default function OtpScreen() {
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(45);
  const inputRef = useRef<TextInput>(null);
  const phone = useAuthStore((s) => s.phone);
  const hasPin = useAuthStore((s) => s.hasPin);
  const loginSuccess = useAuthStore((s) => s.loginSuccess);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(focusTimer);
  }, []);

  const verify = useCallback(() => {
    if (hasPin) {
      loginSuccess();
      router.replace("/(tabs)");
    } else {
      router.replace("/create-pin");
    }
  }, [hasPin, loginSuccess]);

  useEffect(() => {
    if (code.length === LENGTH) {
      const t = setTimeout(verify, 250);
      return () => clearTimeout(t);
    }
  }, [code, verify]);

  return (
    <Screen>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, gap: 24 }}>
        <View style={{ gap: 8 }}>
          <AppText variant="h1">Verifikasi Kode OTP</AppText>
          <AppText variant="body" color={ink[500]}>
            Kami telah mengirim kode 6 digit ke WhatsApp{" "}
            <AppText variant="bodySemibold">+62{phone || "812xxxxxxx"}</AppText>
          </AppText>
        </View>

        <Pressable onPress={() => inputRef.current?.focus()}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {Array.from({ length: LENGTH }).map((_, i) => {
              const filled = code[i];
              const active = i === code.length;
              return (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: 56,
                    borderRadius: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: ink[50],
                    borderWidth: 1.5,
                    borderColor: active ? brand[500] : filled ? brand[300] : ink[200],
                  }}
                >
                  <AppText variant="h3">{filled ?? ""}</AppText>
                </View>
              );
            })}
          </View>
        </Pressable>

        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={(t) => setCode(t.replace(/[^0-9]/g, "").slice(0, LENGTH))}
          keyboardType="number-pad"
          maxLength={LENGTH}
          style={{ position: "absolute", opacity: 0, height: 0, width: 0 }}
        />

        <View style={{ flexDirection: "row", justifyContent: "center", gap: 6 }}>
          <AppText variant="body" color={ink[500]}>
            Tidak menerima kode?
          </AppText>
          <Pressable disabled={seconds > 0} onPress={() => setSeconds(45)}>
            <AppText variant="bodySemibold" color={seconds > 0 ? ink[400] : brand[600]}>
              {seconds > 0 ? `Kirim ulang (${seconds}s)` : "Kirim ulang"}
            </AppText>
          </Pressable>
        </View>

        <View style={{ flex: 1 }} />

        <Button
          label="Verifikasi"
          size="lg"
          fullWidth
          disabled={code.length !== LENGTH}
          onPress={verify}
          style={{ marginBottom: 24 }}
        />
      </View>
    </Screen>
  );
}
