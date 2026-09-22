import React, { useState } from "react";
import { View } from "react-native";
import { Bell, Fingerprint, Moon, Globe, ChevronRight } from "lucide-react-native";
import { Screen, ScreenHeader, AppText, Card, Divider } from "../components/ui";
import { PressableScale } from "../components/ui/PressableScale";
import { MenuRow } from "../components/MenuRow";
import { brand, ink } from "../theme/colors";

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <PressableScale
      onPress={onChange}
      style={{
        width: 44,
        height: 26,
        borderRadius: 13,
        backgroundColor: value ? brand[600] : ink[200],
        padding: 3,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: "#FFFFFF",
          alignSelf: value ? "flex-end" : "flex-start",
        }}
      />
    </PressableScale>
  );
}

export default function SettingsScreen() {
  const [pushNotif, setPushNotif] = useState(true);
  const [promoNotif, setPromoNotif] = useState(true);
  const [biometric, setBiometric] = useState(false);

  return (
    <Screen scroll>
      <ScreenHeader title="Pengaturan" />
      <View style={{ paddingHorizontal: 20, gap: 20 }}>
        <View style={{ gap: 8 }}>
          <AppText variant="titleLg" color={ink[500]}>Notifikasi</AppText>
          <Card style={{ paddingVertical: 4 }}>
            <MenuRow
              icon={<Bell size={18} color={brand[600]} />}
              label="Notifikasi Push"
              subtitle="Update pesanan & poin"
              right={<Toggle value={pushNotif} onChange={() => setPushNotif((v) => !v)} />}
            />
            <Divider inset={54} />
            <MenuRow
              icon={<Bell size={18} color={brand[600]} />}
              label="Notifikasi Promo"
              subtitle="Info promo & giveaway"
              right={<Toggle value={promoNotif} onChange={() => setPromoNotif((v) => !v)} />}
            />
          </Card>
        </View>

        <View style={{ gap: 8 }}>
          <AppText variant="titleLg" color={ink[500]}>Keamanan</AppText>
          <Card style={{ paddingVertical: 4 }}>
            <MenuRow
              icon={<Fingerprint size={18} color={brand[600]} />}
              label="Masuk dengan Biometrik"
              subtitle="Face ID / Sidik jari"
              right={<Toggle value={biometric} onChange={() => setBiometric((v) => !v)} />}
            />
          </Card>
        </View>

        <View style={{ gap: 8 }}>
          <AppText variant="titleLg" color={ink[500]}>Preferensi</AppText>
          <Card style={{ paddingVertical: 4 }}>
            <MenuRow icon={<Moon size={18} color={brand[600]} />} label="Tampilan" subtitle="Terang" right={<ChevronRight size={18} color={ink[300]} />} />
            <Divider inset={54} />
            <MenuRow icon={<Globe size={18} color={brand[600]} />} label="Bahasa" subtitle="Indonesia" right={<ChevronRight size={18} color={ink[300]} />} />
          </Card>
        </View>
      </View>
    </Screen>
  );
}
