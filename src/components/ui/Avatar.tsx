import React from "react";
import { Image, View } from "react-native";
import { AppText } from "./AppText";
import { brand } from "../../theme/colors";

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  /** Initials size in points; defaults to 38% of the circle. */
  initialsSize?: number;
}

const palette = [brand[600], brand[400], "#B9852A", "#0F8A3C", "#C21A40"];

function colorFor(name: string) {
  const idx = name.charCodeAt(0) % palette.length;
  return palette[idx];
}

export function Avatar({
  uri,
  name = "?",
  size = 44,
  initialsSize,
}: AvatarProps) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colorFor(name),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AppText
        variant="bodySemibold"
        color="#FFFFFF"
        style={{ fontSize: initialsSize ?? size * 0.38 }}
      >
        {initials}
      </AppText>
    </View>
  );
}
