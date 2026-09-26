import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";
import { UiText } from "../../components/ui/Text";
import { AppHeader } from "../../components/ui/AppHeader";
import { PressableScale } from "../../components/ui/PressableScale";
import { Glyph } from "../../components/icons/Glyph";
import { BrandLogo } from "../../components/BrandLogo";
import { AccountEmpty } from "../../components/EmptyArt";
import { LABEL_INK, QUIET_INK, RULE } from "../../components/AccountMenu";
import { EDGE, LIFT } from "../../components/checkout/parts";
import { brand, surface } from "../../theme/colors";
import { fontFamilies } from "../../theme/typography";
import { useOrderRecord } from "../../store/ordersStore";
import { useChatStore, type ChatMessage } from "../../store/chatStore";
import { clock, READY_MINUTES } from "../../utils/orderFlow";
import { tapSelect } from "../../utils/haptics";

const QUICK = [
  "Pesananku sudah siap?",
  "Tolong es sedikit, ya",
  "Saya sudah di outlet",
  "Boleh ganti menu?",
];

/**
 * The outlet's reply until chat runs on a real service: a short, polite
 * answer picked from what the member wrote.
 */
function replyTo(text: string, readyAt: number | undefined) {
  const t = text.toLowerCase();
  if (t.includes("siap") || t.includes("lama") || t.includes("kapan")) {
    return readyAt
      ? `Pesananmu sedang kami siapkan, Kak. Perkiraan siap pukul ${clock(readyAt)}.`
      : "Pesananmu sedang kami siapkan, Kak. Kami kabari begitu siap.";
  }
  if (t.includes("sudah di") || t.includes("sampai")) {
    return "Siap, Kak! Silakan ke kasir dan tunjukkan kode pesananmu, ya.";
  }
  if (t.includes("ganti") || t.includes("batal")) {
    return "Untuk ganti menu, pesanan perlu dibatalkan dulu selama belum disiapkan. Kami bantu cek, ya.";
  }
  if (t.includes("es") || t.includes("gula") || t.includes("pedas")) {
    return "Baik, Kak. Catatannya sudah kami teruskan ke barista.";
  }
  return "Terima kasih, Kak. Pesanmu sudah kami terima dan segera kami bantu.";
}

function Bubble({ m, brandId }: { m: ChatMessage; brandId: string }) {
  const mine = m.from === "me";
  return (
    <Animated.View
      entering={FadeInUp.duration(220)}
      style={{
        flexDirection: "row",
        justifyContent: mine ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        gap: 8,
      }}
    >
      {!mine ? (
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: RULE,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BrandLogo brandId={brandId} size={22} />
        </View>
      ) : null}
      <View
        style={{
          maxWidth: "76%",
          borderRadius: 18,
          borderBottomRightRadius: mine ? 6 : 18,
          borderBottomLeftRadius: mine ? 18 : 6,
          paddingHorizontal: 14,
          paddingVertical: 10,
          backgroundColor: mine ? brand[600] : "#FFFFFF",
          ...(mine ? null : LIFT),
        }}
      >
        <UiText
          color={mine ? "#FFFFFF" : LABEL_INK}
          style={{
            fontSize: 15,
            lineHeight: 21,
            fontFamily: fontFamilies.medium,
          }}
        >
          {m.text}
        </UiText>
        <UiText
          color={mine ? "rgba(255,255,255,0.75)" : "#8A93A6"}
          style={{
            alignSelf: "flex-end",
            marginTop: 2,
            fontSize: 11,
            lineHeight: 14,
            fontFamily: fontFamilies.medium,
          }}
        >
          {clock(m.at)}
        </UiText>
      </View>
    </Animated.View>
  );
}

/**
 * Chat with the outlet about one order, from Status Pesanan: the order
 * pinned on top, the conversation, quick messages and a text box. The
 * outlet greets first and answers each message.
 */
