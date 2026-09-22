import type {
  Member,
  Brand,
  Outlet,
  MenuCategory,
  MenuItem,
  Promo,
  FeedPost,
  FeedComment,
  MemberTier,
  PointsHistoryEntry,
  OrderHistoryEntry,
  NotificationItem,
} from "./types";

export const brands: Brand[] = [
  {
    id: "nordu",
    name: "Nordu Coffee",
    shortName: "Nordu",
    tagline: "Semangat Tiada Batas",
    category: "coffee",
    gradient: ["#123CA3", "#4066C2"],
  },
  {
    id: "cattu",
    name: "Cattu Coffee",
    shortName: "Cattu",
    tagline: "Kualitas, kenyamanan, karakter",
    category: "coffee",
    gradient: ["#0B2B73", "#123CA3"],
  },
  {
    id: "lesung-pipi",
    name: "Lesung Pipi",
    shortName: "Lesung Pipi",
    tagline: "Pastry & kopi khas Pontianak",
    category: "food",
    gradient: ["#946A20", "#D9A441"],
  },
  {
    id: "ayam-busari",
    name: "Ayam Goreng Busari",
    shortName: "Busari",
    tagline: "Ayam goreng khas & autentik",
    category: "food",
    gradient: ["#C21A40", "#E11D48"],
  },
];

export const outlets: Outlet[] = [
  {
    id: "nordu-megamall",
    brandId: "nordu",
    name: "Nordu Coffee Mega Mall",
    city: "Kota Pontianak",
    address: "Jl. Jenderal Ahmad Yani, Mega Mall",
    distanceKm: 0.96,
    hours: "10:00 - 21:30",
    isOpen: true,
    services: ["dine_in", "takeaway", "delivery"],
  },
  {
    id: "nordu-tanjungsari",
    brandId: "nordu",
    name: "Nordu Coffee Tanjung Sari",
    city: "Kota Pontianak",
    address: "Jl. Tanjung Sari No. 102A",
    distanceKm: 1.18,
    hours: "24 Jam",
    isOpen: true,
    services: ["dine_in", "takeaway", "delivery"],
  },
  {
    id: "cattu-sepakat",
    brandId: "cattu",
    name: "Cattu Coffee Sepakat",
    city: "Kota Pontianak",
    address: "Jl. Sepakat II",
    distanceKm: 1.41,
    hours: "09:00 - 22:00",
    isOpen: true,
    services: ["dine_in", "takeaway"],
  },
  {
    id: "lesung-gajahmada",
    brandId: "lesung-pipi",
    name: "Lesung Pipi Gajah Mada",
    city: "Kota Pontianak",
    address: "Jl. Gajah Mada No. 21",
    distanceKm: 2.05,
    hours: "08:00 - 21:00",
    isOpen: true,
    services: ["dine_in", "takeaway", "delivery"],
  },
  {
    id: "busari-veteran",
    brandId: "ayam-busari",
    name: "Ayam Goreng Busari Veteran",
    city: "Kota Pontianak",
    address: "Jl. Veteran No. 8",
    distanceKm: 2.6,
    hours: "10:00 - 21:00",
    isOpen: false,
    services: ["dine_in", "takeaway"],
  },
];

export const categories: MenuCategory[] = [
  { id: "coffee", name: "Coffee", icon: "coffee" },
  { id: "non-coffee", name: "Non Coffee", icon: "cup" },
  { id: "food", name: "Food", icon: "drumstick" },
  { id: "snack", name: "Snack", icon: "cookie" },
  { id: "pastry", name: "Pastry", icon: "cake" },
  { id: "merch", name: "Merchandise", icon: "gift" },
  { id: "promo", name: "Promo", icon: "ticket" },
];

export const toppingPool = [
  { id: "peanut", name: "Peanut Crumb", price: 3636 },
  { id: "rainbow-jelly", name: "Rainbow Jelly", price: 5454 },
  { id: "grass-jelly", name: "Grass Jelly", price: 4545 },
  { id: "jelly-pearl", name: "Jelly Pearl", price: 4545 },
  { id: "choco-crunch", name: "Choco Crunch", price: 3636 },
  { id: "oreo-crumb", name: "Oreo Crumb", price: 3636 },
  { id: "boba-mango", name: "Popping Boba Mangga", price: 5454 },
  { id: "ice-cream-vanila", name: "Ice Cream Vanila", price: 5454 },
];

