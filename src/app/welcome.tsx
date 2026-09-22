import React from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Button } from "../components/ui";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { ink } from "../theme/colors";

export default function WelcomeScreen() {
  const openLogin = () => router.push("/login");

  return (
    <View style={{ flex: 1, backgroundColor: ink[200] }}>
      {/* Artwork is expected to be dark, as in the reference. */}
      <StatusBar style="light" />

      {/* Full-screen artwork slot. Swap for:
          <Image source={...} style={StyleSheet.absoluteFill} resizeMode="cover" /> */}
      <ImagePlaceholder
        label="Desain Background (full screen)"
        radius={0}
        iconSize={44}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView edges={["bottom"]} style={{ marginTop: "auto" }}>
        <View
          style={{
            width: "100%",
            maxWidth: 520,
            alignSelf: "center",
            paddingHorizontal: 26,
            paddingBottom: 22,
          }}
        >
          <Button
            label="Masuk / Daftar"
            variant="light"
            size="lg"
            fullWidth
            onPress={openLogin}
            style={{ height: 58 }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
