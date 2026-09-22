import React from "react";
import { PressableScale } from "./PressableScale";
import { AppText } from "./AppText";
import { brand, ink } from "../../theme/colors";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
}

export function Chip({ label, selected, onPress, icon }: ChipProps) {
  return (
    <PressableScale
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: selected ? brand[600] : "#FFFFFF",
        borderWidth: 1,
        borderColor: selected ? brand[600] : ink[200],
      }}
    >
      {icon}
      <AppText variant="bodyMedium" color={selected ? "#FFFFFF" : ink[600]}>
        {label}
      </AppText>
    </PressableScale>
  );
}

export function IconChip({
  active,
  onPress,
  label,
  icon,
}: {
  active?: boolean;
  onPress?: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <PressableScale
      onPress={onPress}
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 18,
        backgroundColor: active ? brand[50] : "#FFFFFF",
        borderWidth: 1,
        borderColor: active ? brand[200] : ink[100],
        minWidth: 84,
      }}
    >
      {icon}
      <AppText variant="captionMedium" color={active ? brand[700] : ink[600]} center>
        {label}
      </AppText>
    </PressableScale>
  );
}
