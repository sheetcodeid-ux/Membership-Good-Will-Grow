import { create } from "zustand";
import type { OrderChannel, OrderStatus, ServiceType } from "../data/types";
import { outlets } from "../data/mock";

/** Geofence radius: past this the outlet sheet warns the member they are too
 *  far to place a self-order. Business-configurable, so it lives in one place. */
export const MAX_ORDER_DISTANCE_KM = 1.0;

/** Receipt numbers minted the moment an order is confirmed. */
export interface PendingReceipt {
  orderNumber: string;
  nota: string;
}

/** Filters on Riwayat Pesanan; `undefined` means "show everything". */
export interface HistoryFilters {
  channel?: OrderChannel;
  status?: OrderStatus;
  outletId?: string;
}

interface OrderState {
  outletId: string;
  serviceType: ServiceType;
  /** False until the member confirms the outlet sheet on entering Order. */
  outletConfirmed: boolean;
  filters: HistoryFilters;
  receipt?: PendingReceipt;
  setOutlet: (outletId: string) => void;
  setServiceType: (serviceType: ServiceType) => void;
  confirmOutlet: () => void;
  reopenOutletSheet: () => void;
  setFilter: <K extends keyof HistoryFilters>(key: K, value: HistoryFilters[K]) => void;
  mintReceipt: () => void;
}

/** The app has no GPS yet, so "nearest" is the smallest mocked distance. */
function nearestOutletId() {
  return [...outlets].sort((a, b) => a.distanceKm - b.distanceKm)[0].id;
}

export const useOrderStore = create<OrderState>((set) => ({
  outletId: nearestOutletId(),
  serviceType: "dine_in",
  outletConfirmed: false,
  filters: {},
  setOutlet: (outletId) => set({ outletId }),
  setServiceType: (serviceType) => set({ serviceType }),
  confirmOutlet: () => set({ outletConfirmed: true }),
  reopenOutletSheet: () => set({ outletConfirmed: false }),
  setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
  mintReceipt: () => {
    const stamp = Date.now().toString();
    set({
      receipt: {
        orderNumber: `01a0cbea-ab82-72a0-93f8-${stamp.slice(-12)}`,
        nota: `GWG/12/${stamp}`,
      },
    });
  },
}));
