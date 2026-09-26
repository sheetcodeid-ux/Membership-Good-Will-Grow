import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { PressableScale } from "../components/ui/PressableScale";
import { Glyph } from "../components/icons/Glyph";
import { BrandLogo } from "../components/BrandLogo";
import { AccountEmpty } from "../components/EmptyArt";
import {
  LABEL_INK,
  QUIET_INK,
  RULE,
  WARN_INK,
} from "../components/AccountMenu";
import { Block, EDGE, OutlinePill } from "../components/checkout/parts";
import { brand, danger, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { formatRupiah } from "../utils/format";
import { tapPress, tapSuccess } from "../utils/haptics";
import { useOrderRecord } from "../store/ordersStore";
import { showToast } from "../store/toastStore";
import { useScrolled } from "../hooks/useScrolled";
import { markOrderPaid } from "../utils/orderFlow";

/** How long one QR stays valid. */
const PAY_WINDOW_SECONDS = 10 * 60;

const STEPS = [
  "Buka aplikasi m-banking atau e-wallet apa pun",
  "Pilih menu Scan QR atau Bayar pakai QRIS",
  "Arahkan kamera ke kode QR di atas",
  "Periksa nominal, lalu konfirmasi pembayaran",
  "Kembali ke sini dan cek status pembayaran",
];

function InfoRow({
  label,
  value,
  onCopy,
  last,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
  last?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        minHeight: 48,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: RULE,
      }}
    >
      <UiText
        color={QUIET_INK}
        style={{
          fontSize: 14,
          lineHeight: 19,
          fontFamily: fontFamilies.medium,
        }}
      >
        {label}
      </UiText>
      <UiText
        color={LABEL_INK}
        numberOfLines={1}
        style={{
          flex: 1,
          textAlign: "right",
          fontSize: 14,
          lineHeight: 19,
          fontFamily: fontFamilies.semibold,
        }}
      >
        {value}
      </UiText>
      {onCopy ? (
        <PressableScale onPress={onCopy} hitSlop={8} scaleTo={0.9}>
          <Glyph name="copy" size={15} color={brand[600]} />
        </PressableScale>
      ) : null}
    </View>
  );
}

/**
 * Pembayaran QRIS for an order already placed on checkout: the amount and
 * the code in one card with a clock on it, how to pay, the receipt
 * numbers (copyable), and "Cek status pembayaran" at the bottom. When the
 * clock runs out the code is greyed and a fresh one can be asked for.
 */
