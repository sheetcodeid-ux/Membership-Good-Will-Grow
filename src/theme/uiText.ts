import { typography, type TextVariant } from "./typography";

/** Weight `@expo/ui` understands, derived from the Urbanist face we ask for. */
const weightOf: Record<string, "400" | "500" | "600" | "700" | "800"> = {
  Urbanist_400Regular: "400",
  Urbanist_500Medium: "500",
  Urbanist_600SemiBold: "600",
  Urbanist_700Bold: "700",
  Urbanist_800ExtraBold: "800",
};

export interface UiTextStyle {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  fontWeight: "400" | "500" | "600" | "700" | "800";
  letterSpacing?: number;
  color?: string;
  textAlign?: "left" | "right" | "center";
}

/**
 * Translates one of our type-scale variants into the `textStyle` shape
 * `@expo/ui`'s Text takes, so native controls keep Urbanist and our sizes
 * rather than falling back to the system font.
 */
export function uiText(variant: TextVariant, color?: string): UiTextStyle {
  const t = typography[variant];
  return {
    fontSize: t.fontSize,
    lineHeight: t.lineHeight,
    fontFamily: t.fontFamily,
    fontWeight: weightOf[t.fontFamily] ?? "400",
    letterSpacing: t.letterSpacing,
    color,
  };
}
