import React from "react";
import { View } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { AppText } from "./AppText";
import { PressableScale } from "./PressableScale";
import { brand, ink } from "../../theme/colors";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: number;
}

/** − value + control. The minus button dims once it is at the minimum. */
export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  size = 28,
}: QuantityStepperProps) {
  const canDecrease = value > min;
  const canIncrease = value < max;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <PressableScale
        onPress={() => canDecrease && onChange(value - 1)}
        hitSlop={8}
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: canDecrease ? brand[200] : ink[100],
        }}
      >
        <Minus size={size * 0.5} color={canDecrease ? brand[800] : ink[300]} strokeWidth={2.6} />
      </PressableScale>
      <AppText
        style={{
          minWidth: 16,
          textAlign: "center",
          fontSize: size * 0.5,
          lineHeight: size * 0.68,
          fontFamily: "Urbanist_600SemiBold",
        }}
      >
        {value}
      </AppText>
      <PressableScale
        onPress={() => canIncrease && onChange(value + 1)}
        hitSlop={8}
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: canIncrease ? brand[900] : ink[200],
        }}
      >
        <Plus size={size * 0.5} color="#FFFFFF" strokeWidth={2.6} />
      </PressableScale>
    </View>
  );
}
