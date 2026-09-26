import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  UIManager,
  View,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { Glyph } from "../components/icons/Glyph";
import { LegalBody, LegalIntro } from "../components/LegalDoc";
import {
  AccountCard,
  AccountSection,
  LABEL_INK,
  QUIET_INK,
  RULE,
} from "../components/AccountMenu";
import { fontFamilies } from "../theme/typography";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, surface } from "../theme/colors";
import { faqEntries, type FaqEntry } from "../data/faq";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function Item({
  entry,
  open,
  onToggle,
}: {
  entry: FaqEntry;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <View>
      <PressableScale
        scaleTo={0.995}
        onPress={onToggle}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          minHeight: 56,
          paddingVertical: 12,
          paddingLeft: 14.5,
          paddingRight: 13,
        }}
      >
        <UiText
          color={LABEL_INK}
          style={{
            flex: 1,
            fontSize: 15,
            lineHeight: 20,
            fontFamily: fontFamilies.semibold,
          }}
        >
          {entry.question}
        </UiText>
        <Glyph
          name="chevronRight"
          rotate={open ? 270 : 90}
          size={14}
          color={QUIET_INK}
        />
      </PressableScale>

      {open ? (
        <View style={{ gap: 12, paddingHorizontal: 14.5, paddingBottom: 16 }}>
          {entry.answer.map((paragraph) => (
            <LegalBody key={paragraph}>{paragraph}</LegalBody>
          ))}

          {entry.imageLabel ? (
            <ImagePlaceholder
              label={entry.imageLabel}
              radius={12}
              iconSize={26}
              style={{ height: 180 }}
            />
          ) : null}

          {entry.href ? (
            <PressableScale
              onPress={() => router.push(entry.href as never)}
              hitSlop={8}
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <UiText
                color={brand[700]}
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  fontFamily: fontFamilies.bold,
                }}
              >
                {entry.linkLabel}
              </UiText>
              <Glyph name="chevronRight" size={12} color={brand[700]} />
            </PressableScale>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export default function FaqScreen() {
  // One answer open at a time, the first to start with.
  const [openId, setOpenId] = useState<string | null>(faqEntries[0].id);

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader tone="account" title="FAQ" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 13.5,
          paddingTop: 16,
          paddingBottom: 40,
        }}
      >
        <LegalIntro
          glyph="help"
          title="Ada yang bisa kami bantu?"
          subtitle="Jawaban untuk pertanyaan yang paling sering ditanyakan member."
        />

        <AccountSection title="Pertanyaan umum" />
        <AccountCard>
          {faqEntries.map((entry, i) => (
            <View key={entry.id}>
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
              <Item
                entry={entry}
                open={openId === entry.id}
                onToggle={() => toggle(entry.id)}
              />
            </View>
          ))}
        </AccountCard>
      </ScrollView>
    </View>
  );
}
