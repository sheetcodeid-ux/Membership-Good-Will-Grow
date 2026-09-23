import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { Check, ChevronRight, Copy, Mail, User } from "lucide-react-native";
import { AppText } from "../../components/ui/AppText";
import { PressableScale } from "../../components/ui/PressableScale";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import {
  BlockedUserGlyph,
  FaqGlyph,
  GearFlowerGlyph,
  GiftGlyph,
  LogoutGlyph,
  MenuLinesGlyph,
  OrderHistoryGlyph,
  PointsHistoryGlyph,
  PrivacyGlyph,
  QrGlyph,
  TagGlyph,
  TermsGlyph,
  VoucherGlyph,
  WhatsAppGlyph,
} from "../../components/AccountIcons";
import { brand, danger, gold, ink, surface } from "../../theme/colors";
import { shadow } from "../../theme/shadows";
import { CONTACT, openEmail, openWhatsApp } from "../../data/contact";
import { localPhone, useAuthStore } from "../../store/authStore";

/** Measured off the reference: cards sit 10.5pt in from each edge. */
const GUTTER = 11;
const ROW_H = 47.5;
const ROW_GAP = 7.5;
const GROUP_GAP = 21;

function MenuCard({
  icon,
  label,
  onPress,
  tone = brand[800],
  chevronColor = brand[700],
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  tone?: string;
  chevronColor?: string;
}) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.99}
      style={{
        height: ROW_H,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 18,
        gap: 7,
        ...(shadow.xs as object),
      }}
    >
      <View style={{ width: 17, alignItems: "center" }}>{icon}</View>
      <AppText variant="bodyMedium" color={tone} numberOfLines={1} style={{ flex: 1 }}>
        {label}
      </AppText>
      <ChevronRight size={16} color={chevronColor} strokeWidth={2.4} />
    </PressableScale>
  );
}

