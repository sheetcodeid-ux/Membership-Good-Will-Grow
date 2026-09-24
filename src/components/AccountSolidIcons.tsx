import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

/**
 * The account list's marks, drawn solid.
 *
 * The set they replace was two-tone outline work at a 1.8 stroke. In a list
 * where every row is a word and a chevron, an outline mark at 20pt is mostly
 * background — it has no mass, so the eye skips it and the row becomes text
 * alone. Filled shapes carry at that size, which is the whole reason the
 * reference set is solid.
 *
 * Rules held across the set: one fill, no strokes, corners rounded at about
 * a tenth of the glyph, and any cut-out is the background showing through
 * rather than a second colour — so a glyph works on white, on a tint, or
 * reversed out, without a variant for each.
 */
interface SolidProps {
  size?: number;
  color?: string;
}

const D = 24;

/** Receipt with a torn foot — order history. */
export function ReceiptSolid({ size = 22, color = "#000" }: SolidProps) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${D} ${D}`}>
      <Path
        d="M5.4 2h13.2a1.4 1.4 0 0 1 1.4 1.4v18.06a.6.6 0 0 1-.88.53L16.6 20.3l-2.52 1.4a1.2 1.2 0 0 1-1.16 0L10.4 20.3l-2.52 1.4a1.2 1.2 0 0 1-1.16 0L4.2 20.3l-.32.17A.6.6 0 0 1 3 19.94V3.4A1.4 1.4 0 0 1 4.4 2Z"
        fill={color}
      />
      <Rect x="6.6" y="6.6" width="10.8" height="2" rx="1" fill="#FFFFFF" />
      <Rect x="6.6" y="11" width="6.8" height="2" rx="1" fill="#FFFFFF" />
    </Svg>
  );
}

/** Coin stack — points history. */
export function CoinsSolid({ size = 22, color = "#000" }: SolidProps) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${D} ${D}`}>
      <Path
        d="M2.4 6.2c0-1.88 3-3.4 6.7-3.4s6.7 1.52 6.7 3.4-3 3.4-6.7 3.4-6.7-1.52-6.7-3.4Z"
        fill={color}
      />
      <Path
        d="M2.4 9.4v2.2c0 1.7 2.45 3.1 5.6 3.35v-2.2C4.85 12.5 2.4 11.1 2.4 9.4Z"
        fill={color}
      />
      <Path
        d="M8 14.9c0-1.88 3-3.4 6.7-3.4s6.9 1.52 6.9 3.4-3.2 3.4-6.9 3.4S8 16.78 8 14.9Z"
        fill={color}
      />
      <Path
        d="M8 18.1v1.4c0 1.88 3 3.4 6.7 3.4s6.9-1.52 6.9-3.4v-1.4c-1.5 1.3-4.1 2.1-6.9 2.1S9.5 19.4 8 18.1Z"
        fill={color}
      />
    </Svg>
  );
}

/** Price tag with its eyelet — coupons. */
export function TagSolid({ size = 22, color = "#000" }: SolidProps) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${D} ${D}`}>
      <Path
        d="M11.1 2.4H19a2.6 2.6 0 0 1 2.6 2.6v7.9a2.6 2.6 0 0 1-.76 1.84l-7.6 7.6a2.6 2.6 0 0 1-3.68 0L2.66 15.44a2.6 2.6 0 0 1 0-3.68l7.6-7.6a2.6 2.6 0 0 1 1.84-.76Z"
        fill={color}
      />
      <Circle cx="16.6" cy="7.4" r="2.1" fill="#FFFFFF" />
    </Svg>
  );
}

/** Ticket, notched at the waist — vouchers. */
export function TicketSolid({ size = 22, color = "#000" }: SolidProps) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${D} ${D}`}>
      {/* Taller than wide-and-flat: at 22pt the flat version read as a ribbon,
          because the notches met in the middle and pinched it to a bowtie.
          Pulling the body to 13.6 tall leaves the notches at the edges. */}
      <Path
        d="M3.6 5.2h16.8a1.8 1.8 0 0 1 1.8 1.8v2.3a2.7 2.7 0 0 0 0 5.4v2.3a1.8 1.8 0 0 1-1.8 1.8H3.6a1.8 1.8 0 0 1-1.8-1.8v-2.3a2.7 2.7 0 0 0 0-5.4V7a1.8 1.8 0 0 1 1.8-1.8Z"
        fill={color}
      />
      {/* The tear line, as the background showing through. */}
      <Rect x="14.6" y="7.6" width="1.7" height="2.6" rx=".85" fill="#FFFFFF" />
      <Rect x="14.6" y="10.7" width="1.7" height="2.6" rx=".85" fill="#FFFFFF" />
      <Rect x="14.6" y="13.8" width="1.7" height="2.6" rx=".85" fill="#FFFFFF" />
    </Svg>
  );
}

