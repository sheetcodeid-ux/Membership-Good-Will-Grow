import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { SlideInDown } from "react-native-reanimated";
import { ChefHat, ShoppingCart } from "lucide-react-native";
import { AppText } from "../../components/ui/AppText";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";
import { PressableScale } from "../../components/ui/PressableScale";
import { QuantityStepper } from "../../components/ui/QuantityStepper";
import { brand, ink, surface, warning } from "../../theme/colors";
import { shadow } from "../../theme/shadows";
import { formatRupiah } from "../../utils/format";
import { getMenuItem } from "../../data/mock";
import { defaultSelections, unitPrice, useCartStore } from "../../store/cartStore";
import type { MenuOption, MenuOptionGroup } from "../../data/types";

/** Hollow ring / filled dot used by every single-select row. */
function Radio({ selected }: { selected: boolean }) {
  return (
    <View
      style={{
        width: 19,
        height: 19,
        borderRadius: 10,
        borderWidth: 1.8,
        borderColor: selected ? brand[900] : ink[300],
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {selected ? (
        <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: brand[900] }} />
      ) : null}
    </View>
  );
}

function OptionCard({
  option,
  group,
  qty,
  onChange,
  leadingIcon,
}: {
  option: MenuOption;
  group: MenuOptionGroup;
  qty: number;
  onChange: (qty: number) => void;
  leadingIcon?: React.ReactNode;
}) {
  // A single-select group, or a multi-select option capped at one, is a toggle.
  const isToggle = group.selection === "single" || option.maxQty === 1;
  return (
    <Pressable
      onPress={() => (isToggle ? onChange(qty > 0 ? (group.selection === "single" ? 1 : 0) : 1) : undefined)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 13,
        height: 44,
        ...(shadow.xs as object),
      }}
    >
      {leadingIcon}
      <AppText variant="bodyMedium" numberOfLines={1} style={{ flex: 1 }}>
        {option.name}
      </AppText>
      <AppText variant="bodyMedium" color={ink[700]}>
        {formatRupiah(option.price)}
      </AppText>
      {isToggle ? (
        <Radio selected={qty > 0} />
      ) : (
        <QuantityStepper value={qty} onChange={onChange} size={24} max={option.maxQty ?? 10} />
      )}
    </Pressable>
  );
}

export default function ProductSheet() {
  const { id, lineId } = useLocalSearchParams<{ id: string; lineId?: string }>();
  const { height } = useWindowDimensions();
  const item = getMenuItem(id);

  const lines = useCartStore((s) => s.lines);
  const addLine = useCartStore((s) => s.addLine);
  const updateLine = useCartStore((s) => s.updateLine);

  // Opened from the cart's Edit button, the sheet starts from that line.
  const editing = useMemo(() => lines.find((l) => l.lineId === lineId), [lines, lineId]);

  const [selections, setSelections] = useState<Record<string, number>>(
    () => editing?.selections ?? (item ? defaultSelections(item.optionGroups) : {})
  );
  const [qty, setQty] = useState(editing?.qty ?? 1);

  if (!item) return null;

  const setOption = (group: MenuOptionGroup, option: MenuOption, next: number) => {
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
    if (editing) updateLine(editing.lineId, qty, selections, editing.note);
    else addLine(item, qty, selections);
    router.back();
  };

  const [variantGroup, ...restGroups] = item.optionGroups;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />

      <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(10,14,26,0.5)" }]} />
      </Pressable>

      <View style={{ flex: 1, justifyContent: "flex-end" }} pointerEvents="box-none">
        <Animated.View
          entering={SlideInDown.duration(300)}
          style={{
            height: height * 0.92,
            backgroundColor: surface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: "hidden",
          }}
        >
          <View style={{ alignItems: "center", paddingVertical: 8 }}>
            <View style={{ width: 38, height: 4, borderRadius: 2, backgroundColor: ink[200] }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <ImagePlaceholder
              label="Foto Produk"
              radius={0}
              iconSize={36}
              style={{ width: "100%", aspectRatio: 1 }}
            />

            <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 8 }}>
              <AppText variant="h3">{item.name}</AppText>

              {variantGroup ? (
                <View style={{ gap: 8 }}>
                  {variantGroup.options.map((option) => (
                    <OptionCard
                      key={option.id}
                      option={option}
                      group={variantGroup}
                      qty={selections[option.id] ?? 0}
                      onChange={(n) => setOption(variantGroup, option, n)}
                      leadingIcon={<ChefHat size={16} color={brand[700]} />}
                    />
                  ))}
                </View>
              ) : null}

              {restGroups.map((group) => (
                <View key={group.id} style={{ gap: 8, marginTop: 10 }}>
                  <AppText variant="bodySemibold">{group.name}</AppText>
                  {group.hint ? (
                    <View
                      style={{
                        alignSelf: "flex-start",
                        borderWidth: 1.2,
                        borderColor: warning[500],
                        borderRadius: 7,
                        paddingHorizontal: 9,
                        paddingVertical: 4,
                      }}
                    >
                      <AppText variant="micro" color={warning[600]}>
                        {group.hint}
                      </AppText>
                    </View>
                  ) : null}
                  {group.options.map((option) => (
                    <OptionCard
                      key={option.id}
                      option={option}
                      group={group}
                      qty={selections[option.id] ?? 0}
                      onChange={(n) => setOption(group, option, n)}
                    />
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>

          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              ...(shadow.lg as object),
            }}
          >
            <SafeAreaView edges={["bottom"]}>
              <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, gap: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <AppText variant="caption" color={ink[500]}>
                      Total
                    </AppText>
                    <AppText variant="h3" color={brand[800]}>
                      {formatRupiah(total)}
                    </AppText>
                  </View>
                  <QuantityStepper value={qty} onChange={setQty} min={1} size={30} />
                </View>

                <PressableScale
                  onPress={submit}
                  scaleTo={0.98}
                  style={{
                    height: 46,
                    borderRadius: 23,
                    backgroundColor: brand[900],
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <AppText variant="titleLg" color="#FFFFFF">
                    {editing ? "Simpan Perubahan" : "Tambah ke Keranjang"}
                  </AppText>
                  <ShoppingCart size={17} color="#FFFFFF" />
                </PressableScale>
              </View>
            </SafeAreaView>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
