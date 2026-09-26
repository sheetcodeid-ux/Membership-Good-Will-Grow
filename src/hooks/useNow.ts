import { useEffect, useState } from "react";

/** The current time, refreshed every `everyMs` while the screen is open. */
export function useNow(everyMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), everyMs);
    return () => clearInterval(id);
  }, [everyMs]);
  return now;
}

/** "02:58:10" until the end of today, for coupons ending today. */
export function untilEndOfDay(now: number) {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const s = Math.max(0, Math.floor((end.getTime() - now) / 1000));
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
}
