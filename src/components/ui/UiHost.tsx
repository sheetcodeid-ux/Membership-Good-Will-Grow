import React from "react";
import type { ViewStyle } from "react-native";
import { Host } from "@expo/ui";
import { brand } from "../../theme/colors";

/**
 * Bridge into `@expo/ui`.
 *
 * Everything inside renders through SwiftUI on iOS and Jetpack Compose on
 * Android; on web the library falls back to plain React Native views. `Host`
 * is what carries our theme across that boundary: `seedColor` becomes the
 * SwiftUI tint, the Material 3 palette on Android, and a CSS variable scale on
 * web, so native controls come out navy instead of the platform default blue.
 *
 * Always use this instead of importing `Host` directly, so no screen can
 * forget the seed colour and ship a stock-blue control.
 */
export function UiHost({
  children,
  matchContents = true,
  style,
}: {
  children: React.ReactNode;
  /** Let the host shrink to its content; off for full-bleed islands. */
  matchContents?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Host
      seedColor={brand[900]}
      colorScheme="light"
      matchContents={matchContents}
      style={style}
    >
      {children}
    </Host>
  );
}
