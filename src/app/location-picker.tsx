import React, { useMemo, useState } from "react";
import { AppIcon } from "../components/ui/AppIcon";
import { ScrollView, TextInput, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, ink, surface } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { provinces } from "../data/regions";
import { useAuthStore } from "../store/authStore";
import { fontFamilies } from "../theme/typography";

type Step = 0 | 1 | 2 | 3;

const stepLabels = ["Provinsi", "Kabupaten/Kota", "Kecamatan", "Desa/Kelurahan"] as const;

/**
 * Four-level picker for Edit Profil. There is no reference screen for it yet,
 * so this is our own take: one column at a time, each pick opening the next.
 */
export default function LocationPickerScreen() {
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [step, setStep] = useState<Step>(0);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  const options = useMemo(() => {
    const province = provinces.find((p) => p.name === picked[0]);
    const regency = province?.regencies.find((r) => r.name === picked[1]);
    const district = regency?.districts.find((d) => d.name === picked[2]);
    if (step === 0) return provinces.map((p) => p.name);
    if (step === 1) return province?.regencies.map((r) => r.name) ?? [];
    if (step === 2) return regency?.districts.map((d) => d.name) ?? [];
    return district?.villages ?? [];
  }, [picked, step]);

  const visible = options.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase()));

  const choose = (value: string) => {
    const next = [...picked.slice(0, step), value];
    setPicked(next);
    setQuery("");
    if (step < 3) {
      setStep((step + 1) as Step);
      return;
    }
    updateProfile({
      province: next[0],
      regency: next[1],
      district: next[2],
      village: next[3],
    });
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Pilih Lokasi" />

      <View style={{ paddingHorizontal: 16, paddingTop: 14, gap: 12 }}>
        {/* Breadcrumb: tap a completed step to go back and change it. */}
        <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
          {stepLabels.map((label, i) => {
            const done = i < picked.length;
            const active = i === step;
            return (
              <View key={label} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                {i > 0 ? <AppIcon name="chevronRight" size={13} color={ink[300]} /> : null}
                <PressableScale
                  hitSlop={6}
                  disabled={!done && !active}
                  onPress={() => {
                    setStep(i as Step);
                    setQuery("");
                  }}
                >
                  <AppText
                    variant={active ? "captionMedium" : "caption"}
                    color={active ? brand[700] : done ? ink[700] : ink[300]}
                  >
                    {done ? picked[i] : label}
                  </AppText>
                </PressableScale>
              </View>
            );
          })}
        </View>

        <View
          style={{
            height: 44,
            borderRadius: 12,
            backgroundColor: "#FFFFFF",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 13,
            gap: 9,
            ...(shadow.xs as object),
          }}
        >
          <AppIcon name="search" size={17} color={ink[400]} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={`Cari ${stepLabels[step].toLowerCase()}`}
            placeholderTextColor={ink[400]}
            style={{
              flex: 1,
              padding: 0,
              fontFamily: fontFamilies.regular,
              fontSize: 13.5,
              color: ink[900],
            }}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 34 }}
      >
        <View style={{ borderRadius: 14, backgroundColor: "#FFFFFF", ...(shadow.xs as object) }}>
          {visible.length === 0 ? (
            <View style={{ paddingVertical: 30, alignItems: "center" }}>
              <AppText variant="body" color={ink[400]}>
                Tidak ada hasil untuk &quot;{query}&quot;
              </AppText>
            </View>
          ) : (
            visible.map((option, i) => {
              const selected = picked[step] === option;
              return (
                <View key={option}>
                  {i > 0 ? (
                    <View
                      style={{ height: 1, backgroundColor: ink[100], marginHorizontal: 14 }}
                    />
                  ) : null}
                  <PressableScale
                    scaleTo={0.99}
                    onPress={() => choose(option)}
                    style={{
                      height: 48,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 14,
                      gap: 10,
                    }}
                  >
                    <AppText
                      variant="bodyMedium"
                      color={selected ? brand[700] : ink[800]}
                      numberOfLines={1}
                      style={{ flex: 1 }}
                    >
                      {option}
                    </AppText>
                    {selected ? (
                      <AppIcon name="check" size={17} color={brand[600]} />
                    ) : (
                      <AppIcon name="chevronRight" size={16} color={ink[300]} />
                    )}
                  </PressableScale>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
