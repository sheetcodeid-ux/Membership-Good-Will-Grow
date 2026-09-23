import { Platform } from "react-native";
import { ink, brand } from "./colors";

/**
 * Cross-platform elevation presets. iOS uses shadow*, Android uses elevation
 * (which ignores color/offset), and the web branch needs its own boxShadow —
 * react-native-web stopped translating the shadow* props, so leaving it empty
 * meant the web build shipped with no elevation anywhere at all.
 */
export const shadow = {
  none: {},
  xs: Platform.select({
    ios: {
      shadowColor: ink[900],
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    android: { elevation: 1 },
    default: { boxShadow: "0 2px 4px rgba(15,23,42,0.06)" },
  }),
  sm: Platform.select({
    ios: {
      shadowColor: ink[900],
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    android: { elevation: 3 },
    default: { boxShadow: "0 3px 8px rgba(15,23,42,0.08)" },
  }),
  md: Platform.select({
    ios: {
      shadowColor: ink[900],
      shadowOpacity: 0.1,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 6 },
    default: { boxShadow: "0 6px 14px rgba(15,23,42,0.10)" },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: ink[900],
      shadowOpacity: 0.14,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
    },
    android: { elevation: 10 },
    default: { boxShadow: "0 12px 24px rgba(15,23,42,0.14)" },
  }),
  /**
   * For glass. Glass has no fill of its own to separate it from what is behind
   * it, so it needs a deeper, darker cast than an opaque card of the same size
   * would — otherwise its top edge dissolves into whatever it is floating over.
   */
  glass: Platform.select({
    ios: {
      shadowColor: "#000000",
      shadowOpacity: 0.22,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
    },
    android: { elevation: 12 },
    default: { boxShadow: "0 8px 18px rgba(0,0,0,0.22)" },
  }),
  brand: Platform.select({
    ios: {
      shadowColor: brand[600],
      shadowOpacity: 0.28,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
    android: { elevation: 8 },
    default: { boxShadow: "0 8px 16px rgba(18,60,163,0.28)" },
  }),
} as const;
