import React from "react";
import Svg, { Path, Rect } from "react-native-svg";
import {
  CircleCheck,
  CircleEllipsis,
  CirclePause,
  CircleX,
  Infinity as InfinityIcon,
  Monitor,
  QrCode,
  Smartphone,
  type LucideIcon,
} from "lucide-react-native";
import { danger, ink, success, warning } from "../theme/colors";
import type { OrderChannel, OrderStatus } from "../data/types";

const HOLD = "#2563EB";

/** Cash register, drawn on lucide's 24pt grid so it sits beside their icons. */
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

/**
 * Status glyphs are outline icons on the same 2pt stroke grid as the channel
 * icons, so both picker sheets read as one icon set; only the colour changes.
 */
export const statusMeta: Record<
  OrderStatus,
  { label: string; description: string; tint: string; icon: LucideIcon }
> = {
  dibayar: {
    label: "Dibayar",
    description: "Pesanan yang sudah dibayar",
    tint: success[500],
    icon: CircleCheck,
  },
  "belum-bayar": {
    label: "Belum Bayar",
    description: "Pesanan yang belum dibayar",
    tint: warning[500],
    icon: CircleEllipsis,
  },
  ditahan: {
    label: "Ditahan",
    description: "Pesanan yang ditahan",
    tint: HOLD,
    icon: CirclePause,
  },
  dibatalkan: {
    label: "Dibatalkan",
    description: "Pesanan yang dibatalkan",
    tint: danger[500],
    icon: CircleX,
  },
};

export function StatusIcon({ status, size = 22 }: { status: OrderStatus; size?: number }) {
  const { icon: Icon, tint } = statusMeta[status];
  return <Icon size={size} color={tint} strokeWidth={2} />;
}

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
