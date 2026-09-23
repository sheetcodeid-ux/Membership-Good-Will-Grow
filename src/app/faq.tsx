import React, { useState } from "react";
import { LayoutAnimation, Platform, ScrollView, UIManager, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react-native";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { PressableScale } from "../components/ui/PressableScale";
import { brand, ink, surface } from "../theme/colors";
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
  const Chevron = open ? ChevronUp : ChevronDown;
  return (
    <View>
      <PressableScale
        scaleTo={0.995}
        onPress={onToggle}
        style={{ flexDirection: "row", gap: 14, paddingVertical: 17 }}
      >
        <AppText
          color={brand[800]}
          style={{
            flex: 1,
            fontSize: 15,
            lineHeight: 22,
            fontFamily: "Urbanist_600SemiBold",
          }}
        >
          {entry.question}
        </AppText>
        <Chevron size={19} color={brand[800]} strokeWidth={2.2} style={{ marginTop: 1 }} />
      </PressableScale>

      {open ? (
        <View style={{ gap: 14, paddingBottom: 20 }}>
          {entry.answer.map((paragraph) => (
            <AppText
              key={paragraph}
              color={ink[400]}
              style={{ fontSize: 14, lineHeight: 21 }}
            >
              {paragraph}
            </AppText>
          ))}

          {entry.imageLabel ? (
            <ImagePlaceholder
              label={entry.imageLabel}
              radius={12}
              iconSize={26}
              style={{ height: 190 }}
            />
          ) : null}

          {entry.href ? (
            <PressableScale
              onPress={() => router.push(entry.href as never)}
              hitSlop={8}
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <AppText variant="bodySemibold" color={brand[700]}>
                {entry.linkLabel}
              </AppText>
              <ChevronRight size={15} color={brand[700]} strokeWidth={2.4} />
            </PressableScale>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export default function FaqScreen() {
  // The reference keeps one answer open at a time.
  const [openId, setOpenId] = useState<string | null>(faqEntries[0].id);

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="FAQ" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 26, paddingBottom: 40 }}
      >
        <AppText
          center
          color={brand[800]}
          style={{ fontSize: 38, lineHeight: 46, fontFamily: "Urbanist_800ExtraBold" }}
        >
          FAQ.
        </AppText>
        <AppText center color={brand[700]} style={{ marginTop: 10, fontSize: 15, lineHeight: 22 }}>
          Frequently Asked Questions.
        </AppText>
        <AppText center color={brand[700]} style={{ fontSize: 15, lineHeight: 22 }}>
          Pertanyaan yang sering ditanyakan.
        </AppText>

        <View style={{ height: 28 }} />

        {faqEntries.map((entry, i) => (
          <View key={entry.id}>
            {i > 0 ? <View style={{ height: 1, backgroundColor: ink[200] }} /> : null}
            <Item
              entry={entry}
              open={openId === entry.id}
              onToggle={() => toggle(entry.id)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
