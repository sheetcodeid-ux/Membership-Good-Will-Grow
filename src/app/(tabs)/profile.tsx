import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UiText } from "../../components/ui/Text";
import { ACCOUNT_BAR } from "../../components/ui/AppHeader";
import { Avatar } from "../../components/ui/Avatar";
import { PressableScale } from "../../components/ui/PressableScale";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import {
  AccountHeroArt,
  HERO_ART_OVERHANG,
} from "../../components/AccountHeroArt";
import { AccountMenu, AccountSection } from "../../components/AccountMenu";
import { Glyph } from "../../components/icons/Glyph";
import {
  REWARD_ART_H,
  REWARD_ART_W,
  RewardArt,
} from "../../components/RewardArt";
// Sign-out keeps its previous mark on purpose.
import { LogoutSolid } from "../../components/AccountSolidIcons";
import { danger, iconGrey, ink, surface } from "../../theme/colors";
import { shadow } from "../../theme/shadows";
import { fontFamilies } from "../../theme/typography";
import { space } from "../../theme/scale";
import { useResponsive } from "../../theme/responsive";
import { CONTACT, openEmail, openWhatsApp } from "../../data/contact";
import { intlPhone, useAuthStore } from "../../store/authStore";
import { orders } from "../../data/mock";
import { useCouponStore } from "../../store/couponStore";

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
// Measured on the reference: the card's corners are tighter than the
// strip's, and the strip reaches up behind the card to where the card's
// bottom corners begin to curve, so no page shows beside them.
const CARD_R = 12;
const STRIP_R = 15;
const STRIP_TUCK = CARD_R;
const INK_TEXT = "#202020";
// Top bar that fades in on scroll (measured on the reference): pale yellow,
// ending 24.5dp below the title's centre. The fade is spread over 44dp of
// scrolling — a gentle dissolve, yet complete by the time the card slides
// under the title.
const BAR_BG = ACCOUNT_BAR;
const BAR_H = HEADER_H / 2 + 24.5;
const BAR_FADE_FROM = 8;
const BAR_FADE_TO = 52;
// Space between the referral strip and the reward card.
const REWARD_GAP = 14;
const WARN = "#A34500";
const STRIP_INK = "#702B00";

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  // The scene is drawn from the very top of the screen, status bar
  // included; without one (web) it would lose its top 24dp.
  const top = Math.max(insets.top, 24);
  const r = useResponsive();
  const name = useAuthStore((s) => s.name);
  const phone = useAuthStore((s) => s.phone);
  const email = useAuthStore((s) => s.email);
  const referralCode = useAuthStore((s) => s.referralCode);
  const logout = useAuthStore((s) => s.logout);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const couponCount = useCouponStore(
    (s) => s.mine.filter((c) => !c.used).length,
  );

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const barStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [BAR_FADE_FROM, BAR_FADE_TO],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
      >
        {/* Inside the list, not pinned over it: the scene belongs to the top
            of the page and should leave with it. Its lower edge arcs down
            behind the card, so the art overhangs this block; the card,
            later in the tree, covers it. */}
        <View style={{ height: HERO_H + top }}>
          <AccountHeroArt
            width={r.width}
            height={HERO_H + top + HERO_ART_OVERHANG}
          />
        </View>

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
            // The strip runs up behind the card with square top corners, so
            // the gold fills the space outside the card's rounded bottom
            // corners — in the reference the card's corners sit on gold, not
            // on the page.
            style={{
              marginTop: -STRIP_TUCK,
              borderBottomLeftRadius: STRIP_R,
              borderBottomRightRadius: STRIP_R,
              ...(shadow.xs as object),
            }}
          >
            <LinearGradient
              colors={["#FFDD00", "#FFDD00", "#FFFDEF"]}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                height: STRIP_H + STRIP_TUCK,
                paddingTop: STRIP_TUCK,
                paddingLeft: 15.5,
                paddingRight: 15,
                borderBottomLeftRadius: STRIP_R,
                borderBottomRightRadius: STRIP_R,
                overflow: "hidden",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Glyph name="qr" size={17} color={STRIP_INK} />
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
              with a button rather than being buried in a list. Measured on
              the reference: 98dp tall with a hairline border and the
              identity card's corners, a two-line bold title in the warning
              ink, a bordered white pill, and the art filling the
              bottom-right corner, clipped by the card. */}
          <View
            style={{
              marginTop: REWARD_GAP,
              minHeight: REWARD_ART_H,
              backgroundColor: "#FFF8E8",
              borderRadius: CARD_R,
              borderWidth: 1,
              borderColor: "#E7E7E7",
              overflow: "hidden",
              paddingLeft: 12,
              paddingTop: 15,
              paddingBottom: 13,
              paddingRight: REWARD_ART_W - 8,
            }}
          >
            <View
              style={{
                position: "absolute",
                right: -1,
                bottom: -1,
              }}
            >
              <RewardArt />
            </View>
            <UiText
              color={WARN}
              style={{
                fontSize: 14,
                lineHeight: 17,
                fontFamily: fontFamilies.bold,
              }}
            >
              Lengkapi profilmu, dapatkan reward
            </UiText>
            <PressableScale
              onPress={() => router.push("/edit-profile")}
              scaleTo={0.97}
              style={{
                marginTop: 5,
                alignSelf: "flex-start",
                height: 29,
                justifyContent: "center",
                backgroundColor: "#FFFFFF",
                borderRadius: 14.5,
                borderWidth: 1,
                borderColor: "#EEEEEE",
                paddingHorizontal: 10,
              }}
            >
              <UiText
                color={INK_TEXT}
                style={{
                  fontSize: 14,
                  lineHeight: 17,
                  fontFamily: fontFamilies.bold,
                }}
              >
                Lengkapi sekarang
              </UiText>
            </PressableScale>
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
                badge: String(couponCount),
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
      </Animated.ScrollView>

      {/* The title stays put; as the page scrolls, a bar fades in behind
          it — as in the reference, where the title sits in the same place
          over the scene and over the bar, so only the background changes. */}
      <View
        pointerEvents="none"
        style={{ position: "absolute", left: 0, right: 0, top: 0 }}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { height: top + BAR_H, backgroundColor: BAR_BG },
            barStyle,
          ]}
        />
        <View
          style={{
            marginTop: top,
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
      </View>

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
