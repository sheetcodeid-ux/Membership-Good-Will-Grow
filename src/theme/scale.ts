/**
 * Design tokens for the rebuilt screens.
 *
 * The original scale was derived by measuring the CW Club reference, which
 * put body copy at 12.5pt. That is too small for a feed people read for
 * minutes at a time — iOS sets body at 17pt and Material at 16dp, and both
 * platforms treat 44pt/48dp as the smallest thing a thumb should have to hit.
 * These tokens follow those two rules instead of the reference.
 *
 * Kept separate from `typography.ts` on purpose: the modules still on the
 * measured scale keep working untouched, and each one moves over as it is
 * rebuilt. One scale would either break those layouts today or hold the
 * rebuild back.
 */
export const type = {
  display: { fontSize: 32, lineHeight: 38, fontFamily: "Urbanist_800ExtraBold", letterSpacing: -0.6 },
  h1: { fontSize: 26, lineHeight: 32, fontFamily: "Urbanist_700Bold", letterSpacing: -0.4 },
  h2: { fontSize: 21, lineHeight: 27, fontFamily: "Urbanist_700Bold", letterSpacing: -0.3 },
  h3: { fontSize: 18, lineHeight: 24, fontFamily: "Urbanist_600SemiBold", letterSpacing: -0.2 },
  titleLg: { fontSize: 16, lineHeight: 22, fontFamily: "Urbanist_600SemiBold" },
  title: { fontSize: 15, lineHeight: 20, fontFamily: "Urbanist_600SemiBold" },
  body: { fontSize: 15, lineHeight: 22, fontFamily: "Urbanist_400Regular" },
  bodyMedium: { fontSize: 15, lineHeight: 22, fontFamily: "Urbanist_500Medium" },
  bodySemibold: { fontSize: 15, lineHeight: 22, fontFamily: "Urbanist_600SemiBold" },
  caption: { fontSize: 13, lineHeight: 18, fontFamily: "Urbanist_400Regular" },
  captionMedium: { fontSize: 13, lineHeight: 18, fontFamily: "Urbanist_500Medium" },
  label: { fontSize: 12, lineHeight: 16, fontFamily: "Urbanist_600SemiBold", letterSpacing: 0.2 },
} as const;

export type TypeToken = keyof typeof type;

/** Eight-point rhythm; every gap and inset comes from here. */
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/** Corner radii, paired to the size of the thing they belong to. */
export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

/**
 * Smallest comfortable hit area. iOS asks for 44pt, Android for 48dp; taking
 * the larger keeps one number for both and errs on the forgiving side.
 */
export const HIT_SIZE = 48;

/** Height of the tab bar itself, sized so each tab clears HIT_SIZE. */
export const TAB_BAR_HEIGHT = 64;
