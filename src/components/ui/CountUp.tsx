import React, { useEffect, useRef, useState } from "react";
import type { TextStyle } from "react-native";
import { UiText } from "./Text";

/**
 * A number that counts up to its value when it first shows, and glides to
 * any new value after that — enough motion to draw the eye to a balance
 * or a total without making anyone wait for it (0.7s, easing out).
 */
export function CountUp({
  value,
  format,
  color,
  style,
  duration = 700,
}: {
  value: number;
  format: (n: number) => string;
  color?: string;
  style?: TextStyle;
  duration?: number;
}) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    const start = from.current;
    const t0 = Date.now();
    let frame = 0;
    const step = () => {
      const t = Math.min(1, (Date.now() - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const n = Math.round(start + (value - start) * eased);
      setShown(n);
      from.current = n;
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <UiText color={color} style={style}>
      {format(shown)}
    </UiText>
  );
}
