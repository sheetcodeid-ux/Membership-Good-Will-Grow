import React from "react";
import { View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PressableScale } from "./PressableScale";
import { AppText } from "./AppText";
import { brand } from "../../theme/colors";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
}

/** White bar with rounded bottom corners, used on every inner screen. */
export function AppHeader({ title, showBack = true, onBack, right }: AppHeaderProps) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
      }}
    >
      <SafeAreaView edges={["top"]}>
        <View
          style={{
            height: 56,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            paddingHorizontal: 20,
          }}
        >
          {showBack ? (
            <PressableScale onPress={onBack ?? (() => router.back())} hitSlop={12}>
              <ChevronLeft size={26} color={brand[700]} strokeWidth={2} />
            </PressableScale>
          ) : null}
          {title ? (
            <AppText variant="titleLg" color={brand[700]} numberOfLines={1} style={{ flex: 1 }}>
              {title}
            </AppText>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          {right}
        </View>
      </SafeAreaView>
    </View>
  );
}
