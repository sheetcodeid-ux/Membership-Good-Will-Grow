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

export const typography: Record<TextVariant, VariantStyle> = {
  display: { fontSize: 32, lineHeight: 38, fontFamily: family.extrabold, letterSpacing: -0.4 },
  h1: { fontSize: 26, lineHeight: 32, fontFamily: family.bold, letterSpacing: -0.3 },
  h2: { fontSize: 21, lineHeight: 27, fontFamily: family.bold, letterSpacing: -0.2 },
  h3: { fontSize: 18, lineHeight: 24, fontFamily: family.semibold },
  titleLg: { fontSize: 16.5, lineHeight: 22, fontFamily: family.semibold },
  title: { fontSize: 15, lineHeight: 20, fontFamily: family.semibold },
  body: { fontSize: 14.5, lineHeight: 21, fontFamily: family.regular },
  bodyMedium: { fontSize: 14.5, lineHeight: 21, fontFamily: family.medium },
  bodySemibold: { fontSize: 14.5, lineHeight: 21, fontFamily: family.semibold },
  caption: { fontSize: 12.5, lineHeight: 17, fontFamily: family.regular },
  captionMedium: { fontSize: 12.5, lineHeight: 17, fontFamily: family.medium },
  overline: {
    fontSize: 11.5,
    lineHeight: 14,
    fontFamily: family.semibold,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  micro: { fontSize: 10.5, lineHeight: 13, fontFamily: family.medium },
};

export const fontFamilies = family;
