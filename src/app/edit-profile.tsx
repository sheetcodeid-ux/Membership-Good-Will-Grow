import React, { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { User, Phone, Mail } from "lucide-react-native";
import { Screen, ScreenHeader, Input, Button, AppText } from "../components/ui";
import { Avatar } from "../components/ui/Avatar";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, ink } from "../theme/colors";
import { useAuthStore } from "../store/authStore";

export default function EditProfileScreen() {
  const name = useAuthStore((s) => s.name);
  const phone = useAuthStore((s) => s.phone);
  const updateName = useAuthStore((s) => s.updateName);
  const [localName, setLocalName] = useState(name);
  const [email, setEmail] = useState("");

  return (
    <Screen scroll>
      <ScreenHeader title="Edit Profil" />
      <View style={{ paddingHorizontal: 20, gap: 24 }}>
        <View style={{ alignItems: "center", gap: 10 }}>
          <Avatar name={localName} size={84} />
          <PressableScale>
            <AppText variant="captionMedium" color={brand[600]}>Ganti Foto Profil</AppText>
          </PressableScale>
        </View>

        <View style={{ gap: 16 }}>
          <Input label="Nama Lengkap" value={localName} onChangeText={setLocalName} left={<User size={18} color={ink[400]} />} />
          <Input label="Nomor WhatsApp" value={`+62${phone || "812xxxxxxxx"}`} editable={false} left={<Phone size={18} color={ink[400]} />} />
          <Input
            label="Email (opsional)"
            placeholder="nama@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            left={<Mail size={18} color={ink[400]} />}
          />
        </View>

        <Button
          label="Simpan Perubahan"
          size="lg"
          fullWidth
          onPress={() => {
            updateName(localName);
            router.back();
          }}
        />
      </View>
    </Screen>
  );
}
