import React from "react";
import { View } from "react-native";
import { UiText } from "./ui/Text";
import { type GlyphName } from "./icons/Glyph";
import { EmptyArt } from "./EmptyArt";
import { LABEL_INK, QUIET_INK, RULE } from "./AccountMenu";
import { fontFamilies } from "../theme/typography";

/** Body copy of the account's long-form pages: left-aligned, never justified. */
const BODY = {
  fontSize: 14,
  lineHeight: 21,
  fontFamily: fontFamilies.regular,
} as const;
const BODY_INK = "#3A3D45";

/**
 * Opening card of a document page, in the reward card's cream: what the
 * page is, when it last changed, and the page's glyph as clay art.
 */
export function LegalIntro({
  glyph,
  title,
  subtitle,
}: {
  glyph: GlyphName;
  title: string;
  subtitle: string;
}) {
  return (
    <View
      style={{
        backgroundColor: "#FFF8E8",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E7E7E7",
        overflow: "hidden",
        minHeight: 98,
        paddingLeft: 14,
        paddingRight: 104,
        paddingVertical: 16,
        justifyContent: "center",
      }}
    >
      <View style={{ position: "absolute", right: -2, top: -6 }}>
        <EmptyArt glyph={glyph} size={108} />
      </View>
      <UiText
        color={LABEL_INK}
        style={{
          fontSize: 17,
          lineHeight: 22,
          fontFamily: fontFamilies.extrabold,
        }}
      >
        {title}
      </UiText>
      <UiText
        color={QUIET_INK}
        style={{
          marginTop: 4,
          fontSize: 12.5,
          lineHeight: 17,
          fontFamily: fontFamilies.medium,
        }}
      >
        {subtitle}
      </UiText>
    </View>
  );
}

export function LegalBody({ children }: { children: React.ReactNode }) {
  return (
    <UiText color={BODY_INK} style={BODY}>
      {children}
    </UiText>
  );
}

export function LegalBullets({ items }: { items: string[] }) {
  return (
    <View style={{ gap: 7 }}>
      {items.map((item) => (
        <View key={item} style={{ flexDirection: "row", gap: 10 }}>
          <View
            style={{
              marginTop: 8,
              width: 5,
              height: 5,
              borderRadius: 2.5,
              backgroundColor: "#A0A4AE",
            }}
          />
          <UiText color={BODY_INK} style={[BODY, { flex: 1 }]}>
            {item}
          </UiText>
        </View>
      ))}
    </View>
  );
}

export function LegalHeading({ children }: { children: React.ReactNode }) {
  return (
    <UiText
      color={LABEL_INK}
      style={{ fontSize: 16, lineHeight: 21, fontFamily: fontFamilies.bold }}
    >
      {children}
    </UiText>
  );
}

/** The document itself: one white card, sections parted by hairlines. */
export function LegalCard({ children }: { children: React.ReactNode }) {
  const parts = React.Children.toArray(children);
  return (
    <View
      style={{
        marginTop: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: RULE,
        paddingHorizontal: 16,
        paddingVertical: 18,
      }}
    >
      {parts.map((part, i) => (
        <View key={i}>
          {i > 0 ? (
            <View
              style={{ height: 1, backgroundColor: RULE, marginVertical: 18 }}
            />
          ) : null}
          {part}
        </View>
      ))}
    </View>
  );
}

/** The line under a document's title saying when it last changed. */
export function updatedLabel(date: string) {
  return `Terakhir diperbarui ${date}`;
}
