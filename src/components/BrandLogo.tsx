import React from "react";
import { Image, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from "react-native";

const sources: Record<string, ImageSourcePropType> = {
  nordu: require("../../assets/brands/nordu-coffee.png"),
  cattu: require("../../assets/brands/cattu-coffee.png"),
  "lesung-pipi": require("../../assets/brands/lesung-pipi.png"),
  "ayam-busari": require("../../assets/brands/ayam-goreng-busari.png"),
};

interface BrandLogoProps {
  brandId?: string;
  /** Side of the square the logo is fitted into. */
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Partner mark, letterboxed inside a square so wordmark logos (Lesung Pipi)
 * and round marks (Nordu) line up on the same baseline in a list.
 */
export function BrandLogo({ brandId, size = 28, style }: BrandLogoProps) {
  const source = brandId ? sources[brandId] : undefined;
  return (
    <View style={[{ width: size, height: size, alignItems: "center", justifyContent: "center" }, style]}>
      {source ? (
        <Image source={source} style={{ width: size, height: size }} resizeMode="contain" />
      ) : null}
    </View>
  );
}
