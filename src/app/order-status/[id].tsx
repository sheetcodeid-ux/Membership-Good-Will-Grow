import React, { useState } from "react";
import { Image, ScrollView, View, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import Svg, { Circle } from "react-native-svg";
import { UiText } from "../../components/ui/Text";
import { PressableScale } from "../../components/ui/PressableScale";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Glyph, type GlyphName } from "../../components/icons/Glyph";
import { BrandLogo } from "../../components/BrandLogo";
import { AccountEmpty } from "../../components/EmptyArt";
import { OrderStatusArt } from "../../components/OrderStatusArt";
import { OrderHelpCard } from "../../components/OrderHelpCard";
import { LABEL_INK, QUIET_INK, RULE } from "../../components/AccountMenu";
import {
  Block,
  CutleryIcon,
  EDGE,
  SumRow,
} from "../../components/checkout/parts";
import { SERVICE_META } from "../../components/checkout/CheckoutSheets";
import { brand, danger, surface } from "../../theme/colors";
import { fontFamilies } from "../../theme/typography";
import { getOutlet, menuItems, outlets } from "../../data/mock";
import { useOrderStore } from "../../store/orderStore";
import { orderKinds } from "../../utils/menuKinds";
import { MenuArt } from "../../components/MenuArt";
import { promoBanners } from "../../data/banners";
import { useOrderRecord } from "../../store/ordersStore";
import { showToast } from "../../store/toastStore";
import { useNow } from "../../hooks/useNow";
import { formatRupiah } from "../../utils/format";
import { tapError, tapPress, tapSuccess } from "../../utils/haptics";
import {
  CANCEL_WINDOW_MS,
  READY_MINUTES,
  cancelOrder,
  clock,
  orderStage,
} from "../../utils/orderFlow";

const ART_H = 290;
const STEPS: { glyph: GlyphName; label: string }[] = [
  { glyph: "receipt", label: "Diterima" },
  { glyph: "coffee", label: "Disiapkan" },
  { glyph: "store", label: "Siap diambil" },
  { glyph: "check", label: "Selesai" },
];
const HEADLINE = [
  "Menunggu konfirmasi outlet...",
  "Pesananmu sedang disiapkan...",
  "Pesananmu siap diambil!",
  "Pesanan selesai. Selamat menikmati!",
];

