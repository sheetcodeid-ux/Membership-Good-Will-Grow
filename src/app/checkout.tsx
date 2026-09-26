import React, { useState } from "react";
import { Platform, ScrollView, TextInput, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { PressableScale } from "../components/ui/PressableScale";
import { Glyph } from "../components/icons/Glyph";
import { BrandLogo } from "../components/BrandLogo";
import { EmptyArt, AccountEmpty } from "../components/EmptyArt";
import { CartLineRow } from "../components/checkout/CartLineRow";
import { useScrolled } from "../hooks/useScrolled";
import {
  LABEL_INK,
  QUIET_INK,
  RULE,
  WARN_INK,
} from "../components/AccountMenu";
import {
  Block,
  Checkbox,
  CutleryIcon,
  EDGE,
  OutlinePill,
  Radio,
  SumRow,
} from "../components/checkout/parts";
import {
  GiftSheet,
  NoteSheet,
  OutletSheet,
  PaymentMethodSheet,
  SERVICE_META,
  ServiceTypeSheet,
} from "../components/checkout/CheckoutSheets";
import { brand, danger, success, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { formatRupiah } from "../utils/format";
import { computeBreakdown } from "../utils/pricing";
import { checkCoupon } from "../utils/coupons";
import { placeOrder } from "../utils/orderFlow";
import { menuItems, outletFullName } from "../data/mock";
import {
  defaultSelections,
  unitPrice,
  useCartStore,
} from "../store/cartStore";
import { MAX_ORDER_DISTANCE_KM, useOrderStore } from "../store/orderStore";
import { useMemberStore } from "../store/memberStore";
import { useOrdersStore } from "../store/ordersStore";
import { showToast } from "../store/toastStore";
import { isVoucher, useCheckout } from "../hooks/useCheckout";
import { tapPress, tapSelect, tapSuccess } from "../utils/haptics";
import type { CartLine } from "../data/types";

const SAVE_INK = "#0F8A3C";

function Title({ children }: { children: string }) {
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

function Hairline({ inset = 0 }: { inset?: number }) {
  return (
    <View
      style={{ height: 1, backgroundColor: RULE, marginHorizontal: inset }}
    />
  );
}

/** "Yay! Kamu hemat Rp 9.500 di pesanan ini." under the header. */
function SavingsStrip({ amount }: { amount: number }) {
  return (
    <View
      style={{
        marginHorizontal: EDGE,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: success[50],
      }}
    >
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: SAVE_INK,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Glyph name="ticketPercent" size={15} color="#FFFFFF" />
      </View>
      <UiText
        color={SAVE_INK}
        style={{
          flex: 1,
          fontSize: 14,
          lineHeight: 19,
          fontFamily: fontFamilies.medium,
        }}
      >
        Yay! Kamu hemat{" "}
        <UiText
          color={SAVE_INK}
          style={{
            fontSize: 14,
            lineHeight: 19,
            fontFamily: fontFamilies.extrabold,
          }}
        >
          {formatRupiah(amount)}
        </UiText>{" "}
        di pesanan ini.
      </UiText>
    </View>
  );
}

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const usePoints = useCartStore((s) => s.usePoints);
  const toggleUsePoints = useCartStore((s) => s.toggleUsePoints);
  const orderNote = useCartStore((s) => s.orderNote);
  const setOrderNote = useCartStore((s) => s.setOrderNote);
  const pickup = useCartStore((s) => s.pickup);
  const setPickup = useCartStore((s) => s.setPickup);
  const tableNumber = useCartStore((s) => s.tableNumber);
  const setTableNumber = useCartStore((s) => s.setTableNumber);
  const payMethod = useCartStore((s) => s.payMethod);
  const setPayMethod = useCartStore((s) => s.setPayMethod);
  const cutlery = useCartStore((s) => s.cutlery);
  const setCutlery = useCartStore((s) => s.setCutlery);
  const gift = useCartStore((s) => s.gift);
  const setGift = useCartStore((s) => s.setGift);
  const setLineQty = useCartStore((s) => s.setLineQty);
  const addLine = useCartStore((s) => s.addLine);

  const serviceType = useOrderStore((s) => s.serviceType);
  const setServiceType = useOrderStore((s) => s.setServiceType);
  const setOutlet = useOrderStore((s) => s.setOutlet);
  const points = useMemberStore((s) => s.points);

  const [sheet, setSheet] = useState<
    "service" | "outlet" | "note" | "gift" | "pay" | null
  >(null);
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState<CartLine | null>(null);
  const [feesOpen, setFeesOpen] = useState(false);
  const [noteLine, setNoteLine] = useState<CartLine | null>(null);
  const setLineNote = useCartStore((s) => s.setLineNote);
  const scroll = useScrolled();

  const { breakdown, coupon, check, held, lines, outlet } = useCheckout();
  const usable = held
    .filter((c) => !c.used)
    .filter((c) => checkCoupon(c, lines, outlet?.brandId).ok).length;
  const tooFar = (outlet?.distanceKm ?? 0) > MAX_ORDER_DISTANCE_KM;
  // What the order would cost with nothing taken off, struck through
  // beside the total once something is.
  const full = computeBreakdown(breakdown.subtotal, false, 0, 0).total;
  const saved = breakdown.couponDiscount + breakdown.pointsDiscount;
  const tableMissing = pickup === "table" && !tableNumber.trim();

  const inCart = new Set(lines.map((l) => l.menuItem.id));
  const extras = menuItems
    .filter((m) => m.brandId === outlet?.brandId && !inCart.has(m.id))
    .sort((a, b) => Number(!!b.isBestSeller) - Number(!!a.isBestSeller))
    .slice(0, 6);

  if (!outlet || lines.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: surface }}>
        <StatusBar style="dark" />
        <AppHeader tone="account" title="Selesaikan Pesanan" />
        <AccountEmpty
          glyph="cart"
          title="Keranjang masih kosong"
          subtitle="Pilih menu dulu, lalu selesaikan pesananmu di sini."
          action={{
            label: "Pilih menu",
            onPress: () => router.replace("/order"),
          }}
        />
      </View>
    );
  }

  const pickupOptions: {
    id: "self" | "table";
    title: string;
    hint: string;
    glyph: "footprints" | "armchair";
    off?: string;
  }[] = [
    {
      id: "self",
      title: "Ambil sendiri",
      hint: "Kami panggil namamu di kasir",
      glyph: "footprints",
    },
    {
      id: "table",
      title: "Antar ke meja",
      hint: "Pesanan diantar ke mejamu",
      glyph: "armchair",
      off: serviceType === "dine_in" ? undefined : "Hanya untuk Dine In",
    },
  ];

  const place = () => {
    setConfirming(false);
    const id = placeOrder();
    if (!id) return;
    tapSuccess();
    const order = useOrdersStore.getState().placed.find((o) => o.id === id);
    if (order?.status === "belum-bayar" && order.paymentMethod === "QRIS") {
      router.replace(`/qris?order=${id}`);
    } else {
      router.replace(`/order-success?id=${id}`);
    }
  };

  const payLabel =
    breakdown.finalTotal === 0 && usePoints
      ? "Poin Good Will Grow"
      : payMethod === "qris"
        ? usePoints
          ? "QRIS + Poin"
          : "QRIS"
        : usePoints
          ? "Bayar di kasir + Poin"
          : "Bayar di kasir";

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader
        tone="account"
        title={outletFullName(outlet)}
        divider={scroll.scrolled}
      >
        {saved > 0 ? <SavingsStrip amount={saved} /> : null}
      </AppHeader>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scroll.onScroll}
        scrollEventThrottle={scroll.scrollEventThrottle}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: EDGE, paddingBottom: 28, gap: 12 }}
      >
        {/* How the order is served, and how it reaches the member. */}
        <Block style={{ borderColor: brand[200], borderWidth: 1.5 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingLeft: 12,
              paddingRight: 14,
              paddingVertical: 12,
              backgroundColor: "#F3F7FF",
            }}
          >
            <EmptyArt glyph={SERVICE_META[serviceType].glyph} size={52} />
            <View style={{ flex: 1 }}>
              <UiText
                color={LABEL_INK}
                style={{
                  fontSize: 17,
                  lineHeight: 22,
                  fontFamily: fontFamilies.extrabold,
                }}
              >
                {SERVICE_META[serviceType].label}
              </UiText>
              <UiText
                color={QUIET_INK}
                style={{
                  fontSize: 13,
                  lineHeight: 17,
                  fontFamily: fontFamilies.medium,
                }}
              >
                {SERVICE_META[serviceType].hint}
              </UiText>
            </View>
            <OutlinePill label="Ubah" onPress={() => setSheet("service")} />
          </View>
          {pickupOptions.map((o) => {
            const on = pickup === o.id && !o.off;
            return (
              <PressableScale
                key={o.id}
                disabled={!!o.off}
                onPress={() => {
                  tapSelect();
                  setPickup(o.id);
                }}
                scaleTo={0.99}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  paddingVertical: 13,
                  paddingLeft: 16,
                  paddingRight: 14,
                  backgroundColor: on ? "#E6EEFF" : "#FFFFFF",
                  borderTopWidth: 1,
                  borderTopColor: on ? "#D4E0FB" : RULE,
                }}
              >
                {on ? (
                  <View
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 10,
                      bottom: 10,
                      width: 4,
                      borderTopRightRadius: 3,
                      borderBottomRightRadius: 3,
                      backgroundColor: brand[600],
                    }}
                  />
                ) : null}
                <Glyph
                  name={o.glyph}
                  size={20}
                  color={o.off ? "#B0B7C6" : brand[700]}
                />
                <View style={{ flex: 1 }}>
                  <UiText
                    color={o.off ? "#8A93A6" : LABEL_INK}
                    style={{
                      fontSize: 15,
                      lineHeight: 19,
                      fontFamily: fontFamilies.bold,
                    }}
                  >
                    {o.title}
                  </UiText>
                  <UiText
                    color={o.off ? "#8A93A6" : on ? brand[700] : QUIET_INK}
                    style={{
                      fontSize: 12.5,
                      lineHeight: 17,
                      fontFamily: fontFamilies.semibold,
                    }}
                  >
                    {o.off ?? o.hint}
                  </UiText>
                </View>
                <Radio on={on} disabled={!!o.off} />
              </PressableScale>
            );
          })}
          {pickup === "table" && serviceType === "dine_in" ? (
            <View
              style={{
                paddingHorizontal: 16,
                paddingBottom: 14,
                backgroundColor: "#E6EEFF",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  height: 44,
                  borderRadius: 12,
                  borderWidth: tableMissing ? 1.5 : 1,
                  borderColor: tableMissing ? WARN_INK : "#C9D6F5",
                  backgroundColor: "#FFFFFF",
                  paddingHorizontal: 12,
                }}
              >
                <Glyph name="hash" size={14} color={QUIET_INK} />
                <TextInput
                  value={tableNumber}
                  onChangeText={setTableNumber}
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholder="Nomor meja (lihat di stiker meja)"
                  placeholderTextColor="#8A93A6"
                  style={[
                    {
                      flex: 1,
                      minWidth: 0,
                      padding: 0,
                      fontFamily: fontFamilies.semibold,
                      fontSize: 15,
                      color: LABEL_INK,
                    },
                    Platform.OS === "web"
                      ? ({ outlineStyle: "none" } as object)
                      : null,
                  ]}
                />
              </View>
              <UiText
                color={QUIET_INK}
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: fontFamilies.medium,
                }}
              >
                Pindah meja? Kabari kasir, ya.
              </UiText>
            </View>
          ) : null}
        </Block>

        {/* Where the order is made, with the note for the outlet. */}
        <Block style={{ padding: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <BrandLogo brandId={outlet.brandId} size={30} />
            <View style={{ flex: 1 }}>
              <UiText
                color={LABEL_INK}
                numberOfLines={1}
                style={{
                  fontSize: 16,
                  lineHeight: 21,
                  fontFamily: fontFamilies.extrabold,
                }}
              >
                {outletFullName(outlet)}
              </UiText>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <UiText
                  color={QUIET_INK}
                  numberOfLines={1}
                  style={{
                    flexShrink: 1,
                    fontSize: 12.5,
                    lineHeight: 17,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  {outlet.address} ·
                </UiText>
                <UiText
                  color={tooFar ? danger[500] : QUIET_INK}
                  style={{
                    fontSize: 12.5,
                    lineHeight: 17,
                    fontFamily: fontFamilies.bold,
                  }}
                >
                  {outlet.distanceKm.toFixed(1)} km
                </UiText>
              </View>
            </View>
            <OutlinePill label="Ubah" onPress={() => setSheet("outlet")} />
          </View>
          {tooFar ? (
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                borderRadius: 10,
                backgroundColor: danger[50],
                paddingHorizontal: 10,
                paddingVertical: 7,
              }}
            >
              <Glyph name="alertCircle" size={13} color={danger[500]} />
              <UiText
                color={danger[500]}
                style={{
                  flex: 1,
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                Kamu lebih dari {MAX_ORDER_DISTANCE_KM.toFixed(1)} km dari
                outlet ini.
              </UiText>
            </View>
          ) : null}
          <PressableScale
            onPress={() => setSheet("note")}
            scaleTo={0.99}
            style={{
              marginTop: 12,
              marginLeft: 42,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              borderRadius: 18,
              backgroundColor: "#F2F3F5",
              paddingHorizontal: 14,
              paddingVertical: 9,
            }}
          >
            <UiText
              color={orderNote ? LABEL_INK : "#6B7488"}
              numberOfLines={1}
              style={{
                flex: 1,
                fontSize: 14,
                lineHeight: 18,
                fontFamily: fontFamilies.medium,
              }}
            >
              {orderNote || "Tambah catatan untuk outlet"}
            </UiText>
            <Glyph name="pencil" size={13} color={QUIET_INK} />
          </PressableScale>
        </Block>

        {/* The items, then more from the same menu. */}
        <Block>
          {lines.map((line, i) => (
            <View key={line.lineId}>
              {i > 0 ? <Hairline inset={16} /> : null}
              <CartLineRow
                line={line}
                onQty={(n) => {
                  if (n <= 0) setRemoving(line);
                  else setLineQty(line.lineId, n);
                }}
                onNote={() => setNoteLine(line)}
              />
            </View>
          ))}

          {extras.length > 0 ? (
            <>
              <Hairline />
              <View style={{ paddingTop: 16 }}>
                <View style={{ paddingHorizontal: 16 }}>
                  <Title>Lengkapi pesananmu</Title>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    padding: 16,
                    paddingTop: 12,
                    gap: 10,
                  }}
                >
                  {extras.map((m) => {
                    const sel = defaultSelections(m.optionGroups);
                    return (
                      <View
                        key={m.id}
                        style={{
                          width: 232,
                          flexDirection: "row",
                          gap: 10,
                          borderRadius: 16,
                          borderWidth: 1,
                          borderColor: RULE,
                          padding: 10,
                        }}
                      >
                        <ImagePlaceholder
                          seed={m.id}
                          radius={12}
                          iconSize={16}
                          style={{ width: 70, height: 70 }}
                        />
                        <View
                          style={{ flex: 1, justifyContent: "space-between" }}
                        >
                          <View>
                            <UiText
                              color={LABEL_INK}
                              numberOfLines={2}
                              style={{
                                fontSize: 14,
                                lineHeight: 18,
                                fontFamily: fontFamilies.bold,
                              }}
                            >
                              {m.name}
                            </UiText>
                            <UiText
                              color={QUIET_INK}
                              style={{
                                marginTop: 2,
                                fontSize: 12.5,
                                lineHeight: 16,
                                fontFamily: fontFamilies.medium,
                              }}
                            >
                              {formatRupiah(unitPrice(m, sel))}
                            </UiText>
                          </View>
                          <View
                            style={{ alignItems: "flex-end", marginTop: 6 }}
                          >
                            <OutlinePill
                              small
                              label="Tambah"
                              onPress={() => {
                                tapSuccess();
                                addLine(m, 1, sel);
                                showToast(`${m.name} ditambahkan`);
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </>
          ) : null}

          <Hairline />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              padding: 16,
            }}
          >
            <View style={{ flex: 1 }}>
              <Title>Butuh yang lain?</Title>
              <UiText
                color={QUIET_INK}
                style={{
                  marginTop: 2,
                  fontSize: 13.5,
                  lineHeight: 18,
                  fontFamily: fontFamilies.medium,
                }}
              >
                Tambah menu lain, kalau mau.
              </UiText>
            </View>
            <OutlinePill label="Tambah" onPress={() => router.push("/order")} />
          </View>
        </Block>

        {/* Promo: the one on the order, and the way to the others. */}
        <Block>
          <PressableScale
            onPress={() => {
              tapPress();
              router.push("/checkout-promos");
            }}
            scaleTo={0.99}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              padding: 14,
              backgroundColor: coupon && check?.ok ? "#F1FBF4" : "#FFFFFF",
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: coupon && check?.ok ? "#DDF5E4" : "#FFF3C4",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Glyph
                name="ticketPercent"
                size={22}
                color={coupon && check?.ok ? SAVE_INK : "#A36A00"}
              />
            </View>
            <View style={{ flex: 1 }}>
              <UiText
                color={LABEL_INK}
                numberOfLines={2}
                style={{
                  fontSize: 15,
                  lineHeight: 20,
                  fontFamily: fontFamilies.bold,
                }}
              >
                {coupon ? coupon.title : "Pakai promo biar makin hemat"}
              </UiText>
              <UiText
                color={
                  coupon && check && !check.ok
                    ? WARN_INK
                    : coupon
                      ? SAVE_INK
                      : usable
                        ? brand[700]
                        : QUIET_INK
                }
                style={{
                  marginTop: 2,
                  fontSize: 12.5,
                  lineHeight: 17,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                {coupon && check && !check.ok
                  ? `Belum berlaku: ${check.reason}`
                  : coupon && check?.ok
                    ? `Hemat ${formatRupiah(check.amount)} · ${isVoucher(coupon) ? "Voucher" : "Kupon"} berakhir dalam ${coupon.daysLeft} hari`
                    : usable
                      ? `${usable} promo bisa dipakai untuk pesanan ini`
                      : "Belum ada promo yang cocok"}
              </UiText>
            </View>
            {coupon && check?.ok ? (
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: SAVE_INK,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Glyph name="check" size={14} color="#FFFFFF" />
              </View>
            ) : (
              <Glyph name="chevronRight" size={13} color={QUIET_INK} />
            )}
          </PressableScale>
          <Hairline />
          <PressableScale
            onPress={() => router.push("/checkout-promos")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 14,
            }}
          >
            <UiText
              color={brand[700]}
              style={{
                flex: 1,
                fontSize: 15,
                lineHeight: 19,
                fontFamily: fontFamilies.bold,
              }}
            >
              Cek promo lainnya
            </UiText>
            <Glyph name="arrowRight" size={17} color={brand[700]} />
          </PressableScale>
        </Block>

        {/* The bill. */}
        <View style={{ marginTop: 6, marginLeft: 2 }}>
          <Title>Rincian pembayaran</Title>
        </View>
        <Block style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
          <SumRow label="Harga" value={formatRupiah(breakdown.subtotal)} />
          <PressableScale onPress={() => setFeesOpen((v) => !v)} scaleTo={1}>
            <SumRow
              label={
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <UiText
                    color="#4C4C4C"
                    style={{
                      fontSize: 15,
                      lineHeight: 20,
                      fontFamily: fontFamilies.medium,
                    }}
                  >
                    Pajak & pembulatan
                  </UiText>
                  <Glyph
                    name="chevronRight"
                    size={11}
                    color={QUIET_INK}
                    rotate={feesOpen ? 270 : 90}
                  />
                </View>
              }
              value={formatRupiah(breakdown.tax + breakdown.rounding)}
            />
          </PressableScale>
          {feesOpen ? (
            <View
              style={{
                paddingLeft: 12,
                borderLeftWidth: 2,
                borderLeftColor: RULE,
                marginBottom: 4,
              }}
            >
              <SumRow label="PB1 10%" value={formatRupiah(breakdown.tax)} />
              <SumRow
                label="Pembulatan"
                value={formatRupiah(breakdown.rounding)}
              />
            </View>
          ) : null}
          {breakdown.couponDiscount > 0 ? (
            <SumRow
              tone="save"
              label={
                coupon && isVoucher(coupon)
                  ? "Potongan voucher"
                  : "Potongan kupon"
              }
              value={`-${formatRupiah(breakdown.couponDiscount)}`}
            />
          ) : null}
          {breakdown.pointsDiscount > 0 ? (
            <SumRow
              tone="save"
              label={`Poin dipakai (${breakdown.pointsDiscount.toLocaleString("id-ID")})`}
              value={`-${formatRupiah(breakdown.pointsDiscount)}`}
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 6,
              gap: 8,
            }}
          >
            <UiText
              color={LABEL_INK}
              style={{
                flex: 1,
                fontSize: 17,
                lineHeight: 22,
                fontFamily: fontFamilies.extrabold,
              }}
            >
              Total bayar
            </UiText>
            {saved > 0 ? (
              <UiText
                color="#8A93A6"
                style={{
                  fontSize: 15,
                  lineHeight: 20,
                  fontFamily: fontFamilies.medium,
                  textDecorationLine: "line-through",
                }}
              >
                {formatRupiah(full)}
              </UiText>
            ) : null}
            <UiText
              color={LABEL_INK}
              style={{
                fontSize: 17,
                lineHeight: 22,
                fontFamily: fontFamilies.extrabold,
              }}
            >
              {formatRupiah(breakdown.finalTotal)}
            </UiText>
          </View>
        </Block>

        {/* Points nudge, until they are on the bill. */}
        {!usePoints && points > 0 ? (
          <Block style={{ padding: 16 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#FFF3C4",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Glyph name="coins" size={20} color="#A36A00" />
              </View>
              <View style={{ flex: 1 }}>
                <UiText
                  color={LABEL_INK}
                  style={{
                    fontSize: 15,
                    lineHeight: 20,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  Kamu punya{" "}
                  <UiText
                    color={LABEL_INK}
                    style={{
                      fontSize: 15,
                      lineHeight: 20,
                      fontFamily: fontFamilies.extrabold,
                    }}
                  >
                    {points.toLocaleString("id-ID")} poin
                  </UiText>
                  . Pakai untuk potong tagihan, 1 poin = Rp 1.
                </UiText>
                <PressableScale
                  onPress={() => {
                    tapSuccess();
                    toggleUsePoints();
                    showToast("Poin dipakai untuk pesanan ini");
                  }}
                  scaleTo={0.96}
                  style={{
                    alignSelf: "flex-start",
                    marginTop: 10,
                    height: 38,
                    paddingHorizontal: 18,
                    borderRadius: 19,
                    backgroundColor: "#EAF0FF",
                    justifyContent: "center",
                  }}
                >
                  <UiText
                    color={brand[700]}
                    style={{
                      fontSize: 14.5,
                      lineHeight: 18,
                      fontFamily: fontFamilies.bold,
                    }}
                  >
                    Pakai poin
                  </UiText>
                </PressableScale>
              </View>
            </View>
          </Block>
        ) : null}

        {/* Cutlery and gift. */}
        <Block>
          <PressableScale
            onPress={() => {
              tapSelect();
              setCutlery(!cutlery);
            }}
            scaleTo={0.99}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              padding: 16,
            }}
          >
            <CutleryIcon size={24} />
            <View style={{ flex: 1 }}>
              <UiText
                color={LABEL_INK}
                style={{
                  fontSize: 16,
                  lineHeight: 21,
                  fontFamily: fontFamilies.bold,
                }}
              >
                Minta alat makan/sedotan
              </UiText>
              <UiText
                color={QUIET_INK}
                style={{
                  fontSize: 13,
                  lineHeight: 18,
                  fontFamily: fontFamilies.medium,
                }}
              >
                Centang kalau perlu. Yuk, kurangi sampah!
              </UiText>
            </View>
            <Checkbox on={cutlery} />
          </PressableScale>
          <Hairline inset={16} />
          <PressableScale
            onPress={() => setSheet("gift")}
            scaleTo={0.99}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              padding: 16,
            }}
          >
            <Glyph name="gift" size={22} color="#C8102E" />
            <View style={{ flex: 1 }}>
              <UiText
                color={LABEL_INK}
                style={{
                  fontSize: 16,
                  lineHeight: 21,
                  fontFamily: fontFamilies.bold,
                }}
              >
                {gift ? `Hadiah untuk ${gift.to}` : "Kirim sebagai hadiah"}
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
                {gift
                  ? gift.message || "Tanpa ucapan"
                  : "Tambah nama penerima dan ucapan."}
              </UiText>
            </View>
            <Glyph name="chevronRight" size={13} color={QUIET_INK} />
          </PressableScale>
        </Block>
      </ScrollView>

      {/* How it is paid and the order button, always in reach. */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: RULE,
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 12),
          gap: 10,
        }}
      >
        <PressableScale
          onPress={() => setSheet("pay")}
          scaleTo={0.99}
          style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: "#F2F5FC",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Glyph
              name={payMethod === "qris" ? "qr" : "pos"}
              size={19}
              color={brand[700]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <UiText
              color={QUIET_INK}
              style={{
                fontSize: 12.5,
                lineHeight: 16,
                fontFamily: fontFamilies.medium,
              }}
            >
              {payLabel}
            </UiText>
            <UiText
              color={LABEL_INK}
              style={{
                fontSize: 17,
                lineHeight: 22,
                fontFamily: fontFamilies.extrabold,
              }}
            >
              {formatRupiah(breakdown.finalTotal)}
            </UiText>
          </View>
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: "#3A3F4B",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Glyph name="more" size={16} color="#FFFFFF" />
          </View>
        </PressableScale>
        <PressableScale
          onPress={() => {
            if (tableMissing) {
              showToast("Isi nomor meja dulu, ya", "error");
              return;
            }
            tapPress();
            setConfirming(true);
          }}
          scaleTo={0.98}
          style={{
            height: 52,
            borderRadius: 26,
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
              fontFamily: fontFamilies.bold,
            }}
          >
            {payMethod === "cashier" && breakdown.finalTotal > 0
              ? "Pesan, bayar di kasir"
              : "Pesan sekarang"}
          </UiText>
        </PressableScale>
      </View>

      {sheet === "service" ? (
        <ServiceTypeSheet
          value={serviceType}
          available={outlet.services}
          onClose={() => setSheet(null)}
          onPick={(t) => {
            setServiceType(t);
            if (t !== "dine_in" && pickup === "table") setPickup("self");
            setSheet(null);
          }}
        />
      ) : null}
      {sheet === "outlet" ? (
        <OutletSheet
          brandId={outlet.brandId}
          value={outlet.id}
          onClose={() => setSheet(null)}
          onPick={(id) => {
            setOutlet(id);
            setSheet(null);
          }}
        />
      ) : null}
      {sheet === "note" ? (
        <NoteSheet
          value={orderNote}
          onClose={() => setSheet(null)}
          onSave={(v) => {
            setOrderNote(v);
            setSheet(null);
          }}
        />
      ) : null}
      {noteLine ? (
        <NoteSheet
          title={`Catatan ${noteLine.menuItem.name}`}
          placeholder="Contoh: tanpa bawang, es sedikit"
          value={noteLine.note ?? ""}
          onClose={() => setNoteLine(null)}
          onSave={(v) => {
            setLineNote(noteLine.lineId, v);
            setNoteLine(null);
          }}
        />
      ) : null}
      {sheet === "gift" ? (
        <GiftSheet
          value={gift}
          onClose={() => setSheet(null)}
          onSave={(g) => {
            setGift(g);
            setSheet(null);
            if (g) showToast(`Pesanan ini hadiah untuk ${g.to}`);
          }}
        />
      ) : null}
      {sheet === "pay" ? (
        <PaymentMethodSheet
          method={payMethod}
          usePoints={usePoints}
          points={points}
          onPick={setPayMethod}
          onTogglePoints={toggleUsePoints}
          onClose={() => setSheet(null)}
        />
      ) : null}

      {removing ? (
        <ConfirmDialog
          title="Hapus item ini?"
          message={`${removing.menuItem.name} akan dihapus dari pesanan.`}
          cancelLabel="Batal"
          confirmLabel="Hapus"
          cancelColor={QUIET_INK}
          confirmColor={danger[500]}
          onCancel={() => setRemoving(null)}
          onConfirm={() => {
            setLineQty(removing.lineId, 0);
            setRemoving(null);
          }}
        />
      ) : null}

      {confirming ? (
        <ConfirmDialog
          title="Pesanan sudah sesuai?"
          cancelLabel="Cek lagi"
          confirmLabel="Ya, pesan"
          cancelColor={brand[700]}
          confirmColor={brand[600]}
          variant="buttons"
          onCancel={() => setConfirming(false)}
          onConfirm={place}
        >
          <View style={{ gap: 8, marginTop: 12 }}>
            {[
              ["Outlet", outletFullName(outlet)],
              [
                "Tipe",
                `${SERVICE_META[serviceType].label} · ${
                  pickup === "table"
                    ? `Antar ke meja ${tableNumber}`
                    : "Ambil sendiri"
                }`,
              ],
              ["Bayar", `${payLabel} · ${formatRupiah(breakdown.finalTotal)}`],
            ].map(([k, v]) => (
              <View
                key={k}
                style={{
                  flexDirection: "row",
                  gap: 10,
                  borderRadius: 11,
                  backgroundColor: "#F3F7FF",
                  padding: 11,
                }}
              >
                <UiText
                  color={QUIET_INK}
                  style={{
                    width: 52,
                    fontSize: 13,
                    lineHeight: 18,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  {k}
                </UiText>
                <UiText
                  color={LABEL_INK}
                  style={{
                    flex: 1,
                    fontSize: 13.5,
                    lineHeight: 18,
                    fontFamily: fontFamilies.bold,
                  }}
                >
                  {v}
                </UiText>
              </View>
            ))}
            {tooFar ? (
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  borderRadius: 11,
                  backgroundColor: danger[50],
                  padding: 11,
                }}
              >
                <Glyph name="alertCircle" size={14} color={danger[500]} />
                <UiText
                  color={danger[500]}
                  style={{
                    flex: 1,
                    fontSize: 12.5,
                    lineHeight: 17,
                    fontFamily: fontFamilies.semibold,
                  }}
                >
                  Kamu lebih dari {MAX_ORDER_DISTANCE_KM.toFixed(1)} km dari
                  outlet. Pastikan bisa mengambilnya, ya.
                </UiText>
              </View>
            ) : null}
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                borderRadius: 11,
                backgroundColor: "#FFF8E1",
                padding: 11,
              }}
            >
              <Glyph name="clock" size={14} color={WARN_INK} />
              <UiText
                color={WARN_INK}
                style={{
                  flex: 1,
                  fontSize: 12.5,
                  lineHeight: 17,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                Pesanan hanya bisa dibatalkan dalam 1 menit, sebelum outlet
                mulai menyiapkannya.
              </UiText>
            </View>
          </View>
        </ConfirmDialog>
      ) : null}
    </View>
  );
}
