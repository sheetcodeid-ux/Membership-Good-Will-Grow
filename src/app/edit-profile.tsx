import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  TextInput,
  View,
  useWindowDimensions,
  type TextInputProps,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { Avatar } from "../components/ui/Avatar";
import { PressableScale } from "../components/ui/PressableScale";
import { Glyph, type GlyphName } from "../components/icons/Glyph";
import { SkylineBand } from "../components/AccountHeroArt";
import { DatePickerSheet } from "../components/DatePickerSheet";
import { PhotoSourceSheet } from "../components/PhotoSourceSheet";
import { AccountBottomBar } from "../components/AccountBottomBar";
import {
  AccountSection,
  LABEL_INK,
  QUIET_INK,
  RULE,
} from "../components/AccountMenu";
import { brand, danger, iconGrey, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { useAuthStore, type Gender } from "../store/authStore";
import { showToast } from "../store/toastStore";
import { emailError, nameError, usernameError } from "../utils/profile";
import { formatIndoDate, parseIndoDate } from "../utils/dates";
import { tapError, tapSelect, tapSuccess } from "../utils/haptics";
import { pickImage, type ImageSource } from "../utils/pickImage";
import { useScrolled } from "../hooks/useScrolled";

const EDGE = 13.5;
const BIO_MAX = 150;
const FIELD_H = 48;
const PLACEHOLDER = "#A0A4AE";
const BAND_H = 104;
const AVATAR = 92;

const inputText = {
  fontFamily: fontFamilies.semibold,
  fontSize: 15,
  color: LABEL_INK,
  padding: 0,
  // The browser's own focus ring; the field draws its own.
  ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null),
};

/** Border for a field: hairline at rest, brand blue in use, red when wrong. */
function borderFor(focused: boolean, error?: string) {
  if (error) return { borderWidth: 1.5, borderColor: danger[500] };
  return {
    borderWidth: focused ? 1.5 : 1,
    borderColor: focused ? brand[600] : RULE,
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

function ErrorLine({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginTop: 6,
      }}
    >
      <Glyph name="alertCircle" size={13} color={danger[500]} />
      <UiText
        color={danger[500]}
        style={{
          fontSize: 12.5,
          lineHeight: 16,
          fontFamily: fontFamilies.semibold,
        }}
      >
        {children}
      </UiText>
    </View>
  );
}