/** The four steps on a line, done ones filled, the current one ringed. */
function Steps({ stage }: { stage: number }) {
  return (
    <View style={{ paddingHorizontal: 4, paddingTop: 16, paddingBottom: 4 }}>
      <View
        style={{
          position: "absolute",
          left: 26,
          right: 26,
          top: 16 + 17,
          height: 4,
          borderRadius: 2,
          backgroundColor: "#E7EBF3",
        }}
      />
      <View
        style={{
          position: "absolute",
          left: 26,
          top: 16 + 17,
          height: 4,
          borderRadius: 2,
          width: `${(Math.min(stage, 3) / 3) * 84}%`,
          backgroundColor: brand[600],
        }}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {STEPS.map((s, i) => {
          const done = i < stage || stage === 3;
          const now = i === stage && stage < 3;
          return (
            <View key={s.label} style={{ alignItems: "center", width: 64 }}>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  borderWidth: now ? 3 : 0,
                  borderColor: "#BFD0F7",
                  backgroundColor: done || now ? brand[600] : "#EEF1F6",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Glyph
                  name={s.glyph}
                  size={16}
                  color={done || now ? "#FFFFFF" : "#8A93A6"}
                />
              </View>
              <UiText
                color={done || now ? LABEL_INK : "#8A93A6"}
                style={{
                  marginTop: 6,
                  textAlign: "center",
                  fontSize: 11.5,
                  lineHeight: 15,
                  fontFamily: now ? fontFamilies.bold : fontFamilies.semibold,
                }}
              >
                {s.label}
              </UiText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/** The ring on the cancel button, emptying as the window closes. */
function CountdownRing({ left }: { left: number }) {
  const r = 11;
  const c = 2 * Math.PI * r;
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28">
      <Circle
        cx={14}
        cy={14}
        r={r}
        stroke="#F6C7CE"
        strokeWidth={2.6}
        fill="none"
      />
      <Circle
        cx={14}
        cy={14}
        r={r}
        stroke="#C8102E"
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={c * (1 - left)}
        transform="rotate(-90 14 14)"
      />
    </Svg>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <UiText
      color={LABEL_INK}
      style={{
        fontSize: 17,
        lineHeight: 22,
        fontFamily: fontFamilies.extrabold,
      }}
    >
      {children}
    </UiText>
  );
}

/**
 * Status Pesanan, where the member lands once an order is placed: the
 * outlet scene, when it will be ready and the four steps there, the
 * cancel button for its first minute, the pickup code, what was ordered,
 * how it is collected and paid, the bill, the receipt number and help.
 */
export default function OrderStatusScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrderRecord(id);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const now = useNow(500);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true);

  const leave = () => router.dismissTo("/(tabs)");

  if (!order) {
    return (
      <View
        style={{ flex: 1, backgroundColor: surface, paddingTop: insets.top }}
      >
        <StatusBar style="dark" />
        <AccountEmpty
          glyph="receipt"
          title="Pesanan tidak ditemukan"
          subtitle="Cek pesananmu di Riwayat Pesanan."
          action={{
            label: "Riwayat Pesanan",
            onPress: () => router.replace("/order-history"),
          }}
        />
      </View>
    );
  }

  const cancelled = order.status === "dibatalkan";
  const stage = cancelled ? -1 : orderStage(order, now);
  const placedAt = order.placedAt ?? now;
  const left = Math.max(0, 1 - (now - placedAt) / CANCEL_WINDOW_MS);
  const readyAt = placedAt + READY_MINUTES * 60_000;
  const outlet = getOutlet(order.outletId);
  // Drinks draw the cup, food the bowl; an order of both shows both.
  const kinds = orderKinds(order.lines.map((l) => l.name));
  const service = SERVICE_META[order.serviceType];
  const unpaid = order.status === "belum-bayar";
  const today =
    new Date(placedAt).toDateString() === new Date(now).toDateString();
  const discounts = (order.couponDiscount ?? 0) + (order.pointsUsed ?? 0);

  // "Mau coba brand lain?": open Daftar Menu on the nearest Lesung Pipi
  // outlet, with the outlet sheet up to pick Dine In or Take Away.
  const tryOtherBrand = () => {
    const next = [...outlets]
      .filter((o) => o.brandId === "lesung-pipi" && o.isOpen)
      .sort((a, b) => a.distanceKm - b.distanceKm)[0];
    if (next) {
      useOrderStore.getState().setOutlet(next.id);
      useOrderStore.getState().reopenOutletSheet();
    }
    router.push("/order");
  };

  const copy = () => {
    Clipboard.setStringAsync(order.nota).catch(() => {});
    tapSuccess();
    showToast("Nomor nota disalin");
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + (bannerOpen ? 120 : 32),
        }}
      >
        {/* the scene, with what was ordered in front of the outlet */}
        <View style={{ height: ART_H + insets.top }}>
          <OrderStatusArt
            width={width}
            height={ART_H + insets.top}
            drink={kinds.drink}
            food={kinds.food}
          />
          <PressableScale
            onPress={leave}
            hitSlop={8}
            style={{
              position: "absolute",
              left: EDGE,
              top: insets.top + 10,
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#0B2B73",
              shadowOpacity: 0.12,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
            }}
          >
            <Glyph name="arrowRight" rotate={180} size={20} color={LABEL_INK} />
          </PressableScale>
        </View>

        {/* when it will be ready, and where it stands */}
        <LinearGradient
          colors={
            cancelled
              ? ["#8A93A6", "#B0B7C6", surface]
              : [brand[700], brand[500], surface]
          }
          locations={[0, 0.62, 1]}
          style={{
            marginTop: -28,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: EDGE,
            paddingTop: 18,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View style={{ flex: 1 }}>
              <UiText
                color="#FFFFFF"
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                {cancelled
                  ? "Status"
                  : stage >= 2
                    ? "Siap sejak"
                    : "Estimasi siap"}
              </UiText>
              <UiText
                color="#FFFFFF"
                style={{
                  fontSize: 30,
                  lineHeight: 36,
                  fontFamily: fontFamilies.extrabold,
                }}
              >
                {cancelled ? "Dibatalkan" : clock(readyAt)}
              </UiText>
            </View>
            {!cancelled ? (
              <View
                style={{
                  marginTop: 4,
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  backgroundColor: "#FFFFFF",
                }}
              >
                <UiText
                  color={brand[700]}
                  style={{
                    fontSize: 13.5,
                    lineHeight: 18,
                    fontFamily: fontFamilies.bold,
                  }}
                >
                  {stage >= 3 ? "Selesai" : "Tepat waktu"}
                </UiText>
              </View>
            ) : null}
          </View>
          <View
            style={{
              marginTop: 6,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Glyph name="shield" size={14} color="#FFFFFF" />
            <UiText
              color="#FFFFFF"
              style={{
                flex: 1,
                fontSize: 13,
                lineHeight: 18,
                fontFamily: fontFamilies.semibold,
              }}
            >
              {cancelled
                ? "Kupon dan poin yang dipakai sudah dikembalikan."
                : "Kami kabari lewat notifikasi saat pesananmu siap."}
            </UiText>
          </View>

          <View
            style={{
              marginTop: 14,
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              borderWidth: 2,
              borderColor: cancelled ? "#D5D8DE" : "#BFD0F7",
              padding: 16,
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
              {cancelled ? "Pesanan dibatalkan" : HEADLINE[stage]}
            </UiText>
            {!cancelled ? <Steps stage={stage} /> : null}

            {!cancelled && stage >= 1 && stage < 3 ? (
              <View
                style={{
                  marginTop: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  borderRadius: 14,
                  backgroundColor: "#F3F7FF",
                  padding: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <UiText
                    color={QUIET_INK}
                    style={{
                      fontSize: 12.5,
                      lineHeight: 16,
                      fontFamily: fontFamilies.semibold,
                    }}
                  >
                    {order.pickup === "table"
                      ? `Diantar ke meja ${order.tableNumber ?? ""}`
                      : "Tunjukkan kode ini di kasir"}
                  </UiText>
                  <UiText
                    color={brand[800]}
                    style={{
                      fontSize: 26,
                      lineHeight: 32,
                      letterSpacing: 3,
                      fontFamily: fontFamilies.extrabold,
                    }}
                  >
                    {order.orderCode}
                  </UiText>
                </View>
                {order.gift ? (
                  <View style={{ alignItems: "flex-end" }}>
                    <UiText
                      color={QUIET_INK}
                      style={{
                        fontSize: 12,
                        lineHeight: 16,
                        fontFamily: fontFamilies.medium,
                      }}
                    >
                      Diambil oleh
                    </UiText>
                    <UiText
                      color={LABEL_INK}
                      style={{
                        fontSize: 14,
                        lineHeight: 18,
                        fontFamily: fontFamilies.bold,
                      }}
                    >
                      {order.gift.to}
                    </UiText>
                  </View>
                ) : null}
              </View>
            ) : null}

            <View
              style={{
                marginTop: 14,
                borderTopWidth: 1,
                borderStyle: "dashed",
                borderColor: "#D5D8DE",
              }}
            />
            <View
              style={{
                marginTop: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <BrandLogo brandId={order.brandId} size={22} />
              <UiText
                color={QUIET_INK}
                numberOfLines={1}
                style={{
                  flex: 1,
                  fontSize: 14.5,
                  lineHeight: 19,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                {order.outletName}
              </UiText>
              <PressableScale
                onPress={() => router.push(`/order-chat/${order.id}`)}
                accessibilityLabel="Chat outlet"
                hitSlop={6}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#EEF1F6",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Glyph name="chatLines" size={17} color={QUIET_INK} />
              </PressableScale>
            </View>

            {stage === 0 ? (
              <PressableScale
                onPress={() => {
                  tapPress();
                  setConfirmCancel(true);
                }}
                scaleTo={0.98}
                style={{
                  marginTop: 14,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "#FDECEE",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UiText
                  color="#C8102E"
                  style={{
                    fontSize: 16,
                    lineHeight: 20,
                    fontFamily: fontFamilies.bold,
                  }}
                >
                  Batalkan pesanan
                </UiText>
                <View style={{ position: "absolute", right: 14 }}>
                  <CountdownRing left={left} />
                </View>
              </PressableScale>
            ) : null}
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: EDGE, gap: 12, marginTop: 12 }}>
          {/* what was ordered */}
          <Block style={{ padding: 16 }}>
            <SectionTitle>Item pesanan</SectionTitle>
            <View style={{ marginTop: 10, gap: 10 }}>
              {order.lines.map((l) => (
                <View
                  key={l.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <MenuArt
                    item={menuItems.find((m) => m.name === l.name)}
                    radius={12}
                    style={{ width: 44, height: 44 }}
                  />
                  <UiText
                    color={LABEL_INK}
                    style={{
                      flex: 1,
                      fontSize: 15,
                      lineHeight: 20,
                      fontFamily: fontFamilies.semibold,
                    }}
                  >
                    {l.name}
                    {l.variant && l.variant !== "Original" ? (
                      <UiText
                        color={QUIET_INK}
                        style={{
                          fontSize: 13.5,
                          lineHeight: 20,
                          fontFamily: fontFamilies.medium,
                        }}
                      >
                        {`  ${l.variant}`}
                      </UiText>
                    ) : null}
                  </UiText>
                  <View
                    style={{
                      minWidth: 30,
                      height: 26,
                      borderRadius: 13,
                      paddingHorizontal: 8,
                      backgroundColor: "#EAF0FF",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <UiText
                      color={brand[700]}
                      style={{
                        fontSize: 13.5,
                        lineHeight: 17,
                        fontFamily: fontFamilies.extrabold,
                      }}
                    >
                      {l.qty}×
                    </UiText>
                  </View>
                </View>
              ))}
            </View>
          </Block>
        </View>

        {/* promo banners, sliding */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: EDGE,
            paddingVertical: 12,
            gap: 10,
          }}
        >
          {promoBanners.map((b) => (
            <PressableScale
              key={b.id}
              onPress={() => router.push("/promo")}
              scaleTo={0.98}
              style={{
                width: 246,
                height: 138,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <Image
                source={b.source}
                accessibilityLabel={b.label}
                resizeMode="cover"
                style={{ width: 246, height: 164, marginTop: -13 }}
              />
            </PressableScale>
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: EDGE, gap: 12 }}>
          {/* from the outlet to the member */}
          <Block style={{ padding: 16 }}>
            {[
              {
                glyph: "store" as GlyphName,
                title: order.outletName,
                line: outlet ? `${outlet.address}, ${outlet.city}` : "",
              },
              {
                glyph:
                  order.pickup === "table"
                    ? ("armchair" as GlyphName)
                    : order.serviceType === "delivery"
                      ? ("scooter" as GlyphName)
                      : ("footprints" as GlyphName),
                title:
                  order.pickup === "table"
                    ? `Antar ke meja ${order.tableNumber ?? ""}`
                    : "Ambil sendiri di kasir",
                line: `${service.label}${order.gift ? ` · Hadiah untuk ${order.gift.to}` : ""}`,
              },
            ].map((stop, i) => (
              <View key={i} style={{ flexDirection: "row", gap: 14 }}>
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      borderWidth: 1.5,
                      borderColor: RULE,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Glyph name={stop.glyph} size={19} color="#C8102E" />
                  </View>
                  {i === 0 ? (
                    <View
                      style={{
                        flex: 1,
                        minHeight: 18,
                        borderLeftWidth: 1.5,
                        borderStyle: "dashed",
                        borderColor: "#C4C9D2",
                      }}
                    />
                  ) : null}
                </View>
                <View
                  style={{
                    flex: 1,
                    paddingTop: 2,
                    paddingBottom: i === 0 ? 14 : 0,
                  }}
                >
                  <UiText
                    color={LABEL_INK}
                    numberOfLines={1}
                    style={{
                      fontSize: 16,
                      lineHeight: 21,
                      fontFamily: fontFamilies.bold,
                    }}
                  >
                    {stop.title}
                  </UiText>
                  <UiText
                    color="#6B7488"
                    numberOfLines={1}
                    style={{
                      fontSize: 13,
                      lineHeight: 18,
                      fontFamily: fontFamilies.medium,
                    }}
                  >
                    {stop.line}
                  </UiText>
                  {i === 1 && (order.note || order.gift?.message) ? (
                    <View
                      style={{
                        marginTop: 8,
                        borderLeftWidth: 3,
                        borderLeftColor: "#D5D8DE",
                        backgroundColor: "#F5F6F8",
                        borderRadius: 6,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        gap: 2,
                      }}
                    >
                      {order.note ? (
                        <UiText
                          color={QUIET_INK}
                          style={{
                            fontSize: 13.5,
                            lineHeight: 19,
                            fontFamily: fontFamilies.medium,
                          }}
                        >
                          {order.note}
                        </UiText>
                      ) : null}
                      {order.gift?.message ? (
                        <UiText
                          color={QUIET_INK}
                          style={{
                            fontSize: 13.5,
                            lineHeight: 19,
                            fontFamily: fontFamilies.medium,
                            fontStyle: "italic",
                          }}
                        >
                          “{order.gift.message}”
                        </UiText>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </Block>

          {/* how it is paid */}
          <Block style={{ padding: 16 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Glyph
                name={
                  order.paymentMethod === "QRIS"
                    ? "qr"
                    : order.paymentMethod === "Poin"
                      ? "coins"
                      : "pos"
                }
                size={22}
                color={brand[700]}
              />
              <UiText
                color={LABEL_INK}
                style={{
                  flex: 1,
                  fontSize: 16,
                  lineHeight: 21,
                  fontFamily: fontFamilies.bold,
                }}
              >
                {order.paymentMethod}
              </UiText>
              <UiText
                color={LABEL_INK}
                style={{
                  fontSize: 16,
                  lineHeight: 21,
                  fontFamily: fontFamilies.extrabold,
                }}
              >
                {formatRupiah(order.paid)}
              </UiText>
            </View>
            {unpaid && !cancelled ? (
              <PressableScale
                onPress={() => router.push(`/qris?order=${order.id}`)}
                scaleTo={0.99}
                style={{
                  marginTop: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 12,
                  backgroundColor: "#EAF0FF",
                  paddingHorizontal: 14,
                  paddingVertical: 11,
                }}
              >
                <UiText
                  color={brand[700]}
                  style={{
                    flex: 1,
                    fontSize: 13.5,
                    lineHeight: 18,
                    fontFamily: fontFamilies.semibold,
                  }}
                >
                  {order.paymentMethod === "QRIS"
                    ? "Pembayaran belum selesai"
                    : "Lebih praktis, bayar pakai QRIS"}
                </UiText>
                <UiText
                  color={brand[700]}
                  style={{
                    fontSize: 15,
                    lineHeight: 19,
                    fontFamily: fontFamilies.bold,
                  }}
                >
                  {order.paymentMethod === "QRIS" ? "Bayar" : "Ganti"}
                </UiText>
                <Glyph name="chevronRight" size={11} color={brand[700]} />
              </PressableScale>
            ) : cancelled && order.paidAt && order.paymentMethod !== "Poin" ? (
              <View
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 12,
                  backgroundColor: "#F2F3F5",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                }}
              >
                <Glyph name="refresh" size={13} color={QUIET_INK} />
                <UiText
                  color={QUIET_INK}
                  style={{
                    flex: 1,
                    fontSize: 12.5,
                    lineHeight: 16,
                    fontFamily: fontFamilies.semibold,
                  }}
                >
                  Dana dikembalikan ke rekening asal maks. 1×24 jam.
                </UiText>
              </View>
            ) : !cancelled ? (
              <View
                style={{
                  marginTop: 10,
                  alignSelf: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  borderRadius: 12,
                  backgroundColor: "#E3F6E9",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Glyph name="checkCircle" size={13} color="#0F8A3C" />
                <UiText
                  color="#0F8A3C"
                  style={{
                    fontSize: 12.5,
                    lineHeight: 16,
                    fontFamily: fontFamilies.bold,
                  }}
                >
                  Lunas
                </UiText>
              </View>
            ) : null}
          </Block>

          <Block style={{ padding: 16 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
            >
              <CutleryIcon size={22} crossed={!order.cutlery} />
              <UiText
                color={LABEL_INK}
                style={{
                  fontSize: 15.5,
                  lineHeight: 20,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                {order.cutlery
                  ? "Dengan alat makan/sedotan"
                  : "Tanpa alat makan/sedotan"}
              </UiText>
            </View>
          </Block>

          {/* the bill */}
          <Block style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <SectionTitle>Rincian pembayaran</SectionTitle>
            <View style={{ marginTop: 6 }}>
              <SumRow label="Harga" value={formatRupiah(order.subtotal)} />
              <SumRow
                label="Pajak & pembulatan"
                value={formatRupiah(order.tax + order.rounding)}
              />
              {order.couponDiscount ? (
                <SumRow
                  label={order.couponTitle ?? "Potongan kupon"}
                  value={`-${formatRupiah(order.couponDiscount)}`}
                />
              ) : null}
              {order.pointsUsed ? (
                <SumRow
                  label="Poin dipakai"
                  value={`-${formatRupiah(order.pointsUsed)}`}
                />
              ) : null}
              <View
                style={{
                  marginVertical: 8,
                  borderTopWidth: 1,
                  borderStyle: "dashed",
                  borderColor: "#D5D8DE",
                }}
              />
              <SumRow
                bold
                label="Total pembayaran"
                value={formatRupiah(order.paid)}
              />
              {discounts > 0 ? (
                <UiText
                  color="#0F8A3C"
                  style={{
                    marginTop: 2,
                    fontSize: 12.5,
                    lineHeight: 17,
                    fontFamily: fontFamilies.semibold,
                  }}
                >
                  Kamu hemat {formatRupiah(discounts)} di pesanan ini.
                </UiText>
              ) : null}
            </View>
          </Block>

          <Block style={{ padding: 16 }}>
            <PressableScale
              onPress={copy}
              scaleTo={0.99}
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <UiText
                color={LABEL_INK}
                style={{
                  fontSize: 16,
                  lineHeight: 21,
                  fontFamily: fontFamilies.bold,
                }}
              >
                {order.nota}
              </UiText>
              <Glyph name="copy" size={15} color={QUIET_INK} />
            </PressableScale>
            <UiText
              color="#6B7488"
              style={{
                marginTop: 3,
                fontSize: 13.5,
                lineHeight: 18,
                fontFamily: fontFamilies.medium,
              }}
            >
              {today ? `Hari ini, ${clock(placedAt)}` : order.createdAt}
            </UiText>
          </Block>

          {/* help */}
          <OrderHelpCard
            orderId={order.id}
            orderCode={order.orderCode}
            stage={stage}
            cancelled={cancelled}
          />

          <PressableScale
            onPress={() => router.push("/order-history")}
            scaleTo={0.99}
            style={{ alignSelf: "center", paddingVertical: 8 }}
          >
            <UiText
              color={brand[700]}
              style={{
                fontSize: 15,
                lineHeight: 19,
                fontFamily: fontFamilies.bold,
              }}
            >
              Lihat Riwayat Pesanan
            </UiText>
          </PressableScale>
        </View>
      </ScrollView>

      {/* a nudge to another brand, until closed */}
      {bannerOpen && !cancelled ? (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            paddingBottom: Math.max(insets.bottom, 10),
            backgroundColor: "#FFF6F0",
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            overflow: "visible",
          }}
        >
          <LinearGradient
            colors={[
              "rgba(255,255,255,0)",
              "#F2B90C",
              "#E5484D",
              "rgba(255,255,255,0)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 3,
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
            }}
          />
          <PressableScale
            onPress={tryOtherBrand}
            scaleTo={0.99}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 6,
            }}
          >
            <BrandLogo brandId="lesung-pipi" size={40} />
            <View style={{ flex: 1 }}>
              <UiText
                color={LABEL_INK}
                style={{
                  fontSize: 16,
                  lineHeight: 21,
                  fontFamily: fontFamilies.extrabold,
                }}
              >
                Mau coba brand lain?
              </UiText>
              <UiText
                color={QUIET_INK}
                numberOfLines={1}
                style={{
                  fontSize: 13,
                  lineHeight: 18,
                  fontFamily: fontFamilies.medium,
                }}
              >
                Dimsum Lesung Pipi, promo berakhir malam ini.
              </UiText>
            </View>
            <Glyph name="arrowRight" size={17} color={brand[700]} />
          </PressableScale>
          <PressableScale
            onPress={() => setBannerOpen(false)}
            hitSlop={8}
            style={{
              position: "absolute",
              right: 14,
              top: -18,
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: RULE,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Glyph name="close" size={12} color={QUIET_INK} />
          </PressableScale>
        </View>
      ) : null}

      {confirmCancel ? (
        <ConfirmDialog
          title="Batalkan pesanan?"
          message="Kupon dan poin yang kamu pakai akan dikembalikan."
          cancelLabel="Tidak"
          confirmLabel="Ya, batalkan"
          cancelColor={QUIET_INK}
          confirmColor={danger[500]}
          onCancel={() => setConfirmCancel(false)}
          onConfirm={() => {
            setConfirmCancel(false);
            if (orderStage(order, Date.now()) !== 0) {
              tapError();
              showToast("Outlet sudah mulai menyiapkan pesananmu", "error");
              return;
            }
            cancelOrder(order);
            tapSuccess();
            showToast("Pesanan dibatalkan", "info");
          }}
        />
      ) : null}
    </View>
  );
}
