import React from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { Avatar } from "../components/ui/Avatar";
import { PressableScale } from "../components/ui/PressableScale";
import { Glyph } from "../components/icons/Glyph";
import {
  AccountSection,
  InfoRows,
  LABEL_INK,
  QUIET_INK,
  WARN_INK,
} from "../components/AccountMenu";
import { iconGrey, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { localPhone, useAuthStore } from "../store/authStore";

const EDGE = 13.5;

/** The same prompt the profile card shows for a missing email. */
function AddEmail({ onPress }: { onPress: () => void }) {
  return (
    <PressableScale
      onPress={onPress}
      hitSlop={10}
      style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
    >
      <UiText
        color={WARN_INK}
        style={{
          fontSize: 14,
          lineHeight: 18,
          fontFamily: fontFamilies.semibold,
        }}
      >
        Tambahkan email
      </UiText>
      <Glyph name="alertCircle" size={14} color={WARN_INK} />
    </PressableScale>
  );
}

export default function ProfileDetailScreen() {
  const profile = useAuthStore();
  const toEdit = () => router.push("/edit-profile");
  const gender =
    profile.gender === "male"
      ? "Laki-laki"
      : profile.gender === "female"
        ? "Perempuan"
        : undefined;

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader
        tone="account"
        title="Detail Profil"
        right={
          <PressableScale
            onPress={toEdit}
            hitSlop={12}
            style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
          >
            <Glyph name="pencil" size={16} color={iconGrey} />
            <UiText
              color={LABEL_INK}
              style={{
                fontSize: 14,
                lineHeight: 18,
                fontFamily: fontFamilies.bold,
              }}
            >
              Ubah
            </UiText>
          </PressableScale>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: EDGE, paddingBottom: 40 }}
      >
        <View
          style={{ alignItems: "center", paddingTop: 24, paddingBottom: 4 }}
        >
          <Avatar name={profile.name} size={76} initialsSize={22} />
          <UiText
            color={LABEL_INK}
            style={{
              marginTop: 12,
              fontSize: 18,
              lineHeight: 23,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            {profile.name}
          </UiText>
          <UiText
            color={QUIET_INK}
            style={{
              marginTop: 2,
              fontSize: 13,
              lineHeight: 17,
              fontFamily: fontFamilies.medium,
            }}
          >
            @{profile.username}
          </UiText>
        </View>

        <AccountSection title="Info akun" />
        <InfoRows
          rows={[
            { label: "Nama", value: profile.name },
            { label: "Username", value: profile.username },
            { label: "Nomor HP", value: localPhone(profile.phone) },
            {
              label: "Email",
              value: profile.email,
              placeholder: <AddEmail onPress={toEdit} />,
            },
          ]}
        />

        <AccountSection title="Data diri" />
        <InfoRows
          rows={[
            { label: "Tanggal lahir", value: profile.birthDate },
            { label: "Jenis kelamin", value: gender },
          ]}
        />

        <AccountSection title="Alamat" />
        <InfoRows
          rows={[
            { label: "Provinsi", value: profile.province },
            { label: "Kabupaten/Kota", value: profile.regency },
            { label: "Kecamatan", value: profile.district },
            { label: "Desa/Kelurahan", value: profile.village },
            { label: "Alamat", value: profile.address, multiline: true },
          ]}
        />

        <AccountSection title="Keamanan" />
        <InfoRows
          rows={[
            {
              label: "PIN akses",
              value: "Ubah PIN",
              onPress: () => router.push("/create-pin"),
            },
          ]}
        />
      </ScrollView>
    </View>
  );
}
