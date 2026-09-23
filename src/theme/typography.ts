import { type as scale } from "./scale";

export type TextVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "titleLg"
  | "title"
  | "body"
  | "bodyMedium"
  | "bodySemibold"
  | "caption"
  | "captionMedium"
  | "overline"
  | "micro";

interface VariantStyle {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  letterSpacing?: number;
  textTransform?: "none" | "uppercase";
}

const family = {
  regular: "Urbanist_400Regular",
  medium: "Urbanist_500Medium",
  semibold: "Urbanist_600SemiBold",
  bold: "Urbanist_700Bold",
  extrabold: "Urbanist_800ExtraBold",
};

/**
 * The app's type scale.
 *
 * There used to be two of these — this one and `type` in scale.ts — sharing
 * the same token names but different sizes, so whether a screen's body text
 * came out at 12.5pt or 15pt depended on which Text component it happened to
 * import. Every size now comes from scale.ts; only `overline` and `micro`,
 * which the newer scale has no equivalent for, are defined here.
 */
export const typography: Record<TextVariant, VariantStyle> = {
  display: scale.display,
  h1: scale.h1,
  h2: scale.h2,
  h3: scale.h3,
  titleLg: scale.titleLg,
  title: scale.title,
  body: scale.body,
  bodyMedium: scale.bodyMedium,
  bodySemibold: scale.bodySemibold,
  caption: scale.caption,
  captionMedium: scale.captionMedium,
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: family.semibold,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  micro: { fontSize: 10.5, lineHeight: 13, fontFamily: family.medium },
};

export const fontFamilies = family;
