import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Svg, { Path, Rect } from "react-native-svg";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { PressableScale } from "../components/ui/PressableScale";
import { GiftGlyph } from "../components/AccountIcons";
import { brand, ink, surface } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { fontFamilies } from "../theme/typography";

/** Outlined gift box, the mark the reference uses for the empty list. */
function EmptyGift({ size = 92 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 0.86} viewBox="0 0 24 21">
      <Path
        d="M12 5.6C10.5 2.5 8.7 1.2 7.2 2c-1.5.8-1.2 2.9.6 3.6m4.2 0c1.5-3.1 3.3-4.4 4.8-3.6 1.5.8 1.2 2.9-.6 3.6"
        stroke={ink[300]}
        strokeWidth={1.7}
        strokeLinecap="round"
        fill="none"
      />
      <Rect
        x={3.1}
        y={5.7}
        width={17.8}
        height={14.2}
        rx={1.6}
        stroke={ink[300]}
        strokeWidth={1.7}
        fill="none"
      />
      <Path d="M3.1 11.2h17.8M3.1 15h17.8" stroke={ink[300]} strokeWidth={1.7} />
    </Svg>
  );
}

export default function VouchersScreen() {
  const [code, setCode] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Voucher Saya" />

      <View
        style={{
          margin: 16,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: 16,
          ...(shadow.xs as object),
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 11 }}>
          <GiftGlyph size={22} color={brand[900]} detail="#FFFFFF" />
          <AppText
            color={ink[900]}
            style={{ fontSize: 16.5, lineHeight: 22, fontFamily: "Urbanist_700Bold" }}
          >
            Punya Kode Voucher?
          </AppText>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 14 }}>
          <TextInput
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            placeholder="Masukkan kode voucher"
            placeholderTextColor={ink[300]}
            style={{
              flex: 1,
              height: 50,
              borderRadius: 11,
              borderWidth: 1.4,
              borderColor: ink[200],
              backgroundColor: ink[50],
              paddingHorizontal: 14,
              padding: 0,
              fontFamily: fontFamilies.regular,
              fontSize: 14.5,
              color: ink[900],
            }}
          />
          <PressableScale
            scaleTo={0.97}
            style={{
              height: 50,
              paddingHorizontal: 24,
              borderRadius: 11,
              backgroundColor: brand[950],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppText
              color="#FFFFFF"
              style={{ fontSize: 15, lineHeight: 20, fontFamily: "Urbanist_600SemiBold" }}
            >
              Klaim
            </AppText>
          </PressableScale>
        </View>
      </View>

      <EmptyState
        icon={<EmptyGift />}
        title="Belum ada voucher"
        subtitle="Voucher yang kamu klaim akan muncul di sini"
        style={{ marginTop: -60 }}
      />
    </View>
  );
}
