import type { ImageSourcePropType } from "react-native";

export interface PromoBanner {
  id: string;
  /** Read out by screen readers and used as the list key. */
  label: string;
  source: ImageSourcePropType;
}

/**
 * Promo artwork supplied by the brand, exported at 1080x720 (3:2).
 *
 * The carousel lays every slide out at the same 3:2 box, so anything added
 * here has to be cropped to that ratio before it lands in the repo — a
 * different ratio would letterbox against the placeholder underneath.
 */
export const promoBanners: PromoBanner[] = [
  {
    id: "dimsum",
    label: "Homemade Dimsum",
    source: require("../../assets/banners/dimsum.jpg"),
  },
  {
    id: "barista",
    label: "Barista Picks",
    source: require("../../assets/banners/barista.jpg"),
  },
  {
    id: "ube",
    label: "Ube Series",
    source: require("../../assets/banners/ube.jpg"),
  },
];
