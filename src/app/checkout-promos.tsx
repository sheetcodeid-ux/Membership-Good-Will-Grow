import React from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { ACCOUNT_BAR, AppHeader } from "../components/ui/AppHeader";
import { useScrolled } from "../hooks/useScrolled";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { UiText } from "../components/ui/Text";
import { PressableScale } from "../components/ui/PressableScale";
import { Glyph } from "../components/icons/Glyph";
import { BrandLogo } from "../components/BrandLogo";
import {
  LABEL_INK,
  QUIET_INK,
  RULE,
  WARN_INK,
} from "../components/AccountMenu";
import { brand, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { getBrand } from "../data/mock";
import type { Coupon } from "../data/types";
import { useCartStore } from "../store/cartStore";
import { showToast } from "../store/toastStore";
import { isVoucher, useCheckout } from "../hooks/useCheckout";
import { untilEndOfDay, useNow } from "../hooks/useNow";
import { checkCoupon, type CouponCheck } from "../utils/coupons";
import { formatRupiah } from "../utils/format";
import { tapPress, tapSuccess } from "../utils/haptics";

const EDGE = 13.5;
const NOTCH = 9;
const SAVE_INK = "#0F8A3C";
const TIMER = "#C2410C";

/** "Rp 40rb", the short form promo cards use for thresholds. */
function short(n: number) {
  return n >= 1000 && n % 1000 === 0
    ? `Rp ${(n / 1000).toLocaleString("id-ID")}rb`
    : formatRupiah(n);
}

/** What a coupon gives at most, for coupons that do not apply yet. */
function upTo(c: Coupon) {
  const r = c.rule?.reward;
  if (!r) return c.detail?.benefits[0] ?? c.title;
  if (r.kind === "amount") return `Hemat ${short(r.value)}`;
  if (r.kind === "percent")
    return `Diskon ${r.value}%${r.max ? ` s.d. ${short(r.max)}` : ""}`;
  if (r.kind === "price") return `Harga spesial ${short(r.value)}`;
  return "Gratis 1 item";
}

/** The small tag over the card's top edge: whose promo it is. */
function tagOf(c: Coupon) {
  if (isVoucher(c)) return "VOUCHER";
  const b = getBrand(c.brandId);
  return b ? b.shortName.toUpperCase() : "SEMUA BRAND";
}

/**
 * One promo as a ticket: a tag over the top edge, the offer and its
 * threshold with the action on the right, a perforation with a notch at
 * each end, then what it saves and how long it has left.
 */
function PromoTicket({
  coupon,
  check,
  applied,
  now,
  onApply,
  onRemove,
}: {
  coupon: Coupon;
  check: CouponCheck;
  applied: boolean;
  now: number;
  onApply: () => void;
  onRemove: () => void;
}) {
  const ok = check.ok;
  const min = coupon.rule?.minSpend;
  return (
    <View style={{ paddingTop: 12 }}>
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 18,
          borderWidth: applied ? 1.5 : 1,
          borderColor: applied ? brand[400] : RULE,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingLeft: 14,
            paddingRight: 14,
            paddingTop: 22,
            paddingBottom: 14,
            opacity: ok || applied ? 1 : 0.6,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#F2F5FC",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {coupon.brandId ? (
              <BrandLogo brandId={coupon.brandId} size={28} />
            ) : (
              <Glyph name="ticketPercent" size={22} color={brand[600]} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <UiText
              color={LABEL_INK}
              numberOfLines={2}
              style={{
                fontSize: 16,
                lineHeight: 21,
                fontFamily: fontFamilies.bold,
              }}
            >
              {coupon.title}
            </UiText>
            <UiText
              color="#8A93A6"
              numberOfLines={1}
              style={{
                marginTop: 2,
                fontSize: 13,
                lineHeight: 17,
                fontFamily: fontFamilies.medium,
              }}
            >
              {/* for one that does not apply yet, what it would give;
                  then the threshold or the item it needs */}
              {[
                ok ? undefined : upTo(coupon),
                min
                  ? `Min. belanja ${short(min)}`
                  : coupon.detail?.requirements[0]?.[0],
              ]
                .filter(Boolean)
                .join(" · ")}
            </UiText>
          </View>
          {applied ? (
            <PressableScale
              onPress={onRemove}
              scaleTo={0.95}
              style={{
                height: 40,
                paddingHorizontal: 18,
                borderRadius: 20,
                backgroundColor: "#FDECEE",
                justifyContent: "center",
              }}
            >
              <UiText
                color="#C8102E"
                style={{
                  fontSize: 15,
                  lineHeight: 19,
                  fontFamily: fontFamilies.bold,
                }}
              >
                Lepas
              </UiText>
            </PressableScale>
          ) : (
            <PressableScale
              onPress={onApply}
              disabled={!ok}
              scaleTo={0.95}
              style={{
                height: 40,
                paddingHorizontal: 20,
                borderRadius: 20,
                backgroundColor: ok ? brand[600] : "#E4E7EC",
                justifyContent: "center",
              }}
            >
              <UiText
                color={ok ? "#FFFFFF" : "#8A93A6"}
                style={{
                  fontSize: 15,
                  lineHeight: 19,
                  fontFamily: fontFamilies.bold,
                }}
              >
                Pakai
              </UiText>
            </PressableScale>
          )}
        </View>

        {/* perforation, with the page showing through a notch each side */}
        <View style={{ height: 0 }}>
          <View
            style={{
              position: "absolute",
              left: NOTCH + 6,
              right: NOTCH + 6,
              top: -0.75,
              borderTopWidth: 1.5,
              borderStyle: "dashed",
              borderColor: "#D5D8DE",
            }}
          />
          {[-NOTCH - 1, undefined].map((left, i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                top: -NOTCH,
                left,
                right: left === undefined ? -NOTCH - 1 : undefined,
                width: NOTCH * 2,
                height: NOTCH * 2,
                borderRadius: NOTCH,
                backgroundColor: surface,
                borderWidth: applied ? 1.5 : 1,
                borderColor: applied ? brand[400] : RULE,
              }}
            />
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 14,
            paddingTop: 12,
            paddingBottom: 12,
          }}
        >
          <View
            style={{
              flexShrink: 1,
              borderRadius: 14,
              paddingHorizontal: 11,
              paddingVertical: 5,
              backgroundColor: ok ? "#E3F6E9" : "#FFF4E3",
            }}
          >
            <UiText
              color={ok ? SAVE_INK : WARN_INK}
              numberOfLines={1}
              style={{
                fontSize: 13,
                lineHeight: 17,
                fontFamily: fontFamilies.semibold,
              }}
            >
              {check.ok
                ? `${applied ? "Kamu hemat" : "Kamu bisa hemat"} ${formatRupiah(check.amount)}`
                : check.reason}
            </UiText>
          </View>
          <View style={{ flex: 1 }} />
          {coupon.daysLeft <= 1 ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                borderRadius: 14,
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: TIMER,
              }}
            >
              <Glyph name="clock" size={13} color="#FFFFFF" />
              <UiText
                color="#FFFFFF"
                style={{
                  fontSize: 13,
                  lineHeight: 17,
                  fontFamily: fontFamilies.bold,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {untilEndOfDay(now)}
              </UiText>
            </View>
          ) : (
            <UiText
              color={QUIET_INK}
              style={{
                fontSize: 12.5,
                lineHeight: 16,
                fontFamily: fontFamilies.semibold,
              }}
            >
              Sisa {coupon.daysLeft} hari
            </UiText>
          )}
        </View>
      </View>

      {/* the tag, riding over the card's top edge */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 18,
          borderRadius: 13,
          borderWidth: 1.5,
          borderColor: "#F4B4BC",
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 10,
          paddingVertical: 2,
        }}
      >
        <UiText
          color="#C8102E"
          style={{
            fontSize: 12,
            lineHeight: 16,
            fontFamily: fontFamilies.bold,
            letterSpacing: 0.4,
          }}
        >
          {tagOf(coupon)}
        </UiText>
      </View>
    </View>
  );
}

