import React, { useState } from "react";
import { AppIcon } from "../components/ui/AppIcon";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Animated, { SlideInDown } from "react-native-reanimated";
import { AppText, Button } from "../components/ui";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, ink } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { useAuthStore } from "../store/authStore";

export default function LoginSheet() {
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(true);
  const setPhoneStore = useAuthStore((s) => s.setPhone);

  const canSubmit = phone.length >= 8 && agree;

  const submit = () => {
    setPhoneStore(phone);
    router.push("/unlock");
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />

      <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(4,16,47,0.55)" }]} />
      </Pressable>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "flex-end" }}
        pointerEvents="box-none"
      >
        <Animated.View
          entering={SlideInDown.duration(320)}
          style={{
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
          }}
        >
          <SafeAreaView edges={["bottom"]}>
            <View
              style={{
                width: "100%",
                maxWidth: 520,
                alignSelf: "center",
                paddingHorizontal: 30,
                paddingTop: 34,
                paddingBottom: 14,
              }}
            >
              <AppText variant="h2" color={brand[700]}>
                Masuk ke Akun Good Will Grow
              </AppText>

              <AppText
                variant="body"
                color={ink[600]}
                style={{ fontSize: 15.5, lineHeight: 23, marginTop: 14 }}
              >
                Silakan masuk dengan nomor WhatsApp yang terdaftar. Pastikan nomor kamu aktif.
              </AppText>

              <View
                style={{
                  flexDirection: "row",
                  height: 64,
                  marginTop: 26,
                  borderRadius: 14,
                  borderWidth: 1.5,
                  borderColor: brand[600],
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: 68,
                    backgroundColor: brand[50],
                    alignItems: "center",
                    justifyContent: "center",
                    borderRightWidth: 1.5,
                    borderRightColor: brand[600],
                  }}
                >
                  <AppText variant="titleLg" color={brand[700]}>
                    +62
                  </AppText>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    paddingHorizontal: 16,
                  }}
                >
                  <TextInput
                    value={phone}
                    onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, ""))}
                    keyboardType="number-pad"
                    placeholder="82354860207"
                    placeholderTextColor={ink[300]}
                    style={[
                      {
                        flex: 1,
                        // Without this the web <input> refuses to shrink below
                        // its intrinsic width and pushes the clear button out.
                        minWidth: 0,
                        padding: 0,
                        fontFamily: fontFamilies.medium,
                        fontSize: 19,
                        color: ink[900],
                      },
                      // react-native-web renders a real <input>, which draws a
                      // focus ring the native platforms do not have.
                      Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null,
                    ]}
                  />
                  {phone.length > 0 ? (
                    <PressableScale onPress={() => setPhone("")} hitSlop={10}>
                      <AppIcon name="close" size={20} color={ink[400]} />
                    </PressableScale>
                  ) : null}
                </View>
              </View>

              <PressableScale
                onPress={() => setAgree((v) => !v)}
                style={{ flexDirection: "row", gap: 12, marginTop: 20 }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    marginTop: 1,
                    backgroundColor: agree ? brand[900] : "#FFFFFF",
                    borderWidth: 1.5,
                    borderColor: agree ? brand[900] : ink[300],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {agree ? <AppIcon name="check" size={14} color="#FFFFFF" /> : null}
                </View>
                <AppText variant="caption" color={ink[600]} style={{ flex: 1, lineHeight: 18 }}>
                  Dengan melanjutkan ke aplikasi Good Will Grow, kamu menyetujui segala{" "}
                  <AppText
                    variant="caption"
                    color={ink[900]}
                    style={{
                      fontFamily: fontFamilies.semibold,
                      textDecorationLine: "underline",
                    }}
                  >
                    Syarat dan Ketentuan
                  </AppText>{" "}
                  dan{" "}
                  <AppText
                    variant="caption"
                    color={ink[900]}
                    style={{
                      fontFamily: fontFamilies.semibold,
                      textDecorationLine: "underline",
                    }}
                  >
                    Kebijakan Privasi
                  </AppText>{" "}
                  Aplikasi Good Will Grow.
                </AppText>
              </PressableScale>

              <Button
                label="Masuk"
                size="lg"
                fullWidth
                disabled={!canSubmit}
                onPress={submit}
                style={{ height: 58, marginTop: 28, backgroundColor: canSubmit ? brand[900] : undefined }}
              />
            </View>
          </SafeAreaView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}
