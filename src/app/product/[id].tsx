import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  Share,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { UiText } from "../../components/ui/Text";
import { MenuArt } from "../../components/MenuArt";
import { PressableScale } from "../../components/ui/PressableScale";
import { Glyph } from "../../components/icons/Glyph";
import { LABEL_INK, QUIET_INK, RULE } from "../../components/AccountMenu";
import {
  GradientButton,
  LIFT,
  Radio,
  Stepper,
} from "../../components/checkout/parts";
import { CountUp } from "../../components/ui/CountUp";
import { brand } from "../../theme/colors";
import { fontFamilies } from "../../theme/typography";
import { formatRupiah } from "../../utils/format";
import { tapSelect, tapSuccess } from "../../utils/haptics";
import { getMenuItem } from "../../data/mock";
import { showToast } from "../../store/toastStore";
import { useFavoriteStore } from "../../store/favoriteStore";
import {
  defaultSelections,
  unitPrice,
  useCartStore,
} from "../../store/cartStore";
import type { MenuOption, MenuOptionGroup } from "../../data/types";

/** The small tag beside a group's name: must pick one, or optional. */
function GroupTag({ group }: { group: MenuOptionGroup }) {
  const single = group.selection === "single";
  return (
    <View
      style={{
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: single ? "#EAF0FF" : "#FFF3C4",
      }}
    >
      <UiText
        color={single ? brand[700] : "#7A4B00"}
        style={{
          fontSize: 11.5,
          lineHeight: 15,
          fontFamily: fontFamilies.bold,
        }}
      >
        {single ? "Wajib, pilih 1" : (group.hint ?? "Opsional")}
      </UiText>
    </View>
  );
}

/** One option: a toggle row (radio) or a counter row for add-ons. */
function OptionRow({
  option,
  group,
  qty,
  first,
  onChange,
}: {
  option: MenuOption;
  group: MenuOptionGroup;
  qty: number;
  first: boolean;
  onChange: (qty: number) => void;
}) {
  const single = group.selection === "single";
  const toggle = single || option.maxQty === 1;
  const on = qty > 0;
  const body = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        minHeight: 54,
        paddingHorizontal: 14,
        borderTopWidth: first ? 0 : 1,
        borderTopColor: RULE,
        backgroundColor: on && toggle ? "#F3F7FF" : "#FFFFFF",
      }}
    >
      <View style={{ flex: 1 }}>
        <UiText
          color={LABEL_INK}
          numberOfLines={1}
          style={{
            fontSize: 15,
            lineHeight: 20,
            fontFamily: on ? fontFamilies.bold : fontFamilies.medium,
          }}
        >
          {option.name}
        </UiText>
      </View>
      <UiText
        color={QUIET_INK}
        style={{
          fontSize: 14,
          lineHeight: 18,
          fontFamily: fontFamilies.semibold,
        }}
      >
        {single
          ? formatRupiah(option.price)
          : option.price > 0
            ? `+${formatRupiah(option.price)}`
            : "Gratis"}
      </UiText>
      {toggle ? (
        <Radio on={on} />
      ) : (
        <Stepper
          qty={qty}
          onChange={onChange}
          min={0}
          max={option.maxQty ?? 10}
          size={28}
        />
      )}
    </View>
  );
  if (!toggle) return body;
  return (
    <PressableScale
      scaleTo={0.99}
      onPress={() => {
        tapSelect();
        onChange(single ? 1 : on ? 0 : 1);
      }}
    >
      {body}
    </PressableScale>
  );
}

/**
 * Detail Produk, as a sheet over Daftar Menu: the photo, name and story,
 * each option group in its own bordered card (the variant must be picked,
 * add-ons are optional), a note for the kitchen, then the quantity and
 * the button with the running price. From Keranjang's "Ubah" it opens on
 * that line and saves back into it.
 */