export const menuItems: MenuItem[] = [
  {
    id: "coffee-creamy",
    brandId: "nordu",
    categoryId: "coffee",
    name: "Coffee Creamy",
    description: "Espresso + Susu + Creamer lembut",
    price: 18181,
    isBestSeller: true,
    toppings: toppingPool,
  },
  {
    id: "americano-arabika",
    brandId: "nordu",
    categoryId: "coffee",
    name: "Americano Arabika",
    description: "Espresso Arabika + Air",
    price: 21818,
    toppings: toppingPool.slice(0, 4),
  },
  {
    id: "arabika-coffee-milk",
    brandId: "nordu",
    categoryId: "coffee",
    name: "Arabika Coffee Milk",
    description: "Espresso Arabika + Susu",
    price: 30000,
    toppings: toppingPool,
  },
  {
    id: "arenga-coffee",
    brandId: "nordu",
    categoryId: "coffee",
    name: "Arenga Coffee",
    description: "Espresso + Susu + Brown Sugar",
    price: 34545,
    isBestSeller: true,
    toppings: toppingPool,
  },
  {
    id: "caffe-latte",
    brandId: "nordu",
    categoryId: "coffee",
    name: "Caffe Latte",
    description: "Espresso + Susu + Sedikit Foam",
    price: 30000,
    toppings: toppingPool.slice(0, 5),
  },
  {
    id: "matcha-latte",
    brandId: "nordu",
    categoryId: "non-coffee",
    name: "Matcha Latte",
    description: "Bubuk matcha premium + Susu",
    price: 28000,
    toppings: toppingPool.slice(0, 4),
  },
  {
    id: "choco-hazelnut",
    brandId: "nordu",
    categoryId: "non-coffee",
    name: "Choco Hazelnut",
    description: "Coklat premium + Hazelnut",
    price: 27000,
    toppings: toppingPool.slice(0, 4),
  },
  {
    id: "nasi-ayam-geprek",
    brandId: "ayam-busari",
    categoryId: "food",
    name: "Nasi Ayam Geprek Chili Padi",
    description: "Ayam goreng + sambal chili padi + lalapan",
    price: 25000,
    isBestSeller: true,
  },
  {
    id: "nasi-ayam-bakar",
    brandId: "ayam-busari",
    categoryId: "food",
    name: "Nasi Ayam Bakar Madu",
    description: "Ayam bakar bumbu madu + lalapan + sambal",
    price: 27000,
  },
  {
    id: "croissant-butter",
    brandId: "lesung-pipi",
    categoryId: "pastry",
    name: "Croissant Butter",
    description: "Croissant mentega berlapis, renyah di luar",
    price: 22000,
    isBestSeller: true,
  },
  {
    id: "sourdough-classic",
    brandId: "lesung-pipi",
    categoryId: "pastry",
    name: "Sourdough Classic",
    description: "Roti sourdough fermentasi alami",
    price: 32000,
  },
  {
    id: "kentang-goreng",
    brandId: "nordu",
    categoryId: "snack",
    name: "Kentang Goreng Saus Sambal",
    description: "Kentang goreng renyah + saus sambal rumahan",
    price: 18000,
  },
  {
    id: "tumbler-cw",
    brandId: "nordu",
    categoryId: "merch",
    name: "Tumbler Good Will Grow",
    description: "Tumbler stainless 500ml edisi member",
    price: 95000,
  },
];

