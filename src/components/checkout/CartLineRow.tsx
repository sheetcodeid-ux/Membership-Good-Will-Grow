import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { UiText } from "../ui/Text";
import { MenuArt } from "../MenuArt";
import { PressableScale } from "../ui/PressableScale";
import { Glyph } from "../icons/Glyph";
import { LABEL_INK, QUIET_INK } from "../AccountMenu";
import { OutlinePill, Stepper } from "./parts";
import { fontFamilies } from "../../theme/typography";
import { formatRupiah } from "../../utils/format";
import { selectionSummary, unitPrice } from "../../store/cartStore";
import type { CartLine } from "../../data/types";

/** "Original · Level 3 · Extra Shot": every single choice, then add-ons. */
export function lineChoices(line: CartLine) {
  const choices = line.menuItem.optionGroups
    .filter((g) => g.selection === "single")
    .flatMap((g) => g.options.filter((o) => (line.selections[o.id] ?? 0) > 0))
    .map((o) => o.name);
  // The variant is priced too, so the add-on list would repeat it.
  const extras = selectionSummary(line.menuItem, line.selections).filter(
    (x) => !choices.includes(x),
  );
  return [...(choices.length ? choices : ["Original"]), ...extras].join(" · ");
}

/**
 * One cart line, the same on Keranjang and Selesaikan Pesanan: name,
 * choices, the line's note, its price and photo; below, "Ubah" (back into
 * the product sheet) and the quantity. Taking the quantity to zero hands
 * the caller a 0, so it can ask before removing.
 */
export function CartLineRow({
  line,
  onQty,
  onNote,
}: {
  line: CartLine;
  onQty: (n: number) => void;
  /** Adds a note pill that opens the caller's note editor. */
  onNote?: () => void;
}) {
  const unit = unitPrice(line.menuItem, line.selections);
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <UiText
            color={LABEL_INK}
            numberOfLines={2}
            style={{
              fontSize: 16,
              lineHeight: 21,
              fontFamily: fontFamilies.bold,
            }}
          >
            {line.menuItem.name}
          </UiText>
          <UiText
            color={QUIET_INK}
            style={{
              marginTop: 4,
              fontSize: 13.5,
              lineHeight: 18,
              fontFamily: fontFamilies.medium,
            }}
          >
            {lineChoices(line)}
          </UiText>
          {line.note && !onNote ? (
            <UiText
              color={QUIET_INK}
              numberOfLines={2}
              style={{
                marginTop: 2,
                fontSize: 12.5,
                lineHeight: 17,
                fontFamily: fontFamilies.medium,
                fontStyle: "italic",
              }}
            >
              “{line.note}”
            </UiText>
          ) : null}
          <UiText
            color={LABEL_INK}
            style={{
              marginTop: 10,
              fontSize: 15,
              lineHeight: 19,
              fontFamily: fontFamilies.semibold,
            }}
          >
            {formatRupiah(unit * line.qty)}
          </UiText>
        </View>
        <MenuArt
          item={line.menuItem}
          radius={16}
          style={{ width: 88, height: 88 }}
        />
      </View>
      {onNote ? (
        <PressableScale
          onPress={onNote}
          scaleTo={0.99}
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            borderRadius: 18,
            backgroundColor: "#F2F3F5",
            paddingHorizontal: 14,
            paddingVertical: 9,
          }}
        >
          <UiText
            color={line.note ? LABEL_INK : "#6B7488"}
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: 13.5,
              lineHeight: 18,
              fontFamily: fontFamilies.medium,
              fontStyle: line.note ? "italic" : "normal",
            }}
          >
            {line.note ? `“${line.note}”` : "Tambah catatan untuk item ini"}
          </UiText>
          <Glyph name="pencil" size={12} color={QUIET_INK} />
        </PressableScale>
      ) : null}
      <View
        style={{
          marginTop: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <OutlinePill
          small
          icon="pencil"
          label="Ubah"
          onPress={() =>
            router.push(`/product/${line.menuItem.id}?lineId=${line.lineId}`)
          }
        />
        <Stepper qty={line.qty} onChange={onQty} />
      </View>
    </View>
  );
}