export default function ProductSheet() {
  const { id, lineId } = useLocalSearchParams<{
    id: string;
    lineId?: string;
  }>();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const item = getMenuItem(id);

  const lines = useCartStore((s) => s.lines);
  const addLine = useCartStore((s) => s.addLine);
  const updateLine = useCartStore((s) => s.updateLine);
  const saved = useFavoriteStore((s) => s.ids.includes(id));
  const toggleSaved = useFavoriteStore((s) => s.toggle);

  const editing = useMemo(
    () => lines.find((l) => l.lineId === lineId),
    [lines, lineId],
  );

  const [selections, setSelections] = useState<Record<string, number>>(
    () =>
      editing?.selections ?? (item ? defaultSelections(item.optionGroups) : {}),
  );
  const [qty, setQty] = useState(editing?.qty ?? 1);
  const [note, setNote] = useState(editing?.note ?? "");

  if (!item) return null;

  const setOption = (
    group: MenuOptionGroup,
    option: MenuOption,
    next: number,
  ) => {
    setSelections((prev) => {
      const draft = { ...prev };
      if (group.selection === "single") {
        for (const o of group.options) delete draft[o.id];
        draft[option.id] = 1;
      } else if (next <= 0) {
        delete draft[option.id];
      } else {
        draft[option.id] = next;
      }
      return draft;
    });
  };

  const total = unitPrice(item, selections) * qty;

  const submit = () => {
    tapSuccess();
    const trimmed = note.trim() || undefined;
    if (editing) {
      updateLine(editing.lineId, qty, selections, trimmed);
      showToast("Pesanan diperbarui");
    } else {
      addLine(item, qty, selections, trimmed);
      showToast(`${item.name} masuk keranjang`);
    }
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />

      <Animated.View
        entering={FadeIn.duration(200)}
        style={StyleSheet.absoluteFill}
      >
        <Pressable
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(10,14,26,0.5)" },
          ]}
          onPress={() => router.back()}
        />
      </Animated.View>

      <View
        style={{ flex: 1, justifyContent: "flex-end" }}
        pointerEvents="box-none"
      >
        <Animated.View
          entering={SlideInDown.duration(300)}
          style={{
            height: height * 0.92,
            backgroundColor: "#F3F4F9",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: "hidden",
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <View>
              <MenuArt
                item={item}
                big
                radius={0}
                style={{ width: "100%", aspectRatio: 4 / 3 }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 10,
                  left: 0,
                  right: 0,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.85)",
                  }}
                />
              </View>
              <PressableScale
                onPress={() => router.back()}
                hitSlop={8}
                scaleTo={0.9}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 14,
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: "#FFFFFF",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Glyph name="close" size={13} color={QUIET_INK} />
              </PressableScale>
            </View>

            <View
              style={{
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: RULE,
              }}
            >
              {item.isBestSeller ? (
                <View
                  style={{
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 6,
                    borderRadius: 10,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    backgroundColor: "#FFF3C4",
                  }}
                >
                  <Glyph name="star" size={11} color="#A36A00" />
                  <UiText
                    color="#7A4B00"
                    style={{
                      fontSize: 11.5,
                      lineHeight: 15,
                      fontFamily: fontFamilies.bold,
                    }}
                  >
                    Terlaris
                  </UiText>
                </View>
              ) : null}
              <UiText
                color={LABEL_INK}
                style={{
                  fontSize: 22,
                  lineHeight: 28,
                  fontFamily: fontFamilies.extrabold,
                }}
              >
                {item.name}
              </UiText>
              {item.description ? (
                <UiText
                  color={QUIET_INK}
                  style={{
                    marginTop: 4,
                    fontSize: 14,
                    lineHeight: 20,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  {item.description}
                </UiText>
              ) : null}
              <UiText
                color={LABEL_INK}
                style={{
                  marginTop: 8,
                  fontSize: 16,
                  lineHeight: 21,
                  fontFamily: fontFamilies.bold,
                }}
              >
                Mulai {formatRupiah(item.price)}
              </UiText>
              <View style={{ marginTop: 12, flexDirection: "row", gap: 8 }}>
                {[
                  {
                    glyph: "heart" as const,
                    label: saved ? "Tersimpan" : "Simpan",
                    on: saved,
                    onPress: () => {
                      tapSelect();
                      toggleSaved(item.id);
                      showToast(
                        saved
                          ? `${item.name} dihapus dari Favoritmu`
                          : `${item.name} masuk Favoritmu`,
                      );
                    },
                  },
                  {
                    glyph: "share" as const,
                    label: "Bagikan",
                    on: false,
                    onPress: () => {
                      Share.share({
                        message: `${item.name} (${formatRupiah(item.price)}) bisa kamu pesan di aplikasi Good Will Grow.`,
                      }).catch(() => {});
                    },
                  },
                ].map((b) => (
                  <PressableScale
                    key={b.label}
                    onPress={b.onPress}
                    scaleTo={0.95}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      height: 36,
                      paddingHorizontal: 13,
                      borderRadius: 18,
                      borderWidth: 1,
                      borderColor: b.on ? brand[200] : RULE,
                      backgroundColor: b.on ? brand[50] : "#FFFFFF",
                    }}
                  >
                    <Glyph
                      name={b.glyph}
                      size={16}
                      color={b.on ? brand[600] : LABEL_INK}
                    />
                    <UiText
                      color={b.on ? brand[700] : LABEL_INK}
                      style={{
                        fontSize: 13.5,
                        lineHeight: 18,
                        fontFamily: fontFamilies.bold,
                      }}
                    >
                      {b.label}
                    </UiText>
                  </PressableScale>
                ))}
              </View>
            </View>

            <View style={{ paddingHorizontal: 13.5, paddingTop: 6, gap: 4 }}>
              {item.optionGroups.map((group) => (
                <View key={group.id}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 16,
                      marginBottom: 8,
                      marginLeft: 2,
                    }}
                  >
                    <UiText
                      color={LABEL_INK}
                      style={{
                        fontSize: 16,
                        lineHeight: 21,
                        fontFamily: fontFamilies.extrabold,
                      }}
                    >
                      {group.name}
                    </UiText>
                    <GroupTag group={group} />
                  </View>
                  <View
                    style={{
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: RULE,
                      overflow: "hidden",
                    }}
                  >
                    {group.options.map((option, i) => (
                      <OptionRow
                        key={option.id}
                        option={option}
                        group={group}
                        first={i === 0}
                        qty={selections[option.id] ?? 0}
                        onChange={(n) => setOption(group, option, n)}
                      />
                    ))}
                  </View>
                </View>
              ))}

              <UiText
                color={LABEL_INK}
                style={{
                  marginTop: 16,
                  marginBottom: 8,
                  marginLeft: 2,
                  fontSize: 16,
                  lineHeight: 21,
                  fontFamily: fontFamilies.extrabold,
                }}
              >
                Catatan
              </UiText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  minHeight: 50,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: RULE,
                  backgroundColor: "#FFFFFF",
                  paddingHorizontal: 14,
                }}
              >
                <Glyph name="pencil" size={13} color={QUIET_INK} />
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  maxLength={120}
                  placeholder="Opsional, mis. tanpa bawang, es sedikit"
                  placeholderTextColor="#8A93A6"
                  style={[
                    {
                      flex: 1,
                      minWidth: 0,
                      paddingVertical: 12,
                      fontFamily: fontFamilies.medium,
                      fontSize: 14.5,
                      color: LABEL_INK,
                    },
                    Platform.OS === "web"
                      ? ({ outlineStyle: "none" } as object)
                      : null,
                  ]}
                />
              </View>
            </View>
          </ScrollView>

          <View
            style={{
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: Math.max(insets.bottom, 12),
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              ...LIFT,
              shadowOffset: { width: 0, height: -4 },
            }}
          >
            <Stepper qty={qty} onChange={setQty} min={1} size={34} filledPlus />
            <GradientButton
              flex={1}
              label={editing ? "Simpan" : "Tambah"}
              onPress={submit}
              chip={
                <CountUp
                  value={total}
                  format={formatRupiah}
                  color="#FFFFFF"
                  duration={350}
                  style={{
                    fontSize: 15,
                    lineHeight: 19,
                    fontFamily: fontFamilies.extrabold,
                  }}
                />
              }
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
