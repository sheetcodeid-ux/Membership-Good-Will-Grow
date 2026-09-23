import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { brand, danger } from "../theme/colors";

/**
 * Marks for the Account (Profile) rows. The reference draws every one of them
 * solid and two-tone — a light body with a darker accent, detail knocked out
 * in the surface colour — so the outline icon sets cannot stand in for them.
 */
interface GlyphProps {
  size?: number;
  /** Body of the mark. */
  color?: string;
  /** Knocked-out detail; matches the surface the mark sits on. */
  detail?: string;
  /** Darker second tone. */
  accent?: string;
}

function useTones({ color, accent, detail }: GlyphProps) {
  return {
    body: color ?? brand[500],
    dark: accent ?? brand[900],
    cut: detail ?? "#FFFFFF",
  };
}

/** Price tag, used by Kupon Saya and Riwayat Pembelian Kupon. */
export function TagGlyph(props: GlyphProps) {
  const { size = 17 } = props;
  const { body, cut } = useTones(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M13.9 1.9h5.9a2.3 2.3 0 0 1 2.3 2.3v5.9a3.4 3.4 0 0 1-1 2.4l-8.5 8.5a3.4 3.4 0 0 1-4.8 0l-4.8-4.8a3.4 3.4 0 0 1 0-4.8l8.5-8.5a3.4 3.4 0 0 1 2.4-1Z"
        fill={body}
      />
      <Circle cx={17.3} cy={6.7} r={1.9} fill={cut} />
      <Path
        d="M9.2 13.1a1.2 1.2 0 1 1 1.7 1.7 1.2 1.2 0 1 0 1.7 1.7"
        stroke={cut}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

/** Ticket with a star, used by Voucher Saya. */
export function VoucherGlyph(props: GlyphProps) {
  const { size = 17 } = props;
  const { body, cut } = useTones(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3.6 5.1h16.8a1.8 1.8 0 0 1 1.8 1.8v2.4a2.7 2.7 0 0 0 0 5.4v2.4a1.8 1.8 0 0 1-1.8 1.8H3.6a1.8 1.8 0 0 1-1.8-1.8v-2.4a2.7 2.7 0 0 0 0-5.4V6.9a1.8 1.8 0 0 1 1.8-1.8Z"
        fill={body}
      />
      <Path
        d="M12 8.4l1.32 2.68 2.96.43-2.14 2.09.5 2.94L12 15.15l-2.64 1.39.5-2.94-2.14-2.09 2.96-.43L12 8.4Z"
        fill={cut}
      />
    </Svg>
  );
}

/** Points card with an up/down pair, used by Histori Poin. */
export function PointsHistoryGlyph(props: GlyphProps) {
  const { size = 17 } = props;
  const { body, dark, cut } = useTones(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={3} y={3.2} width={18} height={11.8} rx={2.8} fill={body} />
      <Rect x={3} y={6.2} width={18} height={2.4} fill={cut} />
      <Path d="M6.8 23.2l-2.9-3.7h5.8l-2.9 3.7Z" fill={dark} />
      <Path d="M12.8 15.8l2.9 3.7H9.9l2.9-3.7Z" fill={dark} />
    </Svg>
  );
}

/** Checklist, used by Riwayat Pemesanan. */
export function OrderHistoryGlyph(props: GlyphProps) {
  const { size = 17 } = props;
  const { body, cut } = useTones(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={3} y={2.6} width={18} height={18.8} rx={3.6} fill={body} />
      <Path
        d="M6.4 8.3l1.5 1.5 2.7-2.9M6.4 15.1l1.5 1.5 2.7-2.9"
        stroke={cut}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Rect x={12.6} y={7.5} width={5.4} height={1.7} rx={0.85} fill={cut} />
      <Rect x={12.6} y={14.3} width={5.4} height={1.7} rx={0.85} fill={cut} />
    </Svg>
  );
}

/** Member with a "no entry" badge, used by Daftar Blokir Pengguna. */
export function BlockedUserGlyph(props: GlyphProps) {
  const { size = 17 } = props;
  const { body, dark, cut } = useTones(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={9.3} cy={5.9} r={3.7} fill={dark} />
      <Path
        d="M9.3 11.6c3.2 0 5.9 1.8 6.9 4.3a5.6 5.6 0 0 0-2 5.3H3.8a1.9 1.9 0 0 1-1.9-1.9v-1.1c0-3.5 3.3-6.6 7.4-6.6Z"
        fill={body}
      />
      <Circle cx={18} cy={17.4} r={5.2} fill={body} />
      <Circle cx={18} cy={17.4} r={3.2} fill={cut} />
      <Rect
        x={17.2}
        y={13.7}
        width={1.6}
        height={7.4}
        rx={0.8}
        fill={body}
        transform="rotate(45 18 17.4)"
      />
    </Svg>
  );
}

/** Three bars, used by Atur Menu Pintas. */
export function MenuLinesGlyph(props: GlyphProps) {
  const { size = 17 } = props;
  const { dark } = useTones(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={2.4} y={5.3} width={19.2} height={2.5} rx={1.25} fill={dark} />
      <Rect x={2.4} y={10.75} width={19.2} height={2.5} rx={1.25} fill={dark} />
      <Rect x={2.4} y={16.2} width={19.2} height={2.5} rx={1.25} fill={dark} />
    </Svg>
  );
}

/** Six-petal cog, used by Pengaturan. */
export function GearFlowerGlyph(props: GlyphProps) {
  const { size = 17 } = props;
  const { body, dark } = useTones(props);
  // Petals ride far enough out that the silhouette stays scalloped.
  const petals: [number, number][] = [
    [18.9, 12],
    [15.45, 17.97],
    [8.55, 17.97],
    [5.1, 12],
    [8.55, 6.03],
    [15.45, 6.03],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {petals.map(([cx, cy]) => (
        <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={3.9} fill={body} />
      ))}
      <Circle cx={12} cy={12} r={5.3} fill={body} />
      <Circle cx={12} cy={12} r={2.5} fill={dark} />
    </Svg>
  );
}

/** Rounded square with a question mark, used by FAQ. */
export function FaqGlyph(props: GlyphProps) {
  const { size = 17 } = props;
  const { body, dark } = useTones(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={2.6} y={2.6} width={18.8} height={18.8} rx={5} fill={body} />
      <Path
        d="M9.3 9.4a2.75 2.75 0 1 1 3.6 2.62c-.65.23-.95.72-.95 1.36v.5"
        stroke={dark}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx={11.95} cy={17} r={1.4} fill={dark} />
    </Svg>
  );
}

/** Rounded square with an exclamation mark, used by Syarat & Ketentuan. */
export function TermsGlyph(props: GlyphProps) {
  const { size = 17 } = props;
  const { body, dark } = useTones(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={2.6} y={2.6} width={18.8} height={18.8} rx={5} fill={body} />
      <Rect x={10.85} y={6.3} width={2.3} height={8.3} rx={1.15} fill={dark} />
      <Circle cx={12} cy={17} r={1.4} fill={dark} />
    </Svg>
  );
}

/** Shield with a star, used by Kebijakan Privasi. */
export function PrivacyGlyph(props: GlyphProps) {
  const { size = 17 } = props;
  const { body, cut } = useTones(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 1.9l8.2 3.1v6.4c0 4.9-3.4 9-8.2 10.7-4.8-1.7-8.2-5.8-8.2-10.7V5L12 1.9Z"
        fill={body}
      />
      <Path
        d="M12 7.3l1.45 2.97 3.27.48-2.36 2.3.56 3.25L12 14.77l-2.92 1.53.56-3.25-2.36-2.3 3.27-.48L12 7.3Z"
        fill={cut}
      />
    </Svg>
  );
}

/** Door with a handle, used by Keluar. Always red. */
export function LogoutGlyph({ size = 17 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M5.2 2.6h10a2.2 2.2 0 0 1 2.2 2.2v14.4a2.2 2.2 0 0 1-2.2 2.2h-10A2.2 2.2 0 0 1 3 19.2V4.8a2.2 2.2 0 0 1 2.2-2.2Z"
        fill="#F2A6A6"
      />
      <Rect x={12.9} y={2.6} width={4.5} height={18.8} rx={1.9} fill={danger[500]} />
      <Circle cx={10.9} cy={12} r={1.15} fill="#FFFFFF" />
    </Svg>
  );
}

/** QR block, used by the referral pill on the Account header card. */
export function QrGlyph(props: GlyphProps) {
  const { size = 15 } = props;
  const { body, cut } = useTones(props);
  const corners: [number, number][] = [
    [2.6, 2.6],
    [13.4, 2.6],
    [2.6, 13.4],
  ];
  const dots: [number, number][] = [
    [13.4, 13.4],
    [18, 13.4],
    [13.4, 18],
    [18, 18],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {corners.map(([x, y]) => (
        <React.Fragment key={`${x}-${y}`}>
          <Rect x={x} y={y} width={8} height={8} rx={2.3} fill={body} />
          <Rect x={x + 2.5} y={y + 2.5} width={3} height={3} rx={0.9} fill={cut} />
        </React.Fragment>
      ))}
      {dots.map(([x, y]) => (
        <Rect key={`${x}-${y}`} x={x} y={y} width={3.4} height={3.4} rx={1} fill={body} />
      ))}
    </Svg>
  );
}

/** Solid gift box, used by the "lengkapi profil" tile and Voucher Saya. */
export function GiftGlyph(props: GlyphProps) {
  const { size = 20 } = props;
  const { body, cut } = useTones(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 6.6C10.5 3.5 8.7 2.2 7.2 3c-1.5.8-1.2 2.9.6 3.6h4.2Zm0 0c1.5-3.1 3.3-4.4 4.8-3.6 1.5.8 1.2 2.9-.6 3.6H12Z"
        fill={body}
      />
      <Rect x={1.7} y={6.3} width={20.6} height={4.8} rx={1.9} fill={body} />
      <Rect x={3.3} y={11.1} width={17.4} height={10.6} rx={2.4} fill={body} />
      <Rect x={10.9} y={6.3} width={2.2} height={15.4} fill={cut} />
    </Svg>
  );
}

/** WhatsApp bubble; drawn white on the green disc the reference uses. */
export function WhatsAppGlyph({
  size = 22,
  color = "#FFFFFF",
  detail = "#25D366",
}: {
  size?: number;
  color?: string;
  detail?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2.6a9.4 9.4 0 0 0-8.05 14.25L2.6 21.4l4.7-1.32A9.4 9.4 0 1 0 12 2.6Z"
        fill={color}
      />
      <Path
        d="M9.05 7.3c-.2-.45-.41-.46-.6-.47h-.51c-.18 0-.47.07-.71.34-.24.27-.94.91-.94 2.23 0 1.32.96 2.59 1.1 2.77.13.18 1.86 2.97 4.6 4.05 2.28.9 2.74.72 3.23.67.5-.04 1.6-.65 1.83-1.29.23-.63.23-1.17.16-1.29-.07-.11-.25-.18-.51-.31-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.6.14-.18.27-.69.87-.85 1.05-.15.18-.31.2-.58.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.35-1.59-1.5-1.86-.16-.27-.02-.42.12-.55.12-.12.27-.31.41-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.14-.6-1.46-.83-1.99Z"
        fill={detail}
      />
    </Svg>
  );
}
