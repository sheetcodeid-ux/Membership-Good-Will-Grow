import React, { useMemo, useRef, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { UiText } from "../../components/ui/Text";
import { PressableScale } from "../../components/ui/PressableScale";
import { Glyph, type GlyphName } from "../../components/icons/Glyph";
import { BrandLogo } from "../../components/BrandLogo";
import { MenuArt } from "../../components/MenuArt";
import { AccountSheet } from "../../components/AccountSheet";
import { OutletInfoSheet } from "../../components/OutletInfoSheet";
import { NoteSheet } from "../../components/checkout/CheckoutSheets";
import { LABEL_INK, QUIET_INK, RULE } from "../../components/AccountMenu";
import { brand, danger, surface } from "../../theme/colors";
import { fontFamilies } from "../../theme/typography";
import { TAB_BAR_HEIGHT, space } from "../../theme/scale";
import { formatDistance, formatRupiah } from "../../utils/format";
import { tapSelect, tapSuccess } from "../../utils/haptics";
import {
  categories,
  getBrand,
  getOutlet,
  menuItems,
  outletFullName,
} from "../../data/mock";
import { promoBanners } from "../../data/banners";
import { outletStats } from "../../data/reviews";
import type { MenuItem, ServiceType } from "../../data/types";
import { MAX_ORDER_DISTANCE_KM, useOrderStore } from "../../store/orderStore";
import {
  defaultSelections,
  unitPrice,
  useCartStore,
} from "../../store/cartStore";
import { useCouponStore } from "../../store/couponStore";
import { useFavoriteStore } from "../../store/favoriteStore";
import { showToast } from "../../store/toastStore";

const EDGE = 16;
const HERO_H = 196;
const HEADER_H = 56;
const DROPDOWN_H = 52;
const THUMB = 112;

const SERVICES: { key: ServiceType; label: string }[] = [
  { key: "dine_in", label: "Dine In" },
  { key: "takeaway", label: "Take Away" },
  { key: "delivery", label: "Delivery" },
];

interface Section {
  id: string;
  title: string;
  items: MenuItem[];
}

/** True when the item has choices to make beyond its one base variant. */
function hasChoices(item: MenuItem) {
  return (
    item.optionGroups.length > 1 ||
    (item.optionGroups[0]?.options.length ?? 0) > 1
  );
}

/** A round white button laid over the hero photo. */
function HeroButton({
  glyph,
  label,
  onPress,
  rotate,
}: {
  glyph: GlyphName;
  label: string;
  onPress: () => void;
  rotate?: 0 | 90 | 180 | 270;
}) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.9}
      accessibilityLabel={label}
      style={{
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
      }}
    >
      <Glyph name={glyph} size={19} color={LABEL_INK} rotate={rotate} />
    </PressableScale>
  );
}

/** Small outlined chip under the outlet card. */
function Chip({
  glyph,
  label,
  onPress,
}: {
  glyph: GlyphName;
  label: string;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.96}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        height: 38,
        paddingHorizontal: 13,
        borderRadius: 19,
        borderWidth: 1,
        borderColor: RULE,
        backgroundColor: "#FFFFFF",
      }}
    >
      <Glyph name={glyph} size={16} color={brand[600]} />
      <UiText
        color={LABEL_INK}
        style={{
          fontSize: 13.5,
          lineHeight: 18,
          fontFamily: fontFamilies.bold,
        }}
      >
        {label}
      </UiText>
    </PressableScale>
  );
}

