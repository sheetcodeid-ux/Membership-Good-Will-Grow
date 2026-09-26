import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { Glyph, type GlyphName } from "./icons/Glyph";
import { HelpArt } from "./OrderStatusArt";
import { LABEL_INK, QUIET_INK, RULE } from "./AccountMenu";
import { Block } from "./checkout/parts";
import { brand } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { hasWhatsApp, openWhatsApp } from "../data/contact";
import { tapSelect } from "../utils/haptics";

interface Topic {
  glyph: GlyphName;
  label: string;
  /** What the chat box opens with; the member can still edit it. */
  draft: string;
}

function topicsFor(stage: number, cancelled: boolean): Topic[] {
  if (cancelled) {
    return [
      {
        glyph: "coins",
        label: "Refund dana",
        draft: "Halo, kapan dana pesananku yang dibatalkan kembali?",
      },
      {
        glyph: "receipt",
        label: "Alasan batal",
        draft: "Halo, aku mau tanya kenapa pesananku dibatalkan.",
      },
    ];
  }
  const out: Topic[] = [];
  if (stage < 2) {
    out.push({
      glyph: "hourglass",
      label: "Belum siap",
      draft: "Halo, pesananku belum siap. Kira-kira berapa lama lagi?",
    });
    out.push({
      glyph: "pencil",
      label: "Ubah catatan",
      draft: "Halo, aku mau ubah catatan pesanan: ",
    });
  }
  out.push({
    glyph: "receipt",
    label: "Item bermasalah",
    draft: "Halo, ada item pesananku yang kurang atau salah: ",
  });
  out.push({
    glyph: "coins",
    label: "Pembayaran",
    draft: "Halo, aku mau tanya soal pembayaran pesanan ini.",
  });
  return out;
}

/** A glossy icon tile: gradient body, a light rim on top, a soft drop. */
function IconTile({
  glyph,
  colors,
}: {
  glyph: GlyphName;
  colors: readonly [string, string];
}) {
  return (
    <View
      style={{
        borderRadius: 14,
        shadowColor: colors[1],
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      }}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderColor: "rgba(255,255,255,0.45)",
        }}
      >
        <Glyph name={glyph} size={21} color="#FFFFFF" />
      </LinearGradient>
    </View>
  );
}

function ActionRow({
  glyph,
  colors,
  title,
  subtitle,
  onPress,
}: {
  glyph: GlyphName;
  colors: readonly [string, string];
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.98}
      accessibilityLabel={title}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: RULE,
        backgroundColor: "#FFFFFF",
        padding: 10,
        paddingRight: 12,
      }}
    >
      <IconTile glyph={glyph} colors={colors} />
      <View style={{ flex: 1 }}>
        <UiText
          color={LABEL_INK}
          numberOfLines={1}
          style={{
            fontSize: 15,
            lineHeight: 20,
            fontFamily: fontFamilies.bold,
          }}
        >
          {title}
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
          {subtitle}
        </UiText>
      </View>
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: brand[50],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Glyph name="chevronRight" size={13} color={brand[700]} />
      </View>
    </PressableScale>
  );
}

/**
 * "Butuh bantuan?" on Status Pesanan: a lit header with the phone scene,
 * the problems members raise most (each opens the outlet chat with the
 * message already written), and the ways to reach us, each saying where
 * it goes.
 */
export function OrderHelpCard({
  orderId,
  orderCode,
  stage,
  cancelled,
}: {
  orderId: string;
  orderCode: string;
  stage: number;
  cancelled: boolean;
}) {
  const topics = topicsFor(stage, cancelled);
  const openChat = (draft?: string) => {
    tapSelect();
    router.push({
      pathname: "/order-chat/[id]",
      params: draft ? { id: orderId, draft } : { id: orderId },
    });
  };

  return (
    <Block style={{ padding: 0 }}>
      <LinearGradient
        colors={["#E6EEFF", "#F4F7FF", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 14,
          paddingRight: 136,
          minHeight: 142,
        }}
      >
        <View
          style={{
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            height: 24,
            paddingHorizontal: 10,
            borderRadius: 12,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#DCE6FB",
          }}
        >
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: 3.5,
              backgroundColor: "#22A355",
            }}
          />
          <UiText
            color={brand[700]}
            style={{
              fontSize: 11.5,
              lineHeight: 15,
              fontFamily: fontFamilies.bold,
            }}
          >
            Outlet online
          </UiText>
        </View>
        <UiText
          color={LABEL_INK}
          style={{
            marginTop: 10,
            fontSize: 19,
            lineHeight: 24,
            fontFamily: fontFamilies.extrabold,
          }}
        >
          Butuh bantuan?
        </UiText>
        <UiText
          color={QUIET_INK}
          style={{
            marginTop: 4,
            fontSize: 13.5,
            lineHeight: 19,
            fontFamily: fontFamilies.medium,
          }}
        >
          Pilih kendalamu, kami bantu sampai beres.
        </UiText>
        <View
          pointerEvents="none"
          style={{ position: "absolute", right: 2, bottom: 0 }}
        >
          <HelpArt size={134} />
        </View>
      </LinearGradient>

      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <UiText
          color={QUIET_INK}
          style={{
            fontSize: 12,
            lineHeight: 16,
            fontFamily: fontFamilies.bold,
            letterSpacing: 0.3,
          }}
        >
          SERING DITANYAKAN
        </UiText>
        <View
          style={{
            marginTop: 8,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {topics.map((t) => (
            <PressableScale
              key={t.label}
              onPress={() => openChat(t.draft)}
              scaleTo={0.96}
              style={{
                flexBasis: "46%",
                flexGrow: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                height: 38,
                paddingHorizontal: 10,
                borderRadius: 18,
                borderWidth: 1.5,
                borderColor: "#D3DEF8",
                backgroundColor: "#F7F9FF",
              }}
            >
              <Glyph name={t.glyph} size={15} color={brand[600]} />
              <UiText
                color={brand[700]}
                numberOfLines={1}
                style={{
                  fontSize: 13,
                  lineHeight: 17,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                {t.label}
              </UiText>
            </PressableScale>
          ))}
        </View>

        <View style={{ marginTop: 14, gap: 10 }}>
          <ActionRow
            glyph="chatLines"
            colors={[brand[400], brand[700]]}
            title="Chat outlet"
            subtitle="Dibalas dalam ±5 menit"
            onPress={() => openChat()}
          />
          <ActionRow
            glyph="help"
            colors={["#F7B84B", "#E08A00"]}
            title="Pusat Bantuan"
            subtitle="Jawaban pertanyaan umum"
            onPress={() => {
              tapSelect();
              router.push("/faq");
            }}
          />
          {hasWhatsApp ? (
            <ActionRow
              glyph="whatsapp"
              colors={["#4ADE80", "#16A34A"]}
              title="WhatsApp CS Good Will Grow"
              subtitle="Untuk kendala di luar pesanan ini"
              onPress={() =>
                openWhatsApp(
                  `Halo, aku butuh bantuan soal pesanan ${orderCode}.`,
                )
              }
            />
          ) : null}
        </View>
      </View>
    </Block>
  );
}
