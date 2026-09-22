export type ServiceType = "dine_in" | "takeaway" | "delivery";

export interface Brand {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  category: "coffee" | "food";
  gradient: [string, string];
}

/** Monday-first, matching how the outlet sheet lists the week. */
export type WeekDay = "senin" | "selasa" | "rabu" | "kamis" | "jumat" | "sabtu" | "minggu";

export interface Outlet {
  id: string;
  brandId: string;
  /** Short label used inside the app, e.g. "Mega Mall". */
  name: string;
  city: string;
  /** One-line address shown on cards. */
  address: string;
  /** Full postal address shown in the outlet info sheet. */
  addressFull: string;
  distanceKm: number;
  hours: string;
  /** Opening hours per day; the info sheet prints all seven rows. */
  weeklyHours: Record<WeekDay, string>;
  isOpen: boolean;
  /** Time the outlet opens, used by the "Tutup, buka pukul .." banner. */
  opensAt: string;
  /** Whether self-order through the membership app is enabled here. */
  appOrderAvailable: boolean;
  services: ServiceType[];
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: "coffee" | "cup" | "drumstick" | "cake" | "soup" | "gift" | "ticket" | "cookie";
}

export interface ToppingOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  brandId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  isBestSeller?: boolean;
  toppings?: ToppingOption[];
}

export interface CartLine {
  lineId: string;
  menuItem: MenuItem;
  qty: number;
  toppingIds: string[];
  notes?: string;
}

export interface Promo {
  id: string;
  title: string;
  brandId?: string;
  tag: string;
  description: string;
  terms: string[];
  code: string;
  expiresAt: string;
  minSpend?: number;
  discountLabel: string;
}

export type PostVisibility = "publik" | "hanya-saya" | "followers" | "teman";

export interface FeedPost {
  id: string;
  authorName: string;
  authorHandle: string;
  time: string;
  caption: string;
  type: "post" | "checkin";
  outletName?: string;
  brandId?: string;
  likes: number;
  comments: number;
  liked?: boolean;
  bookmarked?: boolean;
  visibility?: PostVisibility;
}

export interface Member {
  id: string;
  name: string;
  /** Without the leading "@". */
  username: string;
  bio?: string;
  verified?: boolean;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export type NotificationCategory =
  | "all"
  | "disukai"
  | "postingan-disukai"
  | "komentar-disukai"
  | "komentar"
  | "mention"
  | "pengikut"
  | "info"
  | "lainnya";

export interface FeedComment {
  id: string;
  postId: string;
  authorName: string;
  time: string;
  text: string;
}

export interface MemberTier {
  id: string;
  name: string;
  minTransactions: number;
  minSpend: number;
  pointRate: string;
  perks: string[];
}

export interface PointsHistoryEntry {
  id: string;
  title: string;
  date: string;
  points: number;
  type: "earn" | "redeem";
}

export type OrderStatus = "dibayar" | "belum-bayar" | "ditahan" | "dibatalkan";

export type OrderChannel = "member-apps" | "kiosk" | "pos" | "qr-dine-in";

export interface OrderLineSnapshot {
  id: string;
  name: string;
  /** e.g. "1x Original @ Rp 18.181" is built from these three. */
  qty: number;
  variant: string;
  unitPrice: number;
}

export interface OrderRecord {
  id: string;
  brandId: string;
  outletId: string;
  outletName: string;
  /** Receipt number printed on the order, e.g. "CW/46/20260922150944513". */
  nota: string;
  /** Short queue code the cashier calls out. */
  orderCode: string;
  transactionId: string;
  createdAt: string;
  status: OrderStatus;
  channel: OrderChannel;
  serviceType: ServiceType;
  paymentMethod: string;
  lines: OrderLineSnapshot[];
  /** Sum of line prices before tax. */
  subtotal: number;
  tax: number;
  rounding: number;
  /** Amount actually paid, after any discount. */
  paid: number;
  note?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  kind: "promo" | "order" | "member" | "system";
}
