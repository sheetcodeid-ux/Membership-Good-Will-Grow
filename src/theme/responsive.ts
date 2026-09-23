import { Platform, useWindowDimensions } from "react-native";

/**
 * Layout that adapts to the device rather than assuming one phone.
 *
 * Every measurement in this app was taken off a 360pt-wide reference, so that
 * is the baseline. Narrow phones (320pt) shrink towards it, large phones grow
 * a little, and tablets stop growing and centre the content instead — a feed
 * stretched across 900pt is unreadable, however "responsive" it technically is.
 */
export const BASE_WIDTH = 360;

/** Widest the main column is ever allowed to get. */
export const MAX_CONTENT_WIDTH = 520;

export interface Responsive {
  width: number;
  height: number;
  /** Multiplier against the 360pt reference, clamped so nothing distorts. */
  scale: number;
  /** Scales a reference measurement to this device. */
  s: (value: number) => number;
  /** Phones below 360pt, where padding has to give way first. */
  isCompact: boolean;
  /** 600pt and up: tablets and unfolded foldables. */
  isTablet: boolean;
  /** Width the content column should actually occupy. */
  contentWidth: number;
  /** Side padding, tightened on small screens and widened on large ones. */
  gutter: number;
}

export function useResponsive(): Responsive {
  const { width, height } = useWindowDimensions();

  const isCompact = width < 360;
  const isTablet = width >= 600;

  // Clamped: below 0.92 text stops being legible, above 1.15 the reference
  // proportions start to look inflated rather than larger.
  const raw = width / BASE_WIDTH;
  const scale = Math.min(1.15, Math.max(0.92, raw));

  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH);
  const gutter = isCompact ? 12 : isTablet ? 20 : 16;

  return {
    width,
    height,
    scale,
    s: (value: number) => Math.round(value * scale * 100) / 100,
    isCompact,
    isTablet,
    contentWidth,
    gutter,
  };
}

/**
 * Small platform differences that are not worth a fork at every call site.
 * Android draws denser type and prefers ripples; iOS prefers softer shadows.
 */
export const platform = {
  isIOS: Platform.OS === "ios",
  isAndroid: Platform.OS === "android",
  isWeb: Platform.OS === "web",
  /** Android's ripple replaces the scale feedback we use elsewhere. */
  usesRipple: Platform.OS === "android",
} as const;
