import React from "react";
import { View, type ViewStyle } from "react-native";
import { ImageIcon } from "lucide-react-native";
import { AppText } from "./AppText";
import { ink } from "../../theme/colors";

interface ImagePlaceholderProps {
  /** Short note about what asset goes here, e.g. "Logo" or "Foto Hero". */
  label?: string;
  radius?: number;
  iconSize?: number;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Stand-in block for artwork the client has not supplied yet. Kept visually
 * obvious (grey + dashed outline) so unfinished slots are easy to spot and
 * swap for a real <Image> later.
 */
export function ImagePlaceholder({
  label,
  radius = 20,
  iconSize = 28,
  style,
}: ImagePlaceholderProps) {
  return (
    <View
      style={[
        {
          backgroundColor: ink[200],
          borderRadius: radius,
          borderWidth: 1.5,
          borderColor: ink[300],
          borderStyle: "dashed",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <ImageIcon size={iconSize} color={ink[400]} strokeWidth={1.6} />
      {label ? (
        <AppText variant="captionMedium" color={ink[500]} center>
          {label}
        </AppText>
      ) : null}
    </View>
  );
}
