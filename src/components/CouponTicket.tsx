import React from "react";
import { Image, View, type ImageSourcePropType } from "react-native";
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { Glyph } from "./icons/Glyph";
import { BrandLogo } from "./BrandLogo";
import { LABEL_INK, QUIET_INK, RULE, WARN_INK } from "./AccountMenu";
import { brand, success, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import type { Coupon } from "../data/types";

const NOTCH = 8;
/** List size, and the larger one that heads the detail sheet. */
const SIZES = {
  regular: { h: 112, art: 108, title: 15, line: 19, icon: 30, disc: 58 },
  large: { h: 136, art: 128, title: 17, line: 22, icon: 36, disc: 70 },
};

/**
 * A coupon as a paper ticket: the artwork on the stub, a perforation with
 * a notch bitten out at each end, the offer on the right.
 *
 * Until each coupon's own photo arrives the stub is plain white with a
 * soft coupon mark in the middle; the brand's logo always sits small in
 * its top corner, over the photo once there is one. `notchColor` is the
 * surface the ticket lies on, which shows through the notches.
 */
export function CouponTicket({
  coupon,
  onPress,
  onClose,
  image,
  notchColor = surface,
  size = "regular",
  price,
  fresh,
}: {
  coupon: Coupon;
  onPress?: () => void;
  /** Adds a round close button in the corner, for the detail sheet. */
  onClose?: () => void;
  image?: ImageSourcePropType;
  notchColor?: string;
  size?: keyof typeof SIZES;
  /**
   * For a coupon on sale: its price in points, shown in place of the
   * used/unused tag, and the validity read as "after purchase".
   */
  price?: number;
  /** Marks a coupon just bought with a small "Baru" tag. */
  fresh?: boolean;
}) {
  const urgent = price === undefined && coupon.daysLeft <= 1;
  const m = SIZES[size];
  const art = image ?? (coupon.image ? { uri: coupon.image } : undefined);
  const CARD_H = m.h;
  const ART_W = m.art;
  const body = (
    <View
      style={{
        height: CARD_H,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: RULE,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          width: ART_W,
          backgroundColor: "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {art ? (
          <Image
            source={art}
            resizeMode="cover"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
            }}
          />
        ) : (
          <View
            style={{
              width: m.disc,
              height: m.disc,
              borderRadius: m.disc / 2,
              backgroundColor: "#F2F5FC",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Glyph name="ticketPercent" size={m.icon} color="#B9C6E4" />
          </View>
        )}
        <View
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: RULE,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {coupon.brandId ? (
            <BrandLogo brandId={coupon.brandId} size={16} />
          ) : (
            // good at every brand: the shop mark in place of a logo
            <Glyph name="store" size={13} color={brand[600]} />
          )}
        </View>
        {fresh ? (
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 8,
              backgroundColor: "#E11D48",
              borderRadius: 8,
              paddingHorizontal: 6,
              paddingVertical: 1,
            }}
          >
            <UiText
              color="#FFFFFF"
              style={{
                fontSize: 10.5,
                lineHeight: 14,
                fontFamily: fontFamilies.extrabold,
              }}
            >
              Baru
            </UiText>
          </View>
        ) : null}
      </View>

      {/* perforation, with the surface showing through a notch at each end */}
      <View style={{ width: 0 }}>
        <View
          style={{
            position: "absolute",
            top: NOTCH + 4,
            bottom: NOTCH + 4,
            left: -0.75,
            borderLeftWidth: 1.5,
            borderStyle: "dashed",
            borderColor: "#D5D8DE",
          }}
        />
        {[-NOTCH - 1, CARD_H - NOTCH - 1].map((top) => (
          <View
            key={top}
            style={{
              position: "absolute",
              top,
              left: -NOTCH,
              width: NOTCH * 2,
              height: NOTCH * 2,
              borderRadius: NOTCH,
              backgroundColor: notchColor,
              borderWidth: 1,
              borderColor: RULE,
            }}
          />
        ))}
      </View>

      <View
        style={{
          flex: 1,
          paddingLeft: 14,
          paddingRight: 14,
          paddingTop: 12,
          paddingBottom: 12,
        }}
      >
        <UiText
          color={LABEL_INK}
          numberOfLines={2}
          style={{
            // room for the close button beside the title only
            marginRight: onClose ? 30 : 0,
            fontSize: m.title,
            lineHeight: m.line,
            fontFamily: fontFamilies.bold,
          }}
        >
          {coupon.title}
        </UiText>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Glyph name="clock" size={13} color={urgent ? WARN_INK : QUIET_INK} />
          <UiText
            color={urgent ? WARN_INK : QUIET_INK}
            style={{
              fontSize: 12,
              lineHeight: 16,
              fontFamily: fontFamilies.semibold,
            }}
          >
            {price !== undefined
              ? `Berlaku ${coupon.daysLeft} hari`
              : urgent
                ? `Sisa ${coupon.daysLeft} hari · segera habis`
                : `Sisa ${coupon.daysLeft} hari`}
          </UiText>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}
        >
          {price !== undefined ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                borderRadius: 6,
                paddingHorizontal: 7,
                paddingVertical: 2,
                backgroundColor: "#FFF3C4",
              }}
            >
              <Glyph name="coins" size={12} color="#702B00" />
              <UiText
                color="#702B00"
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: fontFamilies.extrabold,
                }}
              >
                {price.toLocaleString("id-ID")} poin
              </UiText>
            </View>
          ) : (
            <View
              style={{
                borderRadius: 6,
                paddingHorizontal: 7,
                paddingVertical: 2,
                backgroundColor: coupon.used ? "#F2F3F5" : success[50],
              }}
            >
              <UiText
                color={coupon.used ? QUIET_INK : success[600]}
                style={{
                  fontSize: 11.5,
                  lineHeight: 15,
                  fontFamily: fontFamilies.bold,
                }}
              >
                {coupon.used ? "Sudah dipakai" : "Belum dipakai"}
              </UiText>
            </View>
          )}
          <View style={{ flex: 1 }} />
          {onPress ? (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
            >
              <UiText
                color={QUIET_INK}
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                Detail
              </UiText>
              <Glyph name="chevronRight" size={11} color={QUIET_INK} />
            </View>
          ) : null}
        </View>
      </View>

      {onClose ? (
        <PressableScale
          onPress={onClose}
          hitSlop={10}
          scaleTo={0.9}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: "#F2F3F5",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Glyph name="close" size={12} color={QUIET_INK} />
        </PressableScale>
      ) : null}
    </View>
  );

  if (!onPress) return body;
  return (
    <PressableScale onPress={onPress} scaleTo={0.985}>
      {body}
    </PressableScale>
  );
}
