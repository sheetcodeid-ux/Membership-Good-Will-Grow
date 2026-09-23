import React, { useState } from "react";
import { Platform, ScrollView, TextInput, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Armchair,
  CircleAlert,
  Coins,
  Footprints,
  Pencil,
  QrCode,
  TriangleAlert,
} from "lucide-react-native";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { PressableScale } from "../components/ui/PressableScale";
import { BrandLogo } from "../components/BrandLogo";
import { OutletBar } from "../components/OutletBar";
import { brand, danger, ink, surface, warning } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { formatRupiah } from "../utils/format";
import { computeBreakdown } from "../utils/pricing";
import { getOutlet, outletFullName } from "../data/mock";
import { selectionSummary, unitPrice, useCartStore } from "../store/cartStore";
import { MAX_ORDER_DISTANCE_KM, useOrderStore } from "../store/orderStore";
import { useMemberStore } from "../store/memberStore";
import type { ServiceType } from "../data/types";

const serviceLabels: Record<ServiceType, string> = {
  dine_in: "Dine In",
  takeaway: "Take Away",
  delivery: "Delivery",
};

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 14,
        gap: 10,
        ...(shadow.xs as object),
      }}
    >
      {title ? <AppText variant="h3">{title}</AppText> : null}
      {children}
    </View>
  );
}

function Radio({ selected }: { selected: boolean }) {
  return (
    <View
      style={{
        width: 19,
        height: 19,
        borderRadius: 10,
        borderWidth: 1.8,
        borderColor: selected ? brand[900] : ink[300],
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {selected ? (
        <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: brand[900] }} />
      ) : null}
    </View>
  );
}

function AmountRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 5 }}>
      <AppText style={{ flex: 1 }} variant={bold ? "bodySemibold" : "body"} color={ink[800]}>
        {label}
      </AppText>
      <AppText variant={bold ? "bodySemibold" : "body"} color={ink[800]}>
        {value}
      </AppText>
    </View>
  );
}

