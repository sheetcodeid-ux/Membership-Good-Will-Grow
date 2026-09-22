import React from "react";
import { View, useWindowDimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
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

/**
 * Flat navy backspace key with a thin white cross. Every corner is curved,
 * including the left tip, so the key reads as soft rather than spiky.
 */
const BACKSPACE_BODY =
  "M3.7 10.3 L7.3 6.7 Q9 5 11.4 5 L18.5 5 Q22 5 22 8.5 L22 15.5 Q22 19 18.5 19 " +
  "L11.4 19 Q9 19 7.3 17.3 L3.7 13.7 Q2 12 3.7 10.3 Z";

function BackspaceIcon({ size = 46 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={BACKSPACE_BODY} fill={brand[900]} />
      <Path
        d="M18 9 12 15M12 9l6 6"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

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
              <BackspaceIcon size={Math.round(key * 0.52)} />
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
