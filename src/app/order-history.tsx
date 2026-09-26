import React, { useMemo, useState } from "react";
import { Platform, ScrollView, TextInput, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { BottomSheet } from "../components/ui/BottomSheet";
import { UiText } from "../components/ui/Text";
import { Glyph, type GlyphName } from "../components/icons/Glyph";
import { AccountEmpty } from "../components/EmptyArt";
import {
  AccountSection,
  LABEL_INK,
  QUIET_INK,
  RULE,
} from "../components/AccountMenu";
import { PressableScale } from "../components/ui/PressableScale";
import { BrandLogo } from "../components/BrandLogo";
import { OptionRow } from "../components/OptionRow";
import { channelMeta, statusMeta } from "../components/OrderIcons";
import { brand, ink, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { formatRupiah } from "../utils/format";
import { brands, menuItems, orders, outlets } from "../data/mock";
import { useOrderStore } from "../store/orderStore";
import { defaultSelections, useCartStore } from "../store/cartStore";
import { showToast } from "../store/toastStore";
import { parseIndoDate, relativeGroup } from "../utils/dates";
import { tapError, tapSelect, tapSuccess } from "../utils/haptics";
import { useScrolled } from "../hooks/useScrolled";
import type {
  MenuItem,
  OrderChannel,
  OrderRecord,
  OrderStatus,
  ServiceType,
} from "../data/types";

type SheetName = "channel" | "status" | "outlet" | null;

const serviceLabels: Record<ServiceType, string> = {
  dine_in: "Dine In",
  takeaway: "Take Away",
  delivery: "Delivery",
};

const statusOrder: OrderStatus[] = [
  "dibayar",
  "belum-bayar",
  "ditahan",
  "dibatalkan",
];
const channelOrder: OrderChannel[] = [
  "member-apps",
  "kiosk",
  "pos",
  "qr-dine-in",
];

const EDGE = 13.5;
const META_INK = "#8A8F99";

/** A 6-digit hex at the given alpha, for tints drawn from a status colour. */
function alpha(hex: string, a: number) {
  return `${hex}${Math.round(a * 255)
    .toString(16)
    .padStart(2, "0")}`;
}

/**
 * Filter chip. Firms up to brand blue once it narrows the list, so a
 * filtered view never passes for the whole history.
 */
function FilterPill({
  icon,
  label,
  active,
  onPress,
}: {
  icon: GlyphName;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const tone = active ? brand[700] : LABEL_INK;
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.97}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        height: 34,
        paddingLeft: 11,
        paddingRight: 10,
        borderRadius: 17,
        borderWidth: active ? 1.5 : 1,
        borderColor: active ? brand[600] : RULE,
        backgroundColor: active ? "#EEF3FF" : "#FFFFFF",
      }}
    >
      <Glyph name={icon} size={15} color={active ? brand[700] : QUIET_INK} />
      <UiText
        color={tone}
        style={{
          fontSize: 13,
          lineHeight: 17,
          fontFamily: fontFamilies.semibold,
        }}
      >
        {label}
      </UiText>
      <Glyph name="chevronRight" rotate={90} size={11} color={tone} />
    </PressableScale>
  );
}

/** One quiet line of order detail with its glyph. */
function MetaLine({
  icon,
  children,
}: {
  icon: GlyphName;
  children: React.ReactNode;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Glyph name={icon} size={14} color={META_INK} />
      <UiText
        color={QUIET_INK}
        numberOfLines={1}
        style={{
          flex: 1,
          fontSize: 13,
          lineHeight: 17,
          fontFamily: fontFamilies.medium,
        }}
      >
        {children}
      </UiText>
    </View>
  );
}

function Tag({ label, tone }: { label: string; tone: "grey" | "brand" }) {
  return (
    <View
      style={{
        backgroundColor: tone === "brand" ? "#EEF3FF" : "#F2F3F5",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
      }}
    >
      <UiText
        color={tone === "brand" ? brand[700] : QUIET_INK}
        style={{
          fontSize: 12,
          lineHeight: 16,
          fontFamily: fontFamilies.semibold,
        }}
      >
        {label}
      </UiText>
    </View>
  );
}

/**
 * The item's default choices, except that a single-select option named
 * like the order line's variant ("Level 3", "Iced") is picked instead of
 * the group's first, so a reorder comes back the way it was ordered.
 */
function selectionsFor(item: MenuItem, variant: string) {
  const out = defaultSelections(item.optionGroups);
  const wanted = variant.trim().toLowerCase();
  for (const group of item.optionGroups) {
    if (group.selection !== "single") continue;
    const match = group.options.find((o) => o.name.toLowerCase() === wanted);
    if (!match) continue;
    for (const o of group.options) delete out[o.id];
    out[match.id] = 1;
  }
  return out;
}

