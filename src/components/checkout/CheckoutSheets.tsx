import React, { useState } from "react";
import { Platform, ScrollView, TextInput, View } from "react-native";
import { UiText } from "../ui/Text";
import { PressableScale } from "../ui/PressableScale";
import { Glyph, type GlyphName } from "../icons/Glyph";
import { BrandLogo } from "../BrandLogo";
import { AccountSheet } from "../AccountSheet";
import { LABEL_INK, QUIET_INK, RULE } from "../AccountMenu";
import { Checkbox, PrimaryButton, Radio } from "./parts";
import { brand } from "../../theme/colors";
import { fontFamilies } from "../../theme/typography";
import { outletFullName, outlets } from "../../data/mock";
import type { OrderGift, ServiceType } from "../../data/types";
import type { PayMethod } from "../../store/cartStore";
import { MAX_ORDER_DISTANCE_KM } from "../../store/orderStore";
import { tapSelect } from "../../utils/haptics";

const webNoOutline =
  Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null;

export const SERVICE_META: Record<
  ServiceType,
  { label: string; hint: string; glyph: GlyphName }
> = {
  dine_in: { label: "Dine In", hint: "Makan di outlet", glyph: "coffee" },
  takeaway: {
    label: "Take Away",
    hint: "Dibawa pulang",
    glyph: "coldCup",
  },
  delivery: {
    label: "Delivery",
    hint: "Diantar kurir outlet",
    glyph: "scooter",
  },
};

/** One choice in a sheet: mark, name and line, radio on the right. */
function ChoiceRow({
  glyph,
  logo,
  title,
  subtitle,
  on,
  disabled,
  onPress,
}: {
  glyph?: GlyphName;
  logo?: string;
  title: string;
  subtitle?: string;
  on: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      scaleTo={0.985}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 14,
        borderWidth: on ? 1.5 : 1,
        borderColor: on ? brand[600] : RULE,
        backgroundColor: on ? "#F3F7FF" : "#FFFFFF",
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#F2F5FC",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {logo ? (
          <BrandLogo brandId={logo} size={26} />
        ) : glyph ? (
          <Glyph name={glyph} size={19} color={brand[700]} />
        ) : null}
      </View>
      <View style={{ flex: 1 }}>
        <UiText
          color={LABEL_INK}
          numberOfLines={1}
          style={{
            fontSize: 15,
            lineHeight: 19,
            fontFamily: fontFamilies.bold,
          }}
        >
          {title}
        </UiText>
        {subtitle ? (
          <UiText
            color={QUIET_INK}
            numberOfLines={2}
            style={{
              marginTop: 1,
              fontSize: 12.5,
              lineHeight: 17,
              fontFamily: fontFamilies.medium,
            }}
          >
            {subtitle}
          </UiText>
        ) : null}
      </View>
      <Radio on={on} disabled={disabled} />
    </PressableScale>
  );
}

/** Dine In / Take Away / Delivery, as far as the outlet offers them. */
export function ServiceTypeSheet({
  value,
  available,
  onPick,
  onClose,
}: {
  value: ServiceType;
  available: ServiceType[];
  onPick: (t: ServiceType) => void;
  onClose: () => void;
}) {
  return (
    <AccountSheet title="Tipe pesanan" onClose={onClose}>
      <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 8 }}>
        {(Object.keys(SERVICE_META) as ServiceType[]).map((t) => {
          const off = !available.includes(t);
          return (
            <ChoiceRow
              key={t}
              glyph={SERVICE_META[t].glyph}
              title={SERVICE_META[t].label}
              subtitle={
                off ? "Tidak tersedia di outlet ini" : SERVICE_META[t].hint
              }
              on={value === t}
              disabled={off}
              onPress={() => {
                tapSelect();
                onPick(t);
              }}
            />
          );
        })}
      </View>
    </AccountSheet>
  );
}

/**
 * Another outlet of the same brand. Only the brand's own outlets: the
 * cart's items are that brand's menu.
 */
export function OutletSheet({
  brandId,
  value,
  onPick,
  onClose,
}: {
  brandId: string;
  value: string;
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const list = outlets
    .filter((o) => o.brandId === brandId)
    .sort((a, b) => a.distanceKm - b.distanceKm);
  return (
    <AccountSheet title="Pilih outlet" onClose={onClose}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          gap: 8,
        }}
      >
        {list.map((o) => {
          const far = o.distanceKm > MAX_ORDER_DISTANCE_KM;
          return (
            <ChoiceRow
              key={o.id}
              logo={o.brandId}
              title={outletFullName(o)}
              subtitle={`${o.address} · ${o.distanceKm.toFixed(1)} km${
                !o.isOpen ? " · Tutup" : far ? " · Terlalu jauh" : ""
              }`}
              on={value === o.id}
              disabled={!o.isOpen}
              onPress={() => {
                tapSelect();
                onPick(o.id);
              }}
            />
          );
        })}
      </ScrollView>
    </AccountSheet>
  );
}

