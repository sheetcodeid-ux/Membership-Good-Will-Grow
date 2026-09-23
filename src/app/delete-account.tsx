import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Info } from "lucide-react-native";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { brand, danger, ink, surface, warning } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { useAuthStore } from "../store/authStore";

const reasons = ["Sudah tidak tertarik lagi", "Mulai akun dari awal", "Lainnya"];

const consequences = [
  "Akun kamu akan dihapus secara permanen dari sistem kami dan tidak bisa dipulihkan lagi.",
  "Seluruh postingan, komentar, dan interaksi kamu di Good Will Grow akan dihapus.",
  "Seluruh transaksi dan data terkait akun, tidak dapat diakses lagi.",
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

export default function DeleteAccountScreen() {
  const insets = useSafeAreaInsets();
  const logout = useAuthStore((s) => s.logout);
  const [reason, setReason] = useState(reasons[0]);
  const [confirm, setConfirm] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Hapus Akun" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 11,
            borderRadius: 12,
            backgroundColor: "#FDF3CF",
            paddingHorizontal: 14,
            paddingVertical: 13,
          }}
        >
          <Info size={19} color={warning[500]} strokeWidth={2} />
          <AppText color={ink[700]} style={{ flex: 1, fontSize: 13, lineHeight: 18 }}>
            Akun tidak dapat dipulihkan setelah dihapus
          </AppText>
        </View>

        <AppText
          color={ink[900]}
          style={{
            marginTop: 22,
            fontSize: 17,
            lineHeight: 24,
            fontFamily: "Urbanist_700Bold",
          }}
        >
          Kenapa kamu ingin menghapus akun?
        </AppText>

        <View
          style={{
            marginTop: 14,
            borderRadius: 14,
            backgroundColor: "#FFFFFF",
            overflow: "hidden",
            ...(shadow.xs as object),
          }}
        >
          {reasons.map((item, i) => {
            const selected = reason === item;
            return (
              <View key={item}>
                {i > 0 ? <View style={{ height: 1, backgroundColor: ink[100] }} /> : null}
                <PressableScale
                  scaleTo={0.995}
                  onPress={() => setReason(item)}
                  style={{
                    height: 60,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                    paddingHorizontal: 18,
                    backgroundColor: selected ? brand[50] : "#FFFFFF",
                  }}
                >
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      borderWidth: 2,
                      borderColor: selected ? brand[950] : ink[300],
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selected ? (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: brand[950],
                        }}
                      />
                    ) : null}
                  </View>
                  <AppText
                    color={selected ? brand[900] : ink[600]}
                    style={{
                      fontSize: 15,
                      lineHeight: 20,
                      fontFamily: selected ? "Urbanist_600SemiBold" : "Urbanist_400Regular",
                    }}
                  >
                    {item}
                  </AppText>
                </PressableScale>
              </View>
            );
          })}
        </View>

        <AppText
          color={ink[900]}
          style={{
            marginTop: 26,
            fontSize: 17,
            lineHeight: 24,
            fontFamily: "Urbanist_700Bold",
          }}
        >
          Hal yang terjadi setelah hapus akun :
        </AppText>

        <View style={{ marginTop: 16, gap: 16 }}>
          {consequences.map((text) => (
            <Bullet key={text} text={text} />
          ))}
        </View>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 16,
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
            backgroundColor: ink[100],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppText
            color={danger[500]}
            style={{ fontSize: 16.5, lineHeight: 22, fontFamily: "Urbanist_600SemiBold" }}
          >
            Hapus
          </AppText>
        </PressableScale>
      </View>

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
            router.replace("/");
          }}
        />
      ) : null}
    </View>
  );
}
