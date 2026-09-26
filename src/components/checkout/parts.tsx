import React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";
import { UiText } from "../ui/Text";
import { PressableScale } from "../ui/PressableScale";
import { Glyph, type GlyphName } from "../icons/Glyph";
import { LABEL_INK, RULE } from "../AccountMenu";
import { brand } from "../../theme/colors";
import { fontFamilies } from "../../theme/typography";
import { tapSelect } from "../../utils/haptics";

/** Page side margin on the checkout and order status screens. */
export const EDGE = 13.5;

/** White card on the grey page: the checkout's and status page's block. */
export function Block({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: "#FFFFFF",
          borderRadius: 18,
          borderWidth: 1,
          borderColor: RULE,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Bordered pill button, e.g. "Ubah" and "Tambah" beside a block's title. */
export function OutlinePill({
  label,
  onPress,
  icon,
  small,
}: {
  label: string;
  onPress: () => void;
  icon?: GlyphName;
  small?: boolean;
}) {
  const h = small ? 34 : 40;
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.95}
      hitSlop={6}
      style={{
        height: h,
        paddingHorizontal: small ? 14 : 18,
        borderRadius: h / 2,
        borderWidth: 1.5,
        borderColor: brand[600],
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      }}
    >
      {icon ? (
        <Glyph name={icon} size={small ? 12 : 14} color={brand[700]} />
      ) : null}
      <UiText
        color={brand[700]}
        style={{
          fontSize: small ? 13.5 : 15,
          lineHeight: small ? 17 : 19,
          fontFamily: fontFamilies.bold,
        }}
      >
        {label}
      </UiText>
    </PressableScale>
  );
}

/** Full-width primary pill, the sheets' and pages' main action. */
export function PrimaryButton({
  label,
  onPress,
  disabled,
  tone = "primary",
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: "primary" | "danger-soft";
}) {
  const soft = tone === "danger-soft";
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      scaleTo={0.97}
      style={{
        height: 50,
        borderRadius: 25,
        backgroundColor: disabled ? "#E4E7EC" : soft ? "#FDECEE" : brand[600],
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <UiText
        color={disabled ? "#8A93A6" : soft ? "#C8102E" : "#FFFFFF"}
        style={{ fontSize: 16, lineHeight: 20, fontFamily: fontFamilies.bold }}
      >
        {label}
      </UiText>
    </PressableScale>
  );
}

/** Round radio, filled in the brand blue when on. */
export function Radio({ on, disabled }: { on: boolean; disabled?: boolean }) {
  return (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: on ? 7 : 1.5,
        borderColor: on ? brand[600] : disabled ? "#D5D8DE" : "#B9BFCB",
        backgroundColor: disabled ? "#F2F3F5" : "#FFFFFF",
      }}
    />
  );
}

/** Rounded-square checkbox with a tick. */
export function Checkbox({ on }: { on: boolean }) {
  return (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 7,
        borderWidth: on ? 0 : 1.5,
        borderColor: "#6B7488",
        backgroundColor: on ? brand[600] : "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {on ? <Glyph name="check" size={14} color="#FFFFFF" /> : null}
    </View>
  );
}

/** Small label + value row, the building brick of a price summary. */
export function SumRow({
  label,
  value,
  tone = "plain",
  bold,
}: {
  label: React.ReactNode;
  value: string;
  tone?: "plain" | "save";
  bold?: boolean;
}) {
  const color = tone === "save" ? "#0F8A3C" : LABEL_INK;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        gap: 12,
      }}
    >
      <View style={{ flex: 1 }}>
        {typeof label === "string" ? (
          <UiText
            color={tone === "save" ? color : "#4C4C4C"}
            style={{
              fontSize: 15,
              lineHeight: 20,
              fontFamily:
                tone === "save" || bold
                  ? fontFamilies.bold
                  : fontFamilies.medium,
            }}
          >
            {label}
          </UiText>
        ) : (
          label
        )}
      </View>
      <UiText
        color={color}
        style={{
          fontSize: 15,
          lineHeight: 20,
          fontFamily:
            tone === "save" || bold ? fontFamilies.bold : fontFamilies.medium,
        }}
      >
        {value}
      </UiText>
    </View>
  );
}

/**
 * Fork and straw, for "alat makan/sedotan". Drawn with round caps and
 * joins only, like the rest of the set.
 */
export function CutleryIcon({
  size = 22,
  color = "#C8102E",
  crossed,
}: {
  size?: number;
  color?: string;
  crossed?: boolean;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 3v5.5a2.5 2.5 0 0 0 5 0V3M8.5 3v18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.5 21l1.2-12.5h3L21 3.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {crossed ? (
        <Path
          d="M4 20L20 4"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
      ) : null}
    </Svg>
  );
}

/**
 * − qty + in round outlined buttons. A button at its limit dims and stops
 * answering; below `min` the minus still answers when `allowZero` so the
 * caller can ask before removing.
 */
export function Stepper({
  qty,
  onChange,
  min = 0,
  max = 99,
  size = 32,
  filledPlus,
}: {
  qty: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  size?: number;
  /** The plus in solid blue, for the product sheet's main counter. */
  filledPlus?: boolean;
}) {
  const btn = (glyph: "minus" | "plus", next: number, off: boolean) => (
    <PressableScale
      onPress={() => {
        tapSelect();
        onChange(next);
      }}
      disabled={off}
      hitSlop={6}
      scaleTo={0.9}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: off ? "#D5D8DE" : brand[600],
        backgroundColor:
          glyph === "plus" && filledPlus && !off ? brand[600] : "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Glyph
        name={glyph}
        size={Math.round(size * 0.4)}
        color={
          off
            ? "#B0B7C6"
            : glyph === "plus" && filledPlus
              ? "#FFFFFF"
              : brand[700]
        }
      />
    </PressableScale>
  );
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: size * 0.4,
      }}
    >
      {btn("minus", qty - 1, qty <= min)}
      <UiText
        color={LABEL_INK}
        style={{
          minWidth: 16,
          textAlign: "center",
          fontSize: size >= 30 ? 16 : 14.5,
          lineHeight: 20,
          fontFamily: fontFamilies.bold,
        }}
      >
        {qty}
      </UiText>
      {btn("plus", qty + 1, qty >= max)}
    </View>
  );
}
