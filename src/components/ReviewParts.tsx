import React from "react";
import { ScrollView, View } from "react-native";
import { create } from "zustand";
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { Glyph } from "./icons/Glyph";
import { AccountSheet } from "./AccountSheet";
import { LABEL_INK, QUIET_INK, RULE } from "./AccountMenu";
import { PrimaryButton } from "./checkout/parts";
import { brand } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { tapSelect } from "../utils/haptics";
import type { OutletReview } from "../data/reviews";

const STAR = "#F2A516";
const STAR_OFF = "#DDE1EA";

/** Reviews the member marked as helpful, kept across the outlet pages. */
export const useHelpfulStore = create<{
  voted: Record<string, boolean>;
  toggle: (id: string) => void;
}>((set) => ({
  voted: {},
  toggle: (id) => set((s) => ({ voted: { ...s.voted, [id]: !s.voted[id] } })),
}));

export const rating1 = (n: number) => n.toFixed(1).replace(".", ",");

/** Five stars, the last one filled part-way for a fractional rating. */
export function Stars({ value, size = 22 }: { value: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: size * 0.3 }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <View key={i} style={{ width: size, height: size }}>
            <Glyph name="star" size={size} color={STAR_OFF} />
            {fill > 0 ? (
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: size * fill,
                  height: size,
                  overflow: "hidden",
                }}
              >
                <Glyph name="star" size={size} color={STAR} />
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

/** "★ 5,0" in a pill. */
export function RatingPill({
  value,
  onPress,
  active,
}: {
  value: number;
  onPress?: () => void;
  active?: boolean;
}) {
  const body = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        height: 36,
        paddingHorizontal: 13,
        borderRadius: 18,
        borderWidth: active ? 1.5 : 1,
        borderColor: active ? brand[600] : RULE,
        backgroundColor: active ? brand[50] : "#FFFFFF",
      }}
    >
      <Glyph name="star" size={16} color={STAR} />
      <UiText
        color={LABEL_INK}
        style={{
          fontSize: 15,
          lineHeight: 19,
          fontFamily: fontFamilies.extrabold,
        }}
      >
        {rating1(value)}
      </UiText>
    </View>
  );
  return onPress ? (
    <PressableScale onPress={onPress} scaleTo={0.95}>
      {body}
    </PressableScale>
  ) : (
    body
  );
}

/**
 * The rating block: the average large, how many ratings, five stars, and
 * the freshest ratings as a row of pills.
 */
