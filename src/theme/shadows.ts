import { Platform } from "react-native";
import { ink, brand } from "./colors";

/**
 * Cross-platform elevation presets. iOS uses shadow*, Android uses elevation
 * (which ignores color/offset), so each level is tuned to look equivalent.
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
    default: {},
  }),
  sm: Platform.select({
    ios: {
      shadowColor: ink[900],
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    android: { elevation: 3 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: ink[900],
      shadowOpacity: 0.1,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 6 },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: ink[900],
      shadowOpacity: 0.14,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
    },
    android: { elevation: 10 },
    default: {},
  }),
  brand: Platform.select({
    ios: {
      shadowColor: brand[600],
      shadowOpacity: 0.28,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
    android: { elevation: 8 },
    default: {},
  }),
} as const;