export default function QrisScreen() {
  const { order: orderId } = useLocalSearchParams<{ order?: string }>();
  const order = useOrderRecord(orderId);
  const insets = useSafeAreaInsets();
  const scroll = useScrolled();
  const [remaining, setRemaining] = useState(PAY_WINDOW_SECONDS);

  useEffect(() => {
    const id = setInterval(
      () => setRemaining((v) => (v > 0 ? v - 1 : 0)),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: surface }}>
        <StatusBar style="dark" />
        <AppHeader tone="account" title="Pembayaran QRIS" />
        <AccountEmpty
          glyph="qr"
          title="Tidak ada tagihan"
          subtitle="Pesanan ini sudah dibayar atau tidak ditemukan."
          action={{
            label: "Riwayat Pesanan",
            onPress: () => router.replace("/order-history"),
          }}
        />
      </View>
    );
  }

  const expired = remaining === 0;
  const urgent = remaining <= 120;
  const mmss = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(
    remaining % 60,
  ).padStart(2, "0")}`;
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
        title="Pembayaran QRIS"
        divider={scroll.scrolled}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scroll.onScroll}
        scrollEventThrottle={scroll.scrollEventThrottle}
        contentContainerStyle={{ padding: EDGE, paddingBottom: 28, gap: 12 }}
      >
        <Block>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: "#F3F7FF",
            }}
          >
            <BrandLogo brandId={order.brandId} size={26} />
            <UiText
              color={LABEL_INK}
              numberOfLines={1}
              style={{
                flex: 1,
                fontSize: 14.5,
                lineHeight: 19,
                fontFamily: fontFamilies.bold,
              }}
            >
              {order.outletName}
            </UiText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                borderRadius: 14,
                paddingHorizontal: 10,
                paddingVertical: 4,
                backgroundColor: expired
                  ? "#F2F3F5"
                  : urgent
                    ? "#FDECEE"
                    : "#FFFFFF",
              }}
            >
              <Glyph
                name="clock"
                size={13}
                color={expired ? QUIET_INK : urgent ? danger[500] : brand[700]}
              />
              <UiText
                color={expired ? QUIET_INK : urgent ? danger[500] : brand[700]}
                style={{
                  fontSize: 13,
                  lineHeight: 17,
                  fontFamily: fontFamilies.bold,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {expired ? "Kedaluwarsa" : mmss}
              </UiText>
            </View>
          </View>

          <View style={{ alignItems: "center", padding: 18 }}>
            <UiText
              color={QUIET_INK}
              style={{
                fontSize: 13.5,
                lineHeight: 18,
                fontFamily: fontFamilies.medium,
              }}
            >
              Total pembayaran
            </UiText>
            <UiText
              color={LABEL_INK}
              style={{
                marginTop: 2,
                fontSize: 28,
                lineHeight: 34,
                fontFamily: fontFamilies.extrabold,
              }}
            >
              {formatRupiah(order.paid)}
            </UiText>

            <View
              style={{
                marginTop: 16,
                width: "82%",
                aspectRatio: 1,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: RULE,
                padding: 12,
                opacity: expired ? 0.25 : 1,
              }}
            >
              <ImagePlaceholder
                label="Kode QR"
                radius={10}
                iconSize={30}
                style={{ flex: 1 }}
              />
            </View>
            {expired ? (
              <View
                style={{
                  position: "absolute",
                  top: "58%",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <UiText
                  color={LABEL_INK}
                  style={{
                    fontSize: 15,
                    lineHeight: 20,
                    fontFamily: fontFamilies.bold,
                  }}
                >
                  Kode QR sudah kedaluwarsa
                </UiText>
                <OutlinePill
                  label="Buat kode baru"
                  icon="refresh"
                  onPress={() => {
                    tapPress();
                    setRemaining(PAY_WINDOW_SECONDS);
                  }}
                />
              </View>
            ) : null}

            <View
              style={{
                marginTop: 14,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Glyph name="shield" size={13} color={QUIET_INK} />
              <UiText
                color={QUIET_INK}
                style={{
                  fontSize: 12.5,
                  lineHeight: 17,
                  fontFamily: fontFamilies.medium,
                }}
              >
                Bisa dibayar pakai semua aplikasi berlogo QRIS
              </UiText>
            </View>
            <View style={{ marginTop: 14 }}>
              <OutlinePill
                small
                icon="download"
                label="Simpan kode QR"
                onPress={() => showToast("Simpan kode QR segera hadir", "info")}
              />
            </View>
          </View>
        </Block>

        {urgent && !expired ? (
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
            <Glyph name="clock" size={15} color={WARN_INK} />
            <UiText
              color={WARN_INK}
              style={{
                flex: 1,
                fontSize: 13,
                lineHeight: 18,
                fontFamily: fontFamilies.semibold,
              }}
            >
              Sisa waktu tinggal sebentar. Selesaikan pembayaranmu, ya.
            </UiText>
          </View>
        ) : null}

        <View style={{ marginTop: 6, marginLeft: 2 }}>
          <UiText
            color={LABEL_INK}
            style={{
              fontSize: 17,
              lineHeight: 22,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            Cara bayar
          </UiText>
        </View>
        <Block style={{ padding: 16, gap: 12 }}>
          {STEPS.map((step, i) => (
            <View
              key={step}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: "#EAF0FF",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UiText
                  color={brand[700]}
                  style={{
                    fontSize: 12.5,
                    lineHeight: 16,
                    fontFamily: fontFamilies.extrabold,
                  }}
                >
                  {i + 1}
                </UiText>
              </View>
              <UiText
                color={LABEL_INK}
                style={{
                  flex: 1,
                  marginTop: 2,
                  fontSize: 14.5,
                  lineHeight: 20,
                  fontFamily: fontFamilies.medium,
                }}
              >
                {step}
              </UiText>
            </View>
          ))}
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
            Detail tagihan
          </UiText>
        </View>
        <Block style={{ paddingHorizontal: 16 }}>
          <InfoRow
            label="Nomor nota"
            value={order.nota}
            onCopy={() => copy("Nomor nota", order.nota)}
          />
          <InfoRow
            label="ID transaksi"
            value={order.transactionId}
            onCopy={() => copy("ID transaksi", order.transactionId)}
          />
          <InfoRow label="Kode pesanan" value={order.orderCode} last />
        </Block>
      </ScrollView>

      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: RULE,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 12),
        }}
      >
        <PressableScale
          onPress={() => {
            if (expired) {
              showToast("Buat kode QR baru dulu, ya", "error");
              return;
            }
            markOrderPaid(order.id);
            router.replace(`/order-success?id=${order.id}`);
          }}
          scaleTo={0.97}
          style={{
            height: 52,
            borderRadius: 26,
            backgroundColor: expired ? "#E4E7EC" : brand[600],
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Glyph
            name="refresh"
            size={16}
            color={expired ? "#8A93A6" : "#FFFFFF"}
          />
          <UiText
            color={expired ? "#8A93A6" : "#FFFFFF"}
            style={{
              fontSize: 16.5,
              lineHeight: 21,
              fontFamily: fontFamilies.bold,
            }}
          >
            Cek status pembayaran
          </UiText>
        </PressableScale>
      </View>
    </View>
  );
}
