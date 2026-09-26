import React from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { Avatar } from "../components/ui/Avatar";
import { PressableScale } from "../components/ui/PressableScale";
import { Glyph } from "../components/icons/Glyph";
import { SkylineBand } from "../components/AccountHeroArt";
import { ProfileCompletion } from "../components/ProfileCompletion";
import {
  AccountSection,
  InfoRows,
  LABEL_INK,
  QUIET_INK,
  WARN_INK,
} from "../components/AccountMenu";
import { brand, iconGrey, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { localPhone, useAuthStore } from "../store/authStore";
import { profileCompleteness } from "../utils/profile";
import { useScrolled } from "../hooks/useScrolled";

const EDGE = 13.5;
const BAND_H = 112;
const AVATAR = 80;

/** Inline call to fill an empty field; the email one keeps the card's warning ink. */
function AddLink({
  label,
  onPress,
  warn,
}: {
  label: string;
  onPress: () => void;
  warn?: boolean;
}) {
  const ink = warn ? WARN_INK : brand[700];
  return (
    <PressableScale
      onPress={onPress}
      hitSlop={10}
      style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
    >
      <UiText
        color={ink}
        style={{ fontSize: 14, lineHeight: 18, fontFamily: fontFamilies.bold }}
      >
        {label}
      </UiText>
      <Glyph
        name={warn ? "alertCircle" : "plus"}
        size={warn ? 14 : 12}
        color={ink}
      />
    </PressableScale>
  );
}

export default function ProfileDetailScreen() {
  const { width } = useWindowDimensions();
  const scroll = useScrolled();
  const profile = useAuthStore();
  const toEdit = () => router.push("/edit-profile");
  const add = <AddLink label="Tambah" onPress={toEdit} />;
  const gender =
    profile.gender === "male"
      ? "Laki-laki"
      : profile.gender === "female"
        ? "Perempuan"
        : undefined;
  const completeness = profileCompleteness(profile);

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader
        tone="account"
        title="Detail Profil"
        divider={scroll.scrolled}
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
        onScroll={scroll.onScroll}
        scrollEventThrottle={scroll.scrollEventThrottle}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <SkylineBand width={width} height={BAND_H} />

        <View style={{ alignItems: "center", marginTop: -AVATAR / 2 - 8 }}>
          <View
            style={{
              borderRadius: AVATAR / 2 + 4,
              borderWidth: 4,
              borderColor: surface,
            }}
          >
            <Avatar name={profile.name} size={AVATAR} initialsSize={24} />
          </View>
          <UiText
            color={LABEL_INK}
            style={{
              marginTop: 8,
              fontSize: 19,
              lineHeight: 24,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            {profile.name}
          </UiText>
          <UiText
            color={QUIET_INK}
            style={{
              marginTop: 1,
              fontSize: 13,
              lineHeight: 17,
              fontFamily: fontFamilies.medium,
            }}
          >
            @{profile.username} · {localPhone(profile.phone)}
          </UiText>
        </View>

        <View style={{ paddingHorizontal: EDGE, marginTop: 16 }}>
          <ProfileCompletion
            percent={completeness.percent}
            missing={completeness.missing}
            onComplete={toEdit}
          />

          <AccountSection title="Info akun" />
          <InfoRows
            rows={[
              { label: "Nama", value: profile.name },
              { label: "Username", value: profile.username },
              { label: "Nomor HP", value: localPhone(profile.phone) },
              {
                label: "Email",
                value: profile.email,
                placeholder: (
                  <AddLink label="Tambahkan email" onPress={toEdit} warn />
                ),
              },
            ]}
          />

          <AccountSection title="Data diri" />
          <InfoRows
            rows={[
              {
                label: "Tanggal lahir",
                value: profile.birthDate,
                placeholder: add,
              },
              { label: "Jenis kelamin", value: gender, placeholder: add },
              {
                label: "Bio",
                value: profile.bio,
                placeholder: add,
                multiline: true,
              },
            ]}
          />

          <AccountSection title="Alamat" />
          <InfoRows
            rows={[
              { label: "Provinsi", value: profile.province, placeholder: add },
              {
                label: "Kabupaten/Kota",
                value: profile.regency,
                placeholder: add,
              },
              { label: "Kecamatan", value: profile.district, placeholder: add },
              {
                label: "Desa/Kelurahan",
                value: profile.village,
                placeholder: add,
              },
              {
                label: "Alamat",
                value: profile.address,
                placeholder: add,
                multiline: true,
              },
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
        </View>
      </ScrollView>
    </View>
  );
}
