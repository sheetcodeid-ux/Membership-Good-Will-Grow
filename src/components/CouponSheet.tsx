import React from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { Glyph, type GlyphName } from "./icons/Glyph";
import { BrandLogo } from "./BrandLogo";
import { AccountSheet } from "./AccountSheet";
import { CouponTicket } from "./CouponTicket";
import { LegalBullets } from "./LegalDoc";
import { LABEL_INK, QUIET_INK, RULE, WARN_INK } from "./AccountMenu";
import { brand, success } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { getBrand, getOutlet, outletFullName } from "../data/mock";
import { useOrderStore } from "../store/orderStore";
import { useMemberStore } from "../store/memberStore";
import { showToast } from "../store/toastStore";
import { tapPress } from "../utils/haptics";
import type { Coupon } from "../data/types";

const OR_INK = "#C46A00";

function Heading({ children }: { children: string }) {
  return (
    <UiText
      color={LABEL_INK}
      style={{
        marginTop: 22,
        marginBottom: 10,
        fontSize: 16,
        lineHeight: 21,
        fontFamily: fontFamilies.bold,
      }}
    >
      {children}
    </UiText>
  );
}

/** The divider between alternative conditions, as the reference marks it. */
function OrDivider() {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginVertical: 8,
      }}
    >
      <View style={{ flex: 1, height: 1, backgroundColor: RULE }} />
      <View
        style={{
          backgroundColor: "#FFF3DC",
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingVertical: 2,
        }}
      >
        <UiText
          color={OR_INK}
          style={{
            fontSize: 11.5,
            lineHeight: 15,
            fontFamily: fontFamilies.extrabold,
            letterSpacing: 0.6,
          }}
        >
          ATAU
        </UiText>
      </View>
      <View style={{ flex: 1, height: 1, backgroundColor: RULE }} />
    </View>
  );
}

function Fact({
  icon,
  label,
  value,
  tone = LABEL_INK,
}: {
  icon: GlyphName;
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <View
      style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 9 }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: "#F2F3F5",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Glyph name={icon} size={16} color={tone} />
      </View>
      <View style={{ flexShrink: 1 }}>
        <UiText
          color={QUIET_INK}
          style={{
            fontSize: 11.5,
            lineHeight: 15,
            fontFamily: fontFamilies.medium,
          }}
        >
          {label}
        </UiText>
        <UiText
          color={tone}
          numberOfLines={1}
          style={{
            fontSize: 14,
            lineHeight: 18,
            fontFamily: fontFamilies.bold,
          }}
        >
          {value}
        </UiText>
      </View>
    </View>
  );
}

/**
 * Everything about one coupon, opened from its ticket: the ticket itself
 * at the top, what it gives, how long it lasts, the claim terms, the
 * purchases that qualify (any one group, "ATAU" between them) and the
 * outlets it works at. Closes from the ticket's cross, the backdrop or
 * "Tutup"; "Pakai kupon" takes the member to the menu of an outlet that
 * accepts it.
 */