export function RatingSummary({
  rating,
  countLabel,
  latest,
  onPickLatest,
}: {
  rating: number;
  countLabel: string;
  latest: OutletReview[];
  onPickLatest?: (r: OutletReview) => void;
}) {
  return (
    <View
      style={{
        borderRadius: 20,
        borderWidth: 1,
        borderColor: RULE,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          gap: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <UiText
              color={LABEL_INK}
              style={{
                fontSize: 26,
                lineHeight: 31,
                fontFamily: fontFamilies.extrabold,
              }}
            >
              {rating1(rating)}
            </UiText>
            <Glyph name="info" size={16} color={QUIET_INK} />
          </View>
          <UiText
            color={QUIET_INK}
            style={{
              fontSize: 13,
              lineHeight: 18,
              fontFamily: fontFamilies.medium,
            }}
          >
            {countLabel} rating
          </UiText>
        </View>
        <Stars value={rating} size={22} />
      </View>
      {latest.length ? (
        <View
          style={{
            backgroundColor: "#F6F7FA",
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <UiText
            color={QUIET_INK}
            style={{
              paddingLeft: 16,
              paddingRight: 10,
              fontSize: 13,
              lineHeight: 17,
              fontFamily: fontFamilies.medium,
            }}
          >
            Rating{"\n"}terbaru
          </UiText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingRight: 16 }}
          >
            {latest.map((r) => (
              <RatingPill
                key={r.id}
                value={r.rating}
                onPress={onPickLatest ? () => onPickLatest(r) : undefined}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

/** A quote card for the horizontal "Kata mereka" row, name under it. */
export function ReviewQuoteCard({
  review,
  width,
  onPress,
}: {
  review: OutletReview;
  width: number;
  onPress: () => void;
}) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.98} style={{ width }}>
      <View
        style={{
          height: 128,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: RULE,
          backgroundColor: "#FFFFFF",
          padding: 14,
          justifyContent: "space-between",
        }}
      >
        <UiText
          color={LABEL_INK}
          numberOfLines={3}
          style={{
            fontSize: 14,
            lineHeight: 20,
            fontFamily: fontFamilies.medium,
          }}
        >
          {review.text}
        </UiText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Glyph name="star" size={16} color={STAR} />
          <UiText
            color={LABEL_INK}
            style={{
              fontSize: 15,
              lineHeight: 19,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            {rating1(review.rating)}
          </UiText>
        </View>
      </View>
      {/* the card's tail, a small rounded nub under its left side */}
      <View
        style={{
          marginLeft: 22,
          marginTop: -7,
          width: 14,
          height: 14,
          borderRadius: 3,
          backgroundColor: "#FFFFFF",
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderColor: RULE,
          transform: [{ rotate: "45deg" }],
        }}
      />
      <UiText
        color={LABEL_INK}
        style={{
          marginTop: 6,
          fontSize: 14,
          lineHeight: 19,
          fontFamily: fontFamilies.bold,
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
        Dibeli {review.date}
      </UiText>
    </PressableScale>
  );
}

/** "Membantu?" and a thumbs-up, filled once the member has voted. */
export function HelpfulButton({
  review,
  compact,
}: {
  review: OutletReview;
  compact?: boolean;
}) {
  const voted = useHelpfulStore((s) => !!s.voted[review.id]);
  const toggle = useHelpfulStore((s) => s.toggle);
  const count = review.helpful + (voted ? 1 : 0);
  return (
    <PressableScale
      onPress={() => {
        tapSelect();
        toggle(review.id);
      }}
      scaleTo={0.94}
      accessibilityLabel="Ulasan ini membantu"
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        height: 36,
        paddingHorizontal: compact ? 11 : 14,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: voted ? brand[200] : RULE,
        backgroundColor: voted ? brand[50] : "#FFFFFF",
      }}
    >
      {compact ? null : (
        <UiText
          color={LABEL_INK}
          style={{
            fontSize: 13.5,
            lineHeight: 18,
            fontFamily: fontFamilies.bold,
          }}
        >
          {voted ? "Terima kasih!" : "Membantu?"}
        </UiText>
      )}
      <Glyph name="heart" size={16} color={voted ? brand[600] : QUIET_INK} />
      <UiText
        color={voted ? brand[700] : QUIET_INK}
        style={{
          fontSize: 13,
          lineHeight: 17,
          fontFamily: fontFamilies.bold,
        }}
      >
        {count}
      </UiText>
    </PressableScale>
  );
}

/** One review opened in full from the outlet page. */
export function ReviewSheet({
  review,
  onClose,
}: {
  review: OutletReview;
  onClose: () => void;
}) {
  return (
    <AccountSheet
      onClose={onClose}
      footer={<PrimaryButton label="Tutup" onPress={onClose} />}
    >
      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <View
          style={{
            borderRadius: 18,
            borderWidth: 1,
            borderColor: RULE,
            padding: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <UiText
              color={LABEL_INK}
              style={{
                flex: 1,
                fontSize: 16,
                lineHeight: 21,
                fontFamily: fontFamilies.extrabold,
              }}
            >
              Ulasan {review.name}
            </UiText>
            <RatingPill value={review.rating} />
          </View>
          {review.liked.length ? (
            <UiText
              color={QUIET_INK}
              style={{
                marginTop: 8,
                fontSize: 13,
                lineHeight: 18,
                fontFamily: fontFamilies.medium,
              }}
            >
              Suka: {review.liked.join(", ")}
            </UiText>
          ) : null}
          <View
            style={{
              marginVertical: 12,
              borderTopWidth: 1,
              borderStyle: "dashed",
              borderTopColor: "#D9DEE8",
            }}
          />
          <UiText
            color={LABEL_INK}
            style={{
              fontSize: 15,
              lineHeight: 22,
              fontFamily: fontFamilies.medium,
            }}
          >
            {review.text}
          </UiText>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
            }}
          >
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
          <View style={{ marginTop: 12, alignItems: "flex-end" }}>
            <HelpfulButton review={review} />
          </View>
        </View>
      </View>
    </AccountSheet>
  );
}
