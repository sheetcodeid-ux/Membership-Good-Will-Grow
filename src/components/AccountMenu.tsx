import React from "react";
import { View } from "react-native";
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { AppIcon } from "./ui/AppIcon";
import { brand, ink } from "../theme/colors";
import { shadow } from "../theme/shadows";
import { HIT_SIZE, radius, space } from "../theme/scale";

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

const badgeColors = {
  brand: { bg: "#DDE7FF", fg: brand[700] },
  gold: { bg: "#F6E4BE", fg: "#8A6318" },
  danger: { bg: "#FDE8ED", fg: "#C21A40" },
};

/**
 * One group of account rows.
 *
 * A single card with hairlines between the rows, rather than a card per row.
 * Separate cards gave every row the same weight and turned the screen into a
 * wall of identical tiles; grouping is what lets a section be read as a
 * section and skipped as one.
 */
export function AccountMenu({ items }: { items: MenuItemProps[] }) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: radius.lg,
        overflow: "hidden",
        ...(shadow.xs as object),
      }}
    >
      {items.map((item, i) => (
        <View key={item.label}>
          {i > 0 ? (
            // Inset from the label, not the card, so the rule reads as a
            // divider between rows rather than a border around each.
            <View style={{ height: 1, backgroundColor: ink[100], marginLeft: 56 }} />
          ) : null}
          <PressableScale
            onPress={item.onPress}
            scaleTo={0.995}
            style={{
              minHeight: HIT_SIZE + 6,
              flexDirection: "row",
              alignItems: "center",
              gap: space.md,
              paddingHorizontal: space.lg,
              paddingVertical: space.md,
            }}
          >
            <View style={{ width: 28, alignItems: "center" }}>{item.icon}</View>
            <UiText
              token="body"
              color={item.tone ?? ink[800]}
              numberOfLines={1}
              style={{ flexShrink: 1 }}
            >
              {item.label}
            </UiText>
            {item.badge ? (
              <View
                style={{
                  paddingHorizontal: space.sm,
                  paddingVertical: 2,
                  borderRadius: radius.pill,
                  backgroundColor: badgeColors[item.badgeTone ?? "brand"].bg,
                }}
              >
                <UiText token="label" color={badgeColors[item.badgeTone ?? "brand"].fg}>
                  {item.badge}
                </UiText>
              </View>
            ) : null}
            <View style={{ flex: 1 }} />
            {item.plain ? null : (
              <AppIcon name="chevronRight" size={17} color={ink[300]} />
            )}
          </PressableScale>
        </View>
      ))}
    </View>
  );
}

/** Small grey heading above a group. */
export function AccountSection({ title }: { title: string }) {
  return (
    <UiText
      token="captionMedium"
      color={ink[500]}
      style={{ marginTop: space.xxl, marginBottom: space.sm, paddingHorizontal: space.xs }}
    >
      {title}
    </UiText>
  );
}