export default function OrderChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrderRecord(id);
  const insets = useSafeAreaInsets();
  const messages = useChatStore((s) => (id ? s.threads[id] : undefined)) ?? [];
  const send = useChatStore((s) => s.send);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const list = useRef<ScrollView>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The outlet opens the conversation.
  useEffect(() => {
    if (!id || !order) return;
    if ((useChatStore.getState().threads[id] ?? []).length === 0) {
      send(
        id,
        "outlet",
        `Halo, Kak! Ini ${order.outletName}. Ada yang bisa kami bantu untuk pesanan ${order.orderCode}?`,
      );
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [id, order, send]);

  if (!order || !id) {
    return (
      <View style={{ flex: 1, backgroundColor: surface }}>
        <StatusBar style="dark" />
        <AppHeader tone="account" title="Chat outlet" />
        <AccountEmpty
          glyph="chatLines"
          title="Pesanan tidak ditemukan"
          subtitle="Buka chat dari halaman status pesananmu."
        />
      </View>
    );
  }

  const submit = (raw: string) => {
    const body = raw.trim();
    if (!body) return;
    tapSelect();
    send(id, "me", body);
    setText("");
    setTyping(true);
    if (timer.current) clearTimeout(timer.current);
    const readyAt = order.placedAt
      ? order.placedAt + READY_MINUTES * 60_000
      : undefined;
    timer.current = setTimeout(() => {
      send(id, "outlet", replyTo(body, readyAt));
      setTyping(false);
    }, 1200);
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader tone="account" title={order.outletName}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: EDGE + 30,
            paddingBottom: 10,
            marginTop: -6,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#22A355",
            }}
          />
          <UiText
            color={QUIET_INK}
            style={{
              fontSize: 12.5,
              lineHeight: 16,
              fontFamily: fontFamilies.semibold,
            }}
          >
            {typing
              ? "Sedang mengetik..."
              : "Online · biasanya membalas dalam 5 menit"}
          </UiText>
        </View>
      </AppHeader>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* the order this chat is about, back to its status on tap */}
        <PressableScale
          onPress={() => router.back()}
          scaleTo={0.99}
          style={{
            marginHorizontal: EDGE,
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            borderRadius: 16,
            backgroundColor: "#FFFFFF",
            padding: 12,
            ...LIFT,
          }}
        >
          <Glyph name="receipt" size={18} color={brand[600]} />
          <View style={{ flex: 1 }}>
            <UiText
              color={LABEL_INK}
              numberOfLines={1}
              style={{
                fontSize: 14,
                lineHeight: 18,
                fontFamily: fontFamilies.bold,
              }}
            >
              Pesanan {order.orderCode} · {order.lines.length} item
            </UiText>
            <UiText
              color={QUIET_INK}
              numberOfLines={1}
              style={{
                fontSize: 12.5,
                lineHeight: 16,
                fontFamily: fontFamilies.medium,
              }}
            >
              {order.lines.map((l) => l.name).join(", ")}
            </UiText>
          </View>
          <UiText
            color={brand[700]}
            style={{
              fontSize: 13,
              lineHeight: 17,
              fontFamily: fontFamilies.bold,
            }}
          >
            Lihat status
          </UiText>
        </PressableScale>

        <ScrollView
          ref={list}
          onContentSizeChange={() =>
            list.current?.scrollToEnd({ animated: true })
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: EDGE, paddingTop: 16, gap: 10 }}
        >
          {messages.map((m) => (
            <Bubble key={m.id} m={m} brandId={order.brandId} />
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ flexGrow: 0 }}
          contentContainerStyle={{
            paddingHorizontal: EDGE,
            paddingBottom: 10,
            gap: 8,
          }}
        >
          {QUICK.map((q) => (
            <PressableScale
              key={q}
              onPress={() => submit(q)}
              scaleTo={0.96}
              style={{
                height: 36,
                paddingHorizontal: 14,
                borderRadius: 18,
                borderWidth: 1.5,
                borderColor: "#C9D6F5",
                backgroundColor: "#FFFFFF",
                justifyContent: "center",
              }}
            >
              <UiText
                color={brand[700]}
                style={{
                  fontSize: 13.5,
                  lineHeight: 17,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                {q}
              </UiText>
            </PressableScale>
          ))}
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 10,
            paddingHorizontal: EDGE,
            paddingTop: 10,
            paddingBottom: Math.max(insets.bottom, 12),
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            ...LIFT,
            shadowOffset: { width: 0, height: -4 },
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Tulis pesan ke outlet"
            placeholderTextColor="#8A93A6"
            multiline
            maxLength={300}
            style={[
              {
                flex: 1,
                minHeight: 46,
                maxHeight: 110,
                borderRadius: 23,
                backgroundColor: "#F2F3F5",
                paddingHorizontal: 16,
                paddingTop: 12,
                paddingBottom: 12,
                fontFamily: fontFamilies.medium,
                fontSize: 15,
                color: LABEL_INK,
              },
              Platform.OS === "web"
                ? ({ outlineStyle: "none" } as object)
                : null,
            ]}
          />
          <PressableScale
            onPress={() => submit(text)}
            disabled={!text.trim()}
            scaleTo={0.9}
            accessibilityLabel="Kirim"
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              backgroundColor: text.trim() ? brand[600] : "#D5DBE7",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Glyph name="send" size={18} color="#FFFFFF" />
          </PressableScale>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
