import React, { useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Activity, ChevronRight, Lock, ShoppingBasket } from "lucide-react-native";
import { AppText } from "../../components/ui/AppText";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";
import { PointsCardGlyph, ReceiptGlyph } from "../../components/MemberGlyphs";
import { PressableScale } from "../../components/ui/PressableScale";
import { brand, ink, surface } from "../../theme/colors";
import { shadow } from "../../theme/shadows";
import { memberTiers } from "../../data/mock";
import { useMemberStore } from "../../store/memberStore";

const GUTTER = 16;

/** Small filled tile used by the Poinmu and Benefit headings. */
function GlyphTile({
  children,
  size = 22,
  background,
}: {
  children: React.ReactNode;
  size?: number;
  background: string;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        backgroundColor: background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
}

/** Outlined pill that fills from the left, at the reference's 13.5pt height. */
function ProgressRow({
  icon,
  label,
  ratio,
}: {
  icon: React.ReactNode;
  label: string;
  ratio: number;
}) {
  const percent = Math.round(ratio * 100);
  return (
    <View style={{ gap: 7 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {icon}
        <AppText variant="bodyMedium" color={ink[800]} style={{ flex: 1 }}>
          {label}
        </AppText>
        <AppText variant="titleLg" color={brand[800]}>
          {percent}%
        </AppText>
      </View>
      <View
        style={{
          height: 13.5,
          borderRadius: 7,
          borderWidth: 1.4,
          borderColor: brand[700],
          overflow: "hidden",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: `${percent}%`,
            height: "100%",
            borderRadius: 7,
            backgroundColor: brand[700],
          }}
        />
      </View>
    </View>
  );
}

export default function MemberScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const points = useMemberStore((s) => s.points);
  const currentTier = useMemberStore((s) => s.currentTier());
  const spendProgress = useMemberStore((s) => s.spendProgress());
  const txProgress = useMemberStore((s) => s.transactionProgress());

  const [index, setIndex] = useState(() =>
    Math.max(0, memberTiers.findIndex((t) => t.id === currentTier.id))
  );

  // Each page is the full screen so paging lands the card dead centre; the
  // progress block below shares the card's width, as the reference does.
  const cardWidth = width * 0.7;
  const tier = memberTiers[index];
  const unlocked = memberTiers.findIndex((t) => t.id === currentTier.id) >= index;

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />

      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderBottomLeftRadius: 18,
          borderBottomRightRadius: 18,
          zIndex: 2,
          ...(shadow.sm as object),
        }}
      >
        <SafeAreaView edges={["top"]}>
          <View style={{ paddingHorizontal: GUTTER, height: 44, justifyContent: "center" }}>
            <AppText
              color={brand[700]}
              style={{ fontSize: 16, lineHeight: 22, fontFamily: "Urbanist_500Medium" }}
            >
              Membership Level
            </AppText>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100, gap: 12 }}
      >
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 18,
            paddingTop: 18,
            paddingBottom: 16,
            gap: 16,
          }}
        >
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(e) =>
              setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
            }
          >
            {memberTiers.map((t, i) => {
              const isUnlocked =
                memberTiers.findIndex((x) => x.id === currentTier.id) >= i;
              return (
                <View key={t.id} style={{ width, alignItems: "center" }}>
                  <View style={{ width: cardWidth, aspectRatio: 0.63 }}>
                    {/* Artwork comes from the creative team; the frame around
                        it is built so the layout is final either way. */}
                    <ImagePlaceholder
                      label={`Kartu Member — ${t.name}`}
                      radius={18}
                      iconSize={30}
                      style={{ flex: 1 }}
                    />
                    {!isUnlocked ? (
                      <View
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 18,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                      >
                        <Lock size={15} color={ink[600]} />
                        <AppText variant="titleLg" color={ink[600]}>
                          Level ini terkunci
                        </AppText>
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {unlocked ? (
            <View style={{ width: cardWidth, alignSelf: "center", gap: 12 }}>
              <ProgressRow
                icon={<ShoppingBasket size={15} color={brand[700]} fill={brand[700]} strokeWidth={1.6} />}
                label="Total Belanja"
                ratio={spendProgress}
              />
              <ProgressRow
                icon={<ReceiptGlyph size={15} color={brand[700]} detail="#FFFFFF" />}
                label="Total Transaksi"
                ratio={txProgress}
              />
            </View>
          ) : null}

          <View style={{ flexDirection: "row", justifyContent: "center", gap: 6 }}>
            {memberTiers.map((t, i) => (
              <View
                key={t.id}
                style={{
                  width: i === index ? 18 : 6,
                  height: 6.5,
                  borderRadius: 4,
                  backgroundColor: i === index ? brand[900] : brand[200],
                }}
              />
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: GUTTER, gap: 12 }}>
          <PressableScale
            onPress={() => router.push("/points-history")}
            scaleTo={0.99}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 11,
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              paddingVertical: 16,
              paddingHorizontal: 14,
              ...(shadow.xs as object),
            }}
          >
            <GlyphTile background={brand[900]}>
              <PointsCardGlyph size={14} color="#FFFFFF" detail={brand[900]} />
            </GlyphTile>
            <AppText variant="h3" style={{ flex: 1 }}>
              Poinmu
            </AppText>
            <AppText variant="h3">{points.toLocaleString("id-ID")}</AppText>
            <ChevronRight size={19} color={ink[500]} />
          </PressableScale>

          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              padding: 14,
              gap: 12,
              ...(shadow.xs as object),
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <GlyphTile background={brand[900]}>
                <Activity size={13} color="#FFFFFF" strokeWidth={2.6} />
              </GlyphTile>
              <AppText variant="h3">{tier.name} Benefit</AppText>
            </View>
            <AppText variant="body" color={ink[700]} style={{ lineHeight: 19 }}>
              Setiap transaksi Anda akan mendapatkan poin. Semakin tinggi level, semakin banyak
              keuntungan Anda
            </AppText>
            <PressableScale
              onPress={() => router.push("/terms")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                height: 46,
                borderRadius: 12,
                borderWidth: 1.4,
                borderColor: brand[700],
              }}
            >
              <GlyphTile size={26} background={brand[100]}>
                <AppText
                  color={brand[800]}
                  style={{ fontSize: 13, lineHeight: 17, fontFamily: "Urbanist_700Bold" }}
                >
                  i
                </AppText>
              </GlyphTile>
              <AppText variant="h3" color={brand[700]}>
                Informasi Selengkapnya
              </AppText>
            </PressableScale>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