export default function CheckoutScreen() {
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const usePoints = useCartStore((s) => s.usePoints);
  const toggleUsePoints = useCartStore((s) => s.toggleUsePoints);
  const orderNote = useCartStore((s) => s.orderNote);
  const setOrderNote = useCartStore((s) => s.setOrderNote);
  const pickup = useCartStore((s) => s.pickup);
  const setPickup = useCartStore((s) => s.setPickup);
  const tableNumber = useCartStore((s) => s.tableNumber);
  const setTableNumber = useCartStore((s) => s.setTableNumber);
  const couponId = useCartStore((s) => s.couponId);
  const setCoupon = useCartStore((s) => s.setCoupon);

  const outletId = useOrderStore((s) => s.outletId);
  const serviceType = useOrderStore((s) => s.serviceType);
  const outlet = getOutlet(outletId);
  const mintReceipt = useOrderStore((s) => s.mintReceipt);
  const points = useMemberStore((s) => s.points);

  const [confirming, setConfirming] = useState(false);

  // 1 point redeems Rp 1, capped at the bill.
  const breakdown = computeBreakdown(subtotal, usePoints, points);
  const tooFar = (outlet?.distanceKm ?? 0) > MAX_ORDER_DISTANCE_KM;

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <AppHeader title="Selesaikan Pesanan">
        <OutletBar outlet={outlet} serviceType={serviceType} />
      </AppHeader>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: 30, gap: 12 }}
      >
        <Card title="Opsi Pengambilan">
          <PressableScale
            onPress={() => setPickup("self")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              backgroundColor: brand[50],
              borderRadius: 12,
              padding: 12,
            }}
          >
            <Footprints size={22} color={brand[700]} />
            <View style={{ flex: 1 }}>
              <AppText variant="titleLg">Ambil Sendiri</AppText>
              <AppText variant="caption" color={ink[500]}>
                Ambil pesanan di kasir
              </AppText>
            </View>
            <Radio selected={pickup === "self"} />
          </PressableScale>

          <PressableScale
            onPress={() => setPickup("table")}
            style={{ backgroundColor: brand[50], borderRadius: 12, padding: 12, gap: 10 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Armchair size={22} color={brand[700]} />
              <View style={{ flex: 1 }}>
                <AppText variant="titleLg">Antar ke Meja</AppText>
                <AppText variant="caption" color={ink[500]}>
                  Antar ke mejamu
                </AppText>
              </View>
              <Radio selected={pickup === "table"} />
            </View>

            {pickup === "table" ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    height: 38,
                    borderRadius: 9,
                    backgroundColor: "#FFFFFF",
                    paddingHorizontal: 12,
                  }}
                >
                  <TextInput
                    value={tableNumber}
                    onChangeText={setTableNumber}
                    keyboardType="number-pad"
                    placeholder="Nomor meja"
                    placeholderTextColor={ink[400]}
                    style={[
                      {
                        flex: 1,
                        minWidth: 0,
                        padding: 0,
                        fontFamily: "Urbanist_400Regular",
                        fontSize: 12.5,
                        color: ink[900],
                      },
                      Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null,
                    ]}
                  />
                  <Pencil size={14} color={ink[500]} />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    backgroundColor: danger[50],
                    borderRadius: 9,
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                  }}
                >
                  <CircleAlert size={14} color={danger[500]} />
                  <AppText
                    variant="caption"
                    color={danger[500]}
                    style={{ flex: 1, fontStyle: "italic" }}
                  >
                    Beritahu kasir kalau kamu pindah ya!
                  </AppText>
                </View>
              </>
            ) : null}
          </PressableScale>
        </Card>

        <Card title="Ringkasan Pesanan">
          {lines.map((line) => (
            <View
              key={line.lineId}
              style={{ flexDirection: "row", alignItems: "center", gap: 11 }}
            >
              <ImagePlaceholder radius={10} iconSize={16} style={{ width: 46, height: 46 }} />
              <View style={{ flex: 1 }}>
                <AppText variant="titleLg" numberOfLines={1}>
                  {line.menuItem.name}
                </AppText>
                <AppText variant="caption" color={ink[400]} numberOfLines={1}>
                  {line.qty}× {selectionSummary(line.menuItem, line.selections)[0] ?? "Original"} @{" "}
                  {formatRupiah(unitPrice(line.menuItem, line.selections))}
                </AppText>
              </View>
              <AppText variant="titleLg" color={brand[800]}>
                {formatRupiah(unitPrice(line.menuItem, line.selections) * line.qty)}
              </AppText>
            </View>
          ))}
        </Card>

        <Card title="Catatan Pesanan">
          <View
            style={{
              minHeight: 74,
              borderRadius: 10,
              backgroundColor: ink[50],
              padding: 11,
            }}
          >
            <TextInput
              multiline
              maxLength={200}
              value={orderNote}
              onChangeText={setOrderNote}
              placeholder="Tekan Untuk Menambah Catatan"
              placeholderTextColor={ink[400]}
              style={[
                {
                  flex: 1,
                  minHeight: 38,
                  padding: 0,
                  textAlignVertical: "top",
                  fontFamily: "Urbanist_400Regular",
                  fontStyle: "italic",
                  fontSize: 12,
                  color: ink[900],
                },
                Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null,
              ]}
            />
            <AppText variant="micro" color={ink[400]} style={{ alignSelf: "flex-end" }}>
              {orderNote.length}/200
            </AppText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
            <CircleAlert size={13} color={warning[600]} />
            <AppText variant="caption" color={warning[600]}>
              Catatan akan disertakan dalam pesanan Anda
            </AppText>
          </View>
        </Card>

        <Card title="Metode Pembayaran">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              backgroundColor: brand[50],
              borderRadius: 12,
              padding: 12,
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 9,
                backgroundColor: "#FFFFFF",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <QrCode size={22} color={ink[900]} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText variant="titleLg">QRIS</AppText>
              <AppText variant="caption" color={ink[500]}>
                Kode QRIS akan ditampilkan saat melakukan checkout. Scan dengan bank atau dompet
                digital anda.
              </AppText>
            </View>
            <Radio selected />
          </View>
        </Card>

        <Card title="Potongan Biaya Produk">
          <PressableScale
            onPress={() => setCoupon(couponId ? undefined : "cp-3")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: brand[50],
              borderRadius: 12,
              paddingVertical: 13,
              paddingHorizontal: 12,
            }}
          >
            <AppText variant="titleLg" style={{ flex: 1 }}>
              Kupon
            </AppText>
            <Radio selected={!!couponId} />
          </PressableScale>
        </Card>

        <Card title="Detail Pembayaran">
          <View>
            <AmountRow label="Nominal Belanja" value={formatRupiah(breakdown.subtotal)} />
            <View style={{ height: 1, backgroundColor: ink[100] }} />
            <AmountRow label="Sub Total" value={formatRupiah(breakdown.subtotal)} bold />
            <AmountRow label="Pb1" value={formatRupiah(breakdown.tax)} />
            <AmountRow label="Pembulatan" value={formatRupiah(breakdown.rounding)} />
            <View style={{ height: 1, backgroundColor: ink[100] }} />
            <AmountRow label="Total Tagihan" value={formatRupiah(breakdown.total)} bold />
            {breakdown.pointsDiscount > 0 ? (
              <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 5 }}>
                <AppText variant="bodySemibold" color="#3F8F4A" style={{ flex: 1 }}>
                  Penggunaan Poin ({breakdown.pointsDiscount.toLocaleString("id-ID")})
                </AppText>
                <AppText variant="bodySemibold" color="#3F8F4A">
                  -{formatRupiah(breakdown.pointsDiscount)}
                </AppText>
              </View>
            ) : null}
            <View style={{ height: 1, backgroundColor: ink[100] }} />
            <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
              <AppText variant="h3" color={brand[800]} style={{ flex: 1 }}>
                Total Bayar
              </AppText>
              <AppText variant="h3" color={brand[800]}>
                {formatRupiah(breakdown.finalTotal)}
              </AppText>
            </View>
          </View>
        </Card>
      </ScrollView>

      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          ...(shadow.lg as object),
        }}
      >
        <SafeAreaView edges={["bottom"]}>
          <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, gap: 11 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: "#FDF6E3",
                borderRadius: 21,
                paddingVertical: 9,
                paddingHorizontal: 14,
              }}
            >
              <Coins size={17} color="#D9A441" />
              <AppText variant="titleLg" style={{ flex: 1 }}>
                {points.toLocaleString("id-ID")} Poin
              </AppText>
              <AppText variant="bodyMedium" color={ink[600]}>
                Gunakan Poin
              </AppText>
              <PressableScale
                onPress={toggleUsePoints}
                hitSlop={8}
                style={{
                  width: 42,
                  height: 24,
                  borderRadius: 12,
                  padding: 3,
                  backgroundColor: usePoints ? "#F0C24B" : ink[200],
                  alignItems: usePoints ? "flex-end" : "flex-start",
                }}
              >
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: usePoints ? "#D9A441" : "#FFFFFF",
                  }}
                />
              </PressableScale>
            </View>

            <PressableScale
              onPress={() => setConfirming(true)}
              scaleTo={0.98}
              style={{
                height: 48,
                borderRadius: 24,
                backgroundColor: brand[900],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppText variant="h3" color="#FFFFFF">
                Bayar • {formatRupiah(breakdown.finalTotal)}
              </AppText>
            </PressableScale>
          </View>
        </SafeAreaView>
      </View>

      {confirming && outlet ? (
        <ConfirmDialog
          title="Konfirmasi Pesanan"
          cancelLabel="Cek Kembali"
          confirmLabel="Ya, Lanjutkan"
          cancelColor={brand[700]}
          confirmColor={brand[900]}
          variant="buttons"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            mintReceipt();
            router.push("/qris");
          }}
        >
          <View style={{ gap: 9, marginTop: 12 }}>
            <View style={{ backgroundColor: brand[50], borderRadius: 11, padding: 11, gap: 7 }}>
              <AppText variant="caption" color={ink[400]}>
                Lokasi Outlet
              </AppText>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    backgroundColor: "#FFFFFF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BrandLogo brandId={outlet.brandId} size={24} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="titleLg" numberOfLines={1}>
                    {outletFullName(outlet)}
                  </AppText>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <AppText variant="caption" color={ink[500]}>
                      {outlet.city} •
                    </AppText>
                    <AppText
                      variant="caption"
                      color={tooFar ? danger[500] : ink[500]}
                      style={{ fontFamily: "Urbanist_700Bold" }}
                    >
                      {outlet.distanceKm.toFixed(1)} km
                    </AppText>
                    {tooFar ? <TriangleAlert size={11} color={danger[500]} /> : null}
                  </View>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 9 }}>
              <View style={{ flex: 1, backgroundColor: brand[50], borderRadius: 11, padding: 11, gap: 6 }}>
                <AppText variant="caption" color={ink[400]}>
                  Tipe Order
                </AppText>
                <AppText variant="titleLg">{serviceLabels[serviceType]}</AppText>
              </View>
              <View style={{ flex: 1, backgroundColor: brand[50], borderRadius: 11, padding: 11, gap: 6 }}>
                <AppText variant="caption" color={ink[400]}>
                  Opsi Pengambilan
                </AppText>
                <AppText variant="titleLg">
                  {pickup === "self" ? "Ambil Sendiri" : "Antar ke Meja"}
                </AppText>
              </View>
            </View>

            {pickup === "table" && tableNumber ? (
              <View style={{ backgroundColor: brand[50], borderRadius: 11, padding: 11, gap: 6 }}>
                <AppText variant="caption" color={ink[400]}>
                  Catatan Pengambilan
                </AppText>
                <AppText variant="titleLg">{tableNumber}</AppText>
              </View>
            ) : null}

            {tooFar ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 9,
                  backgroundColor: danger[50],
                  borderRadius: 11,
                  padding: 11,
                }}
              >
                <CircleAlert size={15} color={danger[500]} />
                <AppText
                  variant="caption"
                  color={danger[500]}
                  style={{ flex: 1, fontStyle: "italic" }}
                >
                  Jarak anda terlalu jauh dari outlet:{" "}
                  <AppText
                    variant="caption"
                    color={danger[500]}
                    style={{ fontStyle: "italic", fontFamily: "Urbanist_700Bold" }}
                  >
                    {MAX_ORDER_DISTANCE_KM.toFixed(1)} km
                  </AppText>
                </AppText>
              </View>
            ) : null}

            <View
              style={{
                flexDirection: "row",
                gap: 9,
                backgroundColor: "#FDF6E3",
                borderRadius: 11,
                padding: 11,
              }}
            >
              <CircleAlert size={15} color={warning[600]} />
              <AppText
                variant="caption"
                color={warning[600]}
                style={{ flex: 1, fontStyle: "italic", lineHeight: 17 }}
              >
                Pastikan outlet dan pesananmu sudah sesuai ya! karena pesanan yang sudah
                dikonfirmasi{" "}
                <AppText
                  variant="caption"
                  color={warning[600]}
                  style={{ fontStyle: "italic", fontFamily: "Urbanist_700Bold" }}
                >
                  tidak dapat dibatalkan.
                </AppText>
              </AppText>
            </View>
          </View>
        </ConfirmDialog>
      ) : null}
    </View>
  );
}
