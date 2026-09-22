import React, { useState } from "react";
import { View, ScrollView, TextInput } from "react-native";
import { router } from "expo-router";
import { MapPin, ImagePlus, X } from "lucide-react-native";
import { Screen, ScreenHeader, AppText, Button } from "../components/ui";
import { Avatar } from "../components/ui/Avatar";
import { PressableScale } from "../components/ui/PressableScale";
import { MediaTile } from "../components/ui/MediaTile";
import { brand, ink } from "../theme/colors";
import { outlets, getBrand } from "../data/mock";
import { useAuthStore } from "../store/authStore";
import { useFeedStore } from "../store/feedStore";
import { fontFamilies } from "../theme/typography";

export default function CreatePostScreen() {
  const name = useAuthStore((s) => s.name);
  const addPost = useFeedStore((s) => s.addPost);
  const [caption, setCaption] = useState("");
  const [outletId, setOutletId] = useState<string | undefined>();
  const [addPhoto, setAddPhoto] = useState(false);

  const outlet = outlets.find((o) => o.id === outletId);
  const brandInfo = getBrand(outlet?.brandId);

  const submit = () => {
    if (!caption.trim()) return;
    addPost(caption.trim(), outlet?.name, outlet?.brandId);
    router.back();
  };

  return (
    <Screen>
      <ScreenHeader
        title="Buat Post"
        right={
          <Button label="Posting" size="sm" disabled={!caption.trim()} onPress={submit} />
        }
      />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Avatar name={name} size={44} />
          <AppText variant="titleLg">{name}</AppText>
        </View>

        <TextInput
          multiline
          placeholder="Apa yang sedang kamu nikmati hari ini?"
          placeholderTextColor={ink[400]}
          value={caption}
          onChangeText={setCaption}
          style={{
            minHeight: 120,
            fontFamily: fontFamilies.medium,
            fontSize: 16,
            color: ink[900],
            textAlignVertical: "top",
          }}
        />

        {addPhoto ? (
          <View>
            <MediaTile
              colors={brandInfo?.gradient ?? [brand[600], brand[400]]}
              icon="coffee"
              radius={18}
              iconSize={40}
              style={{ height: 180, width: "100%" }}
            />
            <PressableScale
              onPress={() => setAddPhoto(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 30,
                height: 30,
                borderRadius: 10,
                backgroundColor: "rgba(0,0,0,0.4)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={16} color="#FFFFFF" />
            </PressableScale>
          </View>
        ) : null}

        <View style={{ flexDirection: "row", gap: 10 }}>
          <PressableScale
            onPress={() => setAddPhoto(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: ink[50],
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 14,
            }}
          >
            <ImagePlus size={16} color={brand[600]} />
            <AppText variant="captionMedium" color={brand[600]}>Foto</AppText>
          </PressableScale>
        </View>

        <View style={{ gap: 10 }}>
          <AppText variant="titleLg">Check-in di outlet? (opsional)</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {outlets.map((o) => {
              const active = outletId === o.id;
              return (
                <PressableScale
                  key={o.id}
                  onPress={() => setOutletId(active ? undefined : o.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 14,
                    backgroundColor: active ? brand[600] : ink[50],
                  }}
                >
                  <MapPin size={13} color={active ? "#FFFFFF" : ink[500]} />
                  <AppText variant="captionMedium" color={active ? "#FFFFFF" : ink[600]} numberOfLines={1}>
                    {o.name}
                  </AppText>
                </PressableScale>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </Screen>
  );
}
