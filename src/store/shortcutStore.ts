import { create } from "zustand";

export interface ShortcutItem {
  id: string;
  label: string;
  description: string;
  href: string;
  /** Lucide icon name, resolved by the screens that render the shortcut. */
  icon: string;
}

/** Always present in the quick menu and not removable. */
export const requiredShortcuts: ShortcutItem[] = [
  {
    id: "riwayat-pesanan",
    label: "Riwayat Pemesanan",
    description: "Lihat semua pesanan yang pernah dibuat",
    href: "/order-history",
    icon: "receipt",
  },
  {
    id: "kupon-saya",
    label: "Kupon Saya",
    description: "Kupon aktif yang siap digunakan",
    href: "/coupons",
    icon: "ticket",
  },
];

/** Everything the member may pin on top of the required two. */
export const availableShortcuts: ShortcutItem[] = [
  { id: "histori-poin", label: "Histori Poin", description: "Riwayat penambahan & penggunaan poin", href: "/points-history", icon: "star" },
  { id: "voucher-saya", label: "Voucher Saya", description: "Voucher yang sudah kamu klaim", href: "/vouchers", icon: "gift" },
  { id: "riwayat-kupon", label: "Riwayat Pembelian Kupon", description: "Histori transaksi pembelian kupon", href: "/coupon-purchases", icon: "ticket-check" },
  { id: "notifikasi", label: "Notifikasi", description: "Lihat semua notifikasi", href: "/notifications", icon: "bell" },
  { id: "bookmark", label: "Bookmark", description: "Postingan yang kamu simpan", href: "/bookmark", icon: "bookmark" },
  { id: "cari-member", label: "Cari Member", description: "Temukan dan ikuti member lain", href: "/search-member", icon: "search" },
  { id: "pengikut", label: "Pengikut", description: "Daftar member yang mengikuti kamu", href: "/profile/amaliaputri", icon: "users" },
  { id: "mengikuti", label: "Mengikuti", description: "Member yang kamu ikuti", href: "/profile/amaliaputri", icon: "user-plus" },
  { id: "blokir", label: "Daftar Blokir Pengguna", description: "Member yang kamu blokir", href: "/blocked", icon: "ban" },
  { id: "detail-profil", label: "Detail Profil", description: "Lihat & lengkapi data profil kamu", href: "/profile-detail", icon: "user" },
  { id: "edit-profil", label: "Ubah Profil", description: "Perbarui data profil kamu", href: "/edit-profile", icon: "pencil" },
  { id: "atur-pin", label: "Atur PIN", description: "Ubah PIN keamanan akun", href: "/create-pin", icon: "lock" },
  { id: "pengaturan", label: "Pengaturan", description: "Notifikasi, akun, & preferensi", href: "/settings", icon: "settings" },
  { id: "info-referal", label: "Info Referal", description: "Bagikan kode referal kamu", href: "/referral", icon: "share" },
];

interface ShortcutState {
  /** Ids the member pinned, in the order they added them. */
  pinned: string[];
  pin: (id: string) => void;
  unpin: (id: string) => void;
  isPinned: (id: string) => boolean;
}

export const useShortcutStore = create<ShortcutState>((set, get) => ({
  pinned: [],
  pin: (id) => set((s) => (s.pinned.includes(id) ? s : { pinned: [...s.pinned, id] })),
  unpin: (id) => set((s) => ({ pinned: s.pinned.filter((p) => p !== id) })),
  isPinned: (id) => get().pinned.includes(id),
}));
