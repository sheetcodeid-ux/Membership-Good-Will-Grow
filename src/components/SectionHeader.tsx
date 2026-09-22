import React from "react";
import { View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { PressableScale } from "./ui/PressableScale";
import { AppText } from "./ui/AppText";
import { brand } from "../theme/colors";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel = "Lihat semua", onAction }: SectionHeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 12,
      }}
    >
      <AppText variant="h3">{title}</AppText>
      {onAction ? (
        <PressableScale onPress={onAction} style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <AppText variant="captionMedium" color={brand[600]}>
            {actionLabel}
          </AppText>
          <ChevronRight size={16} color={brand[600]} />
        </PressableScale>
      ) : null}
    </View>
  );
}
