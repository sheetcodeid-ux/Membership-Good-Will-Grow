import React, { useState } from "react";
import { ScrollView, TextInput, View, type TextInputProps } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { Avatar } from "../components/ui/Avatar";
import { PressableScale } from "../components/ui/PressableScale";
import { Glyph, type GlyphName } from "../components/icons/Glyph";
import {
  AccountSection,
  LABEL_INK,
  QUIET_INK,
  RULE,
} from "../components/AccountMenu";
import { AccountBottomBar } from "../components/AccountBottomBar";
import { brand, iconGrey, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { useAuthStore, type Gender } from "../store/authStore";

const EDGE = 13.5;
const BIO_MAX = 150;
const FIELD_H = 48;
const PLACEHOLDER = "#A0A4AE";

const inputText = {
  fontFamily: fontFamilies.semibold,
  fontSize: 15,
  color: LABEL_INK,
  padding: 0,
} as const;

/** A white field with the cards' border that firms up to brand blue while in use. */
function useFocusBorder() {
  const [focused, setFocused] = useState(false);
  return {
    focused,
    handlers: {
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
    },
    border: {
      borderWidth: focused ? 1.5 : 1,
      borderColor: focused ? brand[600] : RULE,
    },
  };
}

function FieldLabel({ children }: { children: string }) {
  return (
    <UiText
      color={QUIET_INK}
      style={{
        marginBottom: 6,
        fontSize: 12,
        lineHeight: 16,
        fontFamily: fontFamilies.medium,
      }}
    >
      {children}
    </UiText>
  );
}

/** One labelled single-line field with its glyph inside, on the left. */
function Field({
  label,
  icon,
  ...input
}: { label: string; icon: GlyphName } & TextInputProps) {
  const f = useFocusBorder();
  return (
    <View>
      <FieldLabel>{label}</FieldLabel>
      <View
        style={{
          height: FIELD_H,
          borderRadius: 12,
          backgroundColor: "#FFFFFF",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingHorizontal: 13,
          ...f.border,
        }}
      >
        <Glyph
          name={icon}
          size={19}
          color={f.focused ? brand[600] : iconGrey}
        />
        <TextInput
          {...input}
          {...f.handlers}
          placeholderTextColor={PLACEHOLDER}
          style={[inputText, { flex: 1 }]}
        />
      </View>
    </View>
  );
}

function Area({
  label,
  height,
  counter,
  ...input
}: {
  label: string;
  height: number;
  counter?: string;
} & TextInputProps) {
  const f = useFocusBorder();
  return (
    <View>
      <FieldLabel>{label}</FieldLabel>
      <TextInput
        {...input}
        {...f.handlers}
        multiline
        textAlignVertical="top"
        placeholderTextColor={PLACEHOLDER}
        style={[
          inputText,
          {
            height,
            borderRadius: 12,
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 13,
            paddingTop: 13,
            paddingBottom: 13,
            ...f.border,
          },
        ]}
      />
      {counter ? (
        <UiText
          color={QUIET_INK}
          style={{
            marginTop: 6,
            textAlign: "right",
            fontSize: 12,
            lineHeight: 16,
            fontFamily: fontFamilies.medium,
          }}
        >
          {counter}
        </UiText>
      ) : null}
    </View>
  );
}

/** Two-way choice as pills, the chosen one tinted and ticked. */
function Choice({
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
      scaleTo={0.97}
      style={{
        flex: 1,
        height: FIELD_H,
        borderRadius: FIELD_H / 2,
        borderWidth: selected ? 1.5 : 1,
        borderColor: selected ? brand[600] : RULE,
        backgroundColor: selected ? "#EEF3FF" : "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {selected ? (
        <Glyph name="checkCircle" size={18} color={brand[600]} />
      ) : null}
      <UiText
        color={selected ? brand[800] : LABEL_INK}
        style={{
          fontSize: 15,
          lineHeight: 19,
          fontFamily: selected ? fontFamilies.bold : fontFamilies.semibold,
        }}
      >
        {label}
      </UiText>
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

  const location = [
    profile.village,
    profile.district,
    profile.regency,
    profile.province,
  ]
    .filter(Boolean)
    .join(", ");

  const save = () => {
    updateProfile({ name, username, birthDate, gender, address, bio });
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader tone="account" title="Ubah Profil" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: EDGE,
          paddingTop: 24,
          paddingBottom: 24,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <View>
            <Avatar name={name || profile.name} size={92} initialsSize={27} />
            <PressableScale
              scaleTo={0.92}
              style={{
                position: "absolute",
                right: -4,
                bottom: -2,
                width: 34,
                height: 34,
                borderRadius: 17,
                borderWidth: 3,
                borderColor: surface,
                backgroundColor: brand[600],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Glyph name="camera" size={16} color="#FFFFFF" />
            </PressableScale>
          </View>
          <UiText
            color={QUIET_INK}
            style={{
              marginTop: 10,
              fontSize: 12,
              lineHeight: 16,
              fontFamily: fontFamilies.medium,
            }}
          >
            Ketuk kamera untuk ganti foto
          </UiText>
        </View>

        <AccountSection title="Info akun" />
        <View style={{ gap: 14 }}>
          <Field
            label="Nama"
            icon="tabProfile"
            value={name}
            onChangeText={setName}
            placeholder="Nama lengkap"
          />
          <Field
            label="Username"
            icon="atSign"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholder="username"
          />
        </View>

        <AccountSection title="Data diri" />
        <View style={{ gap: 14 }}>
          <Field
            label="Tanggal lahir"
            icon="calendar"
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="DD/MM/YYYY"
          />
          <View>
            <FieldLabel>Jenis kelamin</FieldLabel>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Choice
                label="Laki-laki"
                selected={gender === "male"}
                onPress={() => setGender("male")}
              />
              <Choice
                label="Perempuan"
                selected={gender === "female"}
                onPress={() => setGender("female")}
              />
            </View>
          </View>
        </View>

        <AccountSection title="Alamat" />
        <View style={{ gap: 14 }}>
          <View>
            <FieldLabel>Lokasi</FieldLabel>
            <PressableScale
              scaleTo={0.99}
              onPress={() => router.push("/location-picker")}
              style={{
                minHeight: FIELD_H,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: RULE,
                backgroundColor: "#FFFFFF",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingLeft: 13,
                paddingRight: 11,
                paddingVertical: 10,
              }}
            >
              <Glyph name="pin" size={19} color={iconGrey} />
              <UiText
                numberOfLines={2}
                color={location ? LABEL_INK : PLACEHOLDER}
                style={{
                  flex: 1,
                  fontSize: 15,
                  lineHeight: 19,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                {location || "Pilih provinsi sampai kelurahan"}
              </UiText>
              <Glyph name="chevronRight" size={15} color={QUIET_INK} />
            </PressableScale>
          </View>
          <Area
            label="Alamat lengkap"
            height={96}
            value={address}
            onChangeText={setAddress}
            placeholder="Nama jalan, nomor rumah, RT/RW"
          />
        </View>

        <AccountSection title="Tentang kamu" />
        <Area
          label="Bio"
          height={104}
          value={bio}
          onChangeText={(t) => setBio(t.slice(0, BIO_MAX))}
          placeholder={`Ceritakan tentang dirimu (maks. ${BIO_MAX} karakter)`}
          counter={`${bio.length}/${BIO_MAX}`}
        />
      </ScrollView>

      {/* Save stays in reach wherever the form is scrolled to. */}
      <AccountBottomBar label="Simpan" onPress={save} />
    </View>
  );
}
