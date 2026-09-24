import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { UiText } from "../../components/ui/Text";
import { Avatar } from "../../components/ui/Avatar";
import { AppIcon } from "../../components/ui/AppIcon";
import { PressableScale } from "../../components/ui/PressableScale";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { AccountHeroArt } from "../../components/AccountHeroArt";
import { AccountMenu, AccountSection } from "../../components/AccountMenu";
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
import { brand, danger, gold, goldRamp, ink, surface } from "../../theme/colors";
import { shadow } from "../../theme/shadows";
import { radius, space } from "../../theme/scale";
import { useResponsive } from "../../theme/responsive";
import { CONTACT, openEmail, openWhatsApp } from "../../data/contact";
import { localPhone, useAuthStore } from "../../store/authStore";
import { coupons, orders } from "../../data/mock";

/**
 * Tall enough that the scene still has a band to live in once the identity
 * card has overlapped it. At 200 the hills crested behind the card.
 */
const HERO_H = 230;

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const r = useResponsive();
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
      >
        {/* Inside the list, not pinned over it: the scene belongs to the top
            of the page and should leave with it. Pinned, it stayed put while
            the rows slid over it. */}
        <View style={{ height: HERO_H + insets.top }}>
          <AccountHeroArt width={r.width} height={HERO_H + insets.top} />
        </View>

        <SafeAreaView edges={["top"]} style={{ position: "absolute", left: 0, right: 0 }}>
          <View style={{ height: 48, justifyContent: "center", paddingHorizontal: r.gutter }}>
            <UiText token="h2" color={brand[900]}>
              Akun Saya
            </UiText>
          </View>
        </SafeAreaView>

        <View
          style={{
            paddingHorizontal: r.gutter,
            // The identity card overlaps the scene, which is what ties the
            // two together instead of stacking them.
            marginTop: -(HERO_H - 124),
          }}
        >
          {/* Identity. Tapping it opens the detail; the pencil goes straight
              to editing, because those are different intentions. */}
          <PressableScale
            scaleTo={0.99}
            onPress={() => router.push("/profile-detail")}
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              padding: space.lg,
              flexDirection: "row",
              alignItems: "center",
              gap: space.md,
              ...(shadow.lg as object),
            }}
          >
            <Avatar name={name} size={56} />
            <View style={{ flex: 1, gap: 2 }}>
              <UiText token="h3" color={brand[900]} numberOfLines={1}>
                {name}
              </UiText>
              <UiText token="caption" color={ink[500]}>
                {localPhone(phone)}
              </UiText>
            </View>
            <PressableScale
              onPress={() => router.push("/edit-profile")}
              rippleBorderless
              hitSlop={12}
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: brand[50],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppIcon name="compose" size={18} color={brand[700]} />
            </PressableScale>
          </PressableScale>

          {/* Referral rides under the card as one piece with it — the code is
              part of who you are here, not another menu row. */}
          <PressableScale onPress={copyCode} scaleTo={0.99}>
            <LinearGradient
              colors={[goldRamp[0], goldRamp[1], goldRamp[2]]}
              locations={[0, 0.45, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                marginHorizontal: space.xs,
                borderBottomLeftRadius: radius.xl,
                borderBottomRightRadius: radius.xl,
                paddingHorizontal: space.lg,
                paddingTop: space.md + 2,
                paddingBottom: space.md,
                flexDirection: "row",
                alignItems: "center",
                gap: space.sm,
                overflow: "hidden",
              }}
            >
              {/* A highlight across the top third, the way a real gold face
                  catches light. Without it the strip is flat colour. */}
              <LinearGradient
                colors={["rgba(255,255,255,0.55)", "rgba(255,255,255,0)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ position: "absolute", left: 0, right: 0, top: 0, height: 18 }}
                pointerEvents="none"
              />
              <QrGlyph size={17} color="#6B2A00" detail={goldRamp[1]} />
              <UiText token="captionMedium" color="#702B00">
                Kode Referal
              </UiText>
              <View style={{ flex: 1 }} />
              <UiText token="bodySemibold" color="#4A1D00">
                {referralCode}
              </UiText>
              <AppIcon
                name={copied ? "check" : "copy"}
                size={16}
                color={copied ? "#1F6B45" : "#702B00"}
              />
            </LinearGradient>
          </PressableScale>

          {/* The one thing the screen actively asks for, given its own card
              with a button rather than being buried in a list. */}
          <View
            style={{
              marginTop: space.lg,
              backgroundColor: "#FFF6E2",
              borderRadius: radius.lg,
              padding: space.lg,
              flexDirection: "row",
              alignItems: "center",
              gap: space.md,
            }}
          >
            <View style={{ flex: 1, gap: space.sm }}>
              <UiText token="bodySemibold" color="#7A5514">
                Lengkapi profilmu, dapatkan reward
              </UiText>
              <PressableScale
                onPress={() => router.push("/edit-profile")}
                scaleTo={0.97}
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#FFFFFF",
                  borderRadius: radius.pill,
                  paddingHorizontal: space.lg,
                  paddingVertical: space.sm,
                }}
              >
                <UiText token="label" color="#7A5514">
                  Lengkapi sekarang
                </UiText>
              </PressableScale>
            </View>
            <GiftGlyph size={44} color={gold[500]} detail="#FFF6E2" />
          </View>

          <AccountSection title="Aktivitas kamu" />
          <AccountMenu
            items={[
              {
                icon: <OrderHistoryGlyph />,
                label: "Riwayat Pemesanan",
                badge: String(orders.length),
                onPress: () => router.push("/order-history"),
              },
              {
                icon: <PointsHistoryGlyph />,
                label: "Histori Poin",
                onPress: () => router.push("/points-history"),
              },
              {
                icon: <TagGlyph />,
                label: "Kupon Saya",
                badge: String(coupons.length),
                onPress: () => router.push("/coupons"),
              },
              {
                icon: <VoucherGlyph />,
                label: "Voucher Saya",
                onPress: () => router.push("/vouchers"),
              },
              {
                icon: <TagGlyph />,
                label: "Riwayat Pembelian Kupon",
                onPress: () => router.push("/coupon-purchases"),
              },
            ]}
          />

          <AccountSection title="Preferensi" />
          <AccountMenu
            items={[
              {
                icon: <GearFlowerGlyph />,
                label: "Pengaturan",
                onPress: () => router.push("/settings"),
              },
              {
                icon: <MenuLinesGlyph />,
                label: "Atur Menu Pintas",
                onPress: () => router.push("/shortcuts"),
              },
              {
                icon: <BlockedUserGlyph />,
                label: "Daftar Blokir Pengguna",
                onPress: () => router.push("/blocked"),
              },
            ]}
          />

          <AccountSection title="Bantuan & ketentuan" />
          <AccountMenu
            items={[
              { icon: <FaqGlyph />, label: "FAQ", onPress: () => router.push("/faq") },
              {
                icon: <TermsGlyph />,
                label: "Syarat & Ketentuan",
                onPress: () => router.push("/terms"),
              },
              {
                icon: <PrivacyGlyph />,
                label: "Kebijakan Privasi",
                onPress: () => router.push("/privacy"),
              },
              {
                icon: <WhatsAppGlyph size={19} />,
                label: CONTACT.phoneLabel,
                onPress: () => openWhatsApp(),
              },
              {
                icon: <AppIcon name="mail" size={19} color={brand[700]} />,
                label: CONTACT.emailLabel,
                onPress: () => openEmail("Bantuan Good Will Grow"),
              },
            ]}
          />

          <View style={{ marginTop: space.xxl }}>
            <AccountMenu
              items={[
                {
                  icon: <LogoutGlyph />,
                  label: "Keluar",
                  tone: danger[500],
                  plain: true,
                  onPress: () => setConfirmLogout(true),
                },
              ]}
            />
          </View>

          <UiText token="caption" color={ink[400]} center style={{ marginTop: space.lg }}>
            Good Will Grow v1.0.0
          </UiText>
        </View>
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
