import React from "react";
import { ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { brand, ink, surface } from "../theme/colors";
import { PRIVACY_UPDATED_AT, privacySections } from "../data/privacy";
import type { TermsSection } from "../data/terms";

const bodyStyle = { lineHeight: 21, textAlign: "justify" as const };

function Body({ children }: { children: React.ReactNode }) {
  return (
    <AppText variant="body" color={brand[800]} style={bodyStyle}>
      {children}
    </AppText>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <View style={{ gap: 7 }}>
      {items.map((item) => (
        <View key={item} style={{ flexDirection: "row", gap: 9, paddingLeft: 4 }}>
          <AppText variant="body" color={brand[800]}>
            •
          </AppText>
          <AppText variant="body" color={brand[800]} style={[bodyStyle, { flex: 1 }]}>
            {item}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function Section({ section }: { section: TermsSection }) {
  return (
    <View style={{ gap: 12 }}>
      <AppText variant="h3" color={brand[800]}>
        {section.heading}
      </AppText>
      {section.paragraphs?.map((p) => <Body key={p}>{p}</Body>)}
      {section.bullets ? <Bullets items={section.bullets} /> : null}
      {section.footnotes?.map((p) => <Body key={p}>{p}</Body>)}
    </View>
  );
}

export default function PrivacyScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Kebijakan Privasi" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
      >
        <AppText
          center
          color={brand[800]}
          style={{ fontSize: 26, lineHeight: 33, fontFamily: "Urbanist_800ExtraBold" }}
        >
          Privacy Policy.
        </AppText>
        <AppText variant="body" color={brand[700]} center style={{ marginTop: 8 }}>
          Kebijakan Privasi Good Will Grow
        </AppText>
        <AppText variant="body" color={brand[700]} center>
          Pembaharuan Terakhir : {PRIVACY_UPDATED_AT}
        </AppText>

        <View style={{ height: 28 }} />

        {privacySections.map((section, i) => (
          <View key={section.heading}>
            {i > 0 ? (
              <View style={{ height: 1, backgroundColor: ink[200], marginVertical: 18 }} />
            ) : null}
            <Section section={section} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
