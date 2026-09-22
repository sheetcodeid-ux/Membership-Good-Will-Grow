import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Clipboard from "expo-clipboard";
import { Check, Copy, ReceiptText } from "lucide-react-native";
import { AppText } from "../../components/ui/AppText";
import { AppHeader } from "../../components/ui/AppHeader";
import { EmptyState } from "../../components/ui/EmptyState";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";
import { PressableScale } from "../../components/ui/PressableScale";
import { statusMeta, channelMeta } from "../../components/OrderIcons";
import { brand, ink, surface } from "../../theme/colors";
import { shadow } from "../../theme/shadows";
import { formatRupiah } from "../../utils/format";
import { getBrand, getOrder } from "../../data/mock";
import type { ServiceType } from "../../data/types";

const serviceLabels: Record<ServiceType, string> = {
  dine_in: "Dine In",
  takeaway: "Take Away",
  delivery: "Delivery",
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 14,
        ...(shadow.xs as object),
      }}
    >
      {children}
    </View>
  );
}

/** Label / value pair; long values wrap under the colon rather than clipping. */
function InfoRow({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 5 }}>
      {/* Fixed, non-shrinking label column so every colon lines up. */}
      <AppText variant="body" color={ink[600]} style={{ width: 125, flexShrink: 0 }}>
        {label}
      </AppText>
      <AppText variant="body" color={ink[600]} style={{ flexShrink: 0 }}>
        :{" "}
      </AppText>
      <AppText variant="bodySemibold" color={ink[900]} style={{ flex: 1 }}>
        {value}
      </AppText>
      {onCopy ? <CopyButton onPress={onCopy} /> : null}
    </View>
  );
}

function CopyButton({ onPress }: { onPress: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <PressableScale
      hitSlop={8}
      onPress={() => {
        onPress();
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      style={{
        width: 21,
        height: 21,
        borderRadius: 6,
        marginLeft: 8,
        backgroundColor: brand[900],
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {copied ? (
        <Check size={12} color="#FFFFFF" strokeWidth={3} />
      ) : (
        <Copy size={12} color="#FFFFFF" />
      )}
    </PressableScale>
  );
}

function AmountRow({
  label,
  value,
  bold,
  emphasis,
}: {
  label: string;
  value: string;
  bold?: boolean;
  emphasis?: boolean;
}) {
  const size = emphasis ? 16 : 13;
  const family = bold || emphasis ? "Urbanist_700Bold" : "Urbanist_400Regular";
  const color = emphasis ? brand[800] : ink[800];
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
      <AppText style={{ flex: 1, fontSize: size, lineHeight: size + 6, fontFamily: family }} color={color}>
        {label}
      </AppText>
      <AppText style={{ fontSize: size, lineHeight: size + 6, fontFamily: family }} color={color}>
        {value}
      </AppText>
    </View>
  );
}

function Rule() {
  return <View style={{ height: 1, backgroundColor: ink[100] }} />;
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = getOrder(id);

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: surface }}>
        <AppHeader title="Detail Pesanan" />
        <EmptyState
          icon={<ReceiptText size={54} color={ink[300]} strokeWidth={1.7} />}
          title="Pesanan tidak ditemukan"
          style={{ paddingTop: 80 }}
        />
      </View>
    );
  }

  const meta = statusMeta[order.status];
  const total = order.subtotal + order.tax + order.rounding;
  const copy = (value: string) => {
    Clipboard.setStringAsync(value).catch(() => {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Detail Pesanan" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 12 }}
      >
        <Card>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View
              style={{
                backgroundColor: `${meta.tint}1A`,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 8,
              }}
            >
              <AppText variant="bodySemibold" color={meta.tint}>
                {meta.label}
              </AppText>
            </View>
            <View style={{ flex: 1 }} />
            <View style={{ alignItems: "flex-end" }}>
              <AppText variant="caption" color={ink[400]}>
                Dibuat Pada
              </AppText>
              <AppText variant="bodyMedium" color={ink[700]}>
                {order.createdAt}
              </AppText>
            </View>
          </View>

          <View style={{ marginTop: 16 }}>
            <InfoRow label="Nota" value={order.nota} onCopy={() => copy(order.nota)} />
            <InfoRow
              label="Kode Pesanan"
              value={order.orderCode}
              onCopy={() => copy(order.orderCode)}
            />
            <InfoRow
              label="ID Transaksi"
              value={order.transactionId}
              onCopy={() => copy(order.transactionId)}
            />
            <InfoRow label="Tipe Pesanan" value={serviceLabels[order.serviceType]} />
            <InfoRow label="Metode Pembayaran" value={order.paymentMethod} />
          </View>

          <View
            style={{
              marginTop: 14,
              backgroundColor: brand[50],
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <AppText variant="h3" color={brand[800]}>
              Total • {formatRupiah(order.paid)}
            </AppText>
          </View>
        </Card>

        <Card>
          <AppText variant="h3" style={{ marginBottom: 10 }}>
            Informasi Outlet
          </AppText>
          <InfoRow label="Nama Outlet" value={order.outletName} />
          <InfoRow label="Brand" value={getBrand(order.brandId)?.name ?? "-"} />
          <InfoRow label="Channel Pemesanan" value={channelMeta[order.channel].label} />
        </Card>

        <Card>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <AppText variant="h3" style={{ flex: 1 }}>
              Ringkasan Pesanan
            </AppText>
            <AppText variant="micro" color={ink[300]} numberOfLines={1}>
              {order.nota}
            </AppText>
          </View>

          <View style={{ gap: 12 }}>
            {order.lines.map((line) => (
              <View key={line.id} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <ImagePlaceholder radius={10} iconSize={18} style={{ width: 46, height: 46 }} />
                <View style={{ flex: 1 }}>
                  <AppText variant="titleLg" numberOfLines={2}>
                    {line.name}
                  </AppText>
                  <AppText variant="caption" color={ink[400]}>
                    {line.qty}× {line.variant} @ {formatRupiah(line.unitPrice)}
                  </AppText>
                </View>
                <AppText variant="titleLg" color={brand[800]}>
                  {formatRupiah(line.unitPrice * line.qty)}
                </AppText>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <AppText variant="h3" style={{ marginBottom: 4 }}>
            Detail Pembayaran
          </AppText>
          <AmountRow label="Nominal Belanja" value={formatRupiah(order.subtotal)} />
          <Rule />
          <AmountRow label="Sub Total" value={formatRupiah(order.subtotal)} bold />
          <AmountRow label="PB1" value={formatRupiah(order.tax)} />
          <AmountRow label="Pembulatan" value={formatRupiah(order.rounding)} />
          <Rule />
          <AmountRow label="Total Tagihan" value={formatRupiah(total)} bold />
          <Rule />
          <AmountRow label="Total Bayar" value={formatRupiah(order.paid)} emphasis />
        </Card>

        {order.note ? (
          <Card>
            <AppText variant="h3" style={{ marginBottom: 6 }}>
              Catatan
            </AppText>
            <AppText variant="body" color={ink[500]}>
              {order.note}
            </AppText>
          </Card>
        ) : null}
      </ScrollView>
    </View>
  );
}