export const promos: Promo[] = [
  {
    id: "promo-buy1get1",
    title: "Buy 1 Get 1 Arenga Coffee",
    brandId: "nordu",
    tag: "Member Elite ke atas",
    description: "Nikmati Arenga Coffee favoritmu, beli satu gratis satu untuk setiap transaksi dine-in.",
    terms: [
      "Berlaku untuk member tier Elite dan Royale.",
      "Berlaku 1x klaim per hari per akun.",
      "Tidak dapat digabung dengan promo atau kupon lain.",
    ],
    code: "ARENGABOGO",
    expiresAt: "30 Sep 2026",
    discountLabel: "BOGO",
  },
  {
    id: "promo-diskon20",
    title: "Diskon 20% Semua Menu Kopi",
    brandId: "cattu",
    tag: "Semua Member",
    description: "Diskon 20% untuk semua menu kategori Coffee di seluruh outlet Cattu Coffee.",
    terms: [
      "Minimal transaksi Rp 25.000.",
      "Maksimal potongan Rp 15.000.",
      "Berlaku hingga tanggal kedaluwarsa.",
    ],
    code: "CATTU20",
    expiresAt: "05 Okt 2026",
    minSpend: 25000,
    discountLabel: "20%",
  },
  {
    id: "promo-freedelivery",
    title: "Gratis Ongkir Delivery",
    tag: "Semua Outlet",
    description: "Gratis biaya pengiriman untuk pemesanan delivery minimal Rp 50.000.",
    terms: [
      "Berlaku untuk semua brand Good Will Grow.",
      "Maksimal potongan ongkir Rp 10.000.",
      "Berlaku untuk 3x transaksi pertama setiap bulan.",
    ],
    code: "GRATISONGKIR",
    expiresAt: "31 Okt 2026",
    minSpend: 50000,
    discountLabel: "Gratis Ongkir",
  },
  {
    id: "promo-pastry",
    title: "Diskon Rp 10.000 Pastry",
    brandId: "lesung-pipi",
    tag: "Member Baru",
    description: "Potongan langsung Rp 10.000 untuk pembelian pastry apa saja di Lesung Pipi.",
    terms: ["Khusus pengguna baru Good Will Grow.", "Satu kali pemakaian per akun."],
    code: "PASTRY10K",
    expiresAt: "15 Okt 2026",
    discountLabel: "Rp 10rb",
  },
];

export const members: Member[] = [
  {
    id: "m-amalia",
    name: "Amalia",
    username: "amaliaputri",
    bio: "Kopi pagi, cerita sore ☕",
    verified: true,
    postsCount: 12,
    followersCount: 48,
    followingCount: 26,
  },
  {
    id: "m-rizky",
    name: "Rizky Pratama",
    username: "rizkyp",
    bio: "ig: @rizkyp",
    verified: true,
    postsCount: 16,
    followersCount: 5,
    followingCount: 1,
  },
  {
    id: "m-dinda",
    name: "Dinda Ayu",
    username: "dindaa",
    bio: "Pastry hunter 🥐",
    postsCount: 8,
    followersCount: 31,
    followingCount: 40,
  },
  {
    id: "m-fajar",
    name: "Fajar Nugraha",
    username: "fajarn",
    postsCount: 4,
    followersCount: 12,
    followingCount: 19,
  },
  { id: "m-maria", name: "mariawati", username: "mariawati", postsCount: 2, followersCount: 9, followingCount: 14 },
  { id: "m-tokepin", name: "Tokepin", username: "tokepin", postsCount: 6, followersCount: 21, followingCount: 8 },
  { id: "m-nuri", name: "nuri", username: "nuriboik", postsCount: 1, followersCount: 4, followingCount: 11 },
  { id: "m-belajar", name: "belajar", username: "belajar", postsCount: 0, followersCount: 2, followingCount: 5 },
  { id: "m-siska", name: "Siska Miranda", username: "mrddd", postsCount: 9, followersCount: 37, followingCount: 22 },
  { id: "m-vincent", name: "Vincent Valerian", username: "vinvlrn", postsCount: 3, followersCount: 15, followingCount: 17 },
  { id: "m-einar", name: "einar", username: "einarest", postsCount: 5, followersCount: 18, followingCount: 9 },
];

export const feedPosts: FeedPost[] = [
  {
    id: "post-1",
    authorName: "Dinda Ayu",
    authorHandle: "@dindaa",
    time: "5 menit lalu",
    caption: "Geprek chili padi selalu jadi comfort food terbaik ✨",
    type: "checkin",
    outletName: "Ayam Goreng Busari Veteran",
    brandId: "ayam-busari",
    likes: 24,
    comments: 6,
  },
  {
    id: "post-2",
    authorName: "Rizky Pratama",
    authorHandle: "@rizkyp",
    time: "22 menit lalu",
    caption: "Kerja dari Nordu Mega Mall sambil nikmatin Arenga Coffee, wifi kenceng banget!",
    type: "post",
    brandId: "nordu",
    likes: 41,
    comments: 12,
  },
  {
    id: "post-3",
    authorName: "Siska Miranda",
    authorHandle: "@mrddd",
    time: "1 jam lalu",
    caption: "Croissant butter Lesung Pipi masih hangat, wangi mentega-nya juara!",
    type: "checkin",
    outletName: "Lesung Pipi Gajah Mada",
    brandId: "lesung-pipi",
    likes: 58,
    comments: 9,
  },
  {
    id: "post-4",
    authorName: "Fajar Nugraha",
    authorHandle: "@fajarn",
    time: "3 jam lalu",
    caption: "Naik level jadi Elite Member hari ini! Terima kasih Good Will Grow Club 🎉",
    type: "post",
    likes: 76,
    comments: 18,
  },
];

