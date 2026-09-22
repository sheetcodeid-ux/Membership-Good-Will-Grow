import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AppText, Button } from "../components/ui";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { brand } from "../theme/colors";
import { useAuthStore } from "../store/authStore";

export default function WelcomeScreen() {
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  const openLogin = () => {
    completeOnboarding();
    router.push("/login");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#04102F" }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#04102F", "#0B2B73", brand[600]]}
        locations={[0, 0.6, 1]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
          <View style={{ flex: 1, width: "100%", maxWidth: 520, alignSelf: "center" }}>
            <View style={{ alignItems: "center", paddingTop: 20, gap: 10 }}>
              <ImagePlaceholder
                label="Logo"
                style={{ width: 188, height: 116 }}
                radius={22}
              />
              <AppText variant="captionMedium" color={brand[300]} style={{ letterSpacing: 2 }}>
                good • will • grow
              </AppText>
            </View>

            <View style={{ paddingHorizontal: 24, paddingTop: 28 }}>
              <AppText variant="display" color="#FFFFFF" center>
                Untuk kamu yang{"\n"}
                <AppText variant="display" color={brand[300]}>
                  terus bertumbuh
                </AppText>
                {"\n"}dan berbagi cerita
              </AppText>
            </View>

            <ImagePlaceholder
              label="Foto Hero"
              iconSize={40}
              radius={0}
              style={{ flex: 1, marginTop: 28 }}
            />

            <View style={{ paddingHorizontal: 24, paddingTop: 22, paddingBottom: 10 }}>
              <Button label="Masuk / Daftar" variant="light" size="lg" fullWidth onPress={openLogin} />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
