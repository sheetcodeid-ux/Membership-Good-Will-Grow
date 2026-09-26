import React from "react";
import { ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UiText } from "../../components/ui/Text";
import { AppHeader } from "../../components/ui/AppHeader";
import { PressableScale } from "../../components/ui/PressableScale";
import { Glyph, type GlyphName } from "../../components/icons/Glyph";
import { BrandLogo } from "../../components/BrandLogo";
import { AccountEmpty } from "../../components/EmptyArt";
import { LABEL_INK, QUIET_INK, RULE } from "../../components/AccountMenu";
import { Block, EDGE } from "../../components/checkout/parts";
import { SERVICE_META } from "../../components/checkout/CheckoutSheets";
import { brand, danger, success, surface } from "../../theme/colors";
import { fontFamilies } from "../../theme/typography";
import { outlets, brands } from "../../data/mock";
import { useOrderStore } from "../../store/orderStore";
import { useScrolled } from "../../hooks/useScrolled";
import { tapPress } from "../../utils/haptics";

function Row({
  glyph,
  text,
  last,
}: {
  glyph: GlyphName;
  text: string;
  last?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        paddingVertical: 13,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: RULE,
      }}
    >
      <Glyph name={glyph} size={17} color={brand[600]} />
      <UiText
        color={LABEL_INK}
        style={{
          flex: 1,
          fontSize: 14.5,
          lineHeight: 20,
          fontFamily: fontFamilies.medium,
        }}
      >
        {text}
      </UiText>
    </View>
  );
}

/**
 * The outlet behind a check-in: who it is, whether it is open, where and
 * when, what it serves, and a way to start an order there.
 */
export default function OutletScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const scroll = useScrolled();
  const setOutlet = useOrderStore((s) => s.setOutlet);
  const reopenOutletSheet = useOrderStore((s) => s.reopenOutletSheet);
  const outlet = outlets.find((o) => o.id === id);
  const brandName = brands.find((b) => b.id === outlet?.brandId)?.name ?? "";

  if (!outlet) {
    return (
      <View style={{ flex: 1, backgroundColor: surface }}>
        <StatusBar style="dark" />
        <AppHeader tone="account" title="Outlet" />
        <AccountEmpty
          glyph="store"
          title="Outlet tidak ditemukan"
          subtitle="Outlet ini mungkin sudah tidak beroperasi."
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader tone="account" title={outlet.name} divider={scroll.scrolled} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scroll.onScroll}
        scrollEventThrottle={scroll.scrollEventThrottle}
        contentContainerStyle={{ padding: EDGE, paddingBottom: 28, gap: 12 }}
      >
        <Block style={{ padding: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: RULE,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BrandLogo brandId={outlet.brandId} size={44} />
            </View>
            <View style={{ flex: 1 }}>
              <UiText
                color={LABEL_INK}
                numberOfLines={1}
                style={{
                  fontSize: 19,
                  lineHeight: 24,
                  fontFamily: fontFamilies.extrabold,
                }}
              >
                {outlet.name}
              </UiText>
              <UiText
                color={QUIET_INK}
                style={{
                  fontSize: 13.5,
                  lineHeight: 18,
                  fontFamily: fontFamilies.medium,
                }}
              >
                {brandName} · {outlet.city}
              </UiText>
              <View
                style={{
                  marginTop: 6,
                  alignSelf: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 10,
                  paddingHorizontal: 9,
                  paddingVertical: 3,
                  backgroundColor: outlet.isOpen ? success[50] : "#FDECEE",
                }}
              >
                <View
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: outlet.isOpen ? success[500] : danger[500],
                  }}
                />
                <UiText
                  color={outlet.isOpen ? success[600] : danger[500]}
                  style={{
                    fontSize: 12.5,
                    lineHeight: 16,
                    fontFamily: fontFamilies.bold,
                  }}
                >
                  {outlet.isOpen
                    ? `Buka · ${outlet.hours}`
                    : `Tutup · buka ${outlet.opensAt}`}
                </UiText>
              </View>
            </View>
          </View>
        </Block>

        <Block style={{ paddingHorizontal: 16 }}>
          <Row glyph="pin" text={outlet.addressFull} />
          <Row glyph="clock" text={`Setiap hari ${outlet.hours}`} />
          <Row
            glyph="store"
            text={outlet.services.map((s) => SERVICE_META[s].label).join(" · ")}
            last
          />
        </Block>
      </ScrollView>

      {outlet.appOrderAvailable ? (
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: RULE,
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: Math.max(insets.bottom, 12),
          }}
        >
          <PressableScale
            onPress={() => {
              tapPress();
              // Start the order here; the outlet sheet asks Dine In or
              // Take Away before the menu.
              setOutlet(outlet.id);
              reopenOutletSheet();
              router.push("/order");
            }}
            scaleTo={0.97}
            style={{
              height: 52,
              borderRadius: 26,
              backgroundColor: brand[600],
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Glyph name="cart" size={17} color="#FFFFFF" />
            <UiText
              color="#FFFFFF"
              style={{
                fontSize: 16.5,
                lineHeight: 21,
                fontFamily: fontFamilies.bold,
              }}
            >
              Pesan dari outlet ini
            </UiText>
          </PressableScale>
        </View>
      ) : null}
    </View>
  );
}
