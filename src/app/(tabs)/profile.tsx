import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { UiText } from "../../components/ui/Text";
import { Avatar } from "../../components/ui/Avatar";
import { PressableScale } from "../../components/ui/PressableScale";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { AccountHeroArt } from "../../components/AccountHeroArt";
import { AccountMenu, AccountSection } from "../../components/AccountMenu";
import { Glyph } from "../../components/icons/Glyph";
// Sign-out keeps its previous mark on purpose.
import { LogoutSolid } from "../../components/AccountSolidIcons";
import { BANNER_RADIUS } from "../../components/PromoCarousel";
import {
  danger,
  gold,
  goldRamp,
  iconGrey,
  ink,
  surface,
  brand,
} from "../../theme/colors";
import { shadow } from "../../theme/shadows";
import { radius, space } from "../../theme/scale";
import { useResponsive } from "../../theme/responsive";
import { CONTACT, openEmail, openWhatsApp } from "../../data/contact";
import { intlPhone, useAuthStore } from "../../store/authStore";
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
  const email = useAuthStore((s) => s.email);
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
        {/* The same bottom corner the promo banner carries on Home. Square
            here, the scene read as a screenshot pasted behind the page. */}
        <View
          style={{
            height: HERO_H + insets.top,
            borderBottomLeftRadius: BANNER_RADIUS,
            borderBottomRightRadius: BANNER_RADIUS,
            overflow: "hidden",
          }}
        >
          <AccountHeroArt width={r.width} height={HERO_H + insets.top} />
        </View>

        <SafeAreaView
          edges={["top"]}
          style={{ position: "absolute", left: 0, right: 0 }}
        >
          <View
            style={{
              height: 48,
              justifyContent: "center",
              paddingHorizontal: r.gutter,
            }}
          >
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
          {/*
            Identity and referral as one block, not two cards.

            They used to be a rounded strip slid under a rounded card, offset
            by a point. Where the two curves crossed the seam showed, and the
            strip read as something laid over the card rather than part of
            it. One clip now gives the pair a single outline: round at the
            four outer corners, straight across the seam. The shadow sits on
            its own parent because a view cannot both cast one and clip.
          */}
          <View
            style={{
              borderRadius: radius.xl,
              zIndex: 2,
              ...(shadow.lg as object),
            }}
          >
            <View
              style={{
                borderRadius: radius.xl,
                overflow: "hidden",
                backgroundColor: "#FFFFFF",
              }}
            >
              <PressableScale
                scaleTo={0.995}
                onPress={() => router.push("/profile-detail")}
                style={{
                  backgroundColor: "#FFFFFF",
                  // 12 round a 52pt avatar: the reference card measures 79pt
                  // tall, and 16 round 58 was making it 93.
                  padding: space.md,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: space.md,
                }}
              >
                <Avatar name={name} size={52} />
                <View style={{ flex: 1, gap: 1 }}>
                  <UiText token="h3" color={brand[900]} numberOfLines={1}>
                    {name}
                  </UiText>
                  {/* An unverified address is the one thing on this card that
                  needs doing, so it carries the warning rather than sitting
                  quietly in grey like the rest. */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: space.xs,
                    }}
                  >
                    <UiText
                      token="caption"
                      color={email ? ink[500] : "#B4550A"}
                      numberOfLines={1}
                      style={{ flexShrink: 1 }}
                    >
                      {email || "Tambahkan email"}
                    </UiText>
                    {!email ? (
                      <View
                        style={{
                          width: 15,
                          height: 15,
                          borderRadius: 8,
                          backgroundColor: "#C2570B",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <UiText
                          token="label"
                          color="#FFFFFF"
                          style={{ fontSize: 10, lineHeight: 13 }}
                        >
                          !
                        </UiText>
                      </View>
                    ) : null}
                  </View>
                  <UiText token="caption" color={ink[600]}>
                    {intlPhone(phone)}
                  </UiText>
                </View>
                <PressableScale
                  onPress={() => router.push("/edit-profile")}
                  rippleBorderless
                  hitSlop={12}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    backgroundColor: "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Glyph name="pencil" size={17} color={iconGrey} />
                </PressableScale>
              </PressableScale>

              {/* Referral rides under the card as one piece with it — the code is
              part of who you are here, not another menu row. */}
              <PressableScale onPress={copyCode} scaleTo={1}>
                <LinearGradient
                  colors={[goldRamp[0], goldRamp[1], goldRamp[2]]}
                  // Top to bottom, and reaching full gold early: sampling the
                  // reference strip gives a near-flat #FFDD00 with a sheen along
                  // its upper edge. Running the ramp across instead washed the
                  // left half out to cream.
                  locations={[0, 0.22, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  // Square: the clip above supplies the block's bottom corners,
                  // and a radius of its own would draw a second curve inside it.
                  style={{
                    paddingHorizontal: space.lg,
                    paddingVertical: space.sm,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: space.sm,
                  }}
                >
                  <Glyph name="qr" size={17} color="#6B2A00" />
                  <UiText token="bodySemibold" color="#702B00">
                    Kode Referal
                  </UiText>
                  <View style={{ flex: 1 }} />
                  <UiText token="bodySemibold" color="#4A1D00">
                    {referralCode}
                  </UiText>
                  {/* The dark disc is what tells you the strip is a control and
                  not a caption printed on the card. */}
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: copied ? "#1F6B45" : "#7A3300",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Glyph
                      name={copied ? "check" : "copy"}
                      size={14}
                      color="#FFFFFF"
                    />
                  </View>
                </LinearGradient>
              </PressableScale>
            </View>
          </View>

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
