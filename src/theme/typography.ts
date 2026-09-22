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
  display: { fontSize: 27, lineHeight: 33, fontFamily: family.extrabold, letterSpacing: -0.4 },
  h1: { fontSize: 22, lineHeight: 28, fontFamily: family.bold, letterSpacing: -0.3 },
  h2: { fontSize: 18, lineHeight: 24, fontFamily: family.bold, letterSpacing: -0.2 },
  h3: { fontSize: 15, lineHeight: 21, fontFamily: family.semibold },
  titleLg: { fontSize: 14, lineHeight: 19, fontFamily: family.semibold },
  title: { fontSize: 13, lineHeight: 18, fontFamily: family.semibold },
  body: { fontSize: 12.5, lineHeight: 18, fontFamily: family.regular },
  bodyMedium: { fontSize: 12.5, lineHeight: 18, fontFamily: family.medium },
  bodySemibold: { fontSize: 12.5, lineHeight: 18, fontFamily: family.semibold },
  caption: { fontSize: 11, lineHeight: 15, fontFamily: family.regular },
  captionMedium: { fontSize: 11, lineHeight: 15, fontFamily: family.medium },
  overline: {
    fontSize: 10,
    lineHeight: 13,
    fontFamily: family.semibold,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  micro: { fontSize: 9.5, lineHeight: 12, fontFamily: family.medium },
};

export const fontFamilies = family;