/**
 * WhatsApp, filled.
 *
 * It stays green while the rest of the list is navy: this row hands the user
 * to another app, and the brand's own colour is what says so before the label
 * is read. Solid so it carries the same weight as its neighbours — the
 * outline version was the one light mark in a column of solid ones.
 */
export function WhatsAppSolid({ size = 22, color = "#25D366" }: SolidProps) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${D} ${D}`}>
      <Path
        d="M12.04 2.2c-5.4 0-9.78 4.38-9.78 9.78 0 1.72.45 3.4 1.31 4.88L2.2 21.8l5.07-1.33a9.74 9.74 0 0 0 4.77 1.24h.01c5.39 0 9.77-4.38 9.77-9.78 0-2.61-1.02-5.07-2.86-6.91a9.71 9.71 0 0 0-6.92-2.87Z"
        fill={color}
      />
      <Path
        d="M9.3 6.9c-.23-.52-.48-.53-.7-.54h-.6a1.15 1.15 0 0 0-.83.39c-.29.31-1.09 1.06-1.09 2.59s1.12 3 1.27 3.21c.16.2 2.16 3.46 5.33 4.71 2.63 1.04 3.17.83 3.74.78.57-.05 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.29-.21-.6-.36-.31-.16-1.84-.91-2.13-1.01-.28-.11-.49-.16-.7.15-.2.31-.8 1.01-.98 1.22-.18.21-.36.23-.67.08-.31-.16-1.32-.49-2.51-1.55-.93-.83-1.55-1.85-1.74-2.16-.18-.31-.02-.48.14-.63.14-.14.31-.36.47-.54.15-.19.2-.32.31-.53.1-.21.05-.39-.03-.55-.08-.15-.68-1.7-.96-2.3Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

/** Cogwheel — settings. */
export function GearSolid({ size = 22, color = "#000" }: SolidProps) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${D} ${D}`}>
      <Path
        d="M10.1 1.8h3.8l.42 2.63 1.62.67 2.17-1.54 2.69 2.69-1.54 2.17.67 1.62 2.63.42v3.8l-2.63.42-.67 1.62 1.54 2.17-2.69 2.69-2.17-1.54-1.62.67-.42 2.63h-3.8l-.42-2.63-1.62-.67-2.17 1.54-2.69-2.69 1.54-2.17-.67-1.62L1.8 13.9v-3.8l2.63-.42.67-1.62-1.54-2.17 2.69-2.69 2.17 1.54 1.62-.67Z"
        fill={color}
      />
      <Circle cx="12" cy="12" r="3.3" fill="#FFFFFF" />
    </Svg>
  );
}

/** Four tiles — the shortcut grid. */
export function GridSolid({ size = 22, color = "#000" }: SolidProps) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${D} ${D}`}>
      <Rect x="2.6" y="2.6" width="8.4" height="8.4" rx="2.4" fill={color} />
      <Rect x="13" y="2.6" width="8.4" height="8.4" rx="2.4" fill={color} />
      <Rect x="2.6" y="13" width="8.4" height="8.4" rx="2.4" fill={color} />
      <Rect x="13" y="13" width="8.4" height="8.4" rx="2.4" fill={color} />
    </Svg>
  );
}

/** Figure inside a barred circle — blocked members. */
export function UserBlockSolid({ size = 22, color = "#000" }: SolidProps) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${D} ${D}`}>
      <Circle cx="9.6" cy="7.4" r="4.2" fill={color} />
      <Path d="M2.2 20.6c0-4.06 3.31-6.7 7.4-6.7 1.02 0 2 .16 2.9.47a6.6 6.6 0 0 0 4.06 6.23Z" fill={color} />
      <Path
        d="M17.6 10.6a5.4 5.4 0 1 1 0 10.8 5.4 5.4 0 0 1 0-10.8Zm-2.4 7.2 4.1-4.1a3.4 3.4 0 0 0-4.1 4.1Z"
        fill={color}
      />
    </Svg>
  );
}

/** Circled question — FAQ. */
export function FaqSolid({ size = 22, color = "#000" }: SolidProps) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${D} ${D}`}>
      <Circle cx="12" cy="12" r="9.8" fill={color} />
      <Path
        d="M12 5.9c2.2 0 3.9 1.5 3.9 3.5 0 1.55-.83 2.3-1.9 3-.75.5-1 .8-1 1.5v.5h-2v-.8c0-1.3.55-2 1.6-2.7.85-.57 1.2-.9 1.2-1.55 0-.9-.75-1.5-1.8-1.5s-1.85.62-1.9 1.7H8.1c.05-2.2 1.7-3.65 3.9-3.65Z"
        fill="#FFFFFF"
      />
      <Circle cx="12" cy="17" r="1.35" fill="#FFFFFF" />
    </Svg>
  );
}

/** Sheet with a folded corner — terms. */
export function DocSolid({ size = 22, color = "#000" }: SolidProps) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${D} ${D}`}>
      <Path
        d="M6.4 2h6.7l6.5 6.5V20a2 2 0 0 1-2 2H6.4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
        fill={color}
      />
      <Path d="M13.4 2.3 19.7 8.6h-5.1a1.2 1.2 0 0 1-1.2-1.2Z" fill="#FFFFFF" opacity={0.55} />
      <Rect x="7.4" y="12" width="9.2" height="1.9" rx=".95" fill="#FFFFFF" />
      <Rect x="7.4" y="15.7" width="6" height="1.9" rx=".95" fill="#FFFFFF" />
    </Svg>
  );
}

