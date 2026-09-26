import React from "react";
import { View, type ViewStyle } from "react-native";
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { Glyph } from "./icons/Glyph";
import { brand } from "../theme/colors";
import { fontFamilies } from "../theme/typography";

export interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  /** Short word beside the label — a count, or "Baru". */
  badge?: string;
  badgeTone?: "brand" | "gold" | "danger";
  onPress?: () => void;
  tone?: string;
  /** Hides the chevron for rows that act rather than navigate. */
  plain?: boolean;
}

// Solid pills with white type, as the reference's "New" badges are.
const badgeColors = {
  brand: { bg: brand[600], fg: "#FFFFFF" },
  gold: { bg: "#B98100", fg: "#FFFFFF" },
  danger: { bg: "#D61F45", fg: "#FFFFFF" },
};

/**
 * One group of account rows.
 *
 * A single card with hairlines between the rows, rather than a card per row.
 * Separate cards gave every row the same weight and turned the screen into a
 * wall of identical tiles; grouping is what lets a section be read as a
 * section and skipped as one.
 *
 * Measured on the reference (dp): 16 corners, a 1dp #E6E6E6 border and no
 * shadow; 48 rows; the icon centred 19 in from the card's inner edge and
 * the label 39.5 in; the hairline runs from the label to 9.5 short of the
 * right edge; a small dark chevron.
 */
const ROW_H = 48;
const ICON_BOX = 21;
const PAD_LEFT = 8.5;
const LABEL_X = 39.5;
export const RULE = "#E6E6E6";
export const LABEL_INK = "#202020";
export const QUIET_INK = "#4C4C4C";
/** The warning ink the profile card uses for a missing email. */
export const WARN_INK = "#A34500";
/** Inset of label-only rows from the card edge. */
const INFO_PAD = 14.5;

export function AccountMenu({ items }: { items: MenuItemProps[] }) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: RULE,
        overflow: "hidden",
      }}
    >
      {items.map((item, i) => (
        <View key={item.label}>
          {i > 0 ? (
            <View
              style={{
                height: 1,
                backgroundColor: RULE,
                marginLeft: LABEL_X,
                marginRight: 9.5,
              }}
            />
          ) : null}
          <PressableScale
            onPress={item.onPress}
            scaleTo={0.995}
            style={{
              height: ROW_H,
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: PAD_LEFT,
              paddingRight: 13,
            }}
          >
            <View style={{ width: ICON_BOX, alignItems: "center" }}>
              {item.icon}
            </View>
            <UiText
              color={item.tone ?? LABEL_INK}
              numberOfLines={1}
              style={{
                marginLeft: LABEL_X - PAD_LEFT - ICON_BOX,
                flexShrink: 1,
                fontSize: 15,
                lineHeight: 19,
                fontFamily: fontFamilies.semibold,
              }}
            >
              {item.label}
            </UiText>
            {item.badge ? (
              <View
                style={{
                  marginLeft: 8,
                  height: 18,
                  minWidth: 18,
                  paddingHorizontal: 6,
                  borderRadius: 9,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: badgeColors[item.badgeTone ?? "brand"].bg,
                }}
              >
                <UiText
                  color={badgeColors[item.badgeTone ?? "brand"].fg}
                  style={{
                    fontSize: 12,
                    lineHeight: 15,
                    fontFamily: fontFamilies.bold,
                  }}
                >
                  {item.badge}
                </UiText>
              </View>
            ) : null}
            <View style={{ flex: 1 }} />
            {item.plain ? null : (
              <Glyph name="chevronRight" size={15} color={QUIET_INK} />
            )}
          </PressableScale>
        </View>
      ))}
    </View>
  );
}

/** Small grey heading above a group, flush with the cards' edge. */
export function AccountSection({
  title,
  first,
}: {
  title: string;
  /** Right under a toolbar or chips, where the full gap would be too much. */
  first?: boolean;
}) {
  return (
    <UiText
      color={QUIET_INK}
      style={{
        marginTop: first ? 6 : 22,
        marginBottom: 9,
        fontSize: 12,
        lineHeight: 16,
        fontFamily: fontFamilies.medium,
      }}
    >
      {title}
    </UiText>
  );
}

/** A white card with the menu's border and corners, for any content. */
export function AccountCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
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

export interface InfoRowProps {
  label: string;
  value?: string;
  /** Shown instead of the value when it is missing. */
  placeholder?: React.ReactNode;
  onPress?: () => void;
  /** Lets a long value such as an address take two lines. */
  multiline?: boolean;
}

/**
 * Label-and-value rows in one card, spaced like the menu rows: 48 tall,
 * the label quiet on the left, the value firm on the right, hairlines
 * between. A row with an action gets the menu's chevron.
 */
export function InfoRows({ rows }: { rows: InfoRowProps[] }) {
  return (
    <AccountCard>
      {rows.map((row, i) => {
        const body = (
          <View
            style={{
              minHeight: ROW_H,
              paddingVertical: row.multiline ? 12 : 0,
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: INFO_PAD,
              paddingRight: row.onPress ? 13 : INFO_PAD,
              gap: 12,
            }}
          >
            <UiText
              color={QUIET_INK}
              style={{
                fontSize: 14,
                lineHeight: 18,
                fontFamily: fontFamilies.medium,
              }}
            >
              {row.label}
            </UiText>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              {row.value ? (
                <UiText
                  color={LABEL_INK}
                  numberOfLines={row.multiline ? 3 : 1}
                  style={{
                    fontSize: 15,
                    lineHeight: 19,
                    fontFamily: fontFamilies.semibold,
                    textAlign: "right",
                  }}
                >
                  {row.value}
                </UiText>
              ) : (
                (row.placeholder ?? (
                  <UiText
                    color="#A0A4AE"
                    style={{
                      fontSize: 14,
                      lineHeight: 18,
                      fontFamily: fontFamilies.medium,
                    }}
                  >
                    Belum diisi
                  </UiText>
                ))
              )}
            </View>
            {row.onPress ? (
              <Glyph name="chevronRight" size={15} color={QUIET_INK} />
            ) : null}
          </View>
        );
        return (
          <View key={row.label}>
            {i > 0 ? (
              <View
                style={{
                  height: 1,
                  backgroundColor: RULE,
                  marginLeft: INFO_PAD,
                  marginRight: 9.5,
                }}
              />
            ) : null}
            {row.onPress ? (
              <PressableScale onPress={row.onPress} scaleTo={0.995}>
                {body}
              </PressableScale>
            ) : (
              body
            )}
          </View>
        );
      })}
    </AccountCard>
  );
}
