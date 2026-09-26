import React, { useState } from "react";
import { Platform, ScrollView, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { Glyph } from "../components/icons/Glyph";
import { AccountEmpty } from "../components/EmptyArt";
import {
  AccountCard,
  AccountSection,
  LABEL_INK,
  QUIET_INK,
  RULE,
} from "../components/AccountMenu";
import { brand, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { router } from "expo-router";
import { showToast } from "../store/toastStore";
import { tapError, tapPress, tapSuccess } from "../utils/haptics";
import { useVoucherStore } from "../store/voucherStore";
import { CouponTicket } from "../components/CouponTicket";
import { CouponSheet } from "../components/CouponSheet";
import { useScrolled } from "../hooks/useScrolled";
import type { Coupon } from "../data/types";

const EDGE = 13.5;
const FIELD_H = 46;

export default function VouchersScreen() {
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(false);
  const ready = code.trim().length > 0;
  const vouchers = useVoucherStore((st) => st.vouchers);
  const claim = useVoucherStore((st) => st.claim);
  const [open, setOpen] = useState<Coupon | null>(null);
  const [error, setError] = useState<string | undefined>();
  // The voucher claimed on this visit, marked "Baru" in the list.
  const [latest, setLatest] = useState<string | undefined>();
  const scroll = useScrolled();
  const active = vouchers.filter((v) => !v.used).length;

  const submit = () => {
    const result = claim(code);
    if (result.ok) {
      tapSuccess();
      setCode("");
      setError(undefined);
      setLatest(result.voucher.id);
      showToast(`${result.voucher.title} berhasil diklaim`);
      return;
    }
    tapError();
    const msg =
      result.reason === "claimed"
        ? "Kode ini sudah pernah kamu klaim."
        : `Kode "${code.trim().toUpperCase()}" tidak ditemukan. Periksa lagi hurufnya.`;
    setError(msg);
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader
        tone="account"
        title="Voucher Saya"
        divider={scroll.scrolled}
      />

      <View style={{ paddingHorizontal: EDGE, paddingTop: 16 }}>
        <AccountCard style={{ padding: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: "#FFF3C4",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Glyph name="gift" size={18} color="#702B00" />
            </View>
            <View style={{ flex: 1 }}>
              <UiText
                color={LABEL_INK}
                style={{
                  fontSize: 15,
                  lineHeight: 19,
                  fontFamily: fontFamilies.bold,
                }}
              >
                Punya kode voucher?
              </UiText>
              <UiText
                color={QUIET_INK}
                style={{
                  marginTop: 1,
                  fontSize: 12.5,
                  lineHeight: 16,
                  fontFamily: fontFamilies.medium,
                }}
              >
                Masukkan kodenya untuk menukar voucher.
              </UiText>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
            <TextInput
              value={code}
              onChangeText={(t) => {
                setCode(t);
                setError(undefined);
              }}
              onSubmitEditing={ready ? submit : undefined}
              returnKeyType="done"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autoCapitalize="characters"
              placeholder="Contoh: GWG2026"
              placeholderTextColor="#A0A4AE"
              style={{
                flex: 1,
                height: FIELD_H,
                borderRadius: 12,
                borderWidth: error || focused ? 1.5 : 1,
                borderColor: error ? "#E11D48" : focused ? brand[600] : RULE,
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 13,
                fontFamily: fontFamilies.semibold,
                fontSize: 15,
                letterSpacing: code ? 1 : 0,
                color: LABEL_INK,
                ...(Platform.OS === "web"
                  ? ({ outlineStyle: "none" } as object)
                  : null),
              }}
            />
            <PressableScale
              scaleTo={0.97}
              disabled={!ready}
              onPress={submit}
              style={{
                height: FIELD_H,
                paddingHorizontal: 22,
                borderRadius: FIELD_H / 2,
                backgroundColor: brand[600],
                opacity: ready ? 1 : 0.4,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UiText
                color="#FFFFFF"
                style={{
                  fontSize: 15,
                  lineHeight: 19,
                  fontFamily: fontFamilies.bold,
                }}
              >
                Klaim
              </UiText>
            </PressableScale>
          </View>
          {error ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginTop: 8,
              }}
            >
              <Glyph name="alertCircle" size={13} color="#E11D48" />
              <UiText
                color="#E11D48"
                style={{
                  flex: 1,
                  fontSize: 12.5,
                  lineHeight: 16,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                {error}
              </UiText>
            </View>
          ) : null}
        </AccountCard>
      </View>

      {vouchers.length === 0 ? (
        <AccountEmpty
          glyph="gift"
          title="Belum ada voucher"
          subtitle="Voucher yang berhasil kamu klaim akan tersimpan di sini."
          action={{
            label: "Lihat promo",
            onPress: () => router.push("/promo"),
          }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={scroll.onScroll}
          scrollEventThrottle={scroll.scrollEventThrottle}
          contentContainerStyle={{ paddingHorizontal: EDGE, paddingBottom: 40 }}
        >
          <AccountSection
            title={
              active === vouchers.length
                ? `${active} voucher aktif`
                : `${active} aktif · ${vouchers.length - active} sudah dipakai`
            }
          />
          <View style={{ gap: 10 }}>
            {[...vouchers]
              .sort((a, b) => Number(a.used) - Number(b.used))
              .map((v) => (
                <CouponTicket
                  key={v.id}
                  coupon={v}
                  fresh={v.id === latest}
                  onPress={() => {
                    tapPress();
                    setOpen(v);
                  }}
                />
              ))}
          </View>
        </ScrollView>
      )}

      {open ? (
        <CouponSheet
          coupon={open}
          noun="voucher"
          onClose={() => setOpen(null)}
        />
      ) : null}
    </View>
  );
}
