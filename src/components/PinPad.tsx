import React from "react";
import { View } from "react-native";
import { Delete } from "lucide-react-native";
import { PressableScale } from "./ui/PressableScale";
import { AppText } from "./ui/AppText";
import { brand, ink } from "../theme/colors";

interface PinPadProps {
  length?: number;
  value: string;
  onChange: (next: string) => void;
  error?: boolean;
}

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

export function PinDots({ length = 6, value, error }: { length?: number; value: string; error?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 14 }}>
      {Array.from({ length }).map((_, i) => {
        const filled = i < value.length;
        return (
          <View
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: error ? "#E11D48" : filled ? brand[600] : ink[200],
            }}
          />
        );
      })}
    </View>
  );
}

export function PinKeypad({ length = 6, value, onChange }: PinPadProps) {
  const press = (k: string) => {
    if (k === "") return;
    if (k === "del") {
      onChange(value.slice(0, -1));
      return;
    }
    if (value.length < length) onChange(value + k);
  };

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 18 }}>
      {keys.map((k, i) => (
        <PressableScale
          key={`${k}-${i}`}
          disabled={k === ""}
          onPress={() => press(k)}
          style={{
            width: 78,
            height: 62,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: k === "" ? "transparent" : ink[50],
          }}
        >
          {k === "del" ? (
            <Delete size={22} color={ink[700]} />
          ) : (
            <AppText variant="h3" color={ink[900]}>
              {k}
            </AppText>
          )}
        </PressableScale>
      ))}
    </View>
  );
}
