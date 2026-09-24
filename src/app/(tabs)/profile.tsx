import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { UiText } from "../../components/ui/Text";
import { Avatar } from "../../components/ui/Avatar";
import { PressableScale } from "../../components/ui/PressableScale";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { AccountHeroArt } from "../../components/AccountHeroArt";
import { AccountMenu, AccountSection } from "../../components/AccountMenu";
import { Glyph } from "../../components/icons/Glyph";
// Sign-out keeps its previous mark on purpose.
import { LogoutSolid } from "../../components/AccountSolidIcons";
import { danger, gold, iconGrey, ink, surface } from "../../theme/colors";
import { shadow } from "../../theme/shadows";
import { fontFamilies } from "../../theme/typography";
import { radius, space } from "../../theme/scale";
import { useResponsive } from "../../theme/responsive";
import { CONTACT, openEmail, openWhatsApp } from "../../data/contact";
import { intlPhone, useAuthStore } from "../../store/authStore";
import { coupons, orders } from "../../data/mock";

/*
 * Measured off the reference account screen (360dp wide, values in dp below
 * the status bar). The title's centre sits 32 down; the identity card starts
 * at 65 and is 80 tall; the scene behind them ends in a straight edge 61.5
 * into the card; the referral strip shows 33 below the card. Card and strip
 * sit 13.5 in from the screen edge.
 */