export const feedComments: FeedComment[] = [
  { id: "c1", postId: "post-1", authorName: "Bagus", time: "3 menit lalu", text: "Wah jadi laper, mau order juga ah" },
  { id: "c2", postId: "post-1", authorName: "Sinta", time: "2 menit lalu", text: "Sambalnya nampol banget emang" },
  { id: "c3", postId: "post-2", authorName: "Wulan", time: "10 menit lalu", text: "Sering kerja disana juga, cozy!" },
];

export const memberTiers: MemberTier[] = [
  {
    id: "classic",
    name: "Classic",
    minTransactions: 0,
    minSpend: 0,
    pointRate: "0.5%",
    perks: ["Poin di setiap transaksi", "Akses promo reguler"],
  },
  {
    id: "elite",
    name: "Elite",
    minTransactions: 16,
    minSpend: 1600000,
    pointRate: "1%",
    perks: ["Poin 1% dari nominal transaksi", "Kupon eksklusif berkala", "Benefit dari brand partner"],
  },
  {
    id: "royale",
    name: "Royale",
    minTransactions: 24,
    minSpend: 2400000,
    pointRate: "2%",
    perks: ["Poin 2% dari nominal transaksi", "Kupon premium", "Fasilitas prioritas di semua outlet"],
  },
];

export const pointsHistory: PointsHistoryEntry[] = [
  { id: "ph-1", title: "Reward Pendaftaran", date: "29 Agustus 2026", points: 1000, type: "earn" },
  { id: "ph-2", title: "Transaksi Nordu Coffee Mega Mall", date: "05 September 2026", points: 90, type: "earn" },
  { id: "ph-3", title: "Tukar Poin - Diskon Rp 10.000", date: "10 September 2026", points: -500, type: "redeem" },
  { id: "ph-4", title: "Transaksi Cattu Coffee Sepakat", date: "18 September 2026", points: 60, type: "earn" },
];

export const orderHistory: OrderHistoryEntry[] = [
  {
    id: "oh-1",
    brandId: "nordu",
    outletName: "Nordu Coffee Mega Mall",
    date: "20 Sep 2026, 15:07",
    total: 20000,
    items: "1x Coffee Creamy",
    status: "completed",
  },
  {
    id: "oh-2",
    brandId: "ayam-busari",
    outletName: "Ayam Goreng Busari Veteran",
    date: "18 Sep 2026, 12:30",
    total: 25000,
    items: "1x Nasi Ayam Geprek Chili Padi",
    status: "completed",
  },
  {
    id: "oh-3",
    brandId: "lesung-pipi",
    outletName: "Lesung Pipi Gajah Mada",
    date: "15 Sep 2026, 09:12",
    total: 44000,
    items: "2x Croissant Butter",
    status: "cancelled",
  },
];

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Poin kamu bertambah!",
    body: "Kamu mendapatkan 90 poin dari transaksi di Nordu Coffee Mega Mall.",
    time: "2 jam lalu",
    read: false,
    kind: "member",
  },
  {
    id: "n2",
    title: "Promo baru untuk kamu",
    body: "Buy 1 Get 1 Arenga Coffee khusus member Elite ke atas.",
    time: "5 jam lalu",
    read: false,
    kind: "promo",
  },
  {
    id: "n3",
    title: "Pesananmu sudah selesai",
    body: "Pesanan di Ayam Goreng Busari Veteran telah selesai diproses.",
    time: "1 hari lalu",
    read: true,
    kind: "order",
  },
];

export function getBrand(id?: string) {
  return brands.find((b) => b.id === id);
}

export function getOutlet(id: string) {
  return outlets.find((o) => o.id === id);
}

export function getMenuItem(id: string) {
  return menuItems.find((m) => m.id === id);
}

export function getPromo(id: string) {
  return promos.find((p) => p.id === id);
}

export function getPost(id: string) {
  return feedPosts.find((p) => p.id === id);
}
