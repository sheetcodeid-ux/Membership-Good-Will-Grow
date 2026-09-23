import React from "react";
import { AppIcon, type AppIconName } from "./ui/AppIcon";
import { InfinityGlyph } from "./GwgIcons";

import { danger, ink, success, warning } from "../theme/colors";
import type { OrderChannel, OrderStatus } from "../data/types";

const HOLD = "#2563EB";


/**
 * Status glyphs are bare outline marks — no disc, no colour of their own — so
 * they sit on the same 2pt stroke grid as the channel icons and read as one
 * icon set. `tint` stays for the coloured status badges on the order cards.
 */
export const statusMeta: Record<
  OrderStatus,
  { label: string; description: string; tint: string; icon: AppIconName }
> = {
  dibayar: {
    label: "Dibayar",
    description: "Pesanan yang sudah dibayar",
    tint: success[500],
    icon: "check",
  },
  "belum-bayar": {
    label: "Belum Bayar",
    description: "Pesanan yang belum dibayar",
    tint: warning[500],
    icon: "hourglass",
  },
  ditahan: {
    label: "Ditahan",
    description: "Pesanan yang ditahan",
    tint: HOLD,
    icon: "pause",
  },
  dibatalkan: {
    label: "Dibatalkan",
    description: "Pesanan yang dibatalkan",
    tint: danger[500],
    icon: "close",
  },
};

export function StatusIcon({
  status,
  size = 22,
  color = ink[600],
}: {
  status: OrderStatus;
  size?: number;
  color?: string;
}) {
  const { icon } = statusMeta[status];
  return <AppIcon name={icon} size={size} color={color} />;
}

export const channelMeta: Record<
  OrderChannel,
  { label: string; description: string; icon: AppIconName }
> = {
  "member-apps": {
    label: "Member Apps",
    description: "Pesanan dari aplikasi membership",
    icon: "phone",
  },
  kiosk: { label: "Kiosk", description: "Pesanan dari mesin kiosk", icon: "monitor" },
  pos: { label: "POS", description: "Pesanan dari sistem POS", icon: "pos" },
  "qr-dine-in": { label: "QR Dine In", description: "Pesanan dari QR code dine in", icon: "qr" },
};

export { InfinityGlyph as InfinityIcon };
