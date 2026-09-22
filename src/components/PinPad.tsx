import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Delete } from "lucide-react-native";
import { PressableScale } from "./ui/PressableScale";
import { AppText } from "./ui/AppText";
import { brand, ink, danger } from "../theme/colors";
import { shadow } from "../theme/shadows";

const GAP = 18;
const MAX_KEY = 96;
/** The keypad spans ~80% of the screen width, as in the reference. */
const GRID_RATIO = 0.8;

interface PinKeypadProps {
  length?: number;
  value: string;
  onChange: (next: string) => void;
}

export function PinDots({
  length = 6,
  value,
  error,
}: {
  length?: number;
  value: string;
  error?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 14 }}>
      {Array.from({ length }).map((_, i) => (
        <View
          key={i}
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: error ? danger[500] : i < value.length ? brand[900] : ink[300],
          }}
        />
      ))}
    </View>
  );
}

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

export function PinKeypad({ length = 6, value, onChange }: PinKeypadProps) {
  const { width } = useWindowDimensions();
  const key = Math.min(MAX_KEY, (Math.min(width, 520) * GRID_RATIO - GAP * 2) / 3);

  const press = (k: string) => {
    if (k === "") return;
    if (k === "del") {
      onChange(value.slice(0, -1));
      return;
    }
    if (value.length < length) onChange(value + k);
  };

  return (
    <View
      style={{
        width: key * 3 + GAP * 2,
        alignSelf: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: GAP,
      }}
    >
      {keys.map((k, i) => {
        if (k === "") {
          return <View key={`spacer-${i}`} style={{ width: key, height: key }} />;
        }

        if (k === "del") {
          return (
            <PressableScale
              key="del"
              onPress={() => press(k)}
              style={{ width: key, height: key, alignItems: "center", justifyContent: "center" }}
            >
              {/* Filled backspace key: navy body, white outline and cross. */}
              <Delete size={46} color="#FFFFFF" fill={brand[900]} strokeWidth={2} />
            </PressableScale>
          );
        }

        return (
          <PressableScale
            key={k}
            onPress={() => press(k)}
            style={{
              width: key,
              height: key,
              borderRadius: 22,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              ...(shadow.sm as object),
            }}
          >
            <AppText
              color={ink[950]}
              style={{
                fontSize: Math.round(key * 0.36),
                lineHeight: Math.round(key * 0.46),
                fontFamily: "Urbanist_600SemiBold",
              }}
            >
              {k}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}
