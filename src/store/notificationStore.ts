import { create } from "zustand";
import { notifications as initial } from "../data/mock";
import type { NotificationItem } from "../data/types";

interface NotificationState {
  items: NotificationItem[];
  markRead: (id: string) => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: initial,
  markRead: (id) =>
    set((state) => ({
      items: state.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  unreadCount: () => get().items.filter((n) => !n.read).length,
}));
