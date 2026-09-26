import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { UiText } from "../components/ui/Text";
import { Glyph } from "../components/icons/Glyph";
import { LABEL_INK, QUIET_INK } from "../components/AccountMenu";
import { fontFamilies } from "../theme/typography";
import { useOrderRecord } from "../store/ordersStore";

const CHECK = "#12A150";
/** How long the burst plays before the order status takes over. */
const HOLD_MS = 2100;

/**
 * A ring of dots that bursts out from its centre and fades: `rings`
 * concentric circles, dotted with round caps.
 */
function Burst({
  x,
  y,
  size,
  color,
  rings = 1,
  delay,
  dot = 4,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  rings?: number;
  delay: number;
  dot?: number;
}) {
  const scale = useSharedValue(0.2);
  const opacity = useSharedValue(0);
  useEffect(() => {
    scale.value = withDelay(
      delay,
      withTiming(1.15, { duration: 900, easing: Easing.out(Easing.cubic) }),
    );
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 160 }),
        withDelay(420, withTiming(0, { duration: 520 })),
      ),
    );
  }, [delay, opacity, scale]);
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  const r = size / 2 - dot;
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: "absolute", left: x - size / 2, top: y - size / 2 },
        style,
      ]}
    >
      <Svg width={size} height={size}>
        {Array.from({ length: rings }).map((_, i) => {
          const rr = r * (1 - i * 0.28);
          const gap = (2 * Math.PI * rr) / Math.max(10, Math.round(rr / 2.6));
          return (
            <Circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={rr}
              fill="none"
              stroke={color}
              strokeWidth={dot}
              strokeLinecap="round"
              strokeDasharray={`0 ${gap}`}
            />
          );
        })}
      </Svg>
    </Animated.View>
  );
}

/**
 * The moment the order goes through: a green tick springs in while rings
 * of dots burst around it, then Status Pesanan takes over. A tap skips
 * ahead.
 */
export default function OrderSuccessScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrderRecord(id);
  const scale = useSharedValue(0.3);

  const next = () => {
    if (id) router.replace(`/order-status/${id}`);
    else router.replace("/(tabs)");
  };

  useEffect(() => {
    scale.value = withSpring(1, { damping: 9, stiffness: 150 });
    const t = setTimeout(() => {
      if (id) router.replace(`/order-status/${id}`);
      else router.replace("/(tabs)");
    }, HOLD_MS);
    return () => clearTimeout(t);
  }, [id, scale]);

  const tick = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const line =
    order?.status === "belum-bayar"
      ? "Bayar di kasir saat ambil pesanan, ya."
      : "Pembayaran diterima. Pesananmu diteruskan ke outlet.";

  return (
    <Pressable onPress={next} style={{ flex: 1, backgroundColor: "#F6F7FA" }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: 360, height: 420 }}>
          <Burst x={100} y={90} size={96} color="#F5A524" delay={120} />
          <Burst
            x={296}
            y={150}
            size={112}
            color="#E5484D"
            rings={3}
            delay={260}
            dot={3.4}
          />
          <Burst
            x={64}
            y={250}
            size={184}
            color="#3E7BFA"
            delay={40}
            dot={2.6}
          />
          <Burst
            x={250}
            y={296}
            size={30}
            color={CHECK}
            rings={2}
            delay={380}
            dot={2.4}
          />
          <Burst x={180} y={210} size={260} color="#9DB8F7" delay={0} dot={2} />
          <Animated.View
            style={[
              {
                position: "absolute",
                left: 180 - 50,
                top: 210 - 50,
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: CHECK,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: CHECK,
                shadowOpacity: 0.3,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 8 },
              },
              tick,
            ]}
          >
            <Glyph name="check" size={46} color="#FFFFFF" />
          </Animated.View>
        </View>
        <Animated.View
          entering={FadeInDown.delay(380).duration(420)}
          style={{
            alignItems: "center",
            paddingHorizontal: 32,
            marginTop: -40,
          }}
        >
          <UiText
            color={LABEL_INK}
            style={{
              textAlign: "center",
              fontSize: 22,
              lineHeight: 28,
              fontFamily: fontFamilies.extrabold,
            }}
          >
            Pesanan berhasil dibuat
          </UiText>
          <UiText
            color={QUIET_INK}
            style={{
              marginTop: 6,
              textAlign: "center",
              fontSize: 14.5,
              lineHeight: 20,
              fontFamily: fontFamilies.medium,
            }}
          >
            {line}
          </UiText>
        </Animated.View>
      </View>
    </Pressable>
  );
}
