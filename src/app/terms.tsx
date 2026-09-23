import React from "react";
import { ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { brand, ink, surface } from "../theme/colors";
import { memberTiers } from "../data/mock";
import { TERMS_UPDATED_AT, termsSections, type TermsSection } from "../data/terms";
import { formatRupiah } from "../utils/format";

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

function Rule() {
  return <View style={{ height: 1, backgroundColor: ink[200], marginVertical: 18 }} />;
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

/** Clause 7 is generated from the tier data so the two can never drift apart. */
function LevelingSection() {
  return (
    <View style={{ gap: 12 }}>
      <AppText variant="h3" color={brand[800]}>
        7. Ketentuan Leveling Membership
      </AppText>
      <Body>
        Good Will Grow memiliki {memberTiers.length} level membership, yaitu:{" "}
        {memberTiers.map((t) => t.name.toUpperCase()).join(", ")}.
      </Body>
      <Body>Setiap levelnya memiliki ketentuan dan benefit yang berbeda, yaitu :</Body>

      {memberTiers.map((tier) => (
        <View key={tier.id} style={{ gap: 10, marginTop: 6 }}>
          <AppText variant="bodySemibold" color={brand[800]}>
            {tier.name.toUpperCase()}
          </AppText>
          {tier.minTransactions === 0 ? (
            <Body>
              Level ini merupakan level default. Setiap member yang mendaftar akan berada di level
              ini.
            </Body>
          ) : (
            <>
              <Body>Untuk naik ke level ini, Anda harus memenuhi kriteria berikut :</Body>
              <Bullets
                items={[
                  `Melakukan ${tier.minTransactions}x transaksi`,
                  `Belanja minimal ${formatRupiah(tier.minSpend)}`,
                ]}
              />
            </>
          )}
          <Body>Benefit :</Body>
          <Bullets items={tier.perks} />
        </View>
      ))}
    </View>
  );
}

export default function TermsScreen() {
  const before = termsSections.slice(0, 6);
  const after = termsSections.slice(6);

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Syarat & Ketentuan" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
      >
        <AppText
          center
          color={brand[800]}
          style={{ fontSize: 26, lineHeight: 33, fontFamily: "Urbanist_800ExtraBold" }}
        >
          Terms & Conditions.
        </AppText>
        <AppText variant="body" color={brand[700]} center style={{ marginTop: 8 }}>
          Syarat dan Ketentuan Good Will Grow
        </AppText>
        <AppText variant="body" color={brand[700]} center>
          Pembaharuan Terakhir : {TERMS_UPDATED_AT}
        </AppText>

        <View style={{ height: 28 }} />

        {before.map((section, i) => (
          <View key={section.heading}>
            <Section section={section} />
            {i < before.length - 1 ? <Rule /> : null}
          </View>
        ))}

        <Rule />
        <LevelingSection />

        {after.map((section) => (
          <View key={section.heading}>
            <Rule />
            <Section section={section} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
