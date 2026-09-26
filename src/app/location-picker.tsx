import React, { useMemo, useState } from "react";
import { Platform, ScrollView, TextInput, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../components/ui/Text";
import { Glyph } from "../components/icons/Glyph";
import {
  AccountCard,
  LABEL_INK,
  QUIET_INK,
  RULE,
} from "../components/AccountMenu";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, surface } from "../theme/colors";
import { provinces } from "../data/regions";
import { useAuthStore } from "../store/authStore";
import { fontFamilies } from "../theme/typography";
import { useScrolled } from "../hooks/useScrolled";
import { showToast } from "../store/toastStore";
import { tapSelect, tapSuccess } from "../utils/haptics";

type Step = 0 | 1 | 2 | 3;

const stepLabels = [
  "Provinsi",
  "Kabupaten/Kota",
  "Kecamatan",
  "Desa/Kelurahan",
] as const;

/**
 * Four-level picker for Ubah Profil. There is no reference screen for it yet,
 * so this is our own take: one column at a time, each pick opening the next.
 */
export default function LocationPickerScreen() {
  const scroll = useScrolled();
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

  const visible = options.filter((o) =>
    o.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const choose = (value: string) => {
    tapSelect();
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
    tapSuccess();
    showToast(`Lokasi disimpan: ${next[3]}, ${next[2]}`);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader
        tone="account"
        title="Pilih Lokasi"
        divider={scroll.scrolled}
      />

      <View style={{ paddingHorizontal: 13.5, paddingTop: 14, gap: 10 }}>
        <UiText
          color={QUIET_INK}
          style={{
            fontSize: 12,
            lineHeight: 16,
            fontFamily: fontFamilies.medium,
          }}
        >
          Langkah {step + 1} dari {stepLabels.length}
        </UiText>
        {/* Breadcrumb: tap a completed step to go back and change it. */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            rowGap: 4,
            columnGap: 4,
          }}
        >
          {stepLabels.map((label, i) => {
            const done = i < picked.length;
            const active = i === step;
            return (
              <View
                key={label}
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                {i > 0 ? (
                  <Glyph name="chevronRight" size={10} color="#A0A4AE" />
                ) : null}
                <PressableScale
                  hitSlop={6}
                  disabled={!done && !active}
                  onPress={() => {
                    setStep(i as Step);
                    setQuery("");
                  }}
                >
                  <UiText
                    color={active ? brand[700] : done ? LABEL_INK : "#A0A4AE"}
                    style={{
                      fontSize: 13,
                      lineHeight: 17,
                      fontFamily: active
                        ? fontFamilies.bold
                        : done
                          ? fontFamilies.semibold
                          : fontFamilies.medium,
                    }}
                  >
                    {done && !active ? picked[i] : label}
                  </UiText>
                </PressableScale>
              </View>
            );
          })}
        </View>

        <View
          style={{
            height: 44,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: RULE,
            backgroundColor: "#FFFFFF",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 13,
            gap: 9,
          }}
        >
          <Glyph name="search" size={17} color={QUIET_INK} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={`Cari ${stepLabels[step].toLowerCase()}`}
            placeholderTextColor="#A0A4AE"
            style={{
              flex: 1,
              padding: 0,
              fontFamily: fontFamilies.semibold,
              fontSize: 14.5,
              color: LABEL_INK,
              ...(Platform.OS === "web"
                ? ({ outlineStyle: "none" } as object)
                : null),
            }}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scroll.onScroll}
        scrollEventThrottle={scroll.scrollEventThrottle}
        contentContainerStyle={{ padding: 13.5, paddingBottom: 40 }}
      >
        <AccountCard>
          {visible.length === 0 ? (
            <View style={{ paddingVertical: 28, alignItems: "center" }}>
              <UiText
                color={QUIET_INK}
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  fontFamily: fontFamilies.medium,
                }}
              >
                Tidak ada hasil untuk &quot;{query}&quot;
              </UiText>
            </View>
          ) : (
            visible.map((option, i) => {
              const selected = picked[step] === option;
              return (
                <View key={option}>
                  {i > 0 ? (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: RULE,
                        marginLeft: 14.5,
                        marginRight: 9.5,
                      }}
                    />
                  ) : null}
                  <PressableScale
                    scaleTo={0.99}
                    onPress={() => choose(option)}
                    style={{
                      height: 48,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingLeft: 14.5,
                      paddingRight: 13,
                      gap: 10,
                    }}
                  >
                    <UiText
                      color={selected ? brand[700] : LABEL_INK}
                      numberOfLines={1}
                      style={{
                        flex: 1,
                        fontSize: 15,
                        lineHeight: 19,
                        fontFamily: selected
                          ? fontFamilies.bold
                          : fontFamilies.semibold,
                      }}
                    >
                      {option}
                    </UiText>
                    {selected ? (
                      <Glyph name="check" size={16} color={brand[600]} />
                    ) : step < 3 ? (
                      <Glyph name="chevronRight" size={15} color={QUIET_INK} />
                    ) : null}
                  </PressableScale>
                </View>
              );
            })
          )}
        </AccountCard>
      </ScrollView>
    </View>
  );
}
