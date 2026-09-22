import React from "react";
import { View } from "react-native";
import { CircleCheck } from "lucide-react-native";
import { AppText } from "./ui/AppText";
import { PressableScale } from "./ui/PressableScale";
import { brand, ink } from "../theme/colors";

interface OptionRowProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}

/**
 * One line in a picker sheet. The selected row turns into a tinted, outlined
 * card; the rest stay flat so the current choice reads at a glance.
 */
export function OptionRow({ icon, title, description, selected, onPress }: OptionRowProps) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.99}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: selected ? 1.5 : 0,
        borderColor: brand[600],
        backgroundColor: selected ? brand[50] : "transparent",
      }}
    >
      <View style={{ width: 26, alignItems: "center" }}>{icon}</View>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="titleLg" color={selected ? brand[700] : ink[900]}>
          {title}
        </AppText>
        {description ? (
          <AppText variant="caption" color={ink[500]}>
            {description}
          </AppText>
        ) : null}
      </View>
      {selected ? <CircleCheck size={24} color={brand[700]} fill={brand[700]} stroke="#FFFFFF" /> : null}
    </PressableScale>
  );
}
