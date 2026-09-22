import React from "react";
import { View } from "react-native";
import { ink } from "../../theme/colors";

export function Divider({ inset = 0 }: { inset?: number }) {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: ink[100],
        marginLeft: inset,
      }}
    />
  );
}
