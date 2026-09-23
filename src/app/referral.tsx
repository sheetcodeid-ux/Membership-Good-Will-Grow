import React, { useState } from "react";
import { AppIcon, type AppIconName } from "../components/ui/AppIcon";
import { ScrollView, Share, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Clipboard from "expo-clipboard";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, ink, surface } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { useAuthStore } from "../store/authStore";

const steps: { icon: AppIconName; title: string; body: string }[] = [
  {
    icon: "share",
    title: "Bagikan Kode",
    body: "Ajak teman untuk bergabung dengan membagikan kode referal Anda",
  },
  {
    icon: "userPlus",
    title: "Teman Mendaftar",
    body: "Teman menggunakan kode referal saat mendaftar di Good Will Grow",
  },
  {
    icon: "gift",
    title: "Dapatkan Reward",
    body: "Anda akan mendapatkan reward berupa kupon ketika teman Anda berhasil mendaftar & melakukan transaksi pertama",
  },
];

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        ...(shadow.xs as object),
      }}
    >
      {children}
    </View>
  );
}

export default function ReferralScreen() {
  const code = useAuthStore((s) => s.referralCode);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const share = () => {
    Share.share({
      message: `Gabung Good Will Grow pakai kode referal saya: ${code}. Kita sama-sama dapat reward!`,
    }).catch(() => {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Kode Referal" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 30, paddingBottom: 34 }}
      >
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: brand[100],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppIcon name="gift" size={54} color={brand[900]} />
          </View>
        </View>

        <AppText
          center
          color={ink[900]}
          style={{
            marginTop: 26,
            fontSize: 21,
            lineHeight: 29,
            fontFamily: "Urbanist_700Bold",
          }}
        >
          Ajak Teman, Dapatkan Reward!
        </AppText>
        <AppText
          center
          color={ink[400]}
          style={{ marginTop: 12, fontSize: 14, lineHeight: 20, paddingHorizontal: 8 }}
        >
          Bagikan kode referal Anda dan nikmati reward setiap kali teman Anda bergabung dan
          melakukan transaksi pertama.
        </AppText>

        <View style={{ height: 26 }} />

        <Card>
          <AppText center color={ink[500]} style={{ fontSize: 13.5, lineHeight: 19 }}>
            Kode Referal Anda
          </AppText>

          <View
            style={{
              marginTop: 12,
              height: 62,
              borderRadius: 12,
              borderWidth: 1.4,
              borderColor: brand[200],
              backgroundColor: brand[50],
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <AppIcon name="ticketPercent" size={21} color={brand[900]} />
            <AppText
              color={brand[900]}
              style={{
                fontSize: 23,
                lineHeight: 30,
                letterSpacing: 2,
                fontFamily: "Urbanist_700Bold",
              }}
            >
              {code}
            </AppText>
          </View>

          <View style={{ flexDirection: "row", gap: 12, marginTop: 14 }}>
            <PressableScale
              onPress={copy}
              scaleTo={0.98}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 10,
                borderWidth: 1.4,
                borderColor: brand[900],
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
              }}
            >
              {copied ? (
                <AppIcon name="check" size={17} color={brand[900]} />
              ) : (
                <AppIcon name="copy" size={17} color={brand[900]} />
              )}
              <AppText color={brand[900]} style={{ fontSize: 14.5, lineHeight: 20 }}>
                {copied ? "Tersalin" : "Salin"}
              </AppText>
            </PressableScale>

            <PressableScale
              onPress={share}
              scaleTo={0.98}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 10,
                backgroundColor: brand[950],
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
              }}
            >
              <AppIcon name="share" size={17} color="#FFFFFF" />
              <AppText color="#FFFFFF" style={{ fontSize: 14.5, lineHeight: 20 }}>
                Bagikan
              </AppText>
            </PressableScale>
          </View>
        </Card>

        <View style={{ height: 18 }} />

        <Card>
          <AppText
            color={ink[900]}
            style={{ fontSize: 17, lineHeight: 23, fontFamily: "Urbanist_700Bold" }}
          >
            Cara Kerja Referral
          </AppText>

          <View style={{ marginTop: 16, gap: 18 }}>
            {steps.map((step, i) => {
              const icon = step.icon;
              return (
                <View key={step.title} style={{ flexDirection: "row", gap: 14 }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: brand[950],
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AppText
                      color="#FFFFFF"
                      style={{ fontSize: 15, lineHeight: 20, fontFamily: "Urbanist_600SemiBold" }}
                    >
                      {i + 1}
                    </AppText>
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
                      <AppIcon name={icon} size={18} color={brand[900]} />
                      <AppText
                        color={ink[900]}
                        style={{
                          fontSize: 15.5,
                          lineHeight: 21,
                          fontFamily: "Urbanist_600SemiBold",
                        }}
                      >
                        {step.title}
                      </AppText>
                    </View>
                    <AppText color={ink[400]} style={{ fontSize: 13.5, lineHeight: 19 }}>
                      {step.body}
                    </AppText>
                  </View>
                </View>
              );
            })}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
