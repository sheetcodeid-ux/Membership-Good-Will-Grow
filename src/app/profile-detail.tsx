import React from "react";
import { AppIcon } from "../components/ui/AppIcon";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, ink, surface } from "../theme/colors";
import { localPhone, useAuthStore } from "../store/authStore";

/** Reference row pitch is 117px at DPR2. */
const ROW_H = 58.5;

function Row({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <View
      style={{
        height: ROW_H,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
      }}
    >
      <AppText color={ink[500]} style={{ fontSize: 14, lineHeight: 19 }}>
        {label}
      </AppText>
      <View style={{ flex: 1, alignItems: "flex-end" }}>{children}</View>
    </View>
  );
}

function Value({ text }: { text: string }) {
  return (
    <AppText
      color={ink[900]}
      numberOfLines={1}
      style={{ fontSize: 14.5, lineHeight: 20, fontFamily: "Urbanist_500Medium" }}
    >
      {text}
    </AppText>
  );
}

/** Purple call to action shown where a field is still empty. */
function AddLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <PressableScale
      onPress={onPress}
      hitSlop={10}
      style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
    >
      <AppText color={brand[700]} style={{ fontSize: 14, lineHeight: 19 }}>
        {label}
      </AppText>
      <AppIcon name="plus" size={15} color={brand[700]} />
    </PressableScale>
  );
}

export default function ProfileDetailScreen() {
  const profile = useAuthStore();
  const toEdit = () => router.push("/edit-profile");

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader
        title="Detail Profil"
        right={
          <PressableScale onPress={toEdit} hitSlop={12}>
            <AppText color={brand[700]} style={{ fontSize: 14.5, lineHeight: 20 }}>
              Edit
            </AppText>
          </PressableScale>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 34 }}
      >
        <View style={{ alignItems: "center", paddingTop: 22, paddingBottom: 26, gap: 12 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: brand[400],
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <AppIcon name="profile" size={54} color={ink[50]} />
          </View>
          <AppText
            color={ink[900]}
            style={{ fontSize: 17, lineHeight: 23, fontFamily: "Urbanist_700Bold" }}
          >
            {profile.name}
          </AppText>
        </View>

        <Row label="Nama">
          <Value text={profile.name} />
        </Row>
        <Row label="Username">
          <Value text={profile.username} />
        </Row>
        <Row label="Phone number">
          <Value text={localPhone(profile.phone)} />
        </Row>
        <Row label="Email">
          {profile.email ? (
            <Value text={profile.email} />
          ) : (
            <AddLink label="Tambahkan email" onPress={toEdit} />
          )}
        </Row>
        <Row label="Tgl Lahir">
          {profile.birthDate ? <Value text={profile.birthDate} /> : null}
        </Row>
        <Row label="Jenis kelamin">
          {profile.gender ? (
            <Value text={profile.gender === "male" ? "Male" : "Female"} />
          ) : null}
        </Row>
        <Row label="Provinsi">{profile.province ? <Value text={profile.province} /> : null}</Row>
        <Row label="Kabupaten/Kota">
          {profile.regency ? <Value text={profile.regency} /> : null}
        </Row>
        <Row label="Kecamatan">{profile.district ? <Value text={profile.district} /> : null}</Row>
        <Row label="Desa/Kelurahan">
          {profile.village ? <Value text={profile.village} /> : null}
        </Row>
        <Row label="Alamat">
          {profile.address ? (
            <AppText
              color={ink[900]}
              numberOfLines={2}
              style={{
                fontSize: 14.5,
                lineHeight: 20,
                fontFamily: "Urbanist_500Medium",
                textAlign: "right",
              }}
            >
              {profile.address}
            </AppText>
          ) : null}
        </Row>
        <Row label="PIN Akses">
          <PressableScale onPress={() => router.push("/create-pin")} hitSlop={10}>
            <AppText color={brand[700]} style={{ fontSize: 14.5, lineHeight: 20 }}>
              Ubah PIN
            </AppText>
          </PressableScale>
        </Row>
      </ScrollView>
    </View>
  );
}
