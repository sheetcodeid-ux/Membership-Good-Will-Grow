import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../components/ui/Text";
import { Glyph } from "../components/icons/Glyph";
import { AccountSection } from "../components/AccountMenu";
import { AccountBottomBar } from "../components/AccountBottomBar";
import { LegalBullets } from "../components/LegalDoc";
import { AppHeader } from "../components/ui/AppHeader";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { brand, ink, success, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { useAuthStore } from "../store/authStore";

const consequences = [
  "Akunmu tidak bisa dicari oleh member lain.",
  "Komentar kamu sebelumnya tidak akan muncul di feed.",
  "Postingan akan disembunyikan dari timeline feed.",
  "Tidak bisa di-mention oleh member lain.",
];

export default function DeactivateAccountScreen() {
  const logout = useAuthStore((s) => s.logout);
  const [confirm, setConfirm] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader tone="account" title="Nonaktifkan Akun" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 13.5, paddingBottom: 24 }}
      >
        <AccountSection title="Yang terjadi jika akun dinonaktifkan" />
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#E6E6E6",
            padding: 16,
          }}
        >
          <LegalBullets items={consequences} />
        </View>

        <View
          style={{
            marginTop: 14,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#CDEBD7",
            backgroundColor: success[50],
            padding: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Glyph name="checkCircle" size={18} color={success[600]} />
            <UiText
              color={success[600]}
              style={{
                fontSize: 15,
                lineHeight: 19,
                fontFamily: fontFamilies.bold,
              }}
            >
              Cara mengaktifkan kembali
            </UiText>
          </View>
          <UiText
            color="#1F5F37"
            style={{
              marginTop: 8,
              fontSize: 14,
              lineHeight: 21,
              fontFamily: fontFamilies.regular,
            }}
          >
            Cukup masuk lagi dengan nomor HP dan PIN Good Will Grow kamu. Kami
            kirimkan kode OTP untuk verifikasi, lalu semua data dan postinganmu
            kembali seperti semula.
          </UiText>
        </View>
      </ScrollView>

      <AccountBottomBar
        label="Nonaktifkan akun"
        onPress={() => setConfirm(true)}
      />

      {confirm ? (
        <ConfirmDialog
          title="Nonaktifkan akun sekarang?"
          message="Akun kamu akan disembunyikan dari member lain. Login ulang kapan saja untuk mengaktifkannya kembali."
          variant="buttons"
          cancelLabel="Batal"
          confirmLabel="Ya, Nonaktifkan"
          cancelColor={ink[400]}
          confirmColor={brand[600]}
          onCancel={() => setConfirm(false)}
          onConfirm={() => {
            setConfirm(false);
            logout();
            router.replace("/");
          }}
        />
      ) : null}
    </View>
  );
}
