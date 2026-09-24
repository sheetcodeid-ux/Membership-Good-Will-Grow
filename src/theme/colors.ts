export const brand = {
  50: "#EBF1FF",
  100: "#D2E0FF",
  200: "#B7CDFF",
  300: "#9BB9FF",
  400: "#6D8FE0",
  500: "#4066C2",
  600: "#123CA3",
  700: "#0E348B",
  800: "#0D2F7E",
  900: "#0B2B73",
  950: "#081E50",
} as const;

export const ink = {
  50: "#F5F7FA",
  100: "#E9ECF2",
  200: "#D6DAE4",
  300: "#B0B7C6",
  400: "#8A93A6",
  500: "#6B7488",
  600: "#4E5568",
  700: "#333C55",
  800: "#1D2338",
  900: "#12172A",
  950: "#0A0E1A",
} as const;

/**
 * The gold the reference uses.
 *
 * Sampling its strip in both directions returns #FFDD00 and nothing else —
 * flat, top to bottom and end to end. The ramp here is deliberately almost
 * no ramp: enough to catch the light along the upper edge, not enough to
 * read as a gradient. The palette's own scale topped out at #EAC584, which
 * is why anything built from it came out beige however it was arranged.
 */
export const goldRamp = ["#FFE64A", "#FFDD00", "#FBD900"] as const;

export const gold = {
  50: "#FBF3E3",
  100: "#F6E4BE",
  300: "#EAC584",
  500: "#D9A441",
  600: "#B9852A",
  700: "#946A20",
} as const;

export const success = { 50: "#E8F8EE", 500: "#16A34A", 600: "#0F8A3C" } as const;
export const warning = { 50: "#FFF4E0", 500: "#F59E0B", 600: "#D6860A" } as const;
export const danger = { 50: "#FDE8ED", 500: "#E11D48", 600: "#C21A40" } as const;

/** App background: a whisper of the brand navy over white. */
export const surface = "#F3F4F9";

export const colors = {
  brand,
  ink,
  gold,
  success,
  warning,
  danger,
  surface,
  white: "#FFFFFF",
  black: "#000000",
};

export type ColorScale = typeof brand;
