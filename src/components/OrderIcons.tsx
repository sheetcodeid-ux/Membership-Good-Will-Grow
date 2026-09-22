import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { Infinity as InfinityIcon, Monitor, QrCode, Smartphone } from "lucide-react-native";
import { danger, ink, success, warning } from "../theme/colors";
import type { OrderChannel, OrderStatus } from "../data/types";

const statusTint: Record<OrderStatus, string> = {
  dibayar: success[500],
  "belum-bayar": warning[500],
  ditahan: "#2563EB",
  dibatalkan: danger[500],
};

/**
 * Filled status pip. Hand-drawn rather than composed from two lucide icons so
 * the glyph is always optically centred in its disc at any size.
 */
export function StatusBadgeIcon({ status, size = 24 }: { status: OrderStatus; size?: number }) {
  const tint = statusTint[status];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={11} fill={tint} />
      {status === "dibayar" ? (
        <Path
          d="M7.2 12.4 10.4 15.6 16.8 9.2"
          stroke="#FFFFFF"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ) : null}
      {status === "belum-bayar" ? (
        <>
          <Circle cx={7.4} cy={12} r={1.6} fill="#FFFFFF" />
          <Circle cx={12} cy={12} r={1.6} fill="#FFFFFF" />
          <Circle cx={16.6} cy={12} r={1.6} fill="#FFFFFF" />
        </>
      ) : null}
      {status === "ditahan" ? (
        <>
          <Rect x={8.4} y={7.6} width={2.6} height={8.8} rx={1.3} fill="#FFFFFF" />
          <Rect x={13} y={7.6} width={2.6} height={8.8} rx={1.3} fill="#FFFFFF" />
        </>
      ) : null}
      {status === "dibatalkan" ? (
        <Path
          d="M8.4 8.4 15.6 15.6 M15.6 8.4 8.4 15.6"
          stroke="#FFFFFF"
          strokeWidth={2.4}
          strokeLinecap="round"
          fill="none"
        />
      ) : null}
    </Svg>
  );
}

/** Cash register, drawn to lucide's 24pt grid so it sits beside their icons. */
export function PosIcon({ size = 24, color = ink[600] }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={12} width={20} height={9} rx={2} stroke={color} strokeWidth={2} />
      <Rect x={6} y={3} width={12} height={6} rx={1.5} stroke={color} strokeWidth={2} />
      <Path d="M6 9v3M18 9v3" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M6 16.5h4M6 19h8" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export const statusMeta: Record<OrderStatus, { label: string; description: string; tint: string }> = {
  dibayar: { label: "Dibayar", description: "Pesanan yang sudah dibayar", tint: success[500] },
  "belum-bayar": {
    label: "Belum Bayar",
    description: "Pesanan yang belum dibayar",
    tint: warning[500],
  },
  ditahan: { label: "Ditahan", description: "Pesanan yang ditahan", tint: "#2563EB" },
  dibatalkan: {
    label: "Dibatalkan",
    description: "Pesanan yang dibatalkan",
    tint: danger[500],
  },
};

export const channelMeta: Record<
  OrderChannel,
  { label: string; description: string; icon: React.ComponentType<{ size?: number; color?: string }> }
> = {
  "member-apps": {
    label: "Member Apps",
    description: "Pesanan dari aplikasi membership",
    icon: Smartphone,
  },
  kiosk: { label: "Kiosk", description: "Pesanan dari mesin kiosk", icon: Monitor },
  pos: { label: "POS", description: "Pesanan dari sistem POS", icon: PosIcon },
  "qr-dine-in": { label: "QR Dine In", description: "Pesanan dari QR code dine in", icon: QrCode },
};

export { InfinityIcon };
