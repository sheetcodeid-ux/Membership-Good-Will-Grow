import React, { useState } from "react";
import { AppIcon } from "../components/ui/AppIcon";
import { ScrollView, TextInput, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, ink, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { useAuthStore, type Gender } from "../store/authStore";

const BIO_MAX = 150;

const fieldStyle = {
  borderWidth: 1.4,
  borderColor: ink[200],
  borderRadius: 12,
  backgroundColor: "rgba(255,255,255,0.55)",
  paddingHorizontal: 14,
};

const textStyle = {
  fontFamily: fontFamilies.regular,
  fontSize: 14.5,
  color: ink[900],
  padding: 0,
};

/** Icon in its own gutter to the left of the field, as the reference draws it. */
function FieldRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
      <View style={{ width: 26, alignItems: "center" }}>{icon}</View>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

function Radio({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      hitSlop={8}
      style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
    >
      <View
        style={{
          width: 21,
          height: 21,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: selected ? brand[900] : ink[400],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected ? (
          <View
            style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: brand[900] }}
          />
        ) : null}
      </View>
      <AppText color={ink[900]} style={{ fontSize: 15, lineHeight: 20 }}>
        {label}
      </AppText>
    </PressableScale>
  );
}

export default function EditProfileScreen() {
  const profile = useAuthStore();
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [gender, setGender] = useState<Gender | undefined>(profile.gender);
  const [address, setAddress] = useState(profile.address);
  const [bio, setBio] = useState(profile.bio);

  const location = [profile.village, profile.district, profile.regency, profile.province]
    .filter(Boolean)
    .join(", ");

  const save = () => {
    updateProfile({ name, username, birthDate, gender, address, bio });
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Edit Profil" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 34 }}
      >
        <View style={{ alignItems: "center" }}>
          <View style={{ width: 120, height: 120 }}>
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: brand[400],
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <AppIcon name="profile" size={80} color={ink[50]} />
            </View>
            <PressableScale
              style={{
                position: "absolute",
                right: -2,
                bottom: 2,
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: ink[400],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppIcon name="camera" size={19} color="#FFFFFF" />
            </PressableScale>
          </View>
        </View>

        <View style={{ marginTop: 28, gap: 16 }}>
          <FieldRow icon={<AppIcon name="profile" size={21} color={ink[500]} />}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nama"
              placeholderTextColor={ink[400]}
              style={[fieldStyle, textStyle, { height: 50 }]}
            />
          </FieldRow>

          <FieldRow icon={<AppIcon name="atSign" size={21} color={ink[500]} />}>
            <TextInput
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholder="Username"
              placeholderTextColor={ink[400]}
              style={[fieldStyle, textStyle, { height: 50 }]}
            />
          </FieldRow>

          <FieldRow icon={<AppIcon name="calendar" size={21} color={ink[500]} />}>
            <TextInput
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="Tanggal Lahir"
              placeholderTextColor={ink[400]}
              style={[fieldStyle, textStyle, { height: 50 }]}
            />
          </FieldRow>
        </View>

        <AppText color={ink[900]} style={{ marginTop: 22, fontSize: 15, lineHeight: 20 }}>
          Gender
        </AppText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 26, marginTop: 12 }}>
          <Radio label="Male" selected={gender === "male"} onPress={() => setGender("male")} />
          <Radio
            label="Female"
            selected={gender === "female"}
            onPress={() => setGender("female")}
          />
        </View>

        <PressableScale
          scaleTo={0.99}
          onPress={() => router.push("/location-picker")}
          style={[
            fieldStyle,
            {
              marginTop: 22,
              height: 58,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            },
          ]}
        >
          <AppIcon name="pin" size={21} color={ink[500]} />
          <AppText
            numberOfLines={1}
            color={location ? ink[900] : ink[400]}
            style={{ flex: 1, fontSize: 14.5, lineHeight: 20 }}
          >
            {location || "Pilih Lokasi"}
          </AppText>
          <AppIcon name="chevronRight" size={19} color={ink[400]} />
        </PressableScale>

        <TextInput
          value={address}
          onChangeText={setAddress}
          multiline
          textAlignVertical="top"
          placeholder="Alamat"
          placeholderTextColor={ink[500]}
          style={[
            fieldStyle,
            textStyle,
            { marginTop: 16, height: 96, paddingTop: 14, paddingBottom: 14 },
          ]}
        />

        <AppText color={ink[900]} style={{ marginTop: 22, fontSize: 15, lineHeight: 20 }}>
          Bio
        </AppText>
        <TextInput
          value={bio}
          onChangeText={(t) => setBio(t.slice(0, BIO_MAX))}
          multiline
          textAlignVertical="top"
          placeholder={`Ceritakan tentang diri Anda (maksimal ${BIO_MAX} karakter)`}
          placeholderTextColor={ink[300]}
          style={[
            fieldStyle,
            textStyle,
            { marginTop: 12, height: 108, paddingTop: 14, paddingBottom: 14 },
          ]}
        />
        <AppText
          variant="caption"
          color={ink[500]}
          style={{ marginTop: 8, textAlign: "right", fontSize: 12.5 }}
        >
          {bio.length}/{BIO_MAX}
        </AppText>

        <PressableScale
          onPress={save}
          scaleTo={0.98}
          style={{
            marginTop: 22,
            height: 56,
            borderRadius: 14,
            backgroundColor: brand[950],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppText
            color="#FFFFFF"
            style={{ fontSize: 16, lineHeight: 22, fontFamily: "Urbanist_600SemiBold" }}
          >
            Update
          </AppText>
        </PressableScale>
      </ScrollView>
    </View>
  );
}
