import React from "react";
import { ScrollView, View, type ViewStyle } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { ink } from "../../theme/colors";

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  background?: string;
  edges?: Edge[];
  contentStyle?: ViewStyle;
  stickyHeader?: React.ReactNode;
}

export function Screen({
  children,
  scroll = false,
  background = "#FFFFFF",
  edges = ["top"],
  contentStyle,
  stickyHeader,
}: ScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }} edges={edges}>
      {stickyHeader}
      {scroll ? (
        <ScrollView
          contentContainerStyle={[{ paddingBottom: 32 }, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export const screenBg = ink[50];
