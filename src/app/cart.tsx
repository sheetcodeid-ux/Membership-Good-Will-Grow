import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { PressableScale } from "../components/ui/PressableScale";
import { Glyph } from "../components/icons/Glyph";
import { BrandLogo } from "../components/BrandLogo";
import { AccountEmpty } from "../components/EmptyArt";
import { LABEL_INK, QUIET_INK, RULE } from "../components/AccountMenu";
import { CartLineRow } from "../components/checkout/CartLineRow";
import { Block, EDGE, OutlinePill, SumRow } from "../components/checkout/parts";
import { NoteSheet, SERVICE_META } from "../components/checkout/CheckoutSheets";
import { brand, danger, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { formatRupiah } from "../utils/format";
import { computeBreakdown } from "../utils/pricing";
import { tapPress } from "../utils/haptics";
import { getOutlet, outletFullName } from "../data/mock";
import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";
import { useScrolled } from "../hooks/useScrolled";
import type { CartLine } from "../data/types";

/**
 * Keranjang: the outlet the order goes to, the lines (the same rows as
 * checkout, with a note per item), and the bill before promos; coupons,
 * points and the way to pay come on the next page.
 */
export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const scroll = useScrolled();
  const lines = useCartStore((s) => s.lines);
  const setLineQty = useCartStore((s) => s.setLineQty);
  const setLineNote = useCartStore((s) => s.setLineNote);
  const removeLine = useCartStore((s) => s.removeLine);
  const subtotal = useCartStore((s) => s.subtotal());
  const itemCount = useCartStore((s) => s.itemCount());

  const outletId = useOrderStore((s) => s.outletId);
  const serviceType = useOrderStore((s) => s.serviceType);
  const reopenOutletSheet = useOrderStore((s) => s.reopenOutletSheet);
  const outlet = getOutlet(outletId);

  const [removing, setRemoving] = useState<CartLine | null>(null);
  const [noteLine, setNoteLine] = useState<CartLine | null>(null);

  const breakdown = computeBreakdown(subtotal, false, 0);

  if (lines.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: surface }}>
        <StatusBar style="dark" />
        <AppHeader tone="account" title="Keranjang" />
        <AccountEmpty
          glyph="cart"
          title="Keranjang masih kosong"
          subtitle="Pilih menu favoritmu dulu, nanti muncul di sini."
          action={{
            label: "Pilih menu",
            onPress: () => router.replace("/order"),
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader tone="account" title="Keranjang" divider={scroll.scrolled} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scroll.onScroll}
        scrollEventThrottle={scroll.scrollEventThrottle}
        contentContainerStyle={{ padding: EDGE, paddingBottom: 28, gap: 12 }}
      >
        {outlet ? (
          <Block style={{ padding: 14 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <BrandLogo brandId={outlet.brandId} size={32} />
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
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <Glyph
                    name={SERVICE_META[serviceType].glyph}
                    size={12}
                    color={brand[700]}
                  />
                  <UiText
                    color={QUIET_INK}
                    style={{
                      fontSize: 12.5,
                      lineHeight: 17,
                      fontFamily: fontFamilies.semibold,
                    }}
                  >
                    {SERVICE_META[serviceType].label} · {outlet.city}
                  </UiText>
                </View>
              </View>
              <OutlinePill
                label="Ubah"
                onPress={() => {
                  // Back to Daftar Menu with the outlet sheet open.
                  reopenOutletSheet();
                  router.dismissTo("/order");
                }}
              />
            </View>
          </Block>
        ) : null}

        <Block>
          {lines.map((line, i) => (
            <View key={line.lineId}>
              {i > 0 ? (
                <View
                  style={{
                    height: 1,
                    backgroundColor: RULE,
                    marginHorizontal: 16,
                  }}
                />
              ) : null}
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
          <View style={{ height: 1, backgroundColor: RULE }} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              padding: 16,
            }}
          >
            <View style={{ flex: 1 }}>
              <UiText
                color={LABEL_INK}
                style={{
                  fontSize: 17,
                  lineHeight: 22,
                  fontFamily: fontFamilies.extrabold,
                }}
              >
                Butuh yang lain?
              </UiText>
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
            <OutlinePill
              label="Tambah"
              onPress={() => router.dismissTo("/order")}
            />
          </View>
        </Block>

        <View style={{ marginTop: 6, marginLeft: 2 }}>
          <UiText
            color={LABEL_INK}
            style={{
              fontSize: 17,
              lineHeight: 22,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            Rincian pembayaran
          </UiText>
        </View>
        <Block style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
          <SumRow label="Harga" value={formatRupiah(breakdown.subtotal)} />
          <SumRow label="PB1 10%" value={formatRupiah(breakdown.tax)} />
          <SumRow label="Pembulatan" value={formatRupiah(breakdown.rounding)} />
          <View
            style={{
              marginVertical: 8,
              borderTopWidth: 1,
              borderStyle: "dashed",
              borderColor: "#D5D8DE",
            }}
          />
          <SumRow bold label="Total" value={formatRupiah(breakdown.total)} />
        </Block>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            borderRadius: 14,
            backgroundColor: "#FFF8E1",
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <Glyph name="ticketPercent" size={16} color="#A36A00" />
          <UiText
            color="#7A4B00"
            style={{
              flex: 1,
              fontSize: 13,
              lineHeight: 18,
              fontFamily: fontFamilies.semibold,
            }}
          >
            Kupon, voucher dan poin bisa dipakai di langkah berikutnya.
          </UiText>
        </View>
      </ScrollView>

      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: RULE,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 12),
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <UiText
            color={QUIET_INK}
            style={{
              fontSize: 12.5,
              lineHeight: 16,
              fontFamily: fontFamilies.medium,
            }}
          >
            Total · {itemCount} item
          </UiText>
          <UiText
            color={LABEL_INK}
            style={{
              fontSize: 18,
              lineHeight: 23,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            {formatRupiah(breakdown.total)}
          </UiText>
        </View>
        <PressableScale
          onPress={() => {
            tapPress();
            router.push("/checkout");
          }}
          scaleTo={0.97}
          style={{
            height: 50,
            paddingHorizontal: 26,
            borderRadius: 25,
            backgroundColor: brand[600],
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
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
            Lanjut bayar
          </UiText>
          <Glyph name="arrowRight" size={15} color="#FFFFFF" />
        </PressableScale>
      </View>

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

      {removing ? (
        <ConfirmDialog
          title="Hapus item ini?"
          message={`${removing.menuItem.name} akan dihapus dari keranjang.`}
          cancelLabel="Batal"
          confirmLabel="Hapus"
          cancelColor={QUIET_INK}
          confirmColor={danger[500]}
          onCancel={() => setRemoving(null)}
          onConfirm={() => {
            removeLine(removing.lineId);
            setRemoving(null);
          }}
        />
      ) : null}
    </View>
  );
}