export function CouponSheet({
  coupon,
  onClose,
  offer,
  noun = "kupon",
}: {
  coupon: Coupon;
  onClose: () => void;
  /** What the member calls it: "kupon", or "voucher" from Voucher Saya. */
  noun?: "kupon" | "voucher";
  /** Opened from "Kupon tersedia": priced in points, bought from the footer. */
  offer?: { price: number; onBuy: () => void };
}) {
  const points = useMemberStore((s) => s.points);
  const detail = coupon.detail;
  const brandInfo = getBrand(coupon.brandId);
  const outletId = useOrderStore((s) => s.outletId);
  const setOutlet = useOrderStore((s) => s.setOutlet);
  const outlets = (detail?.outletIds ?? [])
    .map((id) => getOutlet(id))
    .filter((o): o is NonNullable<typeof o> => !!o);
  const urgent = coupon.daysLeft <= 1;

  const use = () => {
    tapPress();
    // Start the order at an outlet that takes this coupon.
    const target = outlets.find((o) => o.id === outletId) ?? outlets[0];
    if (target && target.id !== outletId) setOutlet(target.id);
    showToast(
      target
        ? `Pilih menu di ${outletFullName(target)}, ${noun} dipakai saat bayar`
        : `Pilih menu, ${noun} bisa dipakai saat bayar`,
      "info",
    );
    onClose();
    router.push("/order");
  };

  return (
    <AccountSheet
      onClose={onClose}
      maxHeightRatio={0.9}
      footer={
        offer ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <UiText
                color={QUIET_INK}
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: fontFamilies.medium,
                }}
              >
                Poinmu
              </UiText>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Glyph name="coins" size={15} color="#C98A00" />
                <UiText
                  color={LABEL_INK}
                  style={{
                    fontSize: 17,
                    lineHeight: 22,
                    fontFamily: fontFamilies.extrabold,
                  }}
                >
                  {points.toLocaleString("id-ID")}
                </UiText>
              </View>
            </View>
            <PressableScale
              onPress={offer.onBuy}
              disabled={points < offer.price}
              scaleTo={0.97}
              style={{
                flex: 1.6,
                height: 48,
                borderRadius: 24,
                backgroundColor: points < offer.price ? "#E4E7EC" : brand[600],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UiText
                color={points < offer.price ? QUIET_INK : "#FFFFFF"}
                style={{
                  fontSize: 16,
                  lineHeight: 20,
                  fontFamily: fontFamilies.bold,
                }}
              >
                {points < offer.price
                  ? `Poin kurang ${(offer.price - points).toLocaleString("id-ID")}`
                  : `Tukar ${offer.price.toLocaleString("id-ID")} poin`}
              </UiText>
            </PressableScale>
          </View>
        ) : (
          <View style={{ flexDirection: "row", gap: 10 }}>
            <PressableScale
              onPress={onClose}
              scaleTo={0.97}
              style={{
                flex: coupon.used ? 1 : 0.8,
                height: 48,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: RULE,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UiText
                color={LABEL_INK}
                style={{
                  fontSize: 16,
                  lineHeight: 20,
                  fontFamily: fontFamilies.bold,
                }}
              >
                Tutup
              </UiText>
            </PressableScale>
            {coupon.used ? null : (
              <PressableScale
                onPress={use}
                scaleTo={0.97}
                style={{
                  flex: 1.2,
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
                  Pakai {noun}
                </UiText>
              </PressableScale>
            )}
          </View>
        )
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 20,
        }}
      >
        <CouponTicket
          coupon={coupon}
          onClose={onClose}
          notchColor="#FFFFFF"
          size="large"
          price={offer?.price}
        />

        <UiText
          color={LABEL_INK}
          style={{
            marginTop: 18,
            fontSize: 20,
            lineHeight: 25,
            fontFamily: fontFamilies.extrabold,
          }}
        >
          {coupon.title}
        </UiText>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginTop: 8,
          }}
        >
          {coupon.brandId ? (
            <BrandLogo brandId={coupon.brandId} size={18} />
          ) : (
            <Glyph name="store" size={16} color={brand[600]} />
          )}
          <UiText
            color={LABEL_INK}
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontFamily: fontFamilies.semibold,
            }}
          >
            {brandInfo?.name ?? "Semua brand"}
          </UiText>
        </View>

        {detail?.benefits.length ? (
          <View
            style={{
              marginTop: 14,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "#F3E1B0",
              backgroundColor: "#FFF8E8",
              padding: 12,
              gap: 6,
            }}
          >
            {detail.benefits.map((b, i) => (
              <View
                key={b}
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Glyph
                  name={i === 0 ? "gift" : "info"}
                  size={i === 0 ? 17 : 14}
                  color="#702B00"
                />
                <UiText
                  color="#702B00"
                  style={{
                    flex: 1,
                    fontSize: i === 0 ? 15 : 13,
                    lineHeight: i === 0 ? 19 : 17,
                    fontFamily:
                      i === 0 ? fontFamilies.bold : fontFamilies.semibold,
                  }}
                >
                  {b}
                </UiText>
              </View>
            ))}
          </View>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginTop: 12,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: RULE,
          }}
        >
          <Fact
            icon="clock"
            label={offer ? "Berlaku setelah ditukar" : "Masa berlaku"}
            value={
              offer ? `${coupon.daysLeft} hari` : `${coupon.daysLeft} hari lagi`
            }
            tone={urgent && !offer ? WARN_INK : LABEL_INK}
          />
          {offer ? (
            <Fact
              icon="coins"
              label="Harga"
              value={`${offer.price.toLocaleString("id-ID")} poin`}
              tone="#702B00"
            />
          ) : (
            <Fact
              icon={coupon.used ? "checkCircle" : "ticket"}
              label="Status"
              value={coupon.used ? "Sudah dipakai" : "Belum dipakai"}
              tone={coupon.used ? QUIET_INK : success[600]}
            />
          )}
        </View>

        {detail ? (
          <>
            <Heading>Ketentuan klaim</Heading>
            <LegalBullets items={detail.claimTerms} />

            <Heading>Syarat & ketentuan</Heading>
            <UiText
              color={QUIET_INK}
              style={{
                marginBottom: 10,
                fontSize: 13,
                lineHeight: 18,
                fontFamily: fontFamilies.medium,
              }}
            >
              {detail.requirements.length > 1
                ? "Penuhi salah satu syarat berikut:"
                : "Penuhi syarat berikut:"}
            </UiText>
            {detail.requirements.map((group, i) => (
              <View key={group.join("|")}>
                {i > 0 ? <OrDivider /> : null}
                <View
                  style={{
                    borderRadius: 12,
                    backgroundColor: "#F7F8FA",
                    padding: 12,
                    gap: 6,
                  }}
                >
                  <UiText
                    color={LABEL_INK}
                    style={{
                      fontSize: 13.5,
                      lineHeight: 18,
                      fontFamily: fontFamilies.bold,
                    }}
                  >
                    {detail.requirementsTitle ?? "Beli item berikut"}
                  </UiText>
                  <LegalBullets items={group} />
                </View>
              </View>
            ))}
            {detail.note ? (
              <View style={{ flexDirection: "row", gap: 6, marginTop: 10 }}>
                <Glyph name="info" size={13} color={QUIET_INK} />
                <UiText
                  color={QUIET_INK}
                  style={{
                    flex: 1,
                    fontSize: 12.5,
                    lineHeight: 17,
                    fontFamily: fontFamilies.medium,
                    fontStyle: "italic",
                  }}
                >
                  Catatan: {detail.note}
                </UiText>
              </View>
            ) : null}

            {outlets.length ? (
              <>
                <Heading>Berlaku di outlet</Heading>
                <View
                  style={{
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: RULE,
                    overflow: "hidden",
                  }}
                >
                  {outlets.map((o, i) => (
                    <View
                      key={o.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        paddingHorizontal: 12,
                        paddingVertical: 11,
                        borderTopWidth: i > 0 ? 1 : 0,
                        borderTopColor: RULE,
                      }}
                    >
                      <Glyph name="store" size={18} color={QUIET_INK} />
                      <View style={{ flex: 1 }}>
                        <UiText
                          color={LABEL_INK}
                          numberOfLines={1}
                          style={{
                            fontSize: 14,
                            lineHeight: 18,
                            fontFamily: fontFamilies.semibold,
                          }}
                        >
                          {outletFullName(o)}
                        </UiText>
                        <UiText
                          color={QUIET_INK}
                          numberOfLines={1}
                          style={{
                            fontSize: 12,
                            lineHeight: 16,
                            fontFamily: fontFamilies.medium,
                          }}
                        >
                          {o.address}
                        </UiText>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </AccountSheet>
  );
}
