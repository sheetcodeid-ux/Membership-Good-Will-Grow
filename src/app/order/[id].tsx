import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Clipboard from "expo-clipboard";
import { UiText } from "../../components/ui/Text";
import { AppHeader } from "../../components/ui/AppHeader";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";
import { PressableScale } from "../../components/ui/PressableScale";
import { Glyph, type GlyphName } from "../../components/icons/Glyph";
import { BrandLogo } from "../../components/BrandLogo";
import { AccountEmpty } from "../../components/EmptyArt";
import {
  AccountCard,
  AccountSection,
  LABEL_INK,
  QUIET_INK,
  RULE,
} from "../../components/AccountMenu";
import { statusMeta, channelMeta } from "../../components/OrderIcons";
import { brand, surface } from "../../theme/colors";
import { fontFamilies } from "../../theme/typography";
import { formatRupiah } from "../../utils/format";
import { getBrand } from "../../data/mock";
import { useOrderRecord } from "../../store/ordersStore";
import type { ServiceType } from "../../data/types";
import { useScrolled } from "../../hooks/useScrolled";
import { CountUp } from "../../components/ui/CountUp";
import { showToast } from "../../store/toastStore";
import { tapSuccess } from "../../utils/haptics";

const EDGE = 13.5;

const serviceLabels: Record<ServiceType, string> = {
  dine_in: "Dine In",
  takeaway: "Take Away",
  delivery: "Delivery",
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <AccountCard style={{ paddingHorizontal: 14, paddingVertical: 8 }}>
      {children}
    </AccountCard>
  );
}

/** Label on the left, value on the right, an optional copy button after it. */
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
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        minHeight: 36,
        paddingVertical: 6,
        gap: 12,
      }}
    >
      <UiText
        color={QUIET_INK}
        style={{
          fontSize: 13.5,
          lineHeight: 18,
          fontFamily: fontFamilies.medium,
        }}
      >
        {label}
      </UiText>
      <UiText
        color={LABEL_INK}
        style={{
          flex: 1,
          textAlign: "right",
          fontSize: 14,
          lineHeight: 18,
          fontFamily: fontFamilies.semibold,
        }}
      >
        {value}
      </UiText>
      {onCopy ? <CopyButton onPress={onCopy} /> : null}
    </View>
  );
}

