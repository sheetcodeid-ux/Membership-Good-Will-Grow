import React from "react";
import { ScrollView, View } from "react-native";
import { UiText } from "./ui/Text";
import { Glyph } from "./icons/Glyph";
import { BrandLogo } from "./BrandLogo";
import { AccountSheet } from "./AccountSheet";
import { LABEL_INK, QUIET_INK, RULE } from "./AccountMenu";
import { brand, danger, success } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import type { Outlet, WeekDay } from "../data/types";
import { formatDistance } from "../utils/format";

const DAYS: { key: WeekDay; label: string }[] = [
  { key: "senin", label: "Senin" },
  { key: "selasa", label: "Selasa" },
  { key: "rabu", label: "Rabu" },
  { key: "kamis", label: "Kamis" },
  { key: "jumat", label: "Jumat" },
  { key: "sabtu", label: "Sabtu" },
  { key: "minggu", label: "Minggu" },
];

/** Today's key; getDay() counts from Sunday. */
function todayKey(): WeekDay {
  return DAYS[(new Date().getDay() + 6) % 7].key;
}

function Pill({ ok, text }: { ok: boolean; text: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: ok ? success[50] : "#FDECEE",
      }}
    >
      <Glyph
        name={ok ? "checkCircle" : "closeCircle"}
        size={18}
        color={ok ? success[600] : danger[500]}
      />
      <UiText
        color={ok ? success[600] : danger[500]}
        style={{
          flex: 1,
          fontSize: 14,
          lineHeight: 19,
          fontFamily: fontFamilies.bold,
        }}
      >
        {text}
      </UiText>
    </View>
  );
}

/**
 * An outlet's details from Pilih Outlet: where it is, whether it is open
 * and takes app orders, and the week's hours with today marked.
 */
export function OutletInfoSheet({
  outlet,
  onClose,
}: {
  outlet: Outlet;
  onClose: () => void;
}) {
  const today = todayKey();
  return (
    <AccountSheet title="Info outlet" onClose={onClose} maxHeightRatio={0.84}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <BrandLogo brandId={outlet.brandId} size={36} />
          <View style={{ flex: 1 }}>
            <UiText
              color={LABEL_INK}
              style={{
                fontSize: 18,
                lineHeight: 23,
                fontFamily: fontFamilies.extrabold,
              }}
            >
              {outlet.name}
            </UiText>
            <UiText
              color={QUIET_INK}
              style={{
                fontSize: 13,
                lineHeight: 18,
                fontFamily: fontFamilies.medium,
              }}
            >
              {outlet.city} · {formatDistance(outlet.distanceKm)}
            </UiText>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
          <Glyph name="pin" size={16} color={brand[600]} />
          <UiText
            color={QUIET_INK}
            style={{
              flex: 1,
              fontSize: 14,
              lineHeight: 20,
              fontFamily: fontFamilies.medium,
            }}
          >
            {outlet.addressFull}
          </UiText>
        </View>

        <View style={{ gap: 8, marginTop: 14 }}>
          <Pill
            ok={outlet.isOpen}
            text={
              outlet.isOpen
                ? `Buka sekarang · ${outlet.weeklyHours[today]}`
                : `Tutup, buka pukul ${outlet.opensAt}`
            }
          />
          <Pill
            ok={!!outlet.appOrderAvailable}
            text={
              outlet.appOrderAvailable
                ? "Bisa pesan lewat aplikasi"
                : "Pesan lewat aplikasi belum tersedia"
            }
          />
        </View>

        <UiText
          color={QUIET_INK}
          style={{
            marginTop: 20,
            marginBottom: 8,
            fontSize: 12.5,
            lineHeight: 16,
            fontFamily: fontFamilies.semibold,
          }}
        >
          Jam operasional
        </UiText>
        <View
          style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: RULE,
            overflow: "hidden",
          }}
        >
          {DAYS.map(({ key, label }, i) => {
            const on = key === today;
            return (
              <View
                key={key}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  minHeight: 44,
                  paddingHorizontal: 14,
                  borderTopWidth: i === 0 ? 0 : 1,
                  borderTopColor: RULE,
                  backgroundColor: on ? "#F3F7FF" : "#FFFFFF",
                }}
              >
                <UiText
                  color={on ? brand[700] : LABEL_INK}
                  style={{
                    fontSize: 14.5,
                    lineHeight: 19,
                    fontFamily: on ? fontFamilies.bold : fontFamilies.medium,
                  }}
                >
                  {label}
                </UiText>
                {on ? (
                  <View
                    style={{
                      borderRadius: 8,
                      paddingHorizontal: 7,
                      paddingVertical: 1,
                      backgroundColor: "#EAF0FF",
                    }}
                  >
                    <UiText
                      color={brand[700]}
                      style={{
                        fontSize: 11,
                        lineHeight: 15,
                        fontFamily: fontFamilies.bold,
                      }}
                    >
                      Hari ini
                    </UiText>
                  </View>
                ) : null}
                <View style={{ flex: 1 }} />
                <UiText
                  color={on ? brand[700] : QUIET_INK}
                  style={{
                    fontSize: 14.5,
                    lineHeight: 19,
                    fontFamily: on ? fontFamilies.bold : fontFamilies.medium,
                  }}
                >
                  {outlet.weeklyHours[key]}
                </UiText>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </AccountSheet>
  );
}
