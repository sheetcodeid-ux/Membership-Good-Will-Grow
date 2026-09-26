import type { CategoryIconName } from "../components/CategoryIcons";

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
  icon: CategoryIconName;
}

/** One choice inside an option group. */
export interface MenuOption {
  id: string;
  name: string;
  price: number;
  /** 1 renders a toggle; anything higher renders a stepper. */
  maxQty?: number;
}

export interface MenuOptionGroup {
  id: string;
  name: string;
  /** "single" picks exactly one option; "multi" keeps a quantity per option. */
  selection: "single" | "multi";
  /** Yellow badge under the heading, e.g. "Bisa pilih lebih dari 1 item". */
  hint?: string;
  options: MenuOption[];
}

export interface MenuItem {
  id: string;
  brandId: string;
  categoryId: string;
  name: string;
  description: string;
  /** Price shown in the menu list; equals the first variant's price. */
  price: number;
  isBestSeller?: boolean;
  optionGroups: MenuOptionGroup[];
}

export interface CartLine {
  lineId: string;
  menuItem: MenuItem;
  qty: number;
  /** Option id -> chosen quantity. Single-select groups store exactly 1. */
  selections: Record<string, number>;
  note?: string;
}

export interface Coupon {
  id: string;
  brandId?: string;
  title: string;
  /** Days before the coupon expires, as the ticket card prints it. */
  daysLeft: number;
  used: boolean;
  /**
   * The coupon's background artwork, once designed. Until then the ticket
   * stub stays white with a coupon mark; the brand logo sits on top either way.
   */
  image?: string;
  /** What the sheet shows when the coupon is opened. */
  detail?: CouponDetail;
}

export interface CouponDetail {
  /** The benefit, one line each, e.g. "Diskon Rp 9.500 per transaksi". */
  benefits: string[];
  claimTerms: string[];
  /**
   * Purchase conditions: each inner list is one way to qualify, and the
   * member needs to meet any one of them ("ATAU" between groups).
   */
  requirements: string[][];
  /** Heading over each requirement group; "Beli item berikut" when unset. */
  requirementsTitle?: string;
  note?: string;
  outletIds: string[];
}

/** A coupon the member can buy with points, from "Kupon tersedia". */
export interface CouponOffer {
  id: string;
  brandId?: string;
  title: string;
  pricePoints: number;
  /** How long the coupon lasts once bought. */
  validDays: number;
  detail: CouponDetail;
}

/** One line of Riwayat Pembelian Kupon. */
export interface CouponPurchase {
  id: string;
  offerId: string;
  couponId: string;
  brandId?: string;
  title: string;
  pricePoints: number;
  date: string;
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
  /**
   * The outlet this check-in points at. The display name is the brand and
   * the branch run together ("Ayam Goreng Busari Veteran") while the outlet
   * record holds them apart ("Ayam Goreng Busari" / "Veteran"), so the name
   * cannot be matched back to a record and the id has to be stored.
   */
  outletId?: string;
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
  likes: number;
  liked?: boolean;
}

export interface MemberTier {
  id: string;
  name: string;
  minTransactions: number;
  minSpend: number;
  pointRate: string;
  /** Line printed under the tier name on the card. */
  tagline: string;
  /** Region the card artwork celebrates, e.g. "[Pulau Kalimantan]". */
  island: string;
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

/**
 * What a notification is about.
 *
 * The first four are the app talking to the member; the rest are other
 * members talking to them. The filter chips on the screen map onto these
 * one for one — they used to list seven categories that no notification
 * could ever carry, so every one of them opened an empty screen.
 */
export type NotificationKind =
  | "promo"
  | "order"
  | "member"
  | "system"
  | "like"
  | "post-like"
  | "comment-like"
  | "comment"
  | "mention"
  | "follow";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  kind: NotificationKind;
  /** Who triggered it, for the social kinds. Drives the avatar. */
  actorName?: string;
  /** Where tapping it goes. */
  href?: string;
}
