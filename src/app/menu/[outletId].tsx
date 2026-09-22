import React, { useEffect, useMemo, useState } from "react";
import { View, FlatList, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Search, Coffee, CupSoda, Drumstick, Cake, Soup, Gift, Ticket, Cookie, ShoppingCart, Star } from "lucide-react-native";
import { Screen, ScreenHeader, AppText, Card, Input, Button } from "../../components/ui";
import { IconChip } from "../../components/ui/Chip";
import { MediaTile } from "../../components/ui/MediaTile";
import { PressableScale } from "../../components/ui/PressableScale";
import { brand, ink } from "../../theme/colors";
import { categories, getOutlet, getBrand, menuItems } from "../../data/mock";
import { formatRupiah } from "../../utils/format";
import { useCartStore } from "../../store/cartStore";
import type { ServiceType } from "../../data/types";

const categoryIconMap = {
  coffee: Coffee,
  cup: CupSoda,
  drumstick: Drumstick,
  cake: Cake,
  soup: Soup,
  gift: Gift,
  ticket: Ticket,
  cookie: Cookie,
} as const;

const fulfillmentLabel: Record<ServiceType, string> = {
  dine_in: "Dine In",
  takeaway: "Take Away",
  delivery: "Delivery",
};

export default function MenuScreen() {
  const { outletId } = useLocalSearchParams<{ outletId: string }>();
  const outlet = getOutlet(outletId);
  const brandInfo = getBrand(outlet?.brandId);
  const [category, setCategory] = useState(categories[0].id);
  const [query, setQuery] = useState("");

  const cart = useCartStore();

  useEffect(() => {
    if (outletId && cart.outletId !== outletId) {
      if (cart.lines.length > 0) cart.clear();
      cart.setOutlet(outletId);
    }
    // Only re-run when the outlet param changes: `cart` is the whole zustand
    // store object and gets a new identity on every state change, so
    // including it here would re-fire this effect (and clear the cart) on
    // every add-to-cart action instead of only on outlet switches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outletId]);

  const brandItems = useMemo(
    () => menuItems.filter((m) => m.brandId === outlet?.brandId),
    [outlet?.brandId]
  );

  const availableCategories = categories.filter((c) => brandItems.some((m) => m.categoryId === c.id));

  const filteredItems = useMemo(() => {
    return brandItems.filter((m) => {
      const matchCategory = m.categoryId === category;
      const matchQuery = m.name.toLowerCase().includes(query.toLowerCase());
      return query ? matchQuery : matchCategory;
    });
  }, [brandItems, category, query]);

  const itemCount = cart.itemCount();
  const subtotal = cart.subtotal();

  if (!outlet) {
    return (
      <Screen>
        <ScreenHeader title="Menu" />
        <AppText style={{ padding: 20 }}>Outlet tidak ditemukan.</AppText>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title="Daftar Menu" subtitle={outlet.name} right={
        <PressableScale onPress={() => router.push("/order-history")}>
          <AppText variant="captionMedium" color={brand[600]}>Riwayat</AppText>
        </PressableScale>
      } />

      <View style={{ paddingHorizontal: 20, gap: 12, marginBottom: 12 }}>
        <Card padded={false} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 12 }}>
          <MediaTile colors={brandInfo?.gradient ?? [brand[600], brand[400]]} icon={brandInfo?.category === "coffee" ? "coffee" : "drumstick"} size={44} radius={13} iconSize={20} />
          <View style={{ flex: 1 }}>
            <AppText variant="title" numberOfLines={1}>{outlet.name}</AppText>
            <AppText variant="caption" color={ink[500]} numberOfLines={1}>{outlet.city}</AppText>
          </View>
        </Card>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {outlet.services.map((s) => {
            const active = cart.fulfillment === s;
            return (
              <PressableScale
                key={s}
                onPress={() => cart.setFulfillment(s)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 14,
                  alignItems: "center",
                  backgroundColor: active ? brand[600] : ink[50],
                }}
              >
                <AppText variant="captionMedium" color={active ? "#FFFFFF" : ink[600]}>
                  {fulfillmentLabel[s]}
                </AppText>
              </PressableScale>
            );
          })}
        </View>

        <Input
          placeholder="Ketik untuk mencari menu"
          value={query}
          onChangeText={setQuery}
          left={<Search size={18} color={ink[400]} />}
        />
      </View>

      <View style={{ flex: 1, flexDirection: "row" }}>
        <ScrollView style={{ width: 92 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10, gap: 10, paddingBottom: 130 }}>
          {availableCategories.map((c) => {
            const Icon = categoryIconMap[c.icon];
            return (
              <IconChip
                key={c.id}
                label={c.name}
                active={category === c.id && !query}
                onPress={() => {
                  setQuery("");
                  setCategory(c.id);
                }}
                icon={<Icon size={20} color={category === c.id && !query ? brand[600] : ink[500]} />}
              />
            );
          })}
        </ScrollView>

        <FlatList
          data={filteredItems}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 140, gap: 12 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <AppText variant="h3" style={{ marginBottom: 4 }}>
              {query ? `Hasil "${query}"` : categories.find((c) => c.id === category)?.name}
            </AppText>
          }
          renderItem={({ item }) => (
            <Card onPress={() => router.push(`/product/${item.id}`)} style={{ flexDirection: "row", gap: 12 }}>
              <MediaTile
                colors={brandInfo?.gradient ?? [brand[600], brand[400]]}
                icon={item.categoryId === "food" ? "drumstick" : item.categoryId === "pastry" ? "cake" : "coffee"}
                size={64}
                radius={14}
                iconSize={26}
              />
              <View style={{ flex: 1, gap: 4 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <AppText variant="title" numberOfLines={1} style={{ flex: 1 }}>
                    {item.name}
                  </AppText>
                  {item.isBestSeller ? <Star size={13} color="#D9A441" fill="#D9A441" /> : null}
                </View>
                <AppText variant="caption" color={ink[500]} numberOfLines={1}>
                  {item.description}
                </AppText>
                <AppText variant="bodySemibold" color={brand[700]}>
                  {formatRupiah(item.price)}
                </AppText>
              </View>
              <PressableScale
                onPress={() => router.push(`/product/${item.id}`)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 11,
                  backgroundColor: brand[600],
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "flex-end",
                }}
              >
                <AppText variant="title" color="#FFFFFF">+</AppText>
              </PressableScale>
            </Card>
          )}
        />
      </View>

      {itemCount > 0 ? (
        <View style={{ position: "absolute", left: 16, right: 16, bottom: 24 }}>
          <Button
            label={`Lihat Keranjang (${itemCount}) · ${formatRupiah(subtotal)}`}
            size="lg"
            fullWidth
            icon={<ShoppingCart size={18} color="#FFFFFF" />}
            onPress={() => router.push("/cart")}
          />
        </View>
      ) : null}
    </Screen>
  );
}
