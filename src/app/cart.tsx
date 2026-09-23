import React, { useState } from "react";
import { Platform, ScrollView, TextInput, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreditCard, FilePlus2, Pencil, ShoppingCart, Trash2 } from "lucide-react-native";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { PressableScale } from "../components/ui/PressableScale";
import { QuantityStepper } from "../components/ui/QuantityStepper";
import { OutletBar } from "../components/OutletBar";
import { brand, danger, ink, surface } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { formatRupiah } from "../utils/format";
import { computeBreakdown } from "../utils/pricing";
import { getOutlet } from "../data/mock";
import { selectionSummary, unitPrice, useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";

export default function CartScreen() {
  const lines = useCartStore((s) => s.lines);
  const setLineQty = useCartStore((s) => s.setLineQty);
  const setLineNote = useCartStore((s) => s.setLineNote);
  const removeLine = useCartStore((s) => s.removeLine);
  const subtotal = useCartStore((s) => s.subtotal());
  const itemCount = useCartStore((s) => s.itemCount());

  const outletId = useOrderStore((s) => s.outletId);
  const serviceType = useOrderStore((s) => s.serviceType);
  const outlet = getOutlet(outletId);

  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const deleting = lines.find((l) => l.lineId === pendingDelete);

  const breakdown = computeBreakdown(subtotal, false, 0);
  const empty = lines.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <AppHeader title="Keranjang">
        <OutletBar outlet={outlet} serviceType={serviceType} />
      </AppHeader>

      {empty ? (
        <EmptyState
          icon={<ShoppingCart size={50} color={ink[300]} strokeWidth={1.7} />}
          title="Keranjang masih kosong"
          subtitle="Tambahkan menu favoritmu dulu."
          style={{ paddingTop: 80 }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 30, gap: 12 }}
        >
          {lines.map((line) => (
            <View
              key={line.lineId}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 15,
                padding: 12,
                gap: 10,
                ...(shadow.xs as object),
              }}
            >
              <View style={{ flexDirection: "row", gap: 11 }}>
                <ImagePlaceholder radius={10} iconSize={18} style={{ width: 60, height: 60 }} />
                <View style={{ flex: 1, gap: 2 }}>
                  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 6 }}>
                    <AppText variant="h3" numberOfLines={1} style={{ flex: 1 }}>
                      {line.menuItem.name}
                    </AppText>
                    <PressableScale
                      onPress={() =>
                        router.push(`/product/${line.menuItem.id}?lineId=${line.lineId}`)
                      }
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        backgroundColor: ink[50],
                        borderRadius: 7,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                      }}
                    >
                      <Pencil size={11} color={brand[700]} />
                      <AppText variant="caption" color={brand[700]}>
                        Edit
                      </AppText>
                    </PressableScale>
                    <PressableScale
                      onPress={() => setPendingDelete(line.lineId)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        backgroundColor: danger[50],
                        borderRadius: 7,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                      }}
                    >
                      <Trash2 size={11} color={danger[500]} />
                      <AppText variant="caption" color={danger[500]}>
                        Hapus
                      </AppText>
                    </PressableScale>
                  </View>
                  <AppText variant="caption" color={ink[500]} numberOfLines={2}>
                    {selectionSummary(line.menuItem, line.selections).join(", ")}
                  </AppText>
                  <AppText variant="h3" color={brand[800]}>
                    {formatRupiah(unitPrice(line.menuItem, line.selections))}
                  </AppText>
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 7,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: ink[50],
                    paddingHorizontal: 10,
                  }}
                >
                  <FilePlus2 size={13} color={ink[400]} />
                  <TextInput
                    value={line.note ?? ""}
                    onChangeText={(v) => setLineNote(line.lineId, v)}
                    placeholder="Tekan untuk menambah catatan"
                    placeholderTextColor={ink[400]}
                    style={[
                      {
                        flex: 1,
                        minWidth: 0,
                        padding: 0,
                        fontFamily: "Urbanist_400Regular",
                        fontStyle: "italic",
                        fontSize: 11,
                        color: ink[900],
                      },
                      Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null,
                    ]}
                  />
                </View>
                <QuantityStepper
                  value={line.qty}
                  onChange={(n) => setLineQty(line.lineId, n)}
                  min={1}
                  size={32}
                />
              </View>
            </View>
          ))}

          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              padding: 14,
              ...(shadow.xs as object),
            }}
          >
            <AppText variant="h3" style={{ marginBottom: 6 }}>
              Detail Pembayaran
            </AppText>
            <Row label="Subtotal" value={formatRupiah(breakdown.subtotal)} />
            <Row label="Pb1" value={formatRupiah(breakdown.tax)} />
            <Row label="Pembulatan" value={formatRupiah(breakdown.rounding)} />
            <View style={{ height: 1, backgroundColor: ink[100], marginVertical: 6 }} />
            <Row label="Total" value={formatRupiah(breakdown.total)} emphasis />
          </View>
        </ScrollView>
      )}

      {!empty ? (
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            ...(shadow.lg as object),
          }}
        >
          <SafeAreaView edges={["bottom"]}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 12,
                gap: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <AppText variant="caption" color={ink[500]}>
                  Total
                </AppText>
                <AppText variant="h3" color={brand[800]}>
                  {formatRupiah(breakdown.total)}
                </AppText>
              </View>
              <PressableScale
                onPress={() => router.push("/checkout")}
                scaleTo={0.98}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 9,
                  height: 46,
                  paddingHorizontal: 26,
                  borderRadius: 23,
                  backgroundColor: brand[900],
                }}
              >
                <AppText variant="titleLg" color="#FFFFFF">
                  Checkout ({itemCount})
                </AppText>
                <CreditCard size={17} color="#FFFFFF" />
              </PressableScale>
            </View>
          </SafeAreaView>
        </View>
      ) : null}

      {deleting ? (
        <ConfirmDialog
          icon={<Trash2 size={21} color={danger[500]} />}
          title="Hapus Item"
          message={`Apakah Anda yakin ingin menghapus "${deleting.menuItem.name}" dari keranjang?`}
          cancelLabel="Batal"
          confirmLabel="Hapus"
          cancelColor={brand[700]}
          confirmColor={danger[500]}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            removeLine(deleting.lineId);
            setPendingDelete(null);
          }}
        />
      ) : null}
    </View>
  );
}

function Row({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 6 }}>
      <AppText
        style={{ flex: 1 }}
        variant={emphasis ? "h3" : "body"}
        color={emphasis ? brand[800] : ink[700]}
      >
        {label}
      </AppText>
      <AppText variant={emphasis ? "h3" : "body"} color={emphasis ? brand[800] : ink[700]}>
        {value}
      </AppText>
    </View>
  );
}
