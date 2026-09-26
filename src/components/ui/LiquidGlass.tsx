import React, { useId, useState, type RefObject } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Svg, {
  Defs,
  LinearGradient as SvgGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
  GlassContainer,
  GlassView,
  isLiquidGlassAvailable,
} from "expo-glass-effect";

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
  /** Blur strength for the fallback glass, 1..100. */
  intensity?: number;
  /** Lets the surface flex under a press on iOS 26. */
  interactive?: boolean;
  /**
   * The BlurTargetView holding what the glass sits over. Android blurs
   * nothing without one; iOS and web ignore it.
   */
  blurTarget?: RefObject<View | null>;
  /** Draws the specular rim (fallback only). Defaults on for rounded glass. */
  rim?: boolean;
  style?: ViewStyle | ViewStyle[];
}

/**
 * The edge that makes a pane read as Liquid Glass rather than frosted
 * plastic: a specular rim, brightest where light enters at the top left and
 * again where it exits at the bottom right, fading to almost nothing along
 * the sides; and just inside it a softer band along the top, the lensing
 * of thick glass. Drawn as SVG strokes so the gradient can follow the
 * curve, which a border cannot.
 */
export function GlassRim({
  radius,
  strength = 1,
}: {
  radius: number;
  strength?: number;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={(e) =>
        setSize({
          w: e.nativeEvent.layout.width,
          h: e.nativeEvent.layout.height,
        })
      }
    >
      {size && size.w > 4 && size.h > 4 ? (
        <Svg width={size.w} height={size.h}>
          <Defs>
            <SvgGradient id={`rim${id}`} x1="0" y1="0" x2="1" y2="1">
              <Stop
                offset="0"
                stopColor="#FFFFFF"
                stopOpacity={0.95 * strength}
              />
              <Stop
                offset="0.3"
                stopColor="#FFFFFF"
                stopOpacity={0.18 * strength}
              />
              <Stop
                offset="0.7"
                stopColor="#FFFFFF"
                stopOpacity={0.1 * strength}
              />
              <Stop
                offset="1"
                stopColor="#FFFFFF"
                stopOpacity={0.7 * strength}
              />
            </SvgGradient>
            <SvgGradient id={`lens${id}`} x1="0" y1="0" x2="0" y2="1">
              <Stop
                offset="0"
                stopColor="#FFFFFF"
                stopOpacity={0.55 * strength}
              />
              <Stop offset="0.45" stopColor="#FFFFFF" stopOpacity={0} />
              <Stop
                offset="1"
                stopColor="#FFFFFF"
                stopOpacity={0.12 * strength}
              />
            </SvgGradient>
          </Defs>
          <Rect
            x={0.7}
            y={0.7}
            width={size.w - 1.4}
            height={size.h - 1.4}
            rx={Math.max(0, radius - 0.7)}
            fill="none"
            stroke={`url(#rim${id})`}
            strokeWidth={1.4}
          />
          <Rect
            x={2.4}
            y={2.4}
            width={size.w - 4.8}
            height={size.h - 4.8}
            rx={Math.max(0, radius - 2.4)}
            fill="none"
            stroke={`url(#lens${id})`}
            strokeWidth={2}
          />
        </Svg>
      ) : null}
    </View>
  );
}

export function LiquidGlass({
  children,
  radius,
  tint = "rgba(155,185,255,0.12)",
  opacity = 1,
  interactive = false,
  intensity = 90,
  blurTarget,
  rim = radius > 0,
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
          // A faint dark hairline outside the rim, so the pane keeps an
          // edge over white content where the rim itself would vanish.
          borderWidth: rim ? StyleSheet.hairlineWidth : 1,
          borderColor: rim ? "rgba(20,32,64,0.10)" : "rgba(255,255,255,0.45)",
        },
        style,
      ]}
    >
      {/* Blur hard, wash light. The blur is what makes it glass; the wash is
          only there to keep contrast, and past about a third it stops being a
          window and turns into frosted plastic. */}
      <BlurView
        intensity={intensity}
        tint="light"
        // Android blurs nothing unless asked: blurMethod defaults to "none",
        // so BlurView is only a translucent tint there. With the wash this
        // light, leaving it off would show the feed through the bar in sharp
        // focus instead of behind glass.
        blurMethod="dimezisBlurView"
        blurTarget={blurTarget}
        blurReductionFactor={4}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: `rgba(255,255,255,${0.24 * opacity})` },
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

      {rim ? (
        <GlassRim radius={radius} />
      ) : (
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
      )}

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
    <GlassContainer
      spacing={spacing}
      style={style}
      pointerEvents={pointerEvents}
    >
      {children}
    </GlassContainer>
  );
}