function CopyButton({ onPress }: { onPress: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <PressableScale
      hitSlop={8}
      scaleTo={0.9}
      onPress={() => {
        onPress();
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: copied ? "#EEF3FF" : "#F2F3F5",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Glyph
        name={copied ? "check" : "copy"}
        size={12}
        color={copied ? brand[600] : QUIET_INK}
      />
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
  const size = emphasis ? 17 : 14;
  const family = emphasis
    ? fontFamilies.extrabold
    : bold
      ? fontFamilies.bold
      : fontFamilies.medium;
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}
    >
      <UiText
        color={emphasis || bold ? LABEL_INK : QUIET_INK}
        style={{
          flex: 1,
          fontSize: size,
          lineHeight: size + 5,
          fontFamily: family,
        }}
      >
        {label}
      </UiText>
      <UiText
        color={LABEL_INK}
        style={{
          fontSize: size,
          lineHeight: size + 5,
          fontFamily: emphasis ? family : bold ? family : fontFamilies.semibold,
        }}
      >
        {value}
      </UiText>
    </View>
  );
}

function Rule() {
  return <View style={{ height: 1, backgroundColor: RULE }} />;
}

export default function OrderDetailScreen() {
  const scroll = useScrolled();
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrderRecord(id);

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: surface }}>
        <AppHeader
          tone="account"
          title="Detail Pesanan"
          divider={scroll.scrolled}
        />
        <AccountEmpty
          glyph="receipt"
          title="Pesanan tidak ditemukan"
          subtitle="Pesanan ini mungkin sudah dihapus atau tautannya salah."
        />
      </View>
    );
  }

  const meta = statusMeta[order.status];
  const total =
    order.subtotal - (order.couponDiscount ?? 0) + order.tax + order.rounding;
  const copy = (label: string, value: string) => {
    Clipboard.setStringAsync(value).catch(() => {});
    tapSuccess();
    showToast(`${label} disalin`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader
        tone="account"
        title="Detail Pesanan"
        divider={scroll.scrolled}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scroll.onScroll}
        scrollEventThrottle={scroll.scrollEventThrottle}
        contentContainerStyle={{
          paddingHorizontal: EDGE,
          paddingTop: 16,
          paddingBottom: 40,
        }}
      >
        {/* Summary: status, where, when, and what was paid. */}
        <AccountCard style={{ padding: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: `${meta.tint}1A`,
                borderRadius: 12,
                paddingLeft: 7,
                paddingRight: 9,
                height: 24,
              }}
            >
              <Glyph
                name={meta.icon as GlyphName}
                size={12}
                color={meta.tint}
              />
              <UiText
                color={meta.tint}
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: fontFamilies.bold,
                }}
              >
                {meta.label}
              </UiText>
            </View>
            <View style={{ flex: 1 }} />
            <UiText
              color={QUIET_INK}
              style={{
                fontSize: 12,
                lineHeight: 16,
                fontFamily: fontFamilies.medium,
              }}
            >
              {order.createdAt}
            </UiText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 9,
              marginTop: 12,
            }}
          >
            <BrandLogo brandId={order.brandId} size={22} />
            <UiText
              color={LABEL_INK}
              numberOfLines={1}
              style={{
                flex: 1,
                fontSize: 17,
                lineHeight: 22,
                fontFamily: fontFamilies.bold,
              }}
            >
              {order.outletName}
            </UiText>
          </View>
          <View
            style={{ height: 1, backgroundColor: RULE, marginVertical: 12 }}
          />
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <UiText
              color={QUIET_INK}
              style={{
                flex: 1,
                fontSize: 13,
                lineHeight: 17,
                fontFamily: fontFamilies.medium,
              }}
            >
              Total bayar
            </UiText>
            <CountUp
              value={order.paid}
              format={formatRupiah}
              color={LABEL_INK}
              style={{
                fontSize: 22,
                lineHeight: 27,
                fontFamily: fontFamilies.extrabold,
              }}
            />
          </View>
        </AccountCard>

        <AccountSection title="Info pesanan" />
        <Card>
          <InfoRow
            label="Nota"
            value={order.nota}
            onCopy={() => copy("Nota", order.nota)}
          />
          <InfoRow
            label="Kode pesanan"
            value={order.orderCode}
            onCopy={() => copy("Kode pesanan", order.orderCode)}
          />
          <InfoRow
            label="ID transaksi"
            value={order.transactionId}
            onCopy={() => copy("ID transaksi", order.transactionId)}
          />
          <InfoRow
            label="Tipe pesanan"
            value={serviceLabels[order.serviceType]}
          />
          <InfoRow label="Metode pembayaran" value={order.paymentMethod} />
        </Card>

        <AccountSection title="Info outlet" />
        <Card>
          <InfoRow label="Nama outlet" value={order.outletName} />
          <InfoRow label="Brand" value={getBrand(order.brandId)?.name ?? "-"} />
          <InfoRow
            label="Channel pemesanan"
            value={channelMeta[order.channel].label}
          />
        </Card>

        <AccountSection title="Ringkasan pesanan" />
        <AccountCard style={{ padding: 14, gap: 12 }}>
          {order.lines.map((line) => (
            <View
              key={line.id}
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <ImagePlaceholder
                radius={10}
                iconSize={18}
                style={{ width: 46, height: 46 }}
              />
              <View style={{ flex: 1 }}>
                <UiText
                  color={LABEL_INK}
                  numberOfLines={2}
                  style={{
                    fontSize: 15,
                    lineHeight: 19,
                    fontFamily: fontFamilies.semibold,
                  }}
                >
                  {line.name}
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
                  {line.qty}× {line.variant} @ {formatRupiah(line.unitPrice)}
                </UiText>
              </View>
              <UiText
                color={LABEL_INK}
                style={{
                  fontSize: 15,
                  lineHeight: 19,
                  fontFamily: fontFamilies.bold,
                }}
              >
                {formatRupiah(line.unitPrice * line.qty)}
              </UiText>
            </View>
          ))}
        </AccountCard>

        <AccountSection title="Detail pembayaran" />
        <Card>
          <AmountRow
            label="Nominal belanja"
            value={formatRupiah(order.subtotal)}
          />
          {order.couponDiscount ? (
            <AmountRow
              label={order.couponTitle ?? "Potongan kupon"}
              value={`-${formatRupiah(order.couponDiscount)}`}
            />
          ) : null}
          <Rule />
          <AmountRow
            label="Subtotal"
            value={formatRupiah(order.subtotal - (order.couponDiscount ?? 0))}
            bold
          />
          <AmountRow label="PB1" value={formatRupiah(order.tax)} />
          <AmountRow label="Pembulatan" value={formatRupiah(order.rounding)} />
          <Rule />
          <AmountRow label="Total tagihan" value={formatRupiah(total)} bold />
          {order.pointsUsed ? (
            <AmountRow
              label="Poin dipakai"
              value={`-${formatRupiah(order.pointsUsed)}`}
            />
          ) : null}
          <Rule />
          <AmountRow
            label="Total bayar"
            value={formatRupiah(order.paid)}
            emphasis
          />
        </Card>

        {order.note ? (
          <>
            <AccountSection title="Catatan" />
            <AccountCard style={{ padding: 14 }}>
              <UiText
                color={LABEL_INK}
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  fontFamily: fontFamilies.medium,
                }}
              >
                {order.note}
              </UiText>
            </AccountCard>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
