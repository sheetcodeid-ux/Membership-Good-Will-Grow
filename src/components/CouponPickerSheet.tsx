import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { Glyph } from "./icons/Glyph";
import { BrandLogo } from "./BrandLogo";
import { AccountSheet } from "./AccountSheet";
import { LABEL_INK, QUIET_INK, RULE, WARN_INK } from "./AccountMenu";
import { brand, success } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { formatRupiah } from "../utils/format";
import { tapSelect } from "../utils/haptics";
import type { CouponCheck } from "../utils/coupons";
import type { Coupon } from "../data/types";

type Row = { coupon: Coupon; check: CouponCheck };

function Radio({ on }: { on: boolean }) {
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: on ? 6.5 : 1.5,
        borderColor: on ? brand[600] : "#C4C9D2",
        backgroundColor: "#FFFFFF",
      }}
    />
  );
}

/** One coupon in the picker: its mark, name, what it saves or why not. */
function CouponRow({
  row,
  selected,
  best,
  voucher,
  onPress,
}: {
  row: Row;
  selected: boolean;
  best: boolean;
  voucher: boolean;
  onPress?: () => void;
}) {
  const { coupon, check } = row;
  const ok = check.ok;
  const body = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderRadius: 14,
        borderWidth: selected ? 1.5 : 1,
        borderColor: selected ? brand[600] : RULE,
        backgroundColor: selected ? "#F3F7FF" : "#FFFFFF",
        paddingVertical: 12,
        paddingLeft: 12,
        paddingRight: 14,
        opacity: ok ? 1 : 0.62,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#F2F5FC",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {coupon.brandId ? (
          <BrandLogo brandId={coupon.brandId} size={26} />
        ) : (
          <Glyph name="store" size={19} color={brand[600]} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <UiText
            color={voucher ? "#702B00" : brand[700]}
            style={{
              fontSize: 10.5,
              lineHeight: 14,
              fontFamily: fontFamilies.extrabold,
              letterSpacing: 0.4,
            }}
          >
            {voucher ? "VOUCHER" : "KUPON"}
          </UiText>
          {best ? (
            <View
              style={{
                borderRadius: 6,
                paddingHorizontal: 6,
                paddingVertical: 1,
                backgroundColor: success[50],
              }}
            >
              <UiText
                color={success[600]}
                style={{
                  fontSize: 10.5,
                  lineHeight: 14,
                  fontFamily: fontFamilies.extrabold,
                }}
              >
                Paling hemat
              </UiText>
            </View>
          ) : null}
        </View>
        <UiText
          color={LABEL_INK}
          numberOfLines={1}
          style={{
            marginTop: 1,
            fontSize: 15,
            lineHeight: 19,
            fontFamily: fontFamilies.bold,
          }}
        >
          {coupon.title}
        </UiText>
        <View
          style={{
            marginTop: 3,
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Glyph
            name={ok ? "ticketCheck" : "info"}
            size={13}
            color={ok ? success[600] : WARN_INK}
          />
          <UiText
            color={ok ? success[600] : WARN_INK}
            numberOfLines={1}
            style={{
              flexShrink: 1,
              fontSize: 12.5,
              lineHeight: 16,
              fontFamily: fontFamilies.bold,
            }}
          >
            {check.ok ? `Hemat ${formatRupiah(check.amount)}` : check.reason}
          </UiText>
          <UiText
            color={QUIET_INK}
            style={{
              fontSize: 12,
              lineHeight: 16,
              fontFamily: fontFamilies.medium,
            }}
          >
            · Sisa {coupon.daysLeft} hari
          </UiText>
        </View>
      </View>
      {ok ? <Radio on={selected} /> : null}
    </View>
  );
  if (!onPress) return body;
  return (
    <PressableScale onPress={onPress} scaleTo={0.985}>
      {body}
    </PressableScale>
  );
}

function Section({ title }: { title: string }) {
  return (
    <UiText
      color={QUIET_INK}
      style={{
        marginTop: 16,
        marginBottom: 8,
        fontSize: 12.5,
        lineHeight: 16,
        fontFamily: fontFamilies.semibold,
      }}
    >
      {title}
    </UiText>
  );
}

/**
 * Checkout's coupon picker: every unused coupon and voucher, the ones that
 * apply to this order first (the biggest saving on top, marked "Paling
 * hemat"), then the rest dimmed with the reason they do not apply yet.
 * The biggest saving starts picked; tapping it again unpicks it, and the
 * footer then goes on without a coupon.
 */
export function CouponPickerSheet({
  rows,
  selectedId,
  isVoucher,
  onApply,
  onClose,
}: {
  rows: Row[];
  selectedId?: string;
  isVoucher: (c: Coupon) => boolean;
  onApply: (id: string | undefined) => void;
  onClose: () => void;
}) {
  const usable = rows
    .filter((r) => r.check.ok)
    .sort(
      (a, b) =>
        (b.check.ok ? b.check.amount : 0) - (a.check.ok ? a.check.amount : 0),
    );
  const blocked = rows.filter((r) => !r.check.ok);
  // The coupon already on the order; with none, the biggest saving.
  const [pick, setPick] = useState<string | undefined>(
    usable.some((r) => r.coupon.id === selectedId)
      ? selectedId
      : usable[0]?.coupon.id,
  );
  const picked = usable.find((r) => r.coupon.id === pick);
  const saving = picked?.check.ok ? picked.check.amount : 0;

  return (
    <AccountSheet
      title="Pakai Kupon"
      onClose={onClose}
      maxHeightRatio={0.86}
      footer={
        <PressableScale
          onPress={() => onApply(pick)}
          scaleTo={0.97}
          style={{
            height: 48,
            borderRadius: 24,
            backgroundColor: brand[600],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UiText
            color="#FFFFFF"
            style={{
              fontSize: 16,
              lineHeight: 20,
              fontFamily: fontFamilies.bold,
            }}
          >
            {picked
              ? `Pakai · Hemat ${formatRupiah(saving)}`
              : "Lanjut tanpa kupon"}
          </UiText>
        </PressableScale>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 18 }}
      >
        {rows.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 28, gap: 6 }}>
            <Glyph name="ticketPercent" size={34} color="#B9C6E4" />
            <UiText
              color={LABEL_INK}
              style={{
                fontSize: 15,
                lineHeight: 19,
                fontFamily: fontFamilies.bold,
              }}
            >
              Belum punya kupon
            </UiText>
            <UiText
              color={QUIET_INK}
              style={{
                textAlign: "center",
                fontSize: 13,
                lineHeight: 18,
                fontFamily: fontFamilies.medium,
              }}
            >
              Tukar poinmu dengan kupon, atau klaim kode voucher.
            </UiText>
            <PressableScale
              onPress={() => {
                onClose();
                router.push("/coupons?tab=available");
              }}
              style={{ marginTop: 6 }}
            >
              <UiText
                color={brand[600]}
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  fontFamily: fontFamilies.bold,
                }}
              >
                Tukar poin
              </UiText>
            </PressableScale>
          </View>
        ) : null}

        {usable.length > 0 ? (
          <>
            <Section title={`Bisa dipakai (${usable.length})`} />
            <View style={{ gap: 8 }}>
              {usable.map((r, i) => (
                <CouponRow
                  key={r.coupon.id}
                  row={r}
                  best={i === 0 && usable.length > 1}
                  voucher={isVoucher(r.coupon)}
                  selected={pick === r.coupon.id}
                  onPress={() => {
                    tapSelect();
                    setPick(pick === r.coupon.id ? undefined : r.coupon.id);
                  }}
                />
              ))}
            </View>
          </>
        ) : null}

        {blocked.length > 0 ? (
          <>
            <Section title={`Belum memenuhi syarat (${blocked.length})`} />
            <View style={{ gap: 8 }}>
              {blocked.map((r) => (
                <CouponRow
                  key={r.coupon.id}
                  row={r}
                  best={false}
                  voucher={isVoucher(r.coupon)}
                  selected={false}
                />
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
    </AccountSheet>
  );
}
