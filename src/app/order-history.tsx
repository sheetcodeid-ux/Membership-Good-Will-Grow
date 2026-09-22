import React, { useMemo, useState } from "react";
import { Platform, ScrollView, TextInput, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ChevronDown,
  CreditCard,
  Hash,
  ReceiptText,
  Search,
  ShoppingBag,
  Store,
} from "lucide-react-native";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { BottomSheet } from "../components/ui/BottomSheet";
import { EmptyState } from "../components/ui/EmptyState";
import { PressableScale } from "../components/ui/PressableScale";
import { BrandLogo } from "../components/BrandLogo";
import { OptionRow } from "../components/OptionRow";
import { InfinityIcon, channelMeta, statusMeta, StatusIcon } from "../components/OrderIcons";
import { brand, ink, surface } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { formatRupiah } from "../utils/format";
import { brands, orders, outlets } from "../data/mock";
import { useOrderStore } from "../store/orderStore";
import type { OrderChannel, OrderStatus, ServiceType } from "../data/types";

type SheetName = "channel" | "status" | "outlet" | null;

const serviceLabels: Record<ServiceType, string> = {
  dine_in: "Dine In",
  takeaway: "Take Away",
  delivery: "Delivery",
};

const statusOrder: OrderStatus[] = ["dibayar", "belum-bayar", "ditahan", "dibatalkan"];
const channelOrder: OrderChannel[] = ["member-apps", "kiosk", "pos", "qr-dine-in"];

function FilterPill({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.97}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        height: 34,
        paddingHorizontal: 13,
        borderRadius: 17,
        borderWidth: 1.5,
        borderColor: ink[200],
        backgroundColor: "#FFFFFF",
      }}
    >
      {icon}
      <AppText variant="bodyMedium" color={ink[800]}>
        {label}
      </AppText>
      <ChevronDown size={14} color={ink[500]} />
    </PressableScale>
  );
}

