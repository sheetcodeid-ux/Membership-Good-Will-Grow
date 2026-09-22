export type ServiceType = "dine_in" | "takeaway" | "delivery";

export interface Brand {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  category: "coffee" | "food";
  gradient: [string, string];
}

export interface Outlet {
  id: string;
  brandId: string;
  name: string;
  city: string;
  address: string;
  distanceKm: number;
  hours: string;
  isOpen: boolean;
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
}

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

export interface OrderHistoryEntry {
  id: string;
  brandId: string;
  outletName: string;
  date: string;
  total: number;
  items: string;
  status: "completed" | "processing" | "cancelled";
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  kind: "promo" | "order" | "member" | "system";
}