/** Green WhatsApp disc / outlined envelope, as the reference draws them. */
function HelpCard({
  icon,
  value,
  onPress,
}: {
  icon: React.ReactNode;
  value: string;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.99}
      style={{
        height: 54,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 13,
        gap: 12,
        ...(shadow.xs as object),
      }}
    >
      {icon}
      <View style={{ flex: 1, gap: 1 }}>
        <AppText variant="caption" color={ink[500]} numberOfLines={1}>
          {CONTACT.csName}
        </AppText>
        <AppText variant="bodySemibold" color={ink[900]} numberOfLines={1}>
          {value}
        </AppText>
      </View>
      <ChevronRight size={16} color={brand[700]} strokeWidth={2.4} />
    </PressableScale>
  );
}

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const name = useAuthStore((s) => s.name);
  const phone = useAuthStore((s) => s.phone);
  const referralCode = useAuthStore((s) => s.referralCode);
  const logout = useAuthStore((s) => s.logout);
  const [copied, setCopied] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const copyCode = async () => {
    await Clipboard.setStringAsync(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderBottomLeftRadius: 18,
          borderBottomRightRadius: 18,
          zIndex: 2,
          ...(shadow.sm as object),
        }}
      >
        <SafeAreaView edges={["top"]}>
          <View style={{ paddingHorizontal: 16, height: 44, justifyContent: "center" }}>
            <AppText
              color={brand[700]}
              style={{ fontSize: 16, lineHeight: 22, fontFamily: "Urbanist_500Medium" }}
            >
              Account
            </AppText>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: GUTTER,
          paddingTop: 11,
          paddingBottom: insets.bottom + 100,
        }}
      >
        {/* Identity card. The gradient runs left to right in the reference. */}
        <PressableScale scaleTo={0.99} onPress={() => router.push("/profile-detail")}>
          <LinearGradient
            colors={[brand[950], brand[500]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 16, padding: 13, ...(shadow.sm as object) }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 11 }}>
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: "rgba(255,255,255,0.16)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <User size={22} color="#FFFFFF" fill="#FFFFFF" strokeWidth={1.6} />
              </View>
              <View style={{ flex: 1, gap: 1 }}>
                <AppText
                  color="#FFFFFF"
                  numberOfLines={1}
                  style={{ fontSize: 17, lineHeight: 23, fontFamily: "Urbanist_700Bold" }}
                >
                  {name}
                </AppText>
                <AppText color="rgba(255,255,255,0.88)" style={{ fontSize: 13, lineHeight: 18 }}>
                  {localPhone(phone)}
                </AppText>
              </View>
              <ChevronRight size={18} color="rgba(255,255,255,0.9)" strokeWidth={2.2} />
            </View>

            <PressableScale
              onPress={copyCode}
              scaleTo={0.98}
              style={{
                marginTop: 11,
                height: 34,
                borderRadius: 11,
                backgroundColor: "#FFFFFF",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 12,
                gap: 9,
              }}
            >
              <QrGlyph size={15} color={brand[600]} />
              <AppText variant="bodyMedium" color={ink[800]} style={{ flex: 1 }}>
                Kode Referal
              </AppText>
              <AppText
                color={brand[900]}
                style={{ fontSize: 15, lineHeight: 20, fontFamily: "Urbanist_700Bold" }}
              >
                {referralCode}
              </AppText>
              {copied ? (
                <Check size={16} color={brand[600]} strokeWidth={2.6} />
              ) : (
                <Copy size={16} color={brand[800]} strokeWidth={2} />
              )}
            </PressableScale>
          </LinearGradient>
        </PressableScale>

        <PressableScale
          onPress={() => router.push("/edit-profile")}
          scaleTo={0.99}
          style={{
            marginTop: ROW_GAP + 3,
            height: 61,
            borderRadius: 14,
            backgroundColor: "#FFFFFF",
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 13,
            paddingRight: 18,
            gap: 12,
            ...(shadow.xs as object),
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              backgroundColor: gold[50],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GiftGlyph size={21} color={gold[500]} detail={gold[50]} />
          </View>
          <AppText
            color={brand[900]}
            numberOfLines={2}
            style={{ flex: 1, fontSize: 13.5, lineHeight: 18, fontFamily: "Urbanist_600SemiBold" }}
          >
            Lengkapi profil anda, dapatkan reward menarik
          </AppText>
          <ChevronRight size={16} color={brand[700]} strokeWidth={2.4} />
        </PressableScale>

        <View style={{ marginTop: GROUP_GAP, gap: ROW_GAP }}>
          <MenuCard
            icon={<TagGlyph />}
            label="Kupon Saya"
            onPress={() => router.push("/coupons")}
          />
          <MenuCard
            icon={<VoucherGlyph />}
            label="Voucher Saya"
            onPress={() => router.push("/vouchers")}
          />
          <MenuCard
            icon={<PointsHistoryGlyph />}
            label="Histori Poin"
            onPress={() => router.push("/points-history")}
          />
          <MenuCard
            icon={<OrderHistoryGlyph />}
            label="Riwayat Pemesanan"
            onPress={() => router.push("/order-history")}
          />
          <MenuCard
            icon={<TagGlyph />}
            label="Riwayat Pembelian Kupon"
            onPress={() => router.push("/coupon-purchases")}
          />
          <MenuCard
            icon={<BlockedUserGlyph />}
            label="Daftar Blokir Pengguna"
            onPress={() => router.push("/blocked")}
          />
          <MenuCard
            icon={<MenuLinesGlyph />}
            label="Atur Menu Pintas"
            onPress={() => router.push("/shortcuts")}
          />
          <MenuCard
            icon={<GearFlowerGlyph color={brand[400]} />}
            label="Pengaturan"
            onPress={() => router.push("/settings")}
          />
        </View>

        <View style={{ marginTop: GROUP_GAP, gap: ROW_GAP }}>
          <MenuCard
            icon={<FaqGlyph color={brand[300]} />}
            label="FAQ"
            onPress={() => router.push("/faq")}
          />
          <MenuCard
            icon={<TermsGlyph color={brand[300]} />}
            label="Syarat & Ketentuan"
            onPress={() => router.push("/terms")}
          />
          <MenuCard
            icon={<PrivacyGlyph color={brand[400]} />}
            label="Kebijakan Privasi"
            onPress={() => router.push("/privacy")}
          />
        </View>

        <View style={{ marginTop: GROUP_GAP }}>
          <MenuCard
            icon={<LogoutGlyph />}
            label="Keluar"
            tone={brand[800]}
            chevronColor={danger[500]}
            onPress={() => setConfirmLogout(true)}
          />
        </View>

        <AppText variant="bodySemibold" color={ink[800]} style={{ marginTop: GROUP_GAP + 2 }}>
          Butuh Bantuan?
        </AppText>

        <View style={{ marginTop: 9, gap: ROW_GAP }}>
          <HelpCard
            icon={
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#25D366",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <WhatsAppGlyph size={23} />
              </View>
            }
            value={CONTACT.phoneLabel}
            onPress={() => openWhatsApp()}
          />
          <HelpCard
            icon={
              <View style={{ width: 40, alignItems: "center" }}>
                <Mail size={27} color={brand[800]} strokeWidth={1.8} />
              </View>
            }
            value={CONTACT.emailLabel}
            onPress={() => openEmail("Bantuan Good Will Grow")}
          />
        </View>

        <AppText variant="caption" color={ink[400]} center style={{ marginTop: 16 }}>
          v1.0.0
        </AppText>
      </ScrollView>

      {confirmLogout ? (
        <ConfirmDialog
          title="Keluar dari akun?"
          message="Kamu perlu masuk lagi dengan nomor HP dan PIN untuk mengakses akunmu."
          cancelLabel="Batal"
          confirmLabel="Keluar"
          cancelColor={ink[500]}
          confirmColor={danger[500]}
          onCancel={() => setConfirmLogout(false)}
          onConfirm={() => {
            setConfirmLogout(false);
            logout();
            router.replace("/");
          }}
        />
      ) : null}
    </View>
  );
}