/**
 * Free-text note, up to 200 characters: for the outlet by default, or
 * for one item with `title` and `placeholder` set.
 */
export function NoteSheet({
  value,
  onSave,
  onClose,
  title = "Catatan untuk outlet",
  placeholder = "Contoh: es sedikit, saus dipisah",
}: {
  value: string;
  onSave: (v: string) => void;
  onClose: () => void;
  title?: string;
  placeholder?: string;
}) {
  const [text, setText] = useState(value);
  return (
    <AccountSheet
      title={title}
      onClose={onClose}
      footer={
        <PrimaryButton label="Simpan" onPress={() => onSave(text.trim())} />
      }
    >
      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <View
          style={{
            borderRadius: 14,
            borderWidth: 1,
            borderColor: RULE,
            padding: 12,
            minHeight: 110,
          }}
        >
          <TextInput
            autoFocus
            multiline
            maxLength={200}
            value={text}
            onChangeText={setText}
            placeholder={placeholder}
            placeholderTextColor="#A0A4AE"
            style={[
              {
                flex: 1,
                minHeight: 70,
                padding: 0,
                textAlignVertical: "top",
                fontFamily: fontFamilies.medium,
                fontSize: 15,
                lineHeight: 21,
                color: LABEL_INK,
              },
              webNoOutline,
            ]}
          />
          <UiText
            color="#8A93A6"
            style={{
              alignSelf: "flex-end",
              fontSize: 11.5,
              lineHeight: 15,
              fontFamily: fontFamilies.medium,
            }}
          >
            {text.length}/200
          </UiText>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginTop: 10,
          }}
        >
          <Glyph name="info" size={13} color={QUIET_INK} />
          <UiText
            color={QUIET_INK}
            style={{
              flex: 1,
              fontSize: 12.5,
              lineHeight: 17,
              fontFamily: fontFamilies.medium,
            }}
          >
            Catatan dibaca barista/koki saat menyiapkan pesananmu.
          </UiText>
        </View>
      </View>
    </AccountSheet>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  multiline?: boolean;
  max: number;
}) {
  return (
    <View style={{ gap: 6 }}>
      <UiText
        color={QUIET_INK}
        style={{
          fontSize: 12.5,
          lineHeight: 16,
          fontFamily: fontFamilies.semibold,
        }}
      >
        {label}
      </UiText>
      <TextInput
        value={value}
        onChangeText={onChange}
        maxLength={max}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor="#A0A4AE"
        style={[
          {
            minHeight: multiline ? 84 : 46,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: RULE,
            paddingHorizontal: 13,
            paddingVertical: multiline ? 11 : 0,
            textAlignVertical: multiline ? "top" : "center",
            fontFamily: fontFamilies.semibold,
            fontSize: 15,
            color: LABEL_INK,
          },
          webNoOutline,
        ]}
      />
    </View>
  );
}

/**
 * "Kirim sebagai hadiah": someone else collects the order. Their name is
 * what the cashier calls, and the message is printed on the receipt.
 */
export function GiftSheet({
  value,
  onSave,
  onClose,
}: {
  value?: OrderGift;
  onSave: (gift?: OrderGift) => void;
  onClose: () => void;
}) {
  const [to, setTo] = useState(value?.to ?? "");
  const [message, setMessage] = useState(value?.message ?? "");
  const ready = to.trim().length > 1;
  return (
    <AccountSheet
      title="Kirim sebagai hadiah"
      onClose={onClose}
      footer={
        <View style={{ gap: 8 }}>
          <PrimaryButton
            label="Simpan hadiah"
            disabled={!ready}
            onPress={() => onSave({ to: to.trim(), message: message.trim() })}
          />
          {value ? (
            <PressableScale
              onPress={() => onSave(undefined)}
              style={{ alignSelf: "center", paddingVertical: 6 }}
            >
              <UiText
                color="#C8102E"
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  fontFamily: fontFamilies.bold,
                }}
              >
                Batalkan hadiah
              </UiText>
            </PressableScale>
          ) : null}
        </View>
      }
    >
      <View style={{ paddingHorizontal: 16, paddingBottom: 12, gap: 12 }}>
        <UiText
          color={QUIET_INK}
          style={{
            fontSize: 13.5,
            lineHeight: 19,
            fontFamily: fontFamilies.medium,
          }}
        >
          Pesanan diambil orang lain? Tulis namanya supaya kasir memanggil dia,
          lalu tambahkan ucapan yang dicetak di struk.
        </UiText>
        <Field
          label="Nama penerima"
          value={to}
          onChange={setTo}
          placeholder="Contoh: Rina"
          max={30}
        />
        <Field
          label="Ucapan (opsional)"
          value={message}
          onChange={setMessage}
          placeholder="Contoh: Selamat ulang tahun!"
          multiline
          max={120}
        />
      </View>
    </AccountSheet>
  );
}

