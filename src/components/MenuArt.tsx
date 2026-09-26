import React, { useState } from "react";
import { Image, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CategoryIcon, type CategoryIconName } from "./CategoryIcons";
import { categories } from "../data/mock";
import type { MenuItem } from "../data/types";

/**
 * A menu item's picture. With a photo (`item.image`) it shows the photo;
 * until one is added it is a quiet grey tile with the item's category
 * mark in the middle, the same mark as the category rail on Daftar Menu:
 * a cup for coffee, a glass for other drinks, a steamer for dimsum, a
 * plate for food, and so on.
 *
 * Fills whatever box it is given; the mark scales with the box.
 */
export function MenuArt({
  item,
  categoryId,
  radius = 14,
  style,
  big,
}: {
  item?: MenuItem;
  categoryId?: string;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  /** The product sheet's hero: a slightly smaller mark for the big box. */
  big?: boolean;
}) {
  const [box, setBox] = useState(0);
  const catId = item?.categoryId ?? categoryId;
  const icon: CategoryIconName =
    categories.find((c) => c.id === catId)?.icon ?? "food";
  const mark = Math.max(18, Math.round(box * (big ? 0.26 : 0.4)));

  return (
    <View
      onLayout={(e) =>
        setBox(
          Math.min(e.nativeEvent.layout.width, e.nativeEvent.layout.height),
        )
      }
      style={[{ borderRadius: radius, overflow: "hidden" }, style]}
    >
      {item?.image ? (
        <Image
          source={{ uri: item.image }}
          resizeMode="cover"
          accessibilityLabel={item.name}
          style={{ flex: 1 }}
        />
      ) : (
        <LinearGradient
          colors={["#F2F3F6", "#E6E8EE"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {box > 0 ? (
            <CategoryIcon name={icon} size={mark} color="#A3AAB7" />
          ) : null}
        </LinearGradient>
      )}
    </View>
  );
}
