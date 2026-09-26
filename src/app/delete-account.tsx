import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../components/ui/Text";
import { Glyph } from "../components/icons/Glyph";
import {
  AccountCard,
  AccountSection,
  LABEL_INK,
  RULE,
  WARN_INK,
} from "../components/AccountMenu";
import { AccountBottomBar } from "../components/AccountBottomBar";
import { LegalBullets } from "../components/LegalDoc";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { brand, danger, ink, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { useAuthStore } from "../store/authStore";
import { useScrolled } from "../hooks/useScrolled";
import { showToast } from "../store/toastStore";
import { tapSelect } from "../utils/haptics";

const reasons = [
  "Sudah tidak tertarik lagi",
  "Mulai akun dari awal",
  "Lainnya",
];

const consequences = [
  "Akun kamu akan dihapus secara permanen dari sistem kami dan tidak bisa dipulihkan lagi.",
  "Seluruh postingan, komentar, dan interaksi kamu di Good Will Grow akan dihapus.",
  "Seluruh transaksi dan data terkait akun tidak dapat diakses lagi.",
];

export default function DeleteAccountScreen() {
  const scroll = useScrolled();
  const logout = useAuthStore((s) => s.logout);
  const [reason, setReason] = useState(reasons[0]);
  const [confirm, setConfirm] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader tone="account" title="Hapus Akun" divider={scroll.scrolled} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scroll.onScroll}
        scrollEventThrottle={scroll.scrollEventThrottle}
        contentContainerStyle={{
          paddingHorizontal: 13.5,
          paddingTop: 16,
          paddingBottom: 24,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#F3DFA2",
            backgroundColor: "#FFF8E1",
            paddingHorizontal: 13,
            paddingVertical: 12,
          }}
        >
          <Glyph name="alertCircle" size={18} color={WARN_INK} />
          <UiText
            color={WARN_INK}
            style={{
              flex: 1,
              fontSize: 13.5,
              lineHeight: 18,
              fontFamily: fontFamilies.semibold,
            }}
          >
            Akun yang sudah dihapus tidak bisa dipulihkan.
          </UiText>
        </View>

        <AccountSection title="Kenapa kamu ingin menghapus akun?" />
        <AccountCard>
          {reasons.map((item, i) => {
            const selected = reason === item;
            return (
              <View key={item}>
                {i > 0 ? (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: RULE,
                      marginLeft: 48,
                      marginRight: 9.5,
                    }}
                  />
                ) : null}
                <PressableScale
                  scaleTo={0.995}
                  onPress={() => {
                    tapSelect();
                    setReason(item);
                  }}
                  style={{
                    height: 52,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    paddingHorizontal: 14.5,
                  }}
                >
                  <View
                    style={{
                      width: 21,
                      height: 21,
                      borderRadius: 10.5,
                      borderWidth: selected ? 6 : 1.5,
                      borderColor: selected ? brand[600] : "#B8BCC6",
                      backgroundColor: "#FFFFFF",
                    }}
                  />
                  <UiText
                    color={LABEL_INK}
                    style={{
                      fontSize: 15,
                      lineHeight: 19,
                      fontFamily: selected
                        ? fontFamilies.bold
                        : fontFamilies.semibold,
                    }}
                  >
                    {item}
                  </UiText>
                </PressableScale>
              </View>
            );
          })}
        </AccountCard>

        <AccountSection title="Yang terjadi setelah akun dihapus" />
        <AccountCard style={{ padding: 16 }}>
          <LegalBullets items={consequences} />
        </AccountCard>
      </ScrollView>

      <AccountBottomBar
        label="Hapus akun"
        tone="danger"
        onPress={() => setConfirm(true)}
      />

      {confirm ? (
        <ConfirmDialog
          title="Hapus akun permanen?"
          message="Seluruh data, poin, dan kupon kamu akan hilang dan tidak bisa dipulihkan."
          variant="buttons"
          cancelLabel="Batal"
          confirmLabel="Ya, Hapus"
          cancelColor={ink[400]}
          confirmColor={danger[500]}
          onCancel={() => setConfirm(false)}
          onConfirm={() => {
            setConfirm(false);
            logout();
            showToast("Akun kamu sudah dihapus", "info");
            router.replace("/");
          }}
        />
      ) : null}
    </View>
  );
}