/** Loose tickets floating over the hero's right side. */
function HeroArt() {
  return (
    <Svg width={150} height={120} viewBox="0 0 150 120">
      <Rect
        x={64}
        y={18}
        width={62}
        height={38}
        rx={9}
        fill="rgba(18,60,163,0.10)"
        transform="rotate(-18 95 37)"
      />
      <Circle cx={80} cy={32} r={5} fill="rgba(18,60,163,0.18)" />
      <Path
        d="M92 36l10-12"
        stroke="rgba(18,60,163,0.35)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Circle cx={92} cy={25} r={2.4} fill="rgba(18,60,163,0.35)" />
      <Circle cx={102} cy={36} r={2.4} fill="rgba(18,60,163,0.35)" />
      <Rect
        x={96}
        y={64}
        width={48}
        height={30}
        rx={8}
        fill="rgba(18,60,163,0.07)"
        transform="rotate(24 120 79)"
      />
    </Svg>
  );
}

/**
 * "Promo untuk kamu", opened from checkout: the promo on the order (or the
 * best one for it) in the blue hero, then the other promos that apply,
 * then the ones that do not yet with the reason. "Pakai" puts one on the
 * order and returns to checkout; "Lepas" takes it off.
 */
export default function CheckoutPromosScreen() {
  const insets = useSafeAreaInsets();
  const scroll = useScrolled();
  const now = useNow(1000);
  const couponId = useCartStore((s) => s.couponId);
  const setCoupon = useCartStore((s) => s.setCoupon);
  const { held, lines, outlet } = useCheckout();

  const rows = held
    .filter((c) => !c.used)
    .map((c) => ({ coupon: c, check: checkCoupon(c, lines, outlet?.brandId) }));
  const saving = (r: (typeof rows)[number]) =>
    r.check.ok ? r.check.amount : 0;
  const usable = rows
    .filter((r) => r.check.ok)
    .sort((a, b) => saving(b) - saving(a));
  const blocked = rows.filter((r) => !r.check.ok);
  const current = rows.find((r) => r.coupon.id === couponId);
  const top = current ?? usable[0];
  const others = usable.filter((r) => r !== top);
  const rest = blocked.filter((r) => r !== top);

  const apply = (c: Coupon, check: CouponCheck) => {
    if (!check.ok) return;
    tapSuccess();
    setCoupon(c.id);
    showToast(`Hemat ${formatRupiah(check.amount)} dengan ${c.title}`);
    router.back();
  };
  const remove = () => {
    tapPress();
    setCoupon(undefined);
    showToast("Promo dilepas dari pesanan", "info");
  };

  const ticket = (r: (typeof rows)[number]) => (
    <PromoTicket
      key={r.coupon.id}
      coupon={r.coupon}
      check={r.check}
      applied={r.coupon.id === couponId}
      now={now}
      onApply={() => apply(r.coupon, r.check)}
      onRemove={remove}
    />
  );

  const section = (t: string) => (
    <UiText
      color={LABEL_INK}
      style={{
        marginTop: 22,
        marginBottom: 2,
        fontSize: 17,
        lineHeight: 22,
        fontFamily: fontFamilies.extrabold,
      }}
    >
      {t}
    </UiText>
  );

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader
        tone="account"
        title="Promo untuk kamu"
        divider={scroll.scrolled}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scroll.onScroll}
        scrollEventThrottle={scroll.scrollEventThrottle}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* the bar's blue runs on into the best promo, as on Detail Profil */}
        <LinearGradient
          colors={[ACCOUNT_BAR, "#E7EEFF", surface]}
          locations={[0, 0.7, 1]}
          style={{
            paddingHorizontal: EDGE,
            paddingTop: 8,
            paddingBottom: 6,
            overflow: "hidden",
          }}
        >
          <View style={{ position: "absolute", right: -6, top: -18 }}>
            <HeroArt />
          </View>
          <UiText
            color={LABEL_INK}
            style={{
              marginTop: 8,
              fontSize: 17,
              lineHeight: 22,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            {current ? "Promo di pesananmu" : "Promo terbaik untukmu"}
          </UiText>
          {top ? (
            ticket(top)
          ) : (
            <UiText
              color={QUIET_INK}
              style={{
                marginTop: 6,
                marginBottom: 10,
                fontSize: 14,
                lineHeight: 19,
                fontFamily: fontFamilies.medium,
              }}
            >
              Belum ada promo yang cocok dengan pesanan ini.
            </UiText>
          )}
        </LinearGradient>

        <View style={{ paddingHorizontal: EDGE }}>
          {others.length > 0 ? (
            <>
              {section("Promo lain yang bisa dipakai")}
              {others.map(ticket)}
            </>
          ) : null}
          {rest.length > 0 ? (
            <>
              {section("Belum memenuhi syarat")}
              {rest.map(ticket)}
            </>
          ) : null}

          <PressableScale
            onPress={() => router.push("/vouchers")}
            scaleTo={0.99}
            style={{
              marginTop: 22,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: RULE,
              backgroundColor: "#FFFFFF",
              padding: 16,
            }}
          >
            <Glyph name="gift" size={20} color="#702B00" />
            <View style={{ flex: 1 }}>
              <UiText
                color={LABEL_INK}
                style={{
                  fontSize: 15,
                  lineHeight: 19,
                  fontFamily: fontFamilies.bold,
                }}
              >
                Punya kode voucher?
              </UiText>
              <UiText
                color={QUIET_INK}
                style={{
                  fontSize: 12.5,
                  lineHeight: 17,
                  fontFamily: fontFamilies.medium,
                }}
              >
                Klaim di Voucher Saya, lalu pakai di sini.
              </UiText>
            </View>
            <Glyph name="chevronRight" size={13} color={QUIET_INK} />
          </PressableScale>
          <PressableScale
            onPress={() => router.push("/coupons?tab=available")}
            scaleTo={0.99}
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: RULE,
              backgroundColor: "#FFFFFF",
              padding: 16,
            }}
          >
            <Glyph name="coins" size={20} color="#A36A00" />
            <View style={{ flex: 1 }}>
              <UiText
                color={LABEL_INK}
                style={{
                  fontSize: 15,
                  lineHeight: 19,
                  fontFamily: fontFamilies.bold,
                }}
              >
                Tukar poin jadi kupon
              </UiText>
              <UiText
                color={QUIET_INK}
                style={{
                  fontSize: 12.5,
                  lineHeight: 17,
                  fontFamily: fontFamilies.medium,
                }}
              >
                Ada kupon baru yang bisa kamu tukar.
              </UiText>
            </View>
            <Glyph name="chevronRight" size={13} color={QUIET_INK} />
          </PressableScale>
        </View>
      </ScrollView>
    </View>
  );
}