/** Tambah before anything is in the cart, then − qty + and a note. */
function ItemControls({
  item,
  qty,
  hasNote,
  onAdd,
  onRemove,
  onNote,
}: {
  item: MenuItem;
  qty: number;
  hasNote: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onNote: () => void;
}) {
  if (qty === 0) {
    return (
      <PressableScale
        onPress={onAdd}
        scaleTo={0.95}
        accessibilityLabel={`Tambah ${item.name}`}
        style={{
          height: 36,
          borderRadius: 18,
          borderWidth: 1.5,
          borderColor: brand[600],
          backgroundColor: "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <UiText
          color={brand[700]}
          style={{
            fontSize: 14.5,
            lineHeight: 19,
            fontFamily: fontFamilies.extrabold,
          }}
        >
          Tambah
        </UiText>
      </PressableScale>
    );
  }
  const round = {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: brand[600],
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };
  return (
    <View style={{ gap: 8 }}>
      <View
        style={{
          height: 36,
          borderRadius: 18,
          borderWidth: 1.5,
          borderColor: brand[600],
          backgroundColor: "#FFFFFF",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 3,
        }}
      >
        <PressableScale
          onPress={onRemove}
          scaleTo={0.85}
          hitSlop={6}
          accessibilityLabel={`Kurangi ${item.name}`}
          style={round}
        >
          <Glyph name="minus" size={13} color={brand[700]} />
        </PressableScale>
        <UiText
          color={LABEL_INK}
          style={{
            fontSize: 15,
            lineHeight: 19,
            fontFamily: fontFamilies.extrabold,
          }}
        >
          {qty}
        </UiText>
        <PressableScale
          onPress={onAdd}
          scaleTo={0.85}
          hitSlop={6}
          accessibilityLabel={`Tambah lagi ${item.name}`}
          style={[round, { backgroundColor: brand[600] }]}
        >
          <Glyph name="plus" size={13} color="#FFFFFF" />
        </PressableScale>
      </View>
      <PressableScale
        onPress={onNote}
        scaleTo={0.95}
        style={{
          alignSelf: "center",
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          height: 34,
          paddingHorizontal: 13,
          borderRadius: 17,
          borderWidth: 1,
          borderColor: hasNote ? brand[200] : RULE,
          backgroundColor: hasNote ? brand[50] : "#FFFFFF",
        }}
      >
        <Glyph
          name={hasNote ? "check" : "pencil"}
          size={13}
          color={brand[600]}
        />
        <UiText
          color={LABEL_INK}
          style={{
            fontSize: 13,
            lineHeight: 17,
            fontFamily: fontFamilies.bold,
          }}
        >
          Catatan
        </UiText>
      </PressableScale>
    </View>
  );
}

/**
 * Order tab, laid out like a restaurant page: the outlet's photo, its card
 * (rating, time, distance, service, change outlet, opening hours), the
 * member's coupons, then the whole menu in sections. The section picker
 * sits above the menu and stays pinned under the search bar while the
 * list scrolls, showing whichever section is on screen; the basket rides
 * at the bottom once something is in it.
 */
export default function OrderScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const outletId = useOrderStore((s) => s.outletId);
  const serviceType = useOrderStore((s) => s.serviceType);
  const setServiceType = useOrderStore((s) => s.setServiceType);
  const reopenOutletSheet = useOrderStore((s) => s.reopenOutletSheet);
  const lines = useCartStore((s) => s.lines);
  const addLine = useCartStore((s) => s.addLine);
  const setLineQty = useCartStore((s) => s.setLineQty);
  const setLineNote = useCartStore((s) => s.setLineNote);
  const clearCart = useCartStore((s) => s.clear);
  const coupons = useCouponStore((s) => s.mine);
  const favorites = useFavoriteStore((s) => s.ids);

  const outlet = getOutlet(outletId);
  const brandInfo = getBrand(outlet?.brandId ?? "");
  const stats = outletStats(outletId);
  const tooFar = (outlet?.distanceKm ?? 0) > MAX_ORDER_DISTANCE_KM;

  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [headerOn, setHeaderOn] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [active, setActive] = useState(0);
  const [picker, setPicker] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [noteFor, setNoteFor] = useState<string | undefined>();
  const [promoPage, setPromoPage] = useState(0);

  const scrollRef = useRef<ScrollView>(null);
  const searchRef = useRef<TextInput>(null);
  const menuY = useRef(0);
  const dropdownY = useRef(0);
  const sectionsY = useRef(0);
  const sectionOffsets = useRef<Record<string, number>>({});

  const topInset = insets.top;
  const pinH = topInset + HEADER_H;

  // The outlet's own menu, in sections: best sellers, the member's saved
  // items, then each category that has anything in it.
  const brandItems = useMemo(
    () => menuItems.filter((m) => m.brandId === outlet?.brandId),
    [outlet?.brandId],
  );
  const sections: Section[] = useMemo(() => {
    const out: Section[] = [];
    const best = brandItems.filter((m) => m.isBestSeller);
    if (best.length) out.push({ id: "best", title: "Terlaris", items: best });
    const fav = brandItems.filter((m) => favorites.includes(m.id));
    if (fav.length) out.push({ id: "fav", title: "Favoritmu", items: fav });
    for (const c of categories) {
      const items = brandItems.filter((m) => m.categoryId === c.id);
      if (items.length) out.push({ id: c.id, title: c.name, items });
    }
    return out;
  }, [brandItems, favorites]);

  const q = query.trim().toLowerCase();
  const results = q
    ? brandItems.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q),
      )
    : [];

  // Lines of another brand cannot be ordered here.
  const foreign = lines.filter((l) => l.menuItem.brandId !== outlet?.brandId);
  const ownLines = lines.filter((l) => l.menuItem.brandId === outlet?.brandId);
  const count = ownLines.reduce((n, l) => n + l.qty, 0);
  const total = ownLines.reduce(
    (n, l) => n + unitPrice(l.menuItem, l.selections) * l.qty,
    0,
  );
  const qtyOf = (id: string) =>
    ownLines.filter((l) => l.menuItem.id === id).reduce((n, l) => n + l.qty, 0);
  const lastLine = (id: string) =>
    [...ownLines].reverse().find((l) => l.menuItem.id === id);

  // Coupons for this brand (or any brand) that are still unused.
  const myCoupons = coupons.filter(
    (c) => !c.used && (!c.brandId || c.brandId === outlet?.brandId),
  );
  // The nearest spend target among them, for the strip over the basket.
  const spendGoal = myCoupons
    .filter((c) => c.rule?.minSpend)
    .sort((a, b) => (a.rule?.minSpend ?? 0) - (b.rule?.minSpend ?? 0))[0];

  const add = (item: MenuItem) => {
    tapSelect();
    if (hasChoices(item) && qtyOf(item.id) === 0) {
      router.push(`/product/${item.id}`);
      return;
    }
    const line = lastLine(item.id);
    if (line) setLineQty(line.lineId, line.qty + 1);
    // The stepper and the basket bar show it landed; no toast over them.
    else addLine(item, 1, defaultSelections(item.optionGroups));
  };
  const remove = (item: MenuItem) => {
    tapSelect();
    const line = lastLine(item.id);
    if (line) setLineQty(line.lineId, line.qty - 1);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const on = y > HERO_H - HEADER_H - topInset - 10;
    if (on !== headerOn) setHeaderOn(on);
    const isStuck = y + pinH >= menuY.current + dropdownY.current;
    if (isStuck !== stuck) setStuck(isStuck);
    // The section on screen: the last one whose top has passed the pin.
    const line = y + pinH + DROPDOWN_H + 8;
    let current = 0;
    sections.forEach((s, i) => {
      const top =
        menuY.current + sectionsY.current + (sectionOffsets.current[s.id] ?? 0);
      if (top <= line) current = i;
    });
    if (current !== active) setActive(current);
  };

  const jumpTo = (i: number) => {
    setPicker(false);
    setActive(i);
    const s = sections[i];
    const top =
      menuY.current + sectionsY.current + (sectionOffsets.current[s.id] ?? 0);
    scrollRef.current?.scrollTo({
      y: Math.max(0, top - pinH - DROPDOWN_H + 2),
      animated: true,
    });
  };

  const openSearch = () => {
    setSearchOpen(true);
    scrollRef.current?.scrollTo({
      y: Math.max(0, menuY.current + dropdownY.current - pinH),
      animated: true,
    });
    setTimeout(() => searchRef.current?.focus(), 250);
  };
  const closeSearch = () => {
    setQuery("");
    setSearchOpen(false);
    searchRef.current?.blur();
  };

  const share = () => {
    if (!outlet) return;
    Share.share({
      message: `Yuk pesan di ${outletFullName(outlet)} lewat aplikasi Good Will Grow!`,
    }).catch(() => {});
  };

  const noteLine = noteFor ? lastLine(noteFor) : undefined;
  const showHeader = headerOn || searchOpen;
  const searching = q.length > 0;
  const promoW = Math.min(width * 0.72, 272);
  const cartBottom = insets.bottom + space.md + TAB_BAR_HEIGHT + 10;
  const heroImage =
    outlet?.brandId === "nordu" ? promoBanners[1]?.source : undefined;

  const renderItem = (item: MenuItem, i: number, all: MenuItem[]) => {
    const qty = qtyOf(item.id);
    const line = lastLine(item.id);
    return (
      <View
        key={item.id}
        style={{
          flexDirection: "row",
          gap: 14,
          paddingVertical: 18,
          paddingHorizontal: EDGE,
          borderBottomWidth: i === all.length - 1 ? 0 : 1,
          borderBottomColor: RULE,
          backgroundColor: qty > 0 ? "#F7F9FF" : "#FFFFFF",
        }}
      >
        {qty > 0 ? (
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 12,
              bottom: 12,
              width: 4,
              borderTopRightRadius: 3,
              borderBottomRightRadius: 3,
              backgroundColor: brand[600],
            }}
          />
        ) : null}
        <PressableScale
          onPress={() => router.push(`/product/${item.id}`)}
          scaleTo={0.99}
          style={{ flex: 1 }}
        >
          {item.isBestSeller ? (
            <View
              style={{
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginBottom: 6,
                paddingHorizontal: 8,
                height: 22,
                borderRadius: 11,
                backgroundColor: "#FFF3D6",
              }}
            >
              <Glyph name="star" size={11} color="#C98A00" />
              <UiText
                color="#8A5A00"
                style={{
                  fontSize: 11,
                  lineHeight: 14,
                  fontFamily: fontFamilies.bold,
                }}
              >
                Terlaris
              </UiText>
            </View>
          ) : null}
          <UiText
            color={LABEL_INK}
            style={{
              fontSize: 16,
              lineHeight: 21,
              fontFamily: fontFamilies.bold,
            }}
          >
            {item.name}
          </UiText>
          <UiText
            color={QUIET_INK}
            numberOfLines={2}
            style={{
              marginTop: 4,
              fontSize: 13,
              lineHeight: 18,
              fontFamily: fontFamilies.medium,
            }}
          >
            {item.description}
          </UiText>
          <UiText
            color={LABEL_INK}
            style={{
              marginTop: 10,
              fontSize: 15.5,
              lineHeight: 20,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            {formatRupiah(item.price)}
          </UiText>
          {line?.note ? (
            <UiText
              color={brand[700]}
              numberOfLines={1}
              style={{
                marginTop: 6,
                fontSize: 12.5,
                lineHeight: 17,
                fontFamily: fontFamilies.semibold,
              }}
            >
              Catatan: {line.note}
            </UiText>
          ) : null}
        </PressableScale>
        <View style={{ width: THUMB }}>
          <PressableScale
            onPress={() => router.push(`/product/${item.id}`)}
            scaleTo={0.97}
          >
            <MenuArt
              item={item}
              radius={16}
              style={{ width: THUMB, height: THUMB }}
            />
          </PressableScale>
          <View style={{ marginTop: -18, paddingHorizontal: 4 }}>
            <ItemControls
              item={item}
              qty={qty}
              hasNote={!!line?.note}
              onAdd={() => add(item)}
              onRemove={() => remove(item)}
              onNote={() => setNoteFor(item.id)}
            />
          </View>
        </View>
      </View>
    );
  };

  const dropdown = (
    <PressableScale
      onPress={() => {
        tapSelect();
        setPicker(true);
      }}
      scaleTo={0.99}
      accessibilityLabel="Pilih kategori menu"
      style={{
        height: DROPDOWN_H,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: EDGE,
        backgroundColor: "#FFFFFF",
      }}
    >
      <Glyph name="tabMenu" size={18} color={brand[600]} />
      <UiText
        color={LABEL_INK}
        numberOfLines={1}
        style={{
          flex: 1,
          fontSize: 17,
          lineHeight: 22,
          fontFamily: fontFamilies.extrabold,
        }}
      >
        {sections[active]?.title ?? "Menu"}
      </UiText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          height: 30,
          paddingHorizontal: 11,
          borderRadius: 15,
          backgroundColor: brand[50],
        }}
      >
        <UiText
          color={brand[700]}
          style={{
            fontSize: 12.5,
            lineHeight: 16,
            fontFamily: fontFamilies.bold,
          }}
        >
          Kategori
        </UiText>
        <Glyph name="chevronRight" size={12} color={brand[700]} rotate={90} />
      </View>
    </PressableScale>
  );

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style={showHeader ? "dark" : "light"} />

      <ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: cartBottom + (count > 0 ? 130 : 30),
        }}
      >
        {/* the outlet's photo, or its colours until one is shot */}
        <View
          style={{
            height: HERO_H + topInset,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
            overflow: "hidden",
            backgroundColor: brand[800],
          }}
        >
          {heroImage ? (
            <Image
              source={heroImage}
              resizeMode="cover"
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <LinearGradient
              colors={brandInfo?.gradient ?? [brand[600], brand[800]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            >
              <View
                style={{
                  position: "absolute",
                  right: -30,
                  bottom: -40,
                  opacity: 0.18,
                }}
              >
                <BrandLogo brandId={outlet?.brandId} size={220} />
              </View>
            </LinearGradient>
          )}
          <LinearGradient
            colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 110,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: topInset + 12,
              left: EDGE,
              right: EDGE,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <HeroButton
              glyph="receipt"
              label="Riwayat pesanan"
              onPress={() => router.push("/order-history")}
            />
            <View style={{ flex: 1 }} />
            <HeroButton glyph="search" label="Cari menu" onPress={openSearch} />
            <HeroButton glyph="share" label="Bagikan outlet" onPress={share} />
          </View>
        </View>

        {/* outlet card */}
        <View
          style={{
            marginTop: -74,
            marginHorizontal: EDGE - 2,
            borderRadius: 22,
            backgroundColor: "#FFFFFF",
            padding: 14,
            shadowColor: "#0B2B73",
            shadowOpacity: 0.1,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 8 },
            elevation: 5,
          }}
        >
          <PressableScale
            onPress={() => outlet && router.push(`/outlet/${outlet.id}`)}
            scaleTo={0.99}
            accessibilityLabel="Info outlet"
            style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                borderWidth: 1,
                borderColor: RULE,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FFFFFF",
              }}
            >
              <BrandLogo brandId={outlet?.brandId} size={36} />
            </View>
            <View style={{ flex: 1 }}>
              <UiText
                color={LABEL_INK}
                numberOfLines={1}
                style={{
                  fontSize: 17,
                  lineHeight: 22,
                  fontFamily: fontFamilies.extrabold,
                }}
              >
                {outlet ? outletFullName(outlet) : "Pilih outlet"}
              </UiText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 2,
                }}
              >
                <Glyph name="star" size={14} color="#F2A516" />
                <UiText
                  color={LABEL_INK}
                  style={{
                    fontSize: 14,
                    lineHeight: 19,
                    fontFamily: fontFamilies.bold,
                  }}
                >
                  {stats.rating.toFixed(1).replace(".", ",")}
                </UiText>
                <UiText
                  color={QUIET_INK}
                  style={{
                    fontSize: 13,
                    lineHeight: 18,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  ({stats.countLabel})
                </UiText>
              </View>
              <UiText
                color={tooFar ? danger[500] : QUIET_INK}
                style={{
                  marginTop: 1,
                  fontSize: 13,
                  lineHeight: 18,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                Siap {stats.prepMinutes} menit ·{" "}
                {outlet ? formatDistance(outlet.distanceKm) : ""}
              </UiText>
            </View>
            <Glyph name="chevronRight" size={16} color={QUIET_INK} />
          </PressableScale>

          {/* service type, as one segmented pill */}
          <View
            style={{
              marginTop: 14,
              flexDirection: "row",
              padding: 4,
              borderRadius: 24,
              backgroundColor: "#F1F3F8",
            }}
          >
            {SERVICES.map(({ key, label }) => {
              const on = serviceType === key;
              const ok = outlet?.services.includes(key) ?? true;
              return (
                <PressableScale
                  key={key}
                  onPress={() => {
                    if (!ok) {
                      showToast(
                        `${label} belum tersedia di outlet ini`,
                        "info",
                      );
                      return;
                    }
                    tapSelect();
                    setServiceType(key);
                  }}
                  scaleTo={0.97}
                  style={{ flex: 1, opacity: ok ? 1 : 0.45 }}
                >
                  {on ? (
                    <LinearGradient
                      colors={["#4C78E0", brand[600], brand[800]]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        height: 38,
                        borderRadius: 19,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <UiText
                        color="#FFFFFF"
                        style={{
                          fontSize: 14,
                          lineHeight: 18,
                          fontFamily: fontFamilies.extrabold,
                        }}
                      >
                        {label}
                      </UiText>
                    </LinearGradient>
                  ) : (
                    <View
                      style={{
                        height: 38,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <UiText
                        color={QUIET_INK}
                        style={{
                          fontSize: 14,
                          lineHeight: 18,
                          fontFamily: fontFamilies.bold,
                        }}
                      >
                        {label}
                      </UiText>
                    </View>
                  )}
                </PressableScale>
              );
            })}
          </View>

          {tooFar ? (
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                borderRadius: 12,
                backgroundColor: "#FDECEE",
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
            >
              <Glyph name="alertCircle" size={15} color={danger[500]} />
              <UiText
                color={danger[500]}
                style={{
                  flex: 1,
                  fontSize: 12.5,
                  lineHeight: 17,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                Kamu lebih dari {MAX_ORDER_DISTANCE_KM.toFixed(1)} km dari
                outlet ini. Pastikan bisa mengambil pesananmu.
              </UiText>
            </View>
          ) : null}

          <View
            style={{
              marginTop: 14,
              borderTopWidth: 1,
              borderStyle: "dashed",
              borderTopColor: "#D9DEE8",
            }}
          />
          <View style={{ marginTop: 12, flexDirection: "row", gap: 8 }}>
            <Chip
              glyph="store"
              label="Ganti outlet"
              onPress={() => {
                tapSelect();
                reopenOutletSheet();
              }}
            />
            <Chip
              glyph="clock"
              label={outlet?.isOpen ? `Buka · ${outlet.hours}` : "Jam buka"}
              onPress={() => setInfoOpen(true)}
            />
          </View>
        </View>

        {/* the member's coupons for this outlet */}
        {myCoupons.length ? (
          <View style={{ marginTop: 16 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={promoW + 10}
              decelerationRate="fast"
              scrollEventThrottle={16}
              onScroll={(e) => {
                const p = Math.round(
                  e.nativeEvent.contentOffset.x / (promoW + 10),
                );
                if (p !== promoPage) setPromoPage(p);
              }}
              contentContainerStyle={{ paddingHorizontal: EDGE - 2, gap: 10 }}
            >
              {myCoupons.map((c) => (
                <PressableScale
                  key={c.id}
                  onPress={() => router.push("/coupons")}
                  scaleTo={0.98}
                  style={{
                    width: promoW,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    padding: 12,
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: RULE,
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 13,
                      backgroundColor: "#FFF3D6",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Glyph name="ticketPercent" size={21} color="#C98A00" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <UiText
                      color={LABEL_INK}
                      numberOfLines={1}
                      style={{
                        fontSize: 14.5,
                        lineHeight: 19,
                        fontFamily: fontFamilies.extrabold,
                      }}
                    >
                      {c.detail?.benefits[0] ?? c.title}
                    </UiText>
                    <UiText
                      color={QUIET_INK}
                      numberOfLines={1}
                      style={{
                        fontSize: 12.5,
                        lineHeight: 17,
                        fontFamily: fontFamilies.medium,
                      }}
                    >
                      {c.rule?.minSpend
                        ? `Min. belanja ${formatRupiah(c.rule.minSpend)}`
                        : c.title}
                    </UiText>
                  </View>
                </PressableScale>
              ))}
            </ScrollView>
            {myCoupons.length > 1 ? (
              <View
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                {myCoupons.map((c, i) => (
                  <View
                    key={c.id}
                    style={{
                      width: i === promoPage ? 20 : 7,
                      height: 7,
                      borderRadius: 4,
                      backgroundColor: i === promoPage ? brand[600] : "#D3D9E6",
                    }}
                  />
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {foreign.length ? (
          <View
            style={{
              marginTop: 14,
              marginHorizontal: EDGE - 2,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              borderRadius: 16,
              backgroundColor: "#FFF6E5",
              padding: 12,
            }}
          >
            <Glyph name="cart" size={18} color="#A35F00" />
            <UiText
              color="#6B4200"
              style={{
                flex: 1,
                fontSize: 13,
                lineHeight: 18,
                fontFamily: fontFamilies.semibold,
              }}
            >
              Keranjangmu masih berisi menu{" "}
              {getBrand(foreign[0].menuItem.brandId)?.name ?? "outlet lain"}.
            </UiText>
            <PressableScale
              onPress={() => {
                clearCart();
                showToast("Keranjang dikosongkan");
              }}
              scaleTo={0.95}
              style={{
                height: 32,
                paddingHorizontal: 12,
                borderRadius: 16,
                backgroundColor: "#FFFFFF",
                justifyContent: "center",
              }}
            >
              <UiText
                color="#A35F00"
                style={{
                  fontSize: 12.5,
                  lineHeight: 16,
                  fontFamily: fontFamilies.bold,
                }}
              >
                Kosongkan
              </UiText>
            </PressableScale>
          </View>
        ) : null}

        {/* the menu */}
        <View
          onLayout={(e) => {
            menuY.current = e.nativeEvent.layout.y;
          }}
          style={{
            marginTop: 18,
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: "hidden",
          }}
        >
          <View
            onLayout={(e: LayoutChangeEvent) => {
              dropdownY.current = e.nativeEvent.layout.y;
            }}
            style={{ paddingTop: 6 }}
          >
            {searching ? (
              <View
                style={{
                  height: DROPDOWN_H,
                  justifyContent: "center",
                  paddingHorizontal: EDGE,
                }}
              >
                <UiText
                  color={LABEL_INK}
                  style={{
                    fontSize: 17,
                    lineHeight: 22,
                    fontFamily: fontFamilies.extrabold,
                  }}
                >
                  {`${results.length} hasil untuk “${query.trim()}”`}
                </UiText>
              </View>
            ) : (
              dropdown
            )}
          </View>

          {searching ? (
            results.length ? (
              results.map((m, i, all) => renderItem(m, i, all))
            ) : (
              <View style={{ alignItems: "center", padding: 32, gap: 6 }}>
                <Glyph name="search" size={28} color={QUIET_INK} />
                <UiText
                  color={LABEL_INK}
                  style={{
                    fontSize: 15,
                    lineHeight: 20,
                    fontFamily: fontFamilies.bold,
                  }}
                >
                  Menu tidak ditemukan
                </UiText>
                <UiText
                  color={QUIET_INK}
                  center
                  style={{
                    fontSize: 13,
                    lineHeight: 18,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  Coba kata lain, misalnya “kopi” atau “ayam”.
                </UiText>
              </View>
            )
          ) : (
            <View
              onLayout={(e) => {
                sectionsY.current = e.nativeEvent.layout.y;
              }}
            >
              {sections.map((s, si) => (
                <View
                  key={s.id}
                  onLayout={(e) => {
                    sectionOffsets.current[s.id] = e.nativeEvent.layout.y;
                  }}
                >
                  {si > 0 ? (
                    <View style={{ height: 8, backgroundColor: surface }} />
                  ) : null}
                  <View
                    style={{
                      paddingHorizontal: EDGE,
                      paddingTop: 18,
                      paddingBottom: 4,
                    }}
                  >
                    <UiText
                      color={LABEL_INK}
                      style={{
                        fontSize: 19,
                        lineHeight: 24,
                        fontFamily: fontFamilies.extrabold,
                      }}
                    >
                      {s.title}
                    </UiText>
                    <View
                      style={{
                        marginTop: 12,
                        borderTopWidth: 1,
                        borderStyle: "dashed",
                        borderTopColor: "#D9DEE8",
                      }}
                    />
                  </View>
                  {s.items.map((m, i, all) => renderItem(m, i, all))}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* search bar and pinned section picker, once the page has moved */}
      {showHeader ? (
        <Animated.View
          entering={FadeIn.duration(160)}
          exiting={FadeOut.duration(120)}
          style={{ position: "absolute", left: 0, right: 0, top: 0 }}
        >
          <View
            style={{
              paddingTop: topInset,
              backgroundColor: "#FFFFFF",
              borderBottomWidth: stuck && !searching ? 0 : 1,
              borderBottomColor: RULE,
            }}
          >
            <View
              style={{
                height: HEADER_H,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingHorizontal: EDGE - 4,
              }}
            >
              {searchOpen ? (
                <PressableScale
                  onPress={closeSearch}
                  scaleTo={0.9}
                  accessibilityLabel="Tutup pencarian"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Glyph
                    name="arrowRight"
                    rotate={180}
                    size={20}
                    color={LABEL_INK}
                  />
                </PressableScale>
              ) : null}
              <PressableScale
                onPress={() => {
                  setSearchOpen(true);
                  searchRef.current?.focus();
                }}
                scaleTo={1}
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: "#F1F3F8",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingHorizontal: 14,
                }}
              >
                <Glyph name="search" size={17} color={QUIET_INK} />
                <TextInput
                  ref={searchRef}
                  value={query}
                  onChangeText={setQuery}
                  onFocus={() => setSearchOpen(true)}
                  placeholder={`Cari menu di ${brandInfo?.shortName ?? "outlet ini"}`}
                  placeholderTextColor="#8A93A6"
                  returnKeyType="search"
                  style={[
                    {
                      flex: 1,
                      minWidth: 0,
                      padding: 0,
                      fontSize: 14.5,
                      fontFamily: fontFamilies.medium,
                      color: LABEL_INK,
                    },
                    Platform.OS === "web"
                      ? ({ outlineStyle: "none" } as object)
                      : null,
                  ]}
                />
                {query ? (
                  <PressableScale
                    onPress={() => setQuery("")}
                    hitSlop={10}
                    accessibilityLabel="Hapus pencarian"
                  >
                    <Glyph name="closeCircle" size={17} color="#8A93A6" />
                  </PressableScale>
                ) : null}
              </PressableScale>
              {!searchOpen ? (
                <PressableScale
                  onPress={() => router.push("/order-history")}
                  scaleTo={0.9}
                  accessibilityLabel="Riwayat pesanan"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: brand[50],
                  }}
                >
                  <Glyph name="receipt" size={19} color={brand[700]} />
                </PressableScale>
              ) : null}
            </View>
          </View>
          {stuck && !searching ? (
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: RULE,
                shadowColor: "#0B2B73",
                shadowOpacity: 0.08,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 6 },
                elevation: 3,
                backgroundColor: "#FFFFFF",
              }}
            >
              {dropdown}
            </View>
          ) : null}
        </Animated.View>
      ) : null}

      {/* basket, with how far the nearest coupon is */}
      {count > 0 && outlet ? (
        <Animated.View
          entering={FadeIn.duration(180)}
          style={{
            position: "absolute",
            left: EDGE - 4,
            right: EDGE - 4,
            bottom: cartBottom,
            gap: 8,
          }}
        >
          {spendGoal?.rule?.minSpend ? (
            <View
              style={{
                borderRadius: 16,
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 12,
                paddingTop: 9,
                paddingBottom: 10,
                borderWidth: 1,
                borderColor: RULE,
                gap: 7,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Glyph name="ticketPercent" size={16} color="#C98A00" />
                <UiText
                  color={LABEL_INK}
                  numberOfLines={1}
                  style={{
                    flex: 1,
                    fontSize: 12.5,
                    lineHeight: 17,
                    fontFamily: fontFamilies.semibold,
                  }}
                >
                  {total >= spendGoal.rule.minSpend
                    ? `Kupon "${spendGoal.title}" bisa dipakai saat bayar`
                    : `Tambah ${formatRupiah(spendGoal.rule.minSpend - total)} lagi untuk pakai "${spendGoal.title}"`}
                </UiText>
              </View>
              <View
                style={{
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: "#E9EDF5",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${Math.min(100, (total / spendGoal.rule.minSpend) * 100)}%`,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: "#F2A516",
                  }}
                />
              </View>
            </View>
          ) : null}
          <PressableScale
            onPress={() => {
              tapSuccess();
              router.push("/cart");
            }}
            scaleTo={0.98}
            accessibilityLabel="Buka keranjang"
            style={{
              borderRadius: 30,
              shadowColor: brand[700],
              shadowOpacity: 0.35,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 7 },
              elevation: 6,
            }}
          >
            <LinearGradient
              colors={["#4C78E0", brand[600], brand[800]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                height: 60,
                borderRadius: 30,
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 20,
                paddingRight: 8,
                gap: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <UiText
                  color="#FFFFFF"
                  style={{
                    fontSize: 15.5,
                    lineHeight: 20,
                    fontFamily: fontFamilies.extrabold,
                  }}
                >
                  {count} item
                </UiText>
                <UiText
                  color="rgba(255,255,255,0.85)"
                  numberOfLines={1}
                  style={{
                    fontSize: 12.5,
                    lineHeight: 16,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  {outletFullName(outlet)}
                </UiText>
              </View>
              <UiText
                color="#FFFFFF"
                style={{
                  fontSize: 16.5,
                  lineHeight: 21,
                  fontFamily: fontFamilies.extrabold,
                }}
              >
                {formatRupiah(total)}
              </UiText>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(255,255,255,0.18)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Glyph name="cart" size={20} color="#FFFFFF" />
              </View>
            </LinearGradient>
          </PressableScale>
        </Animated.View>
      ) : null}

      {picker ? (
        <AccountSheet title="Kategori menu" onClose={() => setPicker(false)}>
          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {sections.map((s, i) => {
              const on = i === active;
              return (
                <PressableScale
                  key={s.id}
                  onPress={() => jumpTo(i)}
                  scaleTo={0.99}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    marginHorizontal: 12,
                    paddingHorizontal: 12,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: on ? brand[50] : "transparent",
                  }}
                >
                  <UiText
                    color={on ? brand[700] : LABEL_INK}
                    style={{
                      flex: 1,
                      fontSize: 15.5,
                      lineHeight: 20,
                      fontFamily: on
                        ? fontFamilies.extrabold
                        : fontFamilies.semibold,
                    }}
                  >
                    {s.title}
                  </UiText>
                  <UiText
                    color={QUIET_INK}
                    style={{
                      fontSize: 13,
                      lineHeight: 17,
                      fontFamily: fontFamilies.semibold,
                    }}
                  >
                    {s.items.length} menu
                  </UiText>
                  {on ? (
                    <Glyph name="check" size={16} color={brand[600]} />
                  ) : null}
                </PressableScale>
              );
            })}
          </ScrollView>
        </AccountSheet>
      ) : null}

      {infoOpen && outlet ? (
        <OutletInfoSheet outlet={outlet} onClose={() => setInfoOpen(false)} />
      ) : null}

      {noteFor && noteLine ? (
        <NoteSheet
          title={`Catatan untuk ${noteLine.menuItem.name}`}
          value={noteLine.note ?? ""}
          onClose={() => setNoteFor(undefined)}
          onSave={(v) => {
            setLineNote(noteLine.lineId, v);
            setNoteFor(undefined);
            showToast(v ? "Catatan disimpan" : "Catatan dihapus");
          }}
        />
      ) : null}
    </View>
  );
}