export default function OrderHistoryScreen() {
  const filters = useOrderStore((s) => s.filters);
  const setFilter = useOrderStore((s) => s.setFilter);
  const [sheet, setSheet] = useState<SheetName>(null);
  const [outletBrandId, setOutletBrandId] = useState<string | null>(null);
  const [outletQuery, setOutletQuery] = useState("");
  const scroll = useScrolled();

  const visible = useMemo(
    () =>
      orders.filter(
        (o) =>
          (!filters.channel || o.channel === filters.channel) &&
          (!filters.status || o.status === filters.status) &&
          (!filters.outletId || o.outletId === filters.outletId),
      ),
    [filters],
  );

  const filtered = !!(filters.channel || filters.status || filters.outletId);
  const clearFilters = () => {
    tapSelect();
    setFilter("channel", undefined);
    setFilter("status", undefined);
    setFilter("outletId", undefined);
  };

  // Newest first, under "Hari ini", "Kemarin", "7 hari terakhir" or the month.
  const groups: { label: string; items: OrderRecord[] }[] = [];
  for (const o of [...visible].sort(
    (a, b) =>
      (parseIndoDate(b.createdAt)?.getTime() ?? 0) -
      (parseIndoDate(a.createdAt)?.getTime() ?? 0),
  )) {
    const at = parseIndoDate(o.createdAt);
    const label = at ? relativeGroup(at) : "Lainnya";
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(o);
    else groups.push({ label, items: [o] });
  }

  const setOutlet = useOrderStore((s) => s.setOutlet);
  const setServiceType = useOrderStore((s) => s.setServiceType);
  const confirmOutlet = useOrderStore((s) => s.confirmOutlet);
  const addLine = useCartStore((s) => s.addLine);

  /**
   * Puts the order's items back in the cart at the same outlet and service,
   * matching each line to the menu by name; anything no longer on the menu
   * is left out and said so, and if nothing is left the outlet's menu opens.
   */
  const reorder = (o: OrderRecord) => {
    const found = o.lines.map((line) => ({
      line,
      item: menuItems.find(
        (m) => m.brandId === o.brandId && m.name === line.name,
      ),
    }));
    const ok = found.filter((f) => f.item);
    setOutlet(o.outletId);
    setServiceType(o.serviceType);
    confirmOutlet();
    if (ok.length === 0) {
      // Nothing left to put back: open the same outlet's menu instead.
      tapError();
      showToast(
        "Menunya sudah tidak ada, pilih yang lain di outlet ini",
        "info",
      );
      router.push("/order");
      return;
    }
    for (const { line, item } of ok) {
      if (item) addLine(item, line.qty, selectionsFor(item, line.variant));
    }
    tapSuccess();
    const missing = found.length - ok.length;
    showToast(
      missing
        ? `${ok.length} menu masuk keranjang, ${missing} tidak tersedia`
        : `${ok.length} menu masuk keranjang`,
    );
    router.push("/cart");
  };

  const sheetOutlets = useMemo(() => {
    const q = outletQuery.trim().toLowerCase();
    return outlets
      .filter((o) => (q || !outletBrandId ? true : o.brandId === outletBrandId))
      .filter(
        (o) =>
          !q ||
          o.name.toLowerCase().includes(q) ||
          o.address.toLowerCase().includes(q),
      );
  }, [outletBrandId, outletQuery]);

  const channelLabel = filters.channel
    ? channelMeta[filters.channel].label
    : "Semua Channel";
  const statusLabel = filters.status
    ? statusMeta[filters.status].label
    : "Semua Status";
  const outletLabel = filters.outletId
    ? (outlets.find((o) => o.id === filters.outletId)?.name ?? "Semua Outlet")
    : "Semua Outlet";

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader
        tone="account"
        title="Riwayat Pesanan"
        divider={scroll.scrolled}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: EDGE,
          paddingVertical: 12,
          gap: 8,
        }}
        // Explicit height: a horizontal list inside a column flex parent
        // otherwise measures as zero on web and the cards ride over it.
        style={{ flexGrow: 0, height: 58 }}
      >
        <FilterPill
          icon="infinity"
          label={channelLabel}
          active={!!filters.channel}
          onPress={() => setSheet("channel")}
        />
        <FilterPill
          icon="checkCircle"
          label={statusLabel}
          active={!!filters.status}
          onPress={() => setSheet("status")}
        />
        <FilterPill
          icon="store"
          label={outletLabel}
          active={!!filters.outletId}
          onPress={() => setSheet("outlet")}
        />
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scroll.onScroll}
        scrollEventThrottle={scroll.scrollEventThrottle}
        contentContainerStyle={{
          paddingHorizontal: EDGE,
          paddingBottom: 30,
          flexGrow: 1,
        }}
      >
        {visible.length === 0 ? (
          <AccountEmpty
            glyph="receipt"
            title="Belum ada pesanan"
            subtitle={
              filtered
                ? "Tidak ada pesanan yang cocok dengan filter ini."
                : "Pesanan pertamamu akan muncul di sini."
            }
            action={
              filtered
                ? { label: "Hapus filter", onPress: clearFilters }
                : { label: "Mulai pesan", onPress: () => router.push("/order") }
            }
          />
        ) : null}

        {groups.map((group, gi) => (
          <View key={group.label}>
            <AccountSection title={group.label} first={gi === 0} />
            <View style={{ gap: 10 }}>
              {group.items.map((o) => {
                const meta = statusMeta[o.status];
                const canReorder =
                  o.status === "dibayar" || o.status === "dibatalkan";
                const items = o.lines.reduce((n, l) => n + l.qty, 0);
                return (
                  // The card and its "Pesan lagi" are siblings, not nested
                  // presses, so the button never also opens the detail.
                  <View
                    key={o.id}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: RULE,
                      overflow: "hidden",
                    }}
                  >
                    <PressableScale
                      onPress={() => router.push(`/order/${o.id}`)}
                      scaleTo={0.99}
                      style={{
                        paddingHorizontal: 14,
                        paddingTop: 12,
                        paddingBottom: canReorder ? 0 : 12,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                            backgroundColor: alpha(meta.tint, 0.1),
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
                          {o.createdAt}
                        </UiText>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 9,
                          marginTop: 10,
                        }}
                      >
                        <BrandLogo brandId={o.brandId} size={20} />
                        <UiText
                          color={LABEL_INK}
                          numberOfLines={1}
                          style={{
                            flex: 1,
                            fontSize: 16,
                            lineHeight: 20,
                            fontFamily: fontFamilies.bold,
                          }}
                        >
                          {o.outletName}
                        </UiText>
                      </View>

                      <View style={{ gap: 5, marginTop: 8 }}>
                        <MetaLine icon="receipt">{o.nota}</MetaLine>
                        <MetaLine icon="hash">
                          Kode pesanan {o.orderCode}
                        </MetaLine>
                      </View>

                      <View
                        style={{
                          height: 1,
                          backgroundColor: RULE,
                          marginVertical: 10,
                        }}
                      />

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Tag label={serviceLabels[o.serviceType]} tone="grey" />
                        <Tag
                          label={channelMeta[o.channel].label}
                          tone="brand"
                        />
                        <View style={{ flex: 1 }} />
                        <View style={{ alignItems: "flex-end" }}>
                          <UiText
                            color={QUIET_INK}
                            style={{
                              fontSize: 11.5,
                              lineHeight: 14,
                              fontFamily: fontFamilies.medium,
                            }}
                          >
                            {items} item
                          </UiText>
                          <UiText
                            color={LABEL_INK}
                            style={{
                              fontSize: 16,
                              lineHeight: 20,
                              fontFamily: fontFamilies.extrabold,
                            }}
                          >
                            {formatRupiah(o.paid)}
                          </UiText>
                        </View>
                      </View>
                    </PressableScale>
                    {canReorder ? (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          marginTop: 10,
                        }}
                      >
                        <PressableScale
                          onPress={() => reorder(o)}
                          scaleTo={0.95}
                          hitSlop={6}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            height: 34,
                            paddingHorizontal: 14,
                            borderRadius: 17,
                            borderWidth: 1.5,
                            borderColor: brand[600],
                            backgroundColor: "#FFFFFF",
                          }}
                        >
                          <Glyph name="refresh" size={14} color={brand[600]} />
                          <UiText
                            color={brand[700]}
                            style={{
                              fontSize: 13.5,
                              lineHeight: 17,
                              fontFamily: fontFamilies.bold,
                            }}
                          >
                            Pesan lagi
                          </UiText>
                        </PressableScale>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {sheet === "channel" ? (
        <BottomSheet
          title="Pilih Channel"
          onClose={() => setSheet(null)}
          maxHeightRatio={0.7}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 10,
              paddingBottom: 16,
              gap: 4,
            }}
          >
            <OptionRow
              icon={
                <Glyph
                  name="infinity"
                  size={22}
                  color={filters.channel ? ink[600] : brand[700]}
                />
              }
              title="Semua Channel"
              description="Tampilkan pesanan dari semua channel"
              selected={!filters.channel}
              onPress={() => {
                setFilter("channel", undefined);
                setSheet(null);
              }}
            />
            {channelOrder.map((key) => {
              const { label, description, icon } = channelMeta[key];
              const selected = filters.channel === key;
              return (
                <OptionRow
                  key={key}
                  icon={
                    <Glyph
                      name={icon as GlyphName}
                      size={22}
                      color={selected ? brand[700] : ink[600]}
                    />
                  }
                  title={label}
                  description={description}
                  selected={selected}
                  onPress={() => {
                    setFilter("channel", key);
                    setSheet(null);
                  }}
                />
              );
            })}
          </ScrollView>
        </BottomSheet>
      ) : null}

      {sheet === "status" ? (
        <BottomSheet
          title="Pilih Status"
          onClose={() => setSheet(null)}
          maxHeightRatio={0.7}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 10,
              paddingBottom: 16,
              gap: 4,
            }}
          >
            <OptionRow
              icon={
                <Glyph
                  name="infinity"
                  size={22}
                  color={filters.status ? ink[600] : brand[700]}
                />
              }
              title="Semua Status"
              description="Tampilkan pesanan dengan semua status"
              selected={!filters.status}
              onPress={() => {
                setFilter("status", undefined);
                setSheet(null);
              }}
            />
            {statusOrder.map((key) => (
              <OptionRow
                key={key}
                icon={
                  <Glyph
                    name={statusMeta[key].icon as GlyphName}
                    size={21}
                    color={filters.status === key ? brand[700] : ink[600]}
                  />
                }
                title={statusMeta[key].label}
                description={statusMeta[key].description}
                selected={filters.status === key}
                onPress={() => {
                  setFilter("status", key);
                  setSheet(null);
                }}
              />
            ))}
          </ScrollView>
        </BottomSheet>
      ) : null}

      {sheet === "outlet" ? (
        <BottomSheet
          title="Pilih Outlet"
          onClose={() => setSheet(null)}
          maxHeightRatio={0.82}
        >
          <View style={{ paddingHorizontal: 22, paddingTop: 12 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: ink[50],
                borderRadius: 14,
                paddingHorizontal: 16,
                height: 50,
              }}
            >
              <Glyph name="search" size={18} color={ink[400]} />
              <TextInput
                value={outletQuery}
                onChangeText={setOutletQuery}
                placeholder="Cari berdasarkan lokasi outlet..."
                placeholderTextColor={ink[400]}
                style={[
                  {
                    flex: 1,
                    minWidth: 0,
                    padding: 0,
                    fontFamily: "Urbanist_400Regular",
                    fontSize: 15,
                    color: ink[900],
                  },
                  Platform.OS === "web"
                    ? ({ outlineStyle: "none" } as object)
                    : null,
                ]}
              />
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 22,
              paddingVertical: 14,
              gap: 10,
            }}
            style={{ flexGrow: 0 }}
          >
            <PressableScale
              onPress={() => setOutletBrandId(null)}
              scaleTo={0.97}
              style={{
                height: 46,
                minWidth: 68,
                paddingHorizontal: 18,
                borderRadius: 23,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1.5,
                borderColor: outletBrandId ? ink[200] : brand[900],
                backgroundColor: outletBrandId ? "#FFFFFF" : brand[900],
              }}
            >
              <AppText
                variant="captionMedium"
                color={outletBrandId ? ink[600] : "#FFFFFF"}
              >
                Semua
              </AppText>
            </PressableScale>
            {brands.map((b) => (
              <PressableScale
                key={b.id}
                onPress={() => setOutletBrandId(b.id)}
                scaleTo={0.97}
                style={{
                  height: 46,
                  paddingHorizontal: 16,
                  borderRadius: 23,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1.5,
                  borderColor: outletBrandId === b.id ? brand[600] : ink[200],
                  backgroundColor: "#FFFFFF",
                }}
              >
                <BrandLogo brandId={b.id} size={30} />
              </PressableScale>
            ))}
          </ScrollView>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 16,
              gap: 4,
            }}
          >
            <OptionRow
              icon={
                <Glyph
                  name="infinity"
                  size={22}
                  color={filters.outletId ? ink[600] : brand[700]}
                />
              }
              title="Semua Outlet"
              description="Tampilkan pesanan dari semua outlet"
              selected={!filters.outletId}
              onPress={() => {
                setFilter("outletId", undefined);
                setSheet(null);
              }}
            />
            {sheetOutlets.map((o) => (
              <OptionRow
                key={o.id}
                icon={<BrandLogo brandId={o.brandId} size={26} />}
                title={o.name}
                description={o.address}
                selected={filters.outletId === o.id}
                onPress={() => {
                  setFilter("outletId", o.id);
                  setSheet(null);
                }}
              />
            ))}
          </ScrollView>
        </BottomSheet>
      ) : null}
    </View>
  );
}