/** One labelled single-line field with its glyph inside, on the left. */
function Field({
  label,
  icon,
  error,
  ...input
}: { label: string; icon: GlyphName; error?: string } & TextInputProps) {
  const [focused, setFocused] = useState(false);
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
          ...borderFor(focused, error),
        }}
      >
        <Glyph
          name={icon}
          size={19}
          color={error ? danger[500] : focused ? brand[600] : iconGrey}
        />
        <TextInput
          {...input}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={PLACEHOLDER}
          style={[inputText, { flex: 1 }]}
        />
      </View>
      <ErrorLine>{error}</ErrorLine>
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
  const [focused, setFocused] = useState(false);
  return (
    <View>
      <FieldLabel>{label}</FieldLabel>
      <TextInput
        {...input}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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
            ...borderFor(focused),
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

/** A field that opens a picker instead of taking typing. */
function PickerField({
  label,
  icon,
  value,
  placeholder,
  onPress,
}: {
  label: string;
  icon: GlyphName;
  value?: string;
  placeholder: string;
  onPress: () => void;
}) {
  return (
    <View>
      <FieldLabel>{label}</FieldLabel>
      <PressableScale
        scaleTo={0.99}
        onPress={onPress}
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
        <Glyph name={icon} size={19} color={iconGrey} />
        <UiText
          numberOfLines={2}
          color={value ? LABEL_INK : PLACEHOLDER}
          style={{
            flex: 1,
            fontSize: 15,
            lineHeight: 19,
            fontFamily: fontFamilies.semibold,
          }}
        >
          {value || placeholder}
        </UiText>
        <Glyph name="chevronRight" size={15} color={QUIET_INK} />
      </PressableScale>
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
      onPress={() => {
        tapSelect();
        onPress();
      }}
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
  const { width } = useWindowDimensions();
  const scroll = useScrolled();
  const profile = useAuthStore();
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [gender, setGender] = useState<Gender | undefined>(profile.gender);
  const [address, setAddress] = useState(profile.address);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUri, setAvatarUri] = useState(profile.avatarUri);
  const [photoSheet, setPhotoSheet] = useState(false);
  const [picking, setPicking] = useState(false);
  const [tried, setTried] = useState(false);

  const location = [
    profile.village,
    profile.district,
    profile.regency,
    profile.province,
  ]
    .filter(Boolean)
    .join(", ");

  // A field's error shows once it has been edited or a save was tried, so
  // an untouched form never opens covered in red.
  const errors = {
    name: nameError(name),
    username: usernameError(username, profile.username),
    email: emailError(email),
  };
  const shown = {
    name: name !== profile.name || tried ? errors.name : undefined,
    username:
      username !== profile.username || tried ? errors.username : undefined,
    email: email !== profile.email || tried ? errors.email : undefined,
  };
  const valid = !errors.name && !errors.username && !errors.email;
  const changed =
    name !== profile.name ||
    username !== profile.username ||
    email !== profile.email ||
    birthDate !== profile.birthDate ||
    gender !== profile.gender ||
    address !== profile.address ||
    bio !== profile.bio ||
    avatarUri !== profile.avatarUri;

  const choosePhoto = async (source: ImageSource) => {
    setPhotoSheet(false);
    const uri = await pickImage(source, { square: true });
    if (!uri) return;
    tapSuccess();
    setAvatarUri(uri);
    showToast("Foto dipasang. Simpan untuk memakainya");
  };

  const save = () => {
    if (!valid) {
      setTried(true);
      tapError();
      showToast("Periksa lagi data yang ditandai merah", "error");
      return;
    }
    updateProfile({
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      birthDate,
      gender,
      address,
      bio,
      avatarUri,
    });
    tapSuccess();
    showToast("Profil berhasil disimpan");
    if (router.canGoBack()) router.back();
    else router.replace("/profile-detail");
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader tone="account" title="Ubah Profil" divider={scroll.scrolled} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={scroll.onScroll}
        scrollEventThrottle={scroll.scrollEventThrottle}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <SkylineBand width={width} height={BAND_H} />
        <View style={{ alignItems: "center", marginTop: -AVATAR / 2 - 8 }}>
          <View>
            <View
              style={{
                borderRadius: AVATAR / 2 + 4,
                borderWidth: 4,
                borderColor: surface,
              }}
            >
              <Avatar
                uri={avatarUri}
                name={name || profile.name}
                size={AVATAR}
                initialsSize={27}
              />
            </View>
            <PressableScale
              scaleTo={0.92}
              onPress={() => {
                tapSelect();
                setPhotoSheet(true);
              }}
              accessibilityLabel="Ganti foto profil"
              style={{
                position: "absolute",
                right: -2,
                bottom: 0,
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
        </View>

        <View style={{ paddingHorizontal: EDGE }}>
          <AccountSection title="Info akun" />
          <View style={{ gap: 14 }}>
            <Field
              label="Nama"
              icon="tabProfile"
              value={name}
              onChangeText={setName}
              placeholder="Nama lengkap"
              error={shown.name}
            />
            <Field
              label="Username"
              icon="atSign"
              value={username}
              onChangeText={(t) => setUsername(t.toLowerCase())}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="username"
              error={shown.username}
            />
            <Field
              label="Email"
              icon="mail"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="nama@email.com"
              error={shown.email}
            />
          </View>

          <AccountSection title="Data diri" />
          <View style={{ gap: 14 }}>
            <PickerField
              label="Tanggal lahir"
              icon="calendar"
              value={birthDate}
              placeholder="Pilih tanggal lahir"
              onPress={() => setPicking(true)}
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
            <PickerField
              label="Lokasi"
              icon="pin"
              value={location}
              placeholder="Pilih provinsi sampai kelurahan"
              onPress={() => router.push("/location-picker")}
            />
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
        </View>
      </ScrollView>

      {/* Save stays in reach, and wakes up only once something has changed. */}
      <AccountBottomBar
        label={changed ? "Simpan perubahan" : "Belum ada perubahan"}
        onPress={save}
        disabled={!changed}
      />

      {photoSheet ? (
        <PhotoSourceSheet
          onClose={() => setPhotoSheet(false)}
          onPick={choosePhoto}
          onRemove={
            avatarUri
              ? () => {
                  setPhotoSheet(false);
                  setAvatarUri(undefined);
                }
              : undefined
          }
        />
      ) : null}

      {picking ? (
        <DatePickerSheet
          initial={parseIndoDate(birthDate)}
          onClose={() => setPicking(false)}
          onPick={(d) => {
            setBirthDate(formatIndoDate(d));
            setPicking(false);
          }}
        />
      ) : null}
    </View>
  );
}
