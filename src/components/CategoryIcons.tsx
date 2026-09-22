import React from "react";
import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";

export type CategoryIconName =
  | "coffee"
  | "non-coffee"
  | "dimsum"
  | "snack"
  | "food"
  | "merch"
  | "promo"
  | "cake";

interface Props {
  name: CategoryIconName;
  size?: number;
  /** Main fill. The secondary shape is drawn at 55% opacity of this. */
  color?: string;
}

/**
 * Solid, two-tone category marks drawn by hand so the sidebar reads as
 * illustrations rather than line icons, and so one colour drives both the
 * active (white on navy) and inactive (navy on white) states.
 */
export function CategoryIcon({ name, size = 26, color = "#0B2B73" }: Props) {
  const soft = { fill: color, opacity: 0.45 };
  const solid = { fill: color };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === "coffee" ? (
        <>
          <Path d="M7.4 2.2v2.2M12 1.6v2.8M16.6 2.2v2.2" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
          <Path
            d="M3.6 7.4h13.2v6.1a5 5 0 0 1-5 5H8.6a5 5 0 0 1-5-5V7.4Z"
            {...solid}
          />
          <Path
            d="M17.6 8.6h1.5a2.9 2.9 0 0 1 0 5.8h-1.5v-1.9h1.5a1 1 0 0 0 0-2h-1.5V8.6Z"
            {...solid}
          />
          <Rect x={2.6} y={20} width={15.2} height={2} rx={1} {...soft} />
        </>
      ) : null}

      {name === "non-coffee" ? (
        <>
          <Path d="M3.8 3.2h16.4l-7 8.3v7.1h-2.4v-7.1L3.8 3.2Z" {...solid} />
          <Path d="M6.2 5.4h11.6l-2.2 2.6H8.4L6.2 5.4Z" {...soft} />
          <Rect x={7} y={19.8} width={10} height={2.2} rx={1.1} {...solid} />
        </>
      ) : null}

      {name === "dimsum" ? (
        <>
          <Ellipse cx={12} cy={7.4} rx={8.2} ry={3.2} {...soft} />
          <Path d="M3.8 7.4v4.2c0 1.8 3.7 3.2 8.2 3.2s8.2-1.4 8.2-3.2V7.4c0 1.8-3.7 3.2-8.2 3.2S3.8 9.2 3.8 7.4Z" {...solid} />
          <Path d="M3.8 13.2v3.4c0 1.8 3.7 3.2 8.2 3.2s8.2-1.4 8.2-3.2v-3.4c0 1.8-3.7 3.2-8.2 3.2s-8.2-1.4-8.2-3.2Z" {...solid} />
        </>
      ) : null}

      {name === "snack" ? (
        <>
          <Path
            d="M12 2.6a9.4 9.4 0 1 0 0 18.8 9.4 9.4 0 0 0 0-18.8Zm0 6.4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"
            {...solid}
          />
          <Circle cx={8.1} cy={7.6} r={1.05} fill="#FFFFFF" opacity={0.85} />
          <Circle cx={16.2} cy={9.2} r={1.05} fill="#FFFFFF" opacity={0.85} />
          <Circle cx={7.3} cy={15.4} r={1.05} fill="#FFFFFF" opacity={0.85} />
          <Circle cx={15.6} cy={16.2} r={1.05} fill="#FFFFFF" opacity={0.85} />
        </>
      ) : null}

      {name === "food" ? (
        <>
          <Path
            d="M12 2.4c2 0 3.7 1.2 4.4 2.9 2.5-.3 4.6 1.7 4.6 4.1 0 1.9-1.3 3.5-3.1 4v2.2H6.1v-2.2C4.3 12.9 3 11.3 3 9.4c0-2.4 2.1-4.4 4.6-4.1C8.3 3.6 10 2.4 12 2.4Z"
            {...solid}
          />
          <Rect x={6.1} y={17} width={11.8} height={4.6} rx={1.6} {...soft} />
        </>
      ) : null}

      {name === "merch" ? (
        <>
          <Path d="M3 10.4h18v9.1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9.1Z" {...solid} />
          <Rect x={2} y={6.6} width={20} height={4} rx={1.4} {...soft} />
          <Rect x={10.6} y={6.6} width={2.8} height={15} {...solid} />
          <Path
            d="M11.9 6.2C10.7 4 9.3 3 8 3a2.3 2.3 0 0 0 0 4.6h3.9Zm.2 0C13.3 4 14.7 3 16 3a2.3 2.3 0 0 1 0 4.6h-3.9Z"
            {...solid}
          />
        </>
      ) : null}

      {name === "promo" ? (
        <>
          <Path
            d="M3 6.4h18v3.3a2.3 2.3 0 0 0 0 4.6v3.3H3v-3.3a2.3 2.3 0 0 0 0-4.6V6.4Z"
            {...solid}
          />
          <Path
            d="M12 9.1l.95 1.93 2.13.31-1.54 1.5.36 2.12L12 13.96l-1.9 1-.36-2.12-1.54-1.5 2.13-.31L12 9.1Z"
            fill="#FFFFFF"
            opacity={0.9}
          />
        </>
      ) : null}

      {name === "cake" ? (
        <>
          <Path d="M12 1.6c.9.9 1.5 1.7 1.5 2.5a1.5 1.5 0 0 1-3 0c0-.8.6-1.6 1.5-2.5Z" {...solid} />
          <Rect x={11.2} y={4.8} width={1.6} height={3} rx={.8} {...solid} />
          <Path
            d="M6.4 7.8h11.2a2.6 2.6 0 0 1 2.6 2.6v2.1c-1 0-1.4.9-2.6.9s-1.6-.9-2.8-.9-1.6.9-2.8.9-1.6-.9-2.8-.9-1.6.9-2.8.9-1.6-.9-2.6-.9v-2.1a2.6 2.6 0 0 1 2.6-2.6Z"
            {...soft}
          />
          <Path d="M3.8 14.3c1 0 1.4.9 2.6.9s1.6-.9 2.8-.9 1.6.9 2.8.9 1.6-.9 2.8-.9 1.6.9 2.8.9 1.6-.9 2.6-.9v4.5a2.6 2.6 0 0 1-2.6 2.6H6.4a2.6 2.6 0 0 1-2.6-2.6v-4.5Z" {...solid} />
        </>
      ) : null}
    </Svg>
  );
}
