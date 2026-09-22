import React from "react";
import { View } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { PressableScale } from "./PressableScale";
import { AppText } from "./AppText";
import { brand, ink } from "../../theme/colors";

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ value, onChange, min = 0, max = 99 }: QuantityStepperProps) {
  const btn = (disabled: boolean) => ({
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: disabled ? ink[100] : brand[600],
  });

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: ink[50],
        borderRadius: 14,
        padding: 6,
      }}
    >
      <PressableScale
        disabled={value <= min}
        onPress={() => onChange(Math.max(min, value - 1))}
        style={btn(value <= min)}
      >
        <Minus size={15} color={value <= min ? ink[400] : "#FFFFFF"} />
      </PressableScale>
      <AppText variant="titleLg" style={{ minWidth: 20, textAlign: "center" }}>
        {value}
      </AppText>
      <PressableScale
        disabled={value >= max}
        onPress={() => onChange(Math.min(max, value + 1))}
        style={btn(value >= max)}
      >
        <Plus size={15} color={value >= max ? ink[400] : "#FFFFFF"} />
      </PressableScale>
    </View>
  );
}
