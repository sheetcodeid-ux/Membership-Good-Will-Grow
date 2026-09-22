import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { PenLine, MapPin, ChevronRight } from "lucide-react-native";
import { AppText } from "../components/ui";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, ink, surface } from "../theme/colors";
import { shadow } from "../theme/shadows";

const options = [
  {
    key: "post",
    icon: PenLine,
    title: "Buat Post",
    subtitle: "Bagikan pemikiran, foto, atau update kamu",
  },
  {
    key: "checkin",
    icon: MapPin,
    title: "Check In",
    subtitle: "Bagikan lokasi dan pengalaman di outlet terdekat",
  },
];

export default function CreatePostChooser() {
  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Buat Post" leftIcon="close" />

      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 20, gap: 30 }}>
          <View style={{ gap: 8 }}>
            <AppText
              center
              color={ink[950]}
              style={{ fontSize: 24, lineHeight: 31, fontFamily: "Urbanist_700Bold" }}
            >
              Apa yang ingin kamu bagikan?
            </AppText>
            <AppText variant="body" color={ink[400]} center style={{ fontSize: 15 }}>
              Pilih jenis post yang ingin kamu buat
            </AppText>
          </View>

          <View style={{ gap: 18 }}>
            {options.map(({ key, icon: Icon, title, subtitle }) => (
              <PressableScale
                key={key}
                onPress={() => router.push(`/post-editor?type=${key}`)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 16,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 20,
                  padding: 16,
                  ...(shadow.sm as object),
                }}
              >
                <View
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 18,
                    backgroundColor: brand[50],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={26} color={brand[800]} strokeWidth={2.2} />
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <AppText variant="h3">{title}</AppText>
                  <AppText variant="body" color={ink[400]}>
                    {subtitle}
                  </AppText>
                </View>
                <ChevronRight size={20} color={ink[300]} />
              </PressableScale>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
