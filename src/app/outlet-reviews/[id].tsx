import React, { useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../../components/ui/Text";
import { AppHeader } from "../../components/ui/AppHeader";
import { PressableScale } from "../../components/ui/PressableScale";
import { Glyph } from "../../components/icons/Glyph";
import { AccountEmpty } from "../../components/EmptyArt";
import { LABEL_INK, QUIET_INK, RULE } from "../../components/AccountMenu";
import {
  HelpfulButton,
  RatingPill,
  RatingSummary,
  ReviewQuoteCard,
  ReviewSheet,
} from "../../components/ReviewParts";
import { brand, surface } from "../../theme/colors";
import { fontFamilies } from "../../theme/typography";
import { outletFullName, outlets } from "../../data/mock";
import { outletStats, reviewsFor, type OutletReview } from "../../data/reviews";
import { useScrolled } from "../../hooks/useScrolled";
import { tapSelect } from "../../utils/haptics";

const EDGE = 16;

type Filter = "all" | 5 | 4 | 3;
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: 5, label: "5" },
  { key: 4, label: "4" },
  { key: 3, label: "3 ke bawah" },
];

function SectionTitle({ children }: { children: string }) {
  return (
    <UiText
      color={LABEL_INK}
      style={{
        paddingHorizontal: EDGE,
        fontSize: 18,
        lineHeight: 23,
        fontFamily: fontFamilies.extrabold,
      }}
    >
      {children}
    </UiText>
  );
}

