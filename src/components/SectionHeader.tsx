import React from "react";
import { View } from "react-native";
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { AppIcon } from "./ui/AppIcon";
import { brand, ink } from "../theme/colors";
import { space } from "../theme/scale";

/**
 * Label above a block of content, with an optional way into the full list.
 *
 * Sections need naming: an unlabelled carousel followed by an unlabelled list
 * makes the reader work out what each one is. The action sits on the same
 * line because that is where the eye already is once it has read the title.
 */
export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: space.md,
        marginBottom: space.md,
      }}
    >
      <View style={{ flex: 1 }}>
        <UiText token="h3">{title}</UiText>
        {subtitle ? (
          <UiText token="caption" color={ink[400]}>
            {subtitle}
          </UiText>
        ) : null}
      </View>

      {actionLabel ? (
        <PressableScale
          onPress={onAction}
          hitSlop={10}
          rippleBorderless
          style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
        >
          <UiText token="captionMedium" color={brand[700]}>
            {actionLabel}
          </UiText>
          <AppIcon name="chevronRight" size={15} color={brand[700]} />
        </PressableScale>
      ) : null}
    </View>
  );
}
