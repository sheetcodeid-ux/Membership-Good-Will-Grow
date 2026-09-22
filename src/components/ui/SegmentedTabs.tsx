import React from "react";
import { View } from "react-native";
import { PressableScale } from "./PressableScale";
import { AppText } from "./AppText";
import { brand, ink } from "../../theme/colors";

interface SegmentedTabsProps {
  tabs: { key: string; label: string }[];
  value: string;
  onChange: (key: string) => void;
}

/** Underlined tabs, as used on the profile and bookmark screens. */
export function SegmentedTabs({ tabs, value, onChange }: SegmentedTabsProps) {
  return (
    <View style={{ flexDirection: "row" }}>
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <PressableScale
            key={tab.key}
            scaleTo={1}
            onPress={() => onChange(tab.key)}
            style={{ flex: 1, alignItems: "center", paddingVertical: 12, gap: 8 }}
          >
            <AppText
              color={active ? brand[700] : ink[400]}
              style={{
                fontSize: 14.5,
                lineHeight: 20,
                fontFamily: active ? "Urbanist_700Bold" : "Urbanist_500Medium",
              }}
            >
              {tab.label}
            </AppText>
            <View
              style={{
                height: 3,
                borderRadius: 2,
                alignSelf: "stretch",
                marginHorizontal: 18,
                backgroundColor: active ? brand[700] : "transparent",
              }}
            />
          </PressableScale>
        );
      })}
    </View>
  );
}
