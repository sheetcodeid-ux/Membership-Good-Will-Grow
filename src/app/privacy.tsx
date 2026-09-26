import React from "react";
import { ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppHeader } from "../components/ui/AppHeader";
import {
  LegalBody,
  LegalBullets,
  LegalCard,
  LegalHeading,
  LegalIntro,
  updatedLabel,
} from "../components/LegalDoc";
import { surface } from "../theme/colors";
import { PRIVACY_UPDATED_AT, privacySections } from "../data/privacy";
import { useScrolled } from "../hooks/useScrolled";

export default function PrivacyScreen() {
  const scroll = useScrolled();
  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader
        tone="account"
        title="Kebijakan Privasi"
        divider={scroll.scrolled}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scroll.onScroll}
        scrollEventThrottle={scroll.scrollEventThrottle}
        contentContainerStyle={{
          paddingHorizontal: 13.5,
          paddingTop: 16,
          paddingBottom: 40,
        }}
      >
        <LegalIntro
          glyph="shield"
          title="Kebijakan Privasi Good Will Grow"
          subtitle={updatedLabel(PRIVACY_UPDATED_AT)}
        />
        <LegalCard>
          {privacySections.map((section) => (
            <View key={section.heading} style={{ gap: 10 }}>
              <LegalHeading>{section.heading}</LegalHeading>
              {section.paragraphs?.map((p) => (
                <LegalBody key={p}>{p}</LegalBody>
              ))}
              {section.bullets ? (
                <LegalBullets items={section.bullets} />
              ) : null}
              {section.footnotes?.map((p) => (
                <LegalBody key={p}>{p}</LegalBody>
              ))}
            </View>
          ))}
        </LegalCard>
      </ScrollView>
    </View>
  );
}
