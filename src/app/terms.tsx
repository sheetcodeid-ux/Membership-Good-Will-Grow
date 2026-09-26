import React from "react";
import { ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import {
  LegalBody,
  LegalBullets,
  LegalCard,
  LegalHeading,
  LegalIntro,
  updatedLabel,
} from "../components/LegalDoc";
import { LABEL_INK } from "../components/AccountMenu";
import { surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { memberTiers } from "../data/mock";
import {
  TERMS_UPDATED_AT,
  termsSections,
  type TermsSection,
} from "../data/terms";
import { formatRupiah } from "../utils/format";
import { useScrolled } from "../hooks/useScrolled";

function Section({ section }: { section: TermsSection }) {
  return (
    <View style={{ gap: 10 }}>
      <LegalHeading>{section.heading}</LegalHeading>
      {section.paragraphs?.map((p) => (
        <LegalBody key={p}>{p}</LegalBody>
      ))}
      {section.bullets ? <LegalBullets items={section.bullets} /> : null}
      {section.footnotes?.map((p) => (
        <LegalBody key={p}>{p}</LegalBody>
      ))}
    </View>
  );
}

/** Clause 7 is generated from the tier data so the two can never drift apart. */
function LevelingSection() {
  return (
    <View style={{ gap: 10 }}>
      <LegalHeading>7. Ketentuan Leveling Membership</LegalHeading>
      <LegalBody>
        Good Will Grow memiliki {memberTiers.length} level membership, yaitu:{" "}
        {memberTiers.map((t) => t.name.toUpperCase()).join(", ")}.
      </LegalBody>
      <LegalBody>
        Setiap level memiliki ketentuan dan benefit yang berbeda, yaitu:
      </LegalBody>

      {memberTiers.map((tier) => (
        <View key={tier.id} style={{ gap: 10, marginTop: 6 }}>
          <UiText
            color={LABEL_INK}
            style={{
              fontSize: 14,
              lineHeight: 19,
              fontFamily: fontFamilies.bold,
            }}
          >
            {tier.name.toUpperCase()}
          </UiText>
          {tier.minTransactions === 0 ? (
            <LegalBody>
              Level ini merupakan level default. Setiap member yang mendaftar
              akan berada di level ini.
            </LegalBody>
          ) : (
            <>
              <LegalBody>
                Untuk naik ke level ini, Anda harus memenuhi kriteria berikut:
              </LegalBody>
              <LegalBullets
                items={[
                  `Melakukan ${tier.minTransactions}x transaksi`,
                  `Belanja minimal ${formatRupiah(tier.minSpend)}`,
                ]}
              />
            </>
          )}
          <LegalBody>Benefit:</LegalBody>
          <LegalBullets items={tier.perks} />
        </View>
      ))}
    </View>
  );
}

export default function TermsScreen() {
  const scroll = useScrolled();
  const before = termsSections.slice(0, 6);
  const after = termsSections.slice(6);

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader
        tone="account"
        title="Syarat & Ketentuan"
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
          glyph="doc"
          title="Syarat dan Ketentuan Good Will Grow"
          subtitle={updatedLabel(TERMS_UPDATED_AT)}
        />
        <LegalCard>
          {before.map((section) => (
            <Section key={section.heading} section={section} />
          ))}
          <LevelingSection />
          {after.map((section) => (
            <Section key={section.heading} section={section} />
          ))}
        </LegalCard>
      </ScrollView>
    </View>
  );
}
