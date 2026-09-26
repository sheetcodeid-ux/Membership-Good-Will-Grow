import React, { useState } from "react";
import { Linking, ScrollView, Share, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { Glyph, type GlyphName } from "../components/icons/Glyph";
import { RewardArt, REWARD_ART_W } from "../components/RewardArt";
import {
  AccountCard,
  AccountSection,
  LABEL_INK,
  QUIET_INK,
  RULE,
} from "../components/AccountMenu";
import { brand, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { useAuthStore } from "../store/authStore";
import { showToast } from "../store/toastStore";
import { tapPress, tapSuccess } from "../utils/haptics";
import { useScrolled } from "../hooks/useScrolled";
import { CountUp } from "../components/ui/CountUp";

const EDGE = 13.5;
/** The referral strip's gold and ink, carried over from the profile. */
const GOLD = ["#FFDD00", "#FFDD00", "#FFFDEF"] as const;
const STRIP_INK = "#702B00";

const steps: { icon: GlyphName; title: string; body: string }[] = [
  {
    icon: "share",
    title: "Bagikan kode",
    body: "Kirim kode referal kamu ke teman lewat chat atau media sosial.",
  },
  {
    icon: "userPlus",
    title: "Teman mendaftar",
    body: "Teman memasukkan kode kamu saat mendaftar di Good Will Grow.",
  },
  {
    icon: "gift",
    title: "Kamu dapat reward",
    body: "Kupon masuk ke akunmu setelah teman menyelesaikan transaksi pertama.",
  },
];

function PillButton({
  icon,
  label,
  onPress,
  solid,
}: {
  icon: GlyphName;
  label: string;
  onPress: () => void;
  solid?: boolean;
}) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.97}
      style={{
        flex: 1,
        height: 44,
        borderRadius: 22,
        borderWidth: solid ? 0 : 1,
        borderColor: RULE,
        backgroundColor: solid ? brand[600] : "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <Glyph name={icon} size={17} color={solid ? "#FFFFFF" : LABEL_INK} />
      <UiText
        color={solid ? "#FFFFFF" : LABEL_INK}
        style={{ fontSize: 15, lineHeight: 19, fontFamily: fontFamilies.bold }}
      >
        {label}
      </UiText>
    </PressableScale>
  );
}

export default function ReferralScreen() {
  const code = useAuthStore((s) => s.referralCode);
  const joined = useAuthStore((s) => s.referralJoined);
  const rewards = useAuthStore((s) => s.referralRewards);
  const [copied, setCopied] = useState(false);
  const scroll = useScrolled();
  const message = `Gabung Good Will Grow pakai kode referal saya: ${code}. Kita sama-sama dapat reward!`;

  const copy = async () => {
    await Clipboard.setStringAsync(code);
    tapSuccess();
    showToast("Kode referal disalin");
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const share = () => {
    tapPress();
    Share.share({ message }).catch(() => {});
  };

  // Straight into WhatsApp when it is installed, else WhatsApp on the web.
  const shareWhatsApp = () => {
    tapPress();
    const text = encodeURIComponent(message);
    Linking.openURL(`whatsapp://send?text=${text}`).catch(() =>
      Linking.openURL(`https://wa.me/?text=${text}`).catch(() =>
        showToast("WhatsApp tidak bisa dibuka", "error"),
      ),
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader
        tone="account"
        title="Kode Referal"
        divider={scroll.scrolled}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scroll.onScroll}
        scrollEventThrottle={scroll.scrollEventThrottle}
        contentContainerStyle={{
          paddingHorizontal: EDGE,
          paddingTop: 16,
          paddingBottom: 40,
        }}
      >
        {/* The profile's gold strip, opened up: the invitation with the
            gift that the reward card already uses. */}
        <LinearGradient
          colors={GOLD}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            borderRadius: 16,
            overflow: "hidden",
            minHeight: 116,
            paddingLeft: 16,
            paddingVertical: 18,
            paddingRight: REWARD_ART_W - 12,
            justifyContent: "center",
          }}
        >
          <View style={{ position: "absolute", right: 0, bottom: -4 }}>
            <RewardArt />
          </View>
          <UiText
            color={STRIP_INK}
            style={{
              fontSize: 18,
              lineHeight: 22,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            Ajak teman, dapat reward bareng
          </UiText>
          <UiText
            color={STRIP_INK}
            style={{
              marginTop: 6,
              fontSize: 13,
              lineHeight: 17,
              fontFamily: fontFamilies.medium,
              opacity: 0.85,
            }}
          >
            Tiap teman yang bergabung dan bertransaksi pertama kali, kamu dapat
            kupon.
          </UiText>
        </LinearGradient>

        <AccountSection title="Kode referal kamu" />
        <AccountCard style={{ padding: 14 }}>
          <View
            style={{
              height: 64,
              borderRadius: 12,
              borderWidth: 1.5,
              borderStyle: "dashed",
              borderColor: "#E9B800",
              backgroundColor: "#FFFBE6",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <Glyph name="qr" size={22} color={STRIP_INK} />
            <UiText
              color={STRIP_INK}
              style={{
                fontSize: 26,
                lineHeight: 32,
                letterSpacing: 3,
                fontFamily: fontFamilies.extrabold,
              }}
            >
              {code}
            </UiText>
          </View>
          <PressableScale
            onPress={shareWhatsApp}
            scaleTo={0.98}
            style={{
              marginTop: 12,
              height: 46,
              borderRadius: 23,
              backgroundColor: "#25D366",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Glyph name="whatsapp" size={19} color="#FFFFFF" />
            <UiText
              color="#FFFFFF"
              style={{
                fontSize: 15,
                lineHeight: 19,
                fontFamily: fontFamilies.bold,
              }}
            >
              Bagikan ke WhatsApp
            </UiText>
          </PressableScale>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <PillButton
              icon={copied ? "check" : "copy"}
              label={copied ? "Tersalin" : "Salin kode"}
              onPress={copy}
            />
            <PillButton icon="share" label="Lainnya" onPress={share} />
          </View>
        </AccountCard>

        <AccountSection title="Hasil ajakanmu" />
        <AccountCard style={{ flexDirection: "row", paddingVertical: 14 }}>
          {[
            {
              label: "Teman bergabung",
              value: joined,
              icon: "userPlus" as const,
            },
            { label: "Kupon didapat", value: rewards, icon: "ticket" as const },
          ].map((stat, i) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingHorizontal: 14,
                borderLeftWidth: i > 0 ? 1 : 0,
                borderLeftColor: RULE,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: "#FFF3C4",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Glyph name={stat.icon} size={18} color={STRIP_INK} />
              </View>
              <View>
                <CountUp
                  value={stat.value}
                  format={(n) => n.toLocaleString("id-ID")}
                  color={LABEL_INK}
                  style={{
                    fontSize: 20,
                    lineHeight: 24,
                    fontFamily: fontFamilies.extrabold,
                  }}
                />
                <UiText
                  color={QUIET_INK}
                  style={{
                    fontSize: 12,
                    lineHeight: 16,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  {stat.label}
                </UiText>
              </View>
            </View>
          ))}
        </AccountCard>
        {joined === 0 ? (
          <UiText
            color={QUIET_INK}
            style={{
              marginTop: 8,
              fontSize: 12.5,
              lineHeight: 17,
              fontFamily: fontFamilies.medium,
            }}
          >
            Belum ada teman yang bergabung. Kirim kodemu sekarang, yuk!
          </UiText>
        ) : null}

        <AccountSection title="Cara kerjanya" />
        <AccountCard style={{ paddingVertical: 6 }}>
          {steps.map((step, i) => (
            <View
              key={step.title}
              style={{ flexDirection: "row", paddingHorizontal: 14 }}
            >
              {/* step marker, with a dotted thread down to the next one */}
              <View style={{ width: 38, alignItems: "center" }}>
                <View
                  style={{
                    marginTop: 10,
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    backgroundColor: "#FFF3C4",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Glyph name={step.icon} size={19} color={STRIP_INK} />
                </View>
                {i < steps.length - 1 ? (
                  <View
                    style={{
                      flex: 1,
                      width: 0,
                      marginVertical: 4,
                      borderLeftWidth: 1.5,
                      borderStyle: "dashed",
                      borderColor: "#E9C75A",
                    }}
                  />
                ) : null}
              </View>
              <View style={{ flex: 1, marginLeft: 12, paddingVertical: 10 }}>
                <UiText
                  color={QUIET_INK}
                  style={{
                    fontSize: 12,
                    lineHeight: 16,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  Langkah {i + 1}
                </UiText>
                <UiText
                  color={LABEL_INK}
                  style={{
                    marginTop: 1,
                    fontSize: 15,
                    lineHeight: 19,
                    fontFamily: fontFamilies.semibold,
                  }}
                >
                  {step.title}
                </UiText>
                <UiText
                  color={QUIET_INK}
                  style={{
                    marginTop: 3,
                    fontSize: 13,
                    lineHeight: 18,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  {step.body}
                </UiText>
              </View>
            </View>
          ))}
        </AccountCard>
      </ScrollView>
    </View>
  );
}
