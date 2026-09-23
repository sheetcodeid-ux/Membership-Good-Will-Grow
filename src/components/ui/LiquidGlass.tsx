import React from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { GlassContainer, GlassView, isLiquidGlassAvailable } from "expo-glass-effect";

/**
 * Liquid Glass surface.
 *
 * On iOS 26 this is the real thing: `GlassView` renders Apple's Liquid Glass,
 * which refracts and specular-highlights whatever scrolls underneath, and
 * `isInteractive` makes it flex under a press. Everywhere else — Android, web,
 * and older iOS — `GlassView` degrades to a plain `View` with no effect at
 * all, so we draw the look ourselves: a blur, a diagonal sheen, a tint pooling
 * at the bottom edge, and a rim light along the top.
 *
 * `radius` has to be passed rather than read off `style`, because the rim
 * light and the sheen are separate layers that each need to be clipped to the
 * same curve.
 */
export const liquidGlassAvailable = isLiquidGlassAvailable();

interface LiquidGlassProps {
  children?: React.ReactNode;
  /** Corner radius; every layer is clipped to it. */
  radius: number;
  /** Brand colour pooled into the glass. Keep it low-alpha. */
  tint?: string;
  /**
   * How much the surface frosts over, 0..1. The default lets what is behind
   * read through clearly; push it up only where something has to stay legible
   * over arbitrary content.
   */
  opacity?: number;
  /** Lets the surface flex under a press on iOS 26. */
  interactive?: boolean;
  style?: ViewStyle | ViewStyle[];
}

export function LiquidGlass({
  children,
  radius,
  tint = "rgba(155,185,255,0.12)",
  opacity = 1,
  interactive = false,
  style,
}: LiquidGlassProps) {
  if (liquidGlassAvailable) {
    return (
      <GlassView
        glassEffectStyle="regular"
        tintColor={tint}
        isInteractive={interactive}
        colorScheme="light"
        style={[{ borderRadius: radius, overflow: "hidden" }, style]}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <View
      style={[
        {
          borderRadius: radius,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.45)",
        },
        style,
      ]}
    >
      {/* Blur hard, wash light. The blur is what makes it glass; the wash is
          only there to keep contrast, and past about a third it stops being a
          window and turns into frosted plastic. */}
      <BlurView
        intensity={58}
        tint="light"
        // Android blurs nothing unless asked: blurMethod defaults to "none",
        // so BlurView is only a translucent tint there. With the wash this
        // light, leaving it off would show the feed through the bar in sharp
        // focus instead of behind glass.
        blurMethod="dimezisBlurView"
        blurReductionFactor={4}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: `rgba(255,255,255,${0.26 * opacity})` },
        ]}
      />

      {/* Diagonal sheen: bright at the top-left, almost gone by the bottom-right. */}
      <LinearGradient
        colors={[
          `rgba(255,255,255,${0.42 * opacity})`,
          `rgba(255,255,255,${0.16 * opacity})`,
          `rgba(255,255,255,${0.04 * opacity})`,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Brand tint pooling towards the bottom, the way thick glass carries colour. */}
      <LinearGradient
        colors={["transparent", tint]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Rim light along the top edge. */}
      <View
        style={{
          position: "absolute",
          left: radius * 0.5,
          right: radius * 0.5,
          top: 0,
          height: 1,
          backgroundColor: "rgba(255,255,255,0.75)",
        }}
      />

      {children}
    </View>
  );
}

/**
 * Wraps sibling glass surfaces so iOS 26 lets them merge as they approach each
 * other — the tab bar and its floating button read as one piece of glass that
 * splits, rather than two panes. A plain view everywhere else.
 */
export function LiquidGlassGroup({
  children,
  spacing = 20,
  style,
  pointerEvents,
}: {
  children: React.ReactNode;
  spacing?: number;
  style?: ViewStyle;
  pointerEvents?: "auto" | "none" | "box-none" | "box-only";
}) {
  if (!liquidGlassAvailable) {
    return (
      <View style={style} pointerEvents={pointerEvents}>
        {children}
      </View>
    );
  }
  return (
    <GlassContainer spacing={spacing} style={style} pointerEvents={pointerEvents}>
      {children}
    </GlassContainer>
  );
}