/**
 * "Pilih metode pembayaran": points on top (they combine with either
 * method, 1 point = Rp 1), then QRIS, then paying at the cashier.
 */
export function PaymentMethodSheet({
  method,
  usePoints,
  points,
  onPick,
  onTogglePoints,
  onClose,
}: {
  method: PayMethod;
  usePoints: boolean;
  points: number;
  onPick: (m: PayMethod) => void;
  onTogglePoints: () => void;
  onClose: () => void;
}) {
  const heading = (t: string, sub?: string) => (
    <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
      <UiText
        color={LABEL_INK}
        style={{
          fontSize: 16,
          lineHeight: 21,
          fontFamily: fontFamilies.extrabold,
        }}
      >
        {t}
      </UiText>
      {sub ? (
        <UiText
          color={QUIET_INK}
          style={{
            marginTop: 2,
            fontSize: 12.5,
            lineHeight: 17,
            fontFamily: fontFamilies.medium,
          }}
        >
          {sub}
        </UiText>
      ) : null}
    </View>
  );
  return (
    <AccountSheet
      title="Pilih metode pembayaran"
      onClose={onClose}
      footer={<PrimaryButton label="Selesai" onPress={onClose} />}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <PressableScale
          onPress={() => {
            tapSelect();
            onTogglePoints();
          }}
          disabled={points <= 0}
          scaleTo={0.99}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 12,
            opacity: points <= 0 ? 0.5 : 1,
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: "#FFF3C4",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Glyph name="coins" size={21} color="#A36A00" />
          </View>
          <View style={{ flex: 1 }}>
            <UiText
              color={LABEL_INK}
              style={{
                fontSize: 16,
                lineHeight: 21,
                fontFamily: fontFamilies.bold,
              }}
            >
              Poin Good Will Grow
            </UiText>
            <UiText
              color={QUIET_INK}
              style={{
                fontSize: 13,
                lineHeight: 17,
                fontFamily: fontFamilies.medium,
              }}
            >
              Saldo: {points.toLocaleString("id-ID")}
            </UiText>
          </View>
          <Checkbox on={usePoints} />
        </PressableScale>
        <View
          style={{
            marginHorizontal: 16,
            borderTopWidth: 1,
            borderStyle: "dashed",
            borderColor: "#D5D8DE",
            paddingTop: 10,
            paddingBottom: 6,
          }}
        >
          <UiText
            color={QUIET_INK}
            style={{
              fontSize: 12.5,
              lineHeight: 17,
              fontFamily: fontFamilies.medium,
            }}
          >
            1 poin = Rp 1. Bisa digabung dengan metode pembayaran lain.
          </UiText>
        </View>

        <View style={{ height: 8, backgroundColor: "#F3F4F9", marginTop: 8 }} />
        {heading("Pembayaran digital")}
        <View style={{ paddingHorizontal: 16 }}>
          <ChoiceRow
            glyph="qr"
            title="QRIS"
            subtitle="Scan pakai m-banking atau e-wallet apa pun"
            on={method === "qris"}
            onPress={() => {
              tapSelect();
              onPick("qris");
            }}
          />
        </View>

        <View
          style={{ height: 8, backgroundColor: "#F3F4F9", marginTop: 16 }}
        />
        {heading("Metode lainnya")}
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <ChoiceRow
            glyph="pos"
            title="Bayar di kasir"
            subtitle="Tunai atau kartu saat ambil pesanan. Siapkan uang pas, ya."
            on={method === "cashier"}
            onPress={() => {
              tapSelect();
              onPick("cashier");
            }}
          />
        </View>
      </ScrollView>
    </AccountSheet>
  );
}