/** Shield with a tick — privacy. */
export function ShieldSolid({ size = 22, color = "#000" }: SolidProps) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${D} ${D}`}>
      <Path
        d="M12 1.9 20.3 5v6.4c0 4.9-3.4 8.9-8.3 10.7-4.9-1.8-8.3-5.8-8.3-10.7V5Z"
        fill={color}
      />
      <Path
        d="m8.1 11.8 2.6 2.6 5.3-5.6"
        stroke="#FFFFFF"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/** Door with an arrow leaving it — sign out. */
export function LogoutSolid({ size = 22, color = "#000" }: SolidProps) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${D} ${D}`}>
      <Path
        d="M4.4 2.6h7.2a2 2 0 0 1 2 2v2.2h-2.4V5.4a.4.4 0 0 0-.4-.4H5.6a.4.4 0 0 0-.4.4v13.2a.4.4 0 0 0 .4.4h5.2a.4.4 0 0 0 .4-.4v-1.4h2.4v2.2a2 2 0 0 1-2 2H4.4a2 2 0 0 1-2-2V4.6a2 2 0 0 1 2-2Z"
        fill={color}
      />
      <Path
        d="m17.1 7.5 4.2 4a.7.7 0 0 1 0 1l-4.2 4a.7.7 0 0 1-1.2-.5v-2.2H9.6v-3.6h6.3V8a.7.7 0 0 1 1.2-.5Z"
        fill={color}
      />
    </Svg>
  );
}

/** QR block — the referral code. */
export function QrSolid({ size = 22, color = "#000" }: SolidProps) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${D} ${D}`}>
      <Path
        d="M2.6 2.6h7.2v7.2H2.6Zm2.4 2.4v2.4h2.4V5Zm9.2-2.4h7.2v7.2h-7.2Zm2.4 2.4v2.4h2.4V5ZM2.6 14.2h7.2v7.2H2.6Zm2.4 2.4V19h2.4v-2.4Z"
        fill={color}
        fillRule="evenodd"
      />
      <Rect x="14.2" y="14.2" width="3" height="3" rx=".6" fill={color} />
      <Rect x="18.4" y="18.4" width="3" height="3" rx=".6" fill={color} />
      <Rect x="14.2" y="19.4" width="2" height="2" rx=".6" fill={color} />
      <Rect x="19.4" y="14.2" width="2" height="2" rx=".6" fill={color} />
    </Svg>
  );
}

/** Wrapped gift — the reward prompt. */
export function GiftSolid({ size = 22, color = "#000" }: SolidProps) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${D} ${D}`}>
      <Path
        d="M12 6.3c-.9-2.1-2.2-3.4-3.9-3.4a2.7 2.7 0 0 0 0 5.4h1.6V6.3Zm0 0c.9-2.1 2.2-3.4 3.9-3.4a2.7 2.7 0 0 1 0 5.4h-1.6V6.3Z"
        fill={color}
      />
      <Rect x="2.4" y="8.3" width="19.2" height="4.6" rx="1.4" fill={color} />
      <Path d="M4.2 13.6h6.6v8.1H6.2a2 2 0 0 1-2-2Zm9 0h6.6v6.1a2 2 0 0 1-2 2h-4.6Z" fill={color} />
      <Rect x="10.6" y="8.3" width="2.8" height="13.4" fill="#FFFFFF" />
    </Svg>
  );
}

/** Envelope — the email contact row. */
export function MailSolid({ size = 22, color = "#000" }: SolidProps) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${D} ${D}`}>
      <Path
        d="M3.4 4.6h17.2a2 2 0 0 1 2 2v.3l-10.06 6.1a1.2 1.2 0 0 1-1.24 0L1.4 6.9v-.3a2 2 0 0 1 2-2Z"
        fill={color}
      />
      <Path
        d="M1.4 9.3v8.1a2 2 0 0 0 2 2h17.2a2 2 0 0 0 2-2V9.3l-9.16 5.55a2.4 2.4 0 0 1-2.48 0Z"
        fill={color}
      />
    </Svg>
  );
}
