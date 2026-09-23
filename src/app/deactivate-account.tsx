import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CircleCheck } from "lucide-react-native";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { brand, ink, success, surface } from "../theme/colors";
import { useAuthStore } from "../store/authStore";

const consequences = [
  "Akun mu tidak bisa dicari oleh member lain.",
  "Komentar kamu sebelumnya tidak akan muncul di feed.",
  "Postingan akan disembunyikan dari timeline feed.",
  "Tidak bisa di-mention oleh member lain.",
];

function Bullet({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <View
        style={{
          width: 7,
          height: 7,
          borderRadius: 3.5,
          backgroundColor: ink[300],
          marginTop: 7,
        }}
      />
      <AppText color={ink[400]} style={{ flex: 1, fontSize: 14, lineHeight: 21 }}>
        {text}
      </AppText>
    </View>
  );
}

export default function DeactivateAccountScreen() {
  const insets = useSafeAreaInsets();
  const logout = useAuthStore((s) => s.logout);
  const [confirm, setConfirm] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Nonaktifkan Akun Sementara" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24 }}
      >
        <AppText
          color={ink[900]}
          style={{ fontSize: 17, lineHeight: 24, fontFamily: "Urbanist_700Bold" }}
        >
          Hal yang terjadi jika akun dinonaktifkan :
        </AppText>

        <View style={{ marginTop: 18, gap: 16 }}>
          {consequences.map((text) => (
            <Bullet key={text} text={text} />
          ))}
        </View>

        <View
          style={{
            marginTop: 26,
            borderRadius: 14,
            borderWidth: 1.3,
            borderColor: "#B7E4C2",
            backgroundColor: success[50],
            padding: 16,
            gap: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <CircleCheck size={21} color={success[600]} strokeWidth={2} />
            <AppText
              color={success[600]}
              style={{ fontSize: 16, lineHeight: 22, fontFamily: "Urbanist_700Bold" }}
            >
              Cara Mengaktifkan Kembali
            </AppText>
          </View>
          <AppText color={success[600]} style={{ fontSize: 14, lineHeight: 21 }}>
            Cukup login ulang menggunakan nomor HP dan pin Good Will Grow kamu. Selanjutnya kamu
            akan dikirimkan OTP untuk verifikasi. Jika berhasil, kamu akan mendapatkan akses
            kembali ke semua data dan postingan.
          </AppText>
        </View>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: insets.bottom + 14,
          backgroundColor: surface,
        }}
      >
        <PressableScale
          onPress={() => setConfirm(true)}
          scaleTo={0.98}
          style={{
            height: 56,
            borderRadius: 14,
            backgroundColor: brand[950],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppText
            color="#FFFFFF"
            style={{ fontSize: 16.5, lineHeight: 22, fontFamily: "Urbanist_600SemiBold" }}
          >
            Nonaktifkan Akun
          </AppText>
        </PressableScale>
      </View>

      {confirm ? (
        <ConfirmDialog
          title="Nonaktifkan akun sekarang?"
          message="Akun kamu akan disembunyikan dari member lain. Login ulang kapan saja untuk mengaktifkannya kembali."
          variant="buttons"
          cancelLabel="Batal"
          confirmLabel="Ya, Nonaktifkan"
          cancelColor={ink[400]}
          confirmColor={brand[950]}
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
