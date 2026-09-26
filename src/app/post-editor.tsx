import React, { useMemo, useState, useRef } from "react";
import { AppIcon, type AppIconName } from "../components/ui/AppIcon";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { AppText } from "../components/ui";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, ink, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { outlets, outletFullName } from "../data/mock";
import { useFeedStore } from "../store/feedStore";
import { pickImage } from "../utils/pickImage";
import { formatDistance } from "../utils/format";
import type { PostVisibility } from "../data/types";

const visibilityOptions: {
  key: PostVisibility;
  icon: AppIconName;
  title: string;
  subtitle: string;
}[] = [
  { key: "publik", icon: "globe", title: "Publik", subtitle: "Semua orang bisa melihat post ini" },
  { key: "hanya-saya", icon: "lock", title: "Hanya Saya", subtitle: "Hanya kamu yang bisa melihat post ini" },
  { key: "followers", icon: "users", title: "Pengikut", subtitle: "Hanya pengikut yang bisa melihat" },
  {
    key: "teman",
    icon: "userCheck",
    title: "Teman Saling Mengikuti",
    subtitle: "Hanya teman yang saling mengikuti yang bisa melihat",
  },
];

export default function PostEditorScreen() {
  const { type } = useLocalSearchParams<{ type?: string }>();
  const isCheckIn = type === "checkin";

  const [caption, setCaption] = useState("");
  const [photo, setPhoto] = useState<string>();
  const hasPhoto = !!photo;
  const [visibility, setVisibility] = useState<PostVisibility>("publik");
  const [sourceSheet, setSourceSheet] = useState(false);
  const addPost = useFeedStore((s) => s.addPost);

  /** Stands in for a GPS fix: the open outlet with the smallest distance. */
  const nearestOutlet = useMemo(
    () =>
      [...outlets].filter((o) => o.isOpen).sort((a, b) => a.distanceKm - b.distanceKm)[0] ??
      outlets[0],
    []
  );
  const [outletId, setOutletId] = useState(nearestOutlet.id);
  const selectedOutlet = outlets.find((o) => o.id === outletId) ?? nearestOutlet;

  const canPost = caption.trim().length > 0 || hasPhoto;

  /**
   * Same double-submit latch as the comment composer. The navigation away
   * does not land until after the tick, so a second tap in the same burst
   * would have posted twice before the screen went anywhere.
   */
  const posting = useRef(false);
  const submit = () => {
    if (!canPost || posting.current) return;
    posting.current = true;
    addPost(
      caption.trim(),
      isCheckIn ? outletFullName(selectedOutlet) : undefined,
      isCheckIn ? selectedOutlet.brandId : undefined,
      photo
    );
    router.dismissAll();
    router.replace("/(tabs)");
    setTimeout(() => {
      posting.current = false;
    }, 0);
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader
        title={isCheckIn ? "Check In" : "Buat Post"}
        leftIcon="close"
        right={
          <PressableScale onPress={submit} disabled={!canPost} hitSlop={10}>
            <AppText variant="titleLg" color={canPost ? brand[700] : ink[300]}>
              Post
            </AppText>
          </PressableScale>
        }
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ backgroundColor: "#FFFFFF", borderRadius: 18, padding: 16, minHeight: 150 }}>
            <TextInput
              multiline
              value={caption}
              onChangeText={setCaption}
              placeholder="Apa yang kamu pikirkan?"
              placeholderTextColor={ink[300]}
              style={[
                {
                  flex: 1,
                  minHeight: 118,
                  padding: 0,
                  textAlignVertical: "top",
                  fontFamily: fontFamilies.regular,
                  fontSize: 16,
                  lineHeight: 23,
                  color: ink[900],
                },
                Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null,
              ]}
            />
          </View>

          {isCheckIn ? (
            <View style={{ backgroundColor: "#FFFFFF", borderRadius: 18, padding: 16, gap: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <AppIcon name="pin" size={19} color={brand[700]} />
                <AppText variant="titleLg">Outlet terdekat</AppText>
              </View>
              {outlets.slice(0, 3).map((outlet) => {
                const active = outlet.id === outletId;
                return (
                  <PressableScale
                    key={outlet.id}
                    onPress={() => setOutletId(outlet.id)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      borderRadius: 14,
                      padding: 12,
                      backgroundColor: active ? brand[50] : ink[50],
                      borderWidth: 1.5,
                      borderColor: active ? brand[700] : "transparent",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <AppText variant="bodySemibold" numberOfLines={1}>
                        {outletFullName(outlet)}
                      </AppText>
                      <AppText variant="caption" color={ink[400]}>
                        {outlet.city} · {formatDistance(outlet.distanceKm)}
                      </AppText>
                    </View>
                    {active ? <AppIcon name="checkCircle" size={20} color={brand[800]} /> : null}
                  </PressableScale>
                );
              })}
            </View>
          ) : null}

          {hasPhoto ? (
            <View>
              <Image
                source={{ uri: photo }}
                resizeMode="cover"
                accessibilityLabel="Foto post"
                style={{ height: 240, borderRadius: 18 }}
              />
              <PressableScale
                onPress={() => setPhoto(undefined)}
                accessibilityLabel="Hapus foto"
                hitSlop={10}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: "rgba(10,14,26,0.55)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppIcon name="close" size={16} color="#FFFFFF" />
              </PressableScale>
            </View>
          ) : (
            <PressableScale
              onPress={() => setSourceSheet(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                backgroundColor: "#FFFFFF",
                borderRadius: 18,
                paddingVertical: 18,
                paddingHorizontal: 16,
              }}
            >
              <AppIcon name="imagePlus" size={24} color={brand[800]} />
              <AppText variant="h3" color={brand[800]}>
                Tambah Foto
              </AppText>
            </PressableScale>
          )}

          <View style={{ backgroundColor: "#FFFFFF", borderRadius: 18, padding: 16, gap: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <AppIcon name="eye" size={20} color={brand[700]} />
              <AppText variant="h3">Siapa yang bisa melihat?</AppText>
            </View>

            {visibilityOptions.map(({ key, icon, title, subtitle }) => {
              const active = visibility === key;
              return (
                <PressableScale
                  key={key}
                  onPress={() => setVisibility(key)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    borderRadius: 14,
                    padding: 10,
                    backgroundColor: active ? brand[50] : "#FFFFFF",
                    borderWidth: 1.5,
                    borderColor: active ? brand[800] : ink[100],
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: active ? brand[800] : ink[200],
                    }}
                  >
                    <AppIcon name={icon} size={19} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText variant="titleLg" color={active ? brand[800] : ink[900]}>
                      {title}
                    </AppText>
                    <AppText variant="caption" color={ink[400]}>
                      {subtitle}
                    </AppText>
                  </View>
                  {active ? <AppIcon name="checkCircle" size={22} color={brand[800]} /> : null}
                </PressableScale>
              );
            })}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {sourceSheet ? (
        <Animated.View entering={FadeIn.duration(180)} style={StyleSheet.absoluteFill}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSourceSheet(false)}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(10,14,26,0.45)" }]} />
          </Pressable>

          <View style={{ flex: 1, justifyContent: "flex-end" }} pointerEvents="box-none">
            <Animated.View
              entering={SlideInDown.duration(280)}
              style={{
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: 26,
                borderTopRightRadius: 26,
              }}
            >
              <SafeAreaView edges={["bottom"]}>
                <View style={{ alignItems: "center", paddingTop: 10 }}>
                  <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: ink[200] }} />
                </View>

                <AppText variant="h3" center style={{ marginTop: 18 }}>
                  Pilih Sumber Gambar
                </AppText>

                <View style={{ flexDirection: "row", gap: 14, padding: 20, paddingBottom: 26 }}>
                  {([
                    { icon: "camera", label: "Kamera", source: "camera" },
                    { icon: "images", label: "Galeri", source: "library" },
                  ] as { icon: AppIconName; label: string; source: "camera" | "library" }[]).map(({ icon, label, source }) => (
                    <PressableScale
                      key={label}
                      onPress={async () => {
                        setSourceSheet(false);
                        const uri = await pickImage(source);
                        if (uri) setPhoto(uri);
                      }}
                      style={{
                        flex: 1,
                        gap: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingVertical: 22,
                        borderRadius: 16,
                        backgroundColor: brand[50],
                        borderWidth: 1.5,
                        borderColor: brand[100],
                      }}
                    >
                      <AppIcon name={icon} size={26} color={brand[800]} />
                      <AppText variant="bodyMedium" color={brand[800]}>
                        {label}
                      </AppText>
                    </PressableScale>
                  ))}
                </View>
              </SafeAreaView>
            </Animated.View>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}