/** One review in the full list: who, since when, their rating and words. */
function ReviewRow({ review, last }: { review: OutletReview; last: boolean }) {
  return (
    <View
      style={{
        paddingHorizontal: EDGE,
        paddingVertical: 18,
        borderBottomWidth: last ? 0 : 1,
        borderStyle: "dashed",
        borderBottomColor: "#D9DEE8",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            backgroundColor: brand[600],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UiText
            color="#FFFFFF"
            style={{
              fontSize: 17,
              lineHeight: 22,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            {review.initials}
          </UiText>
        </View>
        <View style={{ flex: 1 }}>
          <UiText
            color={LABEL_INK}
            numberOfLines={1}
            style={{
              fontSize: 15,
              lineHeight: 20,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            {review.name}
          </UiText>
          <UiText
            color={QUIET_INK}
            style={{
              fontSize: 12.5,
              lineHeight: 17,
              fontFamily: fontFamilies.medium,
            }}
          >
            Member sejak {review.memberSince}
          </UiText>
        </View>
        <RatingPill value={review.rating} />
      </View>

      <View
        style={{
          marginTop: 12,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: RULE,
          padding: 14,
          gap: 10,
        }}
      >
        <UiText
          color={LABEL_INK}
          style={{
            fontSize: 14.5,
            lineHeight: 21,
            fontFamily: fontFamilies.medium,
          }}
        >
          {review.text}
        </UiText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
          <Glyph name="receipt" size={14} color={QUIET_INK} />
          <UiText
            color={QUIET_INK}
            style={{
              flex: 1,
              fontSize: 13,
              lineHeight: 18,
              fontFamily: fontFamilies.medium,
            }}
          >
            {review.items}
          </UiText>
        </View>
      </View>
      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <UiText
          color={QUIET_INK}
          style={{
            flex: 1,
            fontSize: 12.5,
            lineHeight: 17,
            fontFamily: fontFamilies.medium,
          }}
        >
          Dibeli {review.date}
        </UiText>
        <HelpfulButton review={review} />
      </View>
    </View>
  );
}

/**
 * Every review of an outlet: the rating summary, a row of highlights,
 * then the whole list, filterable by stars.
 */
export default function OutletReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const scroll = useScrolled();
  const [filter, setFilter] = useState<Filter>("all");
  const [openReview, setOpenReview] = useState<OutletReview | undefined>();
  const outlet = outlets.find((o) => o.id === id);

  if (!outlet) {
    return (
      <View style={{ flex: 1, backgroundColor: surface }}>
        <StatusBar style="dark" />
        <AppHeader tone="account" title="Ulasan & rating" />
        <AccountEmpty
          glyph="store"
          title="Outlet tidak ditemukan"
          subtitle="Outlet ini mungkin sudah tidak beroperasi."
        />
      </View>
    );
  }

  const stats = outletStats(outlet.id);
  const all = reviewsFor(outlet.brandId);
  const highlights = all.filter((r) => r.rating >= 4);
  const shown = all.filter((r) =>
    filter === "all"
      ? true
      : filter === 3
        ? r.rating <= 3
        : Math.round(r.rating) === filter,
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />
      <AppHeader
        tone="account"
        title="Ulasan & rating"
        divider={scroll.scrolled}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scroll.onScroll}
        scrollEventThrottle={scroll.scrollEventThrottle}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={{ padding: EDGE }}>
          <UiText
            color={QUIET_INK}
            style={{
              marginBottom: 10,
              fontSize: 13.5,
              lineHeight: 18,
              fontFamily: fontFamilies.semibold,
            }}
          >
            {outletFullName(outlet)}
          </UiText>
          <RatingSummary
            rating={stats.rating}
            countLabel={stats.countLabel}
            latest={all}
            onPickLatest={setOpenReview}
          />
        </View>

        <View style={{ height: 8, backgroundColor: surface }} />

        {highlights.length ? (
          <View style={{ paddingTop: 20, paddingBottom: 8 }}>
            <SectionTitle>Kata mereka</SectionTitle>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 14 }}
              contentContainerStyle={{ paddingHorizontal: EDGE, gap: 12 }}
            >
              {highlights.map((r) => (
                <ReviewQuoteCard
                  key={r.id}
                  review={r}
                  width={Math.min(width * 0.62, 250)}
                  onPress={() => setOpenReview(r)}
                />
              ))}
            </ScrollView>
          </View>
        ) : null}

        <View style={{ height: 8, backgroundColor: surface, marginTop: 12 }} />

        <View style={{ paddingTop: 20 }}>
          <SectionTitle>Semua ulasan</SectionTitle>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 12 }}
            contentContainerStyle={{ paddingHorizontal: EDGE, gap: 8 }}
          >
            {FILTERS.map((f) => {
              const on = f.key === filter;
              return (
                <PressableScale
                  key={String(f.key)}
                  onPress={() => {
                    tapSelect();
                    setFilter(f.key);
                  }}
                  scaleTo={0.95}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    height: 34,
                    paddingHorizontal: 14,
                    borderRadius: 17,
                    borderWidth: on ? 1.5 : 1,
                    borderColor: on ? brand[600] : RULE,
                    backgroundColor: on ? brand[50] : "#FFFFFF",
                  }}
                >
                  {f.key !== "all" ? (
                    <Glyph name="star" size={14} color="#F2A516" />
                  ) : null}
                  <UiText
                    color={on ? brand[700] : LABEL_INK}
                    style={{
                      fontSize: 13.5,
                      lineHeight: 18,
                      fontFamily: on
                        ? fontFamilies.bold
                        : fontFamilies.semibold,
                    }}
                  >
                    {f.label}
                  </UiText>
                </PressableScale>
              );
            })}
          </ScrollView>

          {shown.length ? (
            shown.map((r, i) => (
              <ReviewRow key={r.id} review={r} last={i === shown.length - 1} />
            ))
          ) : (
            <View style={{ alignItems: "center", padding: 32, gap: 6 }}>
              <Glyph name="star" size={28} color="#DDE1EA" />
              <UiText
                color={QUIET_INK}
                center
                style={{
                  fontSize: 14,
                  lineHeight: 19,
                  fontFamily: fontFamilies.medium,
                }}
              >
                Belum ada ulasan dengan rating ini.
              </UiText>
            </View>
          )}
        </View>
      </ScrollView>

      {openReview ? (
        <ReviewSheet
          review={openReview}
          onClose={() => setOpenReview(undefined)}
        />
      ) : null}
    </View>
  );
}
