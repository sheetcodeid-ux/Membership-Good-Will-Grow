import React, { useState } from "react";
import { Linking, ScrollView, View, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { UiText } from "../../components/ui/Text";
import { AppHeader } from "../../components/ui/AppHeader";
import { PressableScale } from "../../components/ui/PressableScale";
import { Glyph } from "../../components/icons/Glyph";
import { BrandLogo } from "../../components/BrandLogo";
import { AccountEmpty } from "../../components/EmptyArt";
import { OutletInfoSheet } from "../../components/OutletInfoSheet";
import { LABEL_INK, QUIET_INK, RULE } from "../../components/AccountMenu";
import { GradientButton, LIFT } from "../../components/checkout/parts";
import { SERVICE_META } from "../../components/checkout/CheckoutSheets";
import {
  RatingSummary,
  ReviewQuoteCard,
  ReviewSheet,
} from "../../components/ReviewParts";
import { brand, danger, surface } from "../../theme/colors";
import { fontFamilies } from "../../theme/typography";
import {
  categories,
  menuItems,
  outletFullName,
  outlets,
} from "../../data/mock";
import { outletStats, reviewsFor, type OutletReview } from "../../data/reviews";
import { useOrderStore } from "../../store/orderStore";
import { formatDistance } from "../../utils/format";
import { tapPress } from "../../utils/haptics";

const EDGE = 16;

/** A small street map with the outlet's pin, drawn until maps are wired. */
function MiniMap() {
  return (
    <Svg width={104} height={84} viewBox="0 0 104 84">
      <Rect x={0} y={0} width={104} height={84} rx={14} fill="#EEF1F6" />
      <Rect x={62} y={46} width={34} height={30} rx={8} fill="#DDEFE0" />
      <Rect x={8} y={8} width={30} height={22} rx={6} fill="#E3E8F2" />
      <Path
        d="M-4 60 C 24 52, 46 46, 108 20"
        stroke="#FFFFFF"
        strokeWidth={9}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M38 -4 C 44 28, 50 56, 56 90"
        stroke="#FFFFFF"
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M-4 60 C 24 52, 46 46, 108 20"
        stroke="#D6DCE8"
        strokeWidth={1}
        strokeDasharray="4 4"
        fill="none"
      />
      <Circle cx={50} cy={34} r={13} fill="#E5484D" />
      <Circle
        cx={50}
        cy={34}
        r={13}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={2.5}
      />
      <Circle cx={50} cy={34} r={4.5} fill="#FFFFFF" />
      <Circle cx={50} cy={52} r={3} fill="#E5484D" opacity={0.35} />
    </Svg>
  );
}

/**
 * An outlet's page, the way a restaurant page reads: logo, name and what
 * it serves on top; then the outlet's details (address with a map to open,
 * distance, today's hours, services) and its ratings and reviews, with the
 * full list a tap away. Starting an order here stays at the bottom.
 */
export default function OutletScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const setOutlet = useOrderStore((s) => s.setOutlet);
  const reopenOutletSheet = useOrderStore((s) => s.reopenOutletSheet);
  const [hoursOpen, setHoursOpen] = useState(false);
  const [openReview, setOpenReview] = useState<OutletReview | undefined>();
  const outlet = outlets.find((o) => o.id === id);

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

  const stats = outletStats(outlet.id);
  const reviews = reviewsFor(outlet.brandId);
  const serves = categories
    .filter((c) =>
      menuItems.some(
        (m) => m.brandId === outlet.brandId && m.categoryId === c.id,
      ),
    )
    .map((c) => c.name)
    .join(", ");
  const closesAt = outlet.hours.split("-")[1]?.trim();
  const openMaps = () =>
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        outlet.addressFull,
      )}`,
    ).catch(() => {});
  const cardW = Math.min(width * 0.62, 250);

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* who they are */}
        <View
          style={{
            paddingTop: insets.top + 12,
            paddingHorizontal: EDGE,
            paddingBottom: 44,
            alignItems: "center",
          }}
        >
          <PressableScale
            onPress={() => router.back()}
            scaleTo={0.9}
            accessibilityLabel="Kembali"
            style={{
              position: "absolute",
              left: EDGE,
              top: insets.top + 12,
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              ...LIFT,
            }}
          >
            <Glyph name="arrowRight" rotate={180} size={20} color={LABEL_INK} />
          </PressableScale>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              ...LIFT,
            }}
          >
            <BrandLogo brandId={outlet.brandId} size={44} />
          </View>
          <UiText
            color={LABEL_INK}
            center
            style={{
              marginTop: 12,
              fontSize: 22,
              lineHeight: 28,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            {outletFullName(outlet)}
          </UiText>
          <UiText
            color={QUIET_INK}
            center
            style={{
              marginTop: 4,
              fontSize: 14,
              lineHeight: 19,
              fontFamily: fontFamilies.medium,
            }}
          >
            {serves}
          </UiText>
        </View>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: EDGE,
            paddingTop: 24,
            paddingBottom: 12,
            minHeight: 600,
          }}
        >
          <UiText
            color={LABEL_INK}
            style={{
              fontSize: 18,
              lineHeight: 23,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            Info outlet
          </UiText>
          <View
            style={{
              marginTop: 12,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: RULE,
              overflow: "hidden",
            }}
          >
            <View style={{ flexDirection: "row", gap: 12, padding: 16 }}>
              <View style={{ flex: 1 }}>
                <UiText
                  color={LABEL_INK}
                  style={{
                    fontSize: 14.5,
                    lineHeight: 21,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  {outlet.addressFull}
                </UiText>
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Glyph name="pin" size={15} color={LABEL_INK} />
                  <UiText
                    color={LABEL_INK}
                    style={{
                      fontSize: 14,
                      lineHeight: 19,
                      fontFamily: fontFamilies.bold,
                    }}
                  >
                    {formatDistance(outlet.distanceKm)} · siap{" "}
                    {stats.prepMinutes} menit
                  </UiText>
                </View>
              </View>
              <PressableScale
                onPress={openMaps}
                scaleTo={0.96}
                accessibilityLabel="Buka peta"
              >
                <MiniMap />
              </PressableScale>
            </View>
            <PressableScale
              onPress={() => setHoursOpen(true)}
              scaleTo={0.99}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderTopWidth: 1,
                borderTopColor: RULE,
              }}
            >
              <Glyph
                name="clock"
                size={17}
                color={outlet.isOpen ? LABEL_INK : danger[500]}
              />
              <UiText
                color={outlet.isOpen ? LABEL_INK : danger[500]}
                style={{
                  flex: 1,
                  fontSize: 14.5,
                  lineHeight: 19,
                  fontFamily: fontFamilies.bold,
                }}
              >
                {outlet.isOpen
                  ? `Buka sampai ${closesAt ?? outlet.hours} hari ini`
                  : `Tutup · buka pukul ${outlet.opensAt}`}
              </UiText>
              <Glyph name="chevronRight" size={15} color={QUIET_INK} />
            </PressableScale>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderTopWidth: 1,
                borderTopColor: RULE,
                flexWrap: "wrap",
              }}
            >
              <Glyph name="store" size={17} color={LABEL_INK} />
              {outlet.services.map((s) => (
                <View
                  key={s}
                  style={{
                    height: 28,
                    paddingHorizontal: 11,
                    borderRadius: 14,
                    backgroundColor: brand[50],
                    justifyContent: "center",
                  }}
                >
                  <UiText
                    color={brand[700]}
                    style={{
                      fontSize: 12.5,
                      lineHeight: 16,
                      fontFamily: fontFamilies.bold,
                    }}
                  >
                    {SERVICE_META[s].label}
                  </UiText>
                </View>
              ))}
            </View>
          </View>

          <UiText
            color={LABEL_INK}
            style={{
              marginTop: 26,
              fontSize: 18,
              lineHeight: 23,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            Ulasan & rating
          </UiText>
          <View style={{ marginTop: 12 }}>
            <RatingSummary
              rating={stats.rating}
              countLabel={stats.countLabel}
              latest={reviews}
              onPickLatest={setOpenReview}
            />
          </View>
          {reviews.length ? (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 16, marginHorizontal: -EDGE }}
                contentContainerStyle={{ paddingHorizontal: EDGE, gap: 12 }}
              >
                {reviews.map((r) => (
                  <ReviewQuoteCard
                    key={r.id}
                    review={r}
                    width={cardW}
                    onPress={() => setOpenReview(r)}
                  />
                ))}
              </ScrollView>
              <PressableScale
                onPress={() => router.push(`/outlet-reviews/${outlet.id}`)}
                scaleTo={0.98}
                style={{
                  marginTop: 18,
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 1.5,
                  borderColor: brand[600],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UiText
                  color={brand[700]}
                  style={{
                    fontSize: 16,
                    lineHeight: 20,
                    fontFamily: fontFamilies.extrabold,
                  }}
                >
                  Lihat semua ulasan
                </UiText>
              </PressableScale>
            </>
          ) : null}
        </View>
      </ScrollView>

      {outlet.appOrderAvailable ? (
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            ...LIFT,
            shadowOffset: { width: 0, height: -4 },
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: Math.max(insets.bottom, 12),
          }}
        >
          <GradientButton
            label="Pesan dari outlet ini"
            icon="cart"
            onPress={() => {
              tapPress();
              // Start the order here; the outlet sheet asks Dine In or
              // Take Away before the menu.
              const st = useOrderStore.getState();
              if (st.outletId === outlet.id && st.outletConfirmed) {
                // Already ordering here: straight back to the menu.
                router.navigate("/order");
                return;
              }
              setOutlet(outlet.id);
              reopenOutletSheet();
              router.push("/order");
            }}
          />
        </View>
      ) : null}

      {hoursOpen ? (
        <OutletInfoSheet outlet={outlet} onClose={() => setHoursOpen(false)} />
      ) : null}
      {openReview ? (
        <ReviewSheet
          review={openReview}
          onClose={() => setOpenReview(undefined)}
        />
      ) : null}
    </View>
  );
}
