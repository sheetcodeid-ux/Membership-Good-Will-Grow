import React from "react";
import { View } from "react-native";
import { AccountSheet } from "./AccountSheet";
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { Glyph, type GlyphName } from "./icons/Glyph";
import { LABEL_INK, QUIET_INK } from "./AccountMenu";
import { brand, danger } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import type { ImageSource } from "../utils/pickImage";

function Row({
  glyph,
  title,
  subtitle,
  tone = "brand",
  onPress,
}: {
  glyph: GlyphName;
  title: string;
  subtitle: string;
  tone?: "brand" | "danger";
  onPress: () => void;
}) {
  const ink = tone === "danger" ? danger[500] : brand[700];
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.98}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingHorizontal: 20,
        paddingVertical: 12,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: tone === "danger" ? danger[50] : brand[50],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Glyph name={glyph} size={21} color={ink} />
      </View>
      <View style={{ flex: 1 }}>
        <UiText
          color={tone === "danger" ? danger[500] : LABEL_INK}
          style={{
            fontSize: 15.5,
            lineHeight: 20,
            fontFamily: fontFamilies.bold,
          }}
        >
          {title}
        </UiText>
        <UiText
          color={QUIET_INK}
          style={{
            fontSize: 12.5,
            lineHeight: 16,
            fontFamily: fontFamilies.medium,
          }}
        >
          {subtitle}
        </UiText>
      </View>
      <Glyph name="chevronRight" size={16} color={QUIET_INK} />
    </PressableScale>
  );
}

/**
 * Where a photo comes from: the camera or the gallery, and, when there is
 * one already, taking it off.
 */
export function PhotoSourceSheet({
  title = "Foto profil",
  onClose,
  onPick,
  onRemove,
}: {
  title?: string;
  onClose: () => void;
  onPick: (source: ImageSource) => void;
  /** Shown only when there is a photo to remove. */
  onRemove?: () => void;
}) {
  return (
    <AccountSheet title={title} onClose={onClose}>
      <View style={{ paddingTop: 4, paddingBottom: 12 }}>
        <Row
          glyph="camera"
          title="Ambil foto"
          subtitle="Buka kamera dan foto sekarang"
          onPress={() => onPick("camera")}
        />
        <Row
          glyph="images"
          title="Pilih dari galeri"
          subtitle="Pakai foto yang sudah ada di HP-mu"
          onPress={() => onPick("library")}
        />
        {onRemove ? (
          <Row
            glyph="trash"
            title="Hapus foto"
            subtitle="Kembali ke inisial nama"
            tone="danger"
            onPress={onRemove}
          />
        ) : null}
      </View>
    </AccountSheet>
  );
}
