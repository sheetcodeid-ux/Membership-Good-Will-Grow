import React, { useState } from "react";
import { Platform, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { Glyph } from "../components/icons/Glyph";
import { AccountEmpty } from "../components/EmptyArt";
import {
  AccountCard,
  LABEL_INK,
  QUIET_INK,
  RULE,
} from "../components/AccountMenu";
import { brand, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { router } from "expo-router";
import { showToast } from "../store/toastStore";
import { tapError } from "../utils/haptics";

const EDGE = 13.5;
const FIELD_H = 46;

export default function VouchersScreen() {
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(false);
  const ready = code.trim().length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader tone="account" title="Voucher Saya" />

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
              onChangeText={setCode}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autoCapitalize="characters"
              placeholder="Contoh: GWG2026"
              placeholderTextColor="#A0A4AE"
              style={{
                flex: 1,
                height: FIELD_H,
                borderRadius: 12,
                borderWidth: focused ? 1.5 : 1,
                borderColor: focused ? brand[600] : RULE,
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
              onPress={() => {
                // No voucher codes exist yet, so every code is unknown.
                tapError();
                showToast(`Kode "${code.trim()}" tidak ditemukan`, "error");
              }}
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
        </AccountCard>
      </View>

      <AccountEmpty
        glyph="gift"
        title="Belum ada voucher"
        subtitle="Voucher yang berhasil kamu klaim akan tersimpan di sini."
        action={{ label: "Lihat promo", onPress: () => router.push("/promo") }}
      />
    </View>
  );
}
