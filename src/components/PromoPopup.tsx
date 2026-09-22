import React from "react";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { X } from "lucide-react-native";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";
import { PressableScale } from "./ui/PressableScale";

/** Poster proportions taken from the reference (320 x ~604 on a 360pt screen). */
const POSTER_RATIO = 0.53;

export function PromoPopup({ onClose }: { onClose: () => void }) {
  const { width, height } = useWindowDimensions();

  const cardHeight = Math.min((width - 40) / POSTER_RATIO, height * 0.76);
  const cardWidth = cardHeight * POSTER_RATIO;

  return (
    <Animated.View entering={FadeIn.duration(220)} style={StyleSheet.absoluteFill}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.72)" }]} />
      </Pressable>

      {/* box-none lets taps on the dim area fall through to the backdrop. */}
      <View
        pointerEvents="box-none"
        style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 22 }}
      >
        <Animated.View entering={ZoomIn.duration(260)} pointerEvents="none">
          <ImagePlaceholder
            label="Banner Promo Popup"
            radius={14}
            iconSize={40}
            style={{ width: cardWidth, height: cardHeight }}
          />
        </Animated.View>

        <PressableScale
          onPress={onClose}
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            borderWidth: 1.5,
            borderColor: "rgba(255,255,255,0.9)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={18} color="#FFFFFF" strokeWidth={2.2} />
        </PressableScale>
      </View>
    </Animated.View>
  );
}
