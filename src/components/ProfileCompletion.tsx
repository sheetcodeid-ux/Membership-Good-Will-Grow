import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { Glyph } from "./icons/Glyph";
import { AccountCard, LABEL_INK, QUIET_INK } from "./AccountMenu";
import { brand, success } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { tapPress } from "../utils/haptics";

/**
 * How complete the profile is, as a gold bar that fills on arrival, with
 * what is still missing named and one button to go and fill it in. Once
 * everything is there it turns into a quiet green "complete".
 */
export function ProfileCompletion({
  percent,
  missing,
  onComplete,
}: {
  percent: number;
  missing: string[];
  onComplete: () => void;
}) {
  const fill = useSharedValue(0);
  useEffect(() => {
    fill.value = withTiming(percent, { duration: 800 });
  }, [percent, fill]);
  const barStyle = useAnimatedStyle(() => ({ width: `${fill.value}%` }));

  if (missing.length === 0) {
    return (
      <AccountCard
        style={{
          padding: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Glyph name="checkCircle" size={20} color={success[600]} />
        <UiText
          color={LABEL_INK}
          style={{
            fontSize: 15,
            lineHeight: 19,
            fontFamily: fontFamilies.bold,
          }}
        >
          Profil kamu sudah lengkap
        </UiText>
      </AccountCard>
    );
  }

  const next = missing.slice(0, 3).join(", ");
  const more = missing.length > 3 ? ` dan ${missing.length - 3} lainnya` : "";

  return (
    <AccountCard style={{ padding: 14 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <UiText
          color={LABEL_INK}
          style={{
            flex: 1,
            fontSize: 15,
            lineHeight: 19,
            fontFamily: fontFamilies.bold,
          }}
        >
          Profil {percent}% lengkap
        </UiText>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: "#FFF3C4",
            borderRadius: 10,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}
        >
          <Glyph name="gift" size={12} color="#702B00" />
          <UiText
            color="#702B00"
            style={{
              fontSize: 12,
              lineHeight: 16,
              fontFamily: fontFamilies.bold,
            }}
          >
            Ada reward
          </UiText>
        </View>
      </View>

      <View
        style={{
          marginTop: 10,
          height: 8,
          borderRadius: 4,
          backgroundColor: "#F2F3F5",
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={[{ height: 8, borderRadius: 4, overflow: "hidden" }, barStyle]}
        >
          <LinearGradient
            colors={["#FFE14D", "#FFC400"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
          gap: 12,
        }}
      >
        <UiText
          color={QUIET_INK}
          style={{
            flex: 1,
            fontSize: 12.5,
            lineHeight: 17,
            fontFamily: fontFamilies.medium,
          }}
        >
          Tinggal isi {next}
          {more}.
        </UiText>
        <PressableScale
          onPress={() => {
            tapPress();
            onComplete();
          }}
          scaleTo={0.96}
          style={{
            height: 34,
            paddingHorizontal: 14,
            borderRadius: 17,
            backgroundColor: brand[600],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UiText
            color="#FFFFFF"
            style={{
              fontSize: 13.5,
              lineHeight: 17,
              fontFamily: fontFamilies.bold,
            }}
          >
            Lengkapi
          </UiText>
        </PressableScale>
      </View>
    </AccountCard>
  );
}