const HEADER_H = 64;
const CARD_TOP = 65;
const CARD_H = 80;
const HERO_H = CARD_TOP + 61.5;
const STRIP_H = 33;
const EDGE = 13.5;
const CARD_R = 15;
const INK_TEXT = "#202020";
const WARN = "#A34500";
const STRIP_INK = "#702B00";

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const name = useAuthStore((s) => s.name);
  const phone = useAuthStore((s) => s.phone);
  const email = useAuthStore((s) => s.email);
  const referralCode = useAuthStore((s) => s.referralCode);
  const logout = useAuthStore((s) => s.logout);
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
      >
        {/* Inside the list, not pinned over it: the scene belongs to the top
            of the page and should leave with it. It ends in a straight edge,
            as the reference's does — the card covers where a corner would be. */}
        <View style={{ height: HERO_H + insets.top, overflow: "hidden" }}>
          <AccountHeroArt width={r.width} height={HERO_H + insets.top} />
        </View>

        <SafeAreaView
          edges={["top"]}
          style={{ position: "absolute", left: 0, right: 0 }}
        >
          <View
            style={{
              height: HEADER_H,
              justifyContent: "center",
              paddingHorizontal: r.gutter,
            }}
          >
            <UiText
              token="titleLg"
              color={INK_TEXT}
              style={{ fontFamily: fontFamilies.bold }}
            >
              Akun Saya
            </UiText>
          </View>
        </SafeAreaView>

        <View
          style={{ paddingHorizontal: EDGE, marginTop: -(HERO_H - CARD_TOP) }}
        >
          {/*
            Identity card on top of the referral strip, as in the reference:
            the card keeps all four corners and a hairline border instead of
            a shadow, and the strip runs underneath it, flush with its sides,
            showing a 33dp band below. The strip carries the only shadow.
          */}
          <PressableScale
            scaleTo={0.995}
            onPress={() => router.push("/profile-detail")}
            style={{
              height: CARD_H,
              backgroundColor: "#FFFFFF",
              borderRadius: CARD_R,
              borderWidth: 1,
              borderColor: "#E6E6E6",
              paddingLeft: 15.5,
              paddingRight: 12.5,
              flexDirection: "row",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <Avatar name={name} size={48} initialsSize={12} />
            <View
              // Baselines measured at 242 / 278 / 311 on the 2x reference: the block
              // sits 4.5 below plain centring, with 18 and 16.5 between lines.
              style={{
                flex: 1,
                marginLeft: 18.5,
                justifyContent: "center",
                paddingTop: 6.5,
              }}
            >
              <UiText
                token="titleLg"
                color={INK_TEXT}
                numberOfLines={1}
                // 18 extra-bold: the reference name is 27px tall with a 5px
                // stroke at 2x; 16 bold measured 24 and 4.
                style={{
                  fontSize: 18,
                  fontFamily: fontFamilies.extrabold,
                  lineHeight: 23,
                }}
              >
                {name}
              </UiText>
              {/* The warning sits in a fixed column at the right of the text,
                  not against the end of the words: a long address is cut
                  with an ellipsis before it, a short one leaves a gap. */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <UiText
                  token="caption"
                  color={email ? INK_TEXT : WARN}
                  numberOfLines={1}
                  style={{ flexShrink: 1, fontSize: 12, lineHeight: 17 }}
                >
                  {email || "Tambahkan email"}
                </UiText>
                <View style={{ flex: 1, minWidth: 8 }} />
                {!email ? (
                  <Glyph name="alertCircle" size={12.5} color={WARN} />
                ) : null}
              </View>
              <UiText
                token="caption"
                color="#4C4C4C"
                style={{ fontSize: 12, lineHeight: 17, marginTop: -0.5 }}
              >
                {intlPhone(phone)}
              </UiText>
            </View>
            <PressableScale
              onPress={() => router.push("/edit-profile")}
              rippleBorderless
              hitSlop={14}
              style={{
                marginLeft: 18.5,
                width: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Glyph name="pencil" size={16} color={iconGrey} />
            </PressableScale>
          </PressableScale>

          {/* Referral strip: flat gold for its first half, then fading to
              near-white at the right edge — sampled straight off the
              reference. The whole strip leads to the referral page, which
              has the copy and share actions. */}
          <PressableScale
            onPress={() => router.push("/referral")}
            scaleTo={1}
            style={{
              marginTop: -CARD_R,
              borderRadius: CARD_R,
              ...(shadow.xs as object),
            }}
          >
            <LinearGradient
              colors={["#FFDD00", "#FFDD00", "#FFFDEF"]}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                height: STRIP_H + CARD_R,
                paddingTop: CARD_R,
                paddingLeft: 15.5,
                paddingRight: 15,
                borderRadius: CARD_R,
                overflow: "hidden",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Glyph name="star" size={17} color={STRIP_INK} />
              <UiText
                token="label"
                color={STRIP_INK}
                style={{
                  marginLeft: 10,
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: fontFamilies.bold,
                  letterSpacing: 0,
                }}
              >
                Kode Referal
              </UiText>
              <View style={{ flex: 1 }} />
              <UiText
                token="captionMedium"
                color={STRIP_INK}
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                {referralCode}
              </UiText>
              <View
                style={{
                  marginLeft: 9.5,
                  width: 17.5,
                  height: 17.5,
                  borderRadius: 8.75,
                  backgroundColor: STRIP_INK,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Glyph name="arrowRight" size={11} color="#FFF9D5" />
              </View>
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
            <Glyph name="gift" size={40} color={gold[500]} />
          </View>

          <AccountSection title="Aktivitas kamu" />
          <AccountMenu
            items={[
              {
                icon: <Glyph name="receipt" size={21} color={iconGrey} />,
                label: "Riwayat Pemesanan",
                badge: String(orders.length),
                onPress: () => router.push("/order-history"),
              },
              {
                icon: <Glyph name="coins" size={21} color={iconGrey} />,
                label: "Histori Poin",
                onPress: () => router.push("/points-history"),
              },
              {
                icon: <Glyph name="tag" size={21} color={iconGrey} />,
                label: "Kupon Saya",
                badge: String(coupons.length),
                onPress: () => router.push("/coupons"),
              },
              {
                icon: <Glyph name="ticket" size={21} color={iconGrey} />,
                label: "Voucher Saya",
                onPress: () => router.push("/vouchers"),
              },
              {
                icon: <Glyph name="ticketPercent" size={21} color={iconGrey} />,
                label: "Riwayat Pembelian Kupon",
                onPress: () => router.push("/coupon-purchases"),
              },
            ]}
          />

          <AccountSection title="Preferensi" />
          <AccountMenu
            items={[
              {
                icon: <Glyph name="settings" size={21} color={iconGrey} />,
                label: "Pengaturan",
                onPress: () => router.push("/settings"),
              },
              {
                icon: <Glyph name="grid" size={21} color={iconGrey} />,
                label: "Atur Menu Pintas",
                onPress: () => router.push("/shortcuts"),
              },
              {
                icon: <Glyph name="userOff" size={21} color={iconGrey} />,
                label: "Daftar Blokir Pengguna",
                onPress: () => router.push("/blocked"),
              },
            ]}
          />

          <AccountSection title="Bantuan & ketentuan" />
          <AccountMenu
            items={[
              {
                icon: <Glyph name="help" size={21} color={iconGrey} />,
                label: "FAQ",
                onPress: () => router.push("/faq"),
              },
              {
                icon: <Glyph name="doc" size={21} color={iconGrey} />,
                label: "Syarat & Ketentuan",
                onPress: () => router.push("/terms"),
              },
              {
                icon: <Glyph name="shield" size={21} color={iconGrey} />,
                label: "Kebijakan Privasi",
                onPress: () => router.push("/privacy"),
              },
              {
                icon: <Glyph name="whatsapp" size={21} color="#25D366" />,
                label: CONTACT.phoneLabel,
                onPress: () => openWhatsApp(),
              },
              {
                icon: <Glyph name="mail" size={21} color={iconGrey} />,
                label: CONTACT.emailLabel,
                onPress: () => openEmail("Bantuan Good Will Grow"),
              },
            ]}
          />

          <View style={{ marginTop: space.xxl }}>
            <AccountMenu
              items={[
                {
                  icon: <LogoutSolid color={danger[500]} />,
                  label: "Keluar",
                  tone: danger[500],
                  plain: true,
                  onPress: () => setConfirmLogout(true),
                },
              ]}
            />
          </View>

          <UiText
            token="caption"
            color={ink[400]}
            center
            style={{ marginTop: space.lg }}
          >
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