export default function OrderHistoryScreen() {
  const filters = useOrderStore((s) => s.filters);
  const setFilter = useOrderStore((s) => s.setFilter);
  const [sheet, setSheet] = useState<SheetName>(null);
  const [outletBrandId, setOutletBrandId] = useState<string | null>(null);
  const [outletQuery, setOutletQuery] = useState("");

  const visible = useMemo(
    () =>
      orders.filter(
        (o) =>
          (!filters.channel || o.channel === filters.channel) &&
          (!filters.status || o.status === filters.status) &&
          (!filters.outletId || o.outletId === filters.outletId)
      ),
    [filters]
  );

  const sheetOutlets = useMemo(() => {
    const q = outletQuery.trim().toLowerCase();
    return outlets
      .filter((o) => (q || !outletBrandId ? true : o.brandId === outletBrandId))
      .filter((o) => !q || o.name.toLowerCase().includes(q) || o.address.toLowerCase().includes(q));
  }, [outletBrandId, outletQuery]);

  const channelLabel = filters.channel ? channelMeta[filters.channel].label : "Semua Channel";
  const statusLabel = filters.status ? statusMeta[filters.status].label : "Semua Status";
  const outletLabel = filters.outletId
    ? outlets.find((o) => o.id === filters.outletId)?.name ?? "Semua Outlet"
    : "Semua Outlet";

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Riwayat Pesanan" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 13, gap: 10 }}
        // Explicit height: a horizontal list inside a column flex parent
        // otherwise measures as zero on web and the cards ride over it.
        style={{ flexGrow: 0, height: 60 }}
      >
        <FilterPill
          icon={<InfinityIcon size={16} color={ink[600]} />}
          label={channelLabel}
          onPress={() => setSheet("channel")}
        />
        <FilterPill
          icon={<CreditCard size={16} color={ink[600]} />}
          label={statusLabel}
          onPress={() => setSheet("status")}
        />
        <FilterPill
          icon={<Store size={16} color={ink[600]} />}
          label={outletLabel}
          onPress={() => setSheet("outlet")}
        />
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 26, gap: 12, flexGrow: 1 }}
      >
        {visible.length === 0 ? (
          <EmptyState
            icon={<ReceiptText size={54} color={ink[300]} strokeWidth={1.7} />}
            title="Belum ada pesanan"
            subtitle="Pesanan yang cocok dengan filter ini belum ada."
            style={{ paddingTop: 60 }}
          />
        ) : null}

        {visible.map((o) => {
          const meta = statusMeta[o.status];
          return (
            <PressableScale
              key={o.id}
              onPress={() => router.push(`/order/${o.id}`)}
              scaleTo={0.99}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 15,
                padding: 14,
                gap: 8,
                ...(shadow.xs as object),
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    borderWidth: 1.4,
                    borderColor: meta.tint,
                    borderRadius: 15,
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                  }}
                >
                  <AppText variant="bodySemibold" color={meta.tint}>
                    {meta.label}
                  </AppText>
                </View>
                <View style={{ flex: 1 }} />
                <AppText variant="caption" color={ink[500]}>
                  {o.createdAt}
                </AppText>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <BrandLogo brandId={o.brandId} size={19} />
                <AppText variant="h3" numberOfLines={1} style={{ flex: 1 }}>
                  {o.outletName}
                </AppText>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <ReceiptText size={15} color={ink[400]} />
                <AppText variant="body" color={ink[400]} numberOfLines={1} style={{ flex: 1 }}>
                  {o.nota}
                </AppText>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Hash size={15} color={ink[400]} />
                <AppText variant="body" color={ink[400]}>
                  Kode Pesanan : {o.orderCode}
                </AppText>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <ShoppingBag size={15} color={ink[400]} />
                <AppText variant="body" color={ink[500]} style={{ flex: 1 }}>
                  {o.lines.reduce((n, l) => n + l.qty, 0)} item
                </AppText>
                <AppText variant="h3" color={brand[800]}>
                  {formatRupiah(o.paid)}
                </AppText>
              </View>

              <View style={{ flexDirection: "row", gap: 8, marginTop: 2 }}>
                <View
                  style={{
                    backgroundColor: ink[50],
                    borderRadius: 8,
                    paddingHorizontal: 9,
                    paddingVertical: 5,
                  }}
                >
                  <AppText variant="caption" color={ink[600]}>
                    {serviceLabels[o.serviceType]}
                  </AppText>
                </View>
                <View
                  style={{
                    backgroundColor: brand[50],
                    borderRadius: 8,
                    paddingHorizontal: 9,
                    paddingVertical: 5,
                  }}
                >
                  <AppText variant="caption" color={brand[700]}>
                    {channelMeta[o.channel].label}
                  </AppText>
                </View>
              </View>
            </PressableScale>
          );
        })}
      </ScrollView>

      {sheet === "channel" ? (
        <BottomSheet title="Pilih Channel" onClose={() => setSheet(null)} maxHeightRatio={0.7}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16, gap: 4 }}
          >
            <OptionRow
              icon={<InfinityIcon size={24} color={filters.channel ? ink[600] : brand[700]} />}
              title="Semua Channel"
              description="Tampilkan pesanan dari semua channel"
              selected={!filters.channel}
              onPress={() => {
                setFilter("channel", undefined);
                setSheet(null);
              }}
            />
            {channelOrder.map((key) => {
              const { label, description, icon: Icon } = channelMeta[key];
              const selected = filters.channel === key;
              return (
                <OptionRow
                  key={key}
                  icon={<Icon size={24} color={selected ? brand[700] : ink[600]} />}
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
        <BottomSheet title="Pilih Status" onClose={() => setSheet(null)} maxHeightRatio={0.7}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16, gap: 4 }}
          >
            <OptionRow
              icon={<InfinityIcon size={24} color={filters.status ? ink[600] : brand[700]} />}
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
                icon={<StatusIcon status={key} size={21} color={filters.status === key ? brand[700] : ink[600]} />}
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
        <BottomSheet title="Pilih Outlet" onClose={() => setSheet(null)} maxHeightRatio={0.82}>
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
              <Search size={18} color={ink[400]} />
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
                  Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null,
                ]}
              />
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 22, paddingVertical: 14, gap: 10 }}
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
              <AppText variant="captionMedium" color={outletBrandId ? ink[600] : "#FFFFFF"}>
                ALL
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
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 4 }}
          >
            <OptionRow
              icon={<InfinityIcon size={24} color={filters.outletId ? ink[600] : brand[700]} />}
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
