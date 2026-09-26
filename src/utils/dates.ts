/** Indonesian month names, full and as the app abbreviates them. */
export const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const SHORT = [
  "jan",
  "feb",
  "mar",
  "apr",
  "mei",
  "jun",
  "jul",
  "agu",
  "sep",
  "okt",
  "nov",
  "des",
];

/**
 * Reads the dates the app's data writes — "29 Agustus 2026",
 * "22 Sep 2026, 15:09", "12/03/1998" — into a Date. Undefined if it
 * cannot make sense of the text.
 */
export function parseIndoDate(text: string | undefined): Date | undefined {
  if (!text) return undefined;
  const slash = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slash) return new Date(+slash[3], +slash[2] - 1, +slash[1]);
  const m = text.match(
    /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})(?:,\s*(\d{1,2})[:.](\d{2}))?/,
  );
  if (!m) return undefined;
  const month = SHORT.indexOf(m[2].slice(0, 3).toLowerCase());
  if (month < 0) return undefined;
  return new Date(+m[3], month, +m[1], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0);
}

/** "12 Maret 1998". */
export function formatIndoDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "September 2026". */
export function monthLabel(d: Date) {
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/**
 * The heading a dated list groups an item under: "Hari ini", "Kemarin",
 * "7 hari terakhir", then the month.
 */
export function relativeGroup(d: Date, now = new Date()) {
  const days = Math.round((startOfDay(now) - startOfDay(d)) / 86400000);
  if (days <= 0) return "Hari ini";
  if (days === 1) return "Kemarin";
  if (days < 7) return "7 hari terakhir";
  return monthLabel(d);
}
