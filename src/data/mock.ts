import type {
  Member,
  Brand,
  Outlet,
  WeekDay,
  MenuCategory,
  MenuItem,
  MenuOptionGroup,
  Coupon,
  CouponOffer,
  Promo,
  FeedPost,
  FeedComment,
  MemberTier,
  PointsHistoryEntry,
  OrderRecord,
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

/** Every outlet keeps the same hours all week in the mock data. */
function sameHours(value: string): Record<WeekDay, string> {
  return {
    senin: value,
    selasa: value,
    rabu: value,
    kamis: value,
    jumat: value,
    sabtu: value,
    minggu: value,
  };
}

export const outlets: Outlet[] = [
  {
    id: "nordu-megamall",
    brandId: "nordu",
    name: "Mega Mall",
    city: "Kota Pontianak",
    address: "JL. JENDERAL AHMAD YANI NO 4",
    addressFull:
      "JL. JENDERAL AHMAD YANI NO 4 PARIT TOKAYA KEC. PONTIANAK SELATAN, KOTA PONTIANAK KALIMANTAN BARAT 78113",
    distanceKm: 0.96396,
    hours: "10:00 - 21:30",
    weeklyHours: sameHours("10:00 - 21:30"),
    isOpen: true,
    opensAt: "10:00",
    appOrderAvailable: true,
    services: ["dine_in", "takeaway", "delivery"],
  },
  {
    id: "nordu-tanjungsari",
    brandId: "nordu",
    name: "Tanjung Sari",
    city: "Kota Pontianak",
    address: "JL. TANJUNG SARI NO. 102A",
    addressFull: "JL. TANJUNG SARI NO. 102A, KEC. PONTIANAK SELATAN, KOTA PONTIANAK 78121",
    distanceKm: 1.18,
    hours: "24 Jam",
    weeklyHours: sameHours("24 Jam"),
    isOpen: true,
    opensAt: "00:00",
    appOrderAvailable: true,
    services: ["dine_in", "takeaway", "delivery"],
  },
  {
    id: "nordu-booth-event",
    brandId: "nordu",
    name: "Booth Event Protokol",
    city: "Kota Pontianak",
    address: "Jl. MT. Haryono Komp. GOR",
    addressFull: "JL. MT. HARYONO KOMP. GOR PANGSUMA, KOTA PONTIANAK 78122",
    distanceKm: 1.21,
    hours: "24 Jam",
    weeklyHours: sameHours("24 Jam"),
    isOpen: true,
    opensAt: "00:00",
    appOrderAvailable: false,
    services: ["takeaway"],
  },
  {
    id: "nordu-merdeka",
    brandId: "nordu",
    name: "Merdeka",
    city: "Kota Pontianak",
    address: "Jl. Merdeka",
    addressFull: "JL. MERDEKA NO. 12, KEC. PONTIANAK KOTA, KOTA PONTIANAK 78117",
    distanceKm: 2.34,
    hours: "09:00 - 22:00",
    weeklyHours: sameHours("09:00 - 22:00"),
    isOpen: true,
    opensAt: "09:00",
    appOrderAvailable: true,
    services: ["dine_in", "takeaway", "delivery"],
  },
  {
    id: "cattu-sepakat",
    brandId: "cattu",
    name: "Sepakat",
    city: "Kota Pontianak",
    address: "JL. SEPAKAT II",
    addressFull: "JL. SEPAKAT II NO. 5, BANSIR LAUT, KEC. PONTIANAK TENGGARA 78124",
    distanceKm: 1.41,
    hours: "09:00 - 22:00",
    weeklyHours: sameHours("09:00 - 22:00"),
    isOpen: true,
    opensAt: "09:00",
    appOrderAvailable: true,
    services: ["dine_in", "takeaway"],
  },
  {
    id: "cattu-ks-tubun",
    brandId: "cattu",
    name: "Ks Tubun",
    city: "Kota Pontianak",
    address: "Jl. Karel Satsuit Tubun No.2e",
    addressFull: "JL. KAREL SATSUIT TUBUN NO. 2E, AKCAYA, KEC. PONTIANAK SELATAN 78121",
    distanceKm: 1.86,
    hours: "08:00 - 23:00",
    weeklyHours: sameHours("08:00 - 23:00"),
    isOpen: true,
    opensAt: "08:00",
    appOrderAvailable: true,
    services: ["dine_in", "takeaway", "delivery"],
  },
  {
    id: "lesung-gajahmada",
    brandId: "lesung-pipi",
    name: "Gajah Mada",
    city: "Kota Pontianak",
    address: "Jl. Gajah Mada No. 21",
    addressFull: "JL. GAJAH MADA NO. 21, DARAT SEKIP, KEC. PONTIANAK KOTA 78117",
    distanceKm: 2.05,
    hours: "08:00 - 21:00",
    weeklyHours: sameHours("08:00 - 21:00"),
    isOpen: true,
    opensAt: "08:00",
    appOrderAvailable: true,
    services: ["dine_in", "takeaway", "delivery"],
  },
  {
    id: "lesung-hijas",
    brandId: "lesung-pipi",
    name: "Hijas",
    city: "Kota Pontianak",
    address: "Jl. Hijas No. 38-40",
    addressFull: "JL. HIJAS NO. 38-40, BENUA MELAYU DARAT, KEC. PONTIANAK SELATAN 78113",
    distanceKm: 2.41,
    hours: "08:00 - 21:00",
    weeklyHours: sameHours("08:00 - 21:00"),
    isOpen: true,
    opensAt: "08:00",
    appOrderAvailable: true,
    services: ["dine_in", "takeaway"],
  },
  {
    id: "busari-veteran",
    brandId: "ayam-busari",
    name: "Veteran",
    city: "Kota Pontianak",
    address: "Jl. Veteran No. 8",
    addressFull: "JL. VETERAN NO. 8, BENUA MELAYU LAUT, KEC. PONTIANAK SELATAN 78113",
    distanceKm: 2.6,
    hours: "10:00 - 21:00",
    weeklyHours: sameHours("10:00 - 21:00"),
    isOpen: false,
    opensAt: "10:00",
    appOrderAvailable: true,
    services: ["dine_in", "takeaway"],
  },
  {
    id: "busari-pancasila",
    brandId: "ayam-busari",
    name: "Pancasila",
    city: "Kota Pontianak",
    address: "JL. GUSTI HAMZAH NO. 6F",
    addressFull: "JL. GUSTI HAMZAH NO. 6F, SUNGAI BANGKONG, KEC. PONTIANAK KOTA 78116",
    distanceKm: 3.12,
    hours: "10:00 - 21:00",
    weeklyHours: sameHours("10:00 - 21:00"),
    isOpen: true,
    opensAt: "10:00",
    appOrderAvailable: true,
    services: ["dine_in", "takeaway", "delivery"],
  },
];

export const categories: MenuCategory[] = [
  { id: "coffee", name: "Coffee", icon: "coffee" },
  { id: "non-coffee", name: "Non Coffee", icon: "non-coffee" },
  { id: "dimsum", name: "Dimsum", icon: "dimsum" },
  { id: "snack", name: "Snack", icon: "snack" },
  { id: "food", name: "Food", icon: "food" },
  { id: "merch", name: "Merchandise", icon: "merch" },
  { id: "promo", name: "Promo", icon: "promo" },
  { id: "kue", name: "Kue", icon: "cake" },
];

/* Shared option groups. Options with maxQty 1 render as a toggle in the
   product sheet; the rest render as a stepper. */

const addedSyrup: MenuOptionGroup = {
  id: "syrup",
  name: "Added Syrup",
  selection: "multi",
  options: [
    { id: "syrup-vanilla", name: "Vanilla Syrup", price: 2727 },
    { id: "syrup-caramel", name: "Caramel Syrup", price: 2727 },
    { id: "syrup-coconut", name: "Coconut Syrup", price: 3000 },
    { id: "syrup-hazelnut", name: "Hazelnut Syrup", price: 2727 },
    { id: "syrup-brown-sugar", name: "Brown Sugar Syrup", price: 3000 },
  ],
};

const toppingGroup: MenuOptionGroup = {
  id: "topping",
  name: "Topping",
  selection: "multi",
  hint: "Bisa pilih lebih dari 1 item",
  options: [
    { id: "top-peanut", name: "Peanut Crumb", price: 3636 },
    { id: "top-rainbow-jelly", name: "Rainbow Jelly", price: 5454 },
    { id: "top-grass-jelly", name: "Grass Jelly", price: 4545 },
    { id: "top-jelly-pearl", name: "Jelly Pearl", price: 4545 },
    { id: "top-choco-crunch", name: "Choco Crunch", price: 3636 },
    { id: "top-redvelvet", name: "Redvelvet Crumb", price: 3636 },
    { id: "top-oreo", name: "Oreo Crumb", price: 3636 },
    { id: "top-boba-mangga", name: "Popping Boba Mangga", price: 5454 },
    { id: "top-ice-cream", name: "Ice Cream Vanila", price: 5454 },
    { id: "top-seaweed", name: "Seawed Jelly", price: 5454, maxQty: 1 },
    { id: "top-choco-chip", name: "Choco Chip", price: 3636, maxQty: 1 },
  ],
};

const extraEspresso: MenuOptionGroup = {
  id: "espresso",
  name: "Extra Espresso",
  selection: "multi",
  hint: "Bisa pilih lebih dari 1 item",
  options: [
    { id: "esp-arabika", name: "Extra Espresso Arabika", price: 4545 },
    { id: "esp-robusta", name: "Extra Espresso Robusta", price: 3000 },
  ],
};

function sweetness(itemName: string): MenuOptionGroup {
  return {
    id: "sweetness",
    name: `Tingkat Manis ${itemName}`,
    selection: "single",
    options: [
      { id: "sweet-normal", name: "Normal", price: 0 },
      { id: "sweet-kurang", name: "Kurang Manis", price: 0 },
      { id: "sweet-no", name: "No Sugar", price: 0 },
      { id: "sweet-extra", name: "Extra Manis", price: 0 },
    ],
  };
}

/** Variant group: its selected option carries the item's base price. */
function variant(price: number, name = "Original"): MenuOptionGroup {
  return {
    id: "varian",
    name: "Varian",
    selection: "single",
    options: [{ id: "var-original", name, price }],
  };
}

function drinkOptions(price: number, itemName: string): MenuOptionGroup[] {
  return [variant(price), addedSyrup, toppingGroup, extraEspresso, sweetness(itemName)];
}

function plainOptions(price: number): MenuOptionGroup[] {
  return [variant(price)];
}

export const menuItems: MenuItem[] = [
  {
    id: "coffee-creamy",
    brandId: "nordu",
    categoryId: "coffee",
    name: "Coffee Creamy",
    description: "Espresso + Susu + Creamer lembut",
    price: 15454,
    isBestSeller: true,
    optionGroups: drinkOptions(15454, "Coffee Creamy"),
  },
  {
    id: "americano-arabika",
    brandId: "nordu",
    categoryId: "coffee",
    name: "Americano Arabika",
    description: "Espresso Arabika + Air",
    price: 21818,
    optionGroups: drinkOptions(21818, "Americano Arabika"),
  },
  {
    id: "arabika-coffee-milk",
    brandId: "nordu",
    categoryId: "coffee",
    name: "Arabika Coffee Milk",
    description: "Espresso Arabika + Susu",
    price: 30000,
    optionGroups: drinkOptions(30000, "Arabika Coffee Milk"),
  },
  {
    id: "arenga-coffee",
    brandId: "nordu",
    categoryId: "coffee",
    name: "Arenga Coffee",
    description: "Espresso + Susu + Brown Sugar",
    price: 34545,
    isBestSeller: true,
    optionGroups: drinkOptions(34545, "Arenga Coffee"),
  },
  {
    id: "caffe-latte",
    brandId: "nordu",
    categoryId: "coffee",
    name: "Caffe Latte",
    description: "Espresso + Susu + Sedikit Foam",
    price: 30000,
    optionGroups: drinkOptions(30000, "Caffe Latte"),
  },
  {
    id: "matcha-latte",
    brandId: "nordu",
    categoryId: "non-coffee",
    name: "Matcha Latte",
    description: "Bubuk matcha premium + Susu",
    price: 28000,
    optionGroups: [variant(28000), addedSyrup, toppingGroup, sweetness("Matcha Latte")],
  },
  {
    id: "choco-hazelnut",
    brandId: "nordu",
    categoryId: "non-coffee",
    name: "Choco Hazelnut",
    description: "Coklat premium + Hazelnut",
    price: 27000,
    optionGroups: [variant(27000), addedSyrup, toppingGroup, sweetness("Choco Hazelnut")],
  },
  {
    id: "dimsum-ayam",
    brandId: "lesung-pipi",
    categoryId: "dimsum",
    name: "Dimsum Ayam Kukus",
    description: "4 pcs siomay ayam + saus sambal",
    price: 20000,
    isBestSeller: true,
    optionGroups: plainOptions(20000),
  },
  {
    id: "dimsum-udang",
    brandId: "lesung-pipi",
    categoryId: "dimsum",
    name: "Dimsum Udang",
    description: "4 pcs siomay udang + saus",
    price: 24000,
    optionGroups: plainOptions(24000),
  },
  {
    id: "kue-lapis",
    brandId: "lesung-pipi",
    categoryId: "kue",
    name: "Kue Lapis Legit",
    description: "Lapis legit klasik, potong tebal",
    price: 28000,
    optionGroups: plainOptions(28000),
  },
  {
    id: "nasi-ayam-geprek",
    brandId: "ayam-busari",
    categoryId: "food",
    name: "Nasi Ayam Geprek Chili Padi",
    description: "Ayam goreng + sambal chili padi + lalapan",
    price: 25000,
    isBestSeller: true,
    optionGroups: [
      variant(25000),
      {
        id: "level",
        name: "Level Pedas",
        selection: "single",
        options: [
          { id: "level-1", name: "Level 1", price: 0 },
          { id: "level-3", name: "Level 3", price: 0 },
          { id: "level-5", name: "Level 5", price: 0 },
        ],
      },
    ],
  },
  {
    id: "nasi-ayam-bakar",
    brandId: "ayam-busari",
    categoryId: "food",
    name: "Nasi Ayam Bakar Madu",
    description: "Ayam bakar bumbu madu + lalapan + sambal",
    price: 27000,
    optionGroups: plainOptions(27000),
  },
  {
    id: "kentang-goreng",
    brandId: "nordu",
    categoryId: "snack",
    name: "Kentang Goreng Saus Sambal",
    description: "Kentang goreng renyah + saus sambal rumahan",
    price: 18000,
    optionGroups: plainOptions(18000),
  },
  {
    id: "tumbler-gwg",
    brandId: "nordu",
    categoryId: "merch",
    name: "Tumbler Good Will Grow",
    description: "Tumbler stainless 500ml edisi member",
    price: 95000,
    optionGroups: plainOptions(95000),
  },
];

const oneDayClaim = [
  "Tidak ada batasan tanggal atau waktu untuk klaim kupon.",
  "Kupon berlaku 1 hari sejak diklaim.",
];

export const coupons: Coupon[] = [
  {
    id: "cp-1",
    brandId: "ayam-busari",
    title: "Hot Hour Deals - Pontianak",
    daysLeft: 1,
    used: false,
    rule: { items: ["nasi-ayam-geprek", "nasi-ayam-bakar"], reward: { kind: "amount", value: 9500 } },
    detail: {
      benefits: ["Diskon Rp 9.500 per transaksi"],
      claimTerms: oneDayClaim,
      requirements: [
        ["Nasi Ayam Geprek Chili Padi, varian apa pun, 1 item"],
        ["Nasi Ayam Bakar Madu, varian apa pun, 1 item"],
      ],
      note: "Tidak berlaku kelipatan.",
      outletIds: ["busari-veteran", "busari-pancasila"],
    },
  },
  {
    id: "cp-2",
    brandId: "cattu",
    title: "VIP Member Reward - Cattu Coffee",
    daysLeft: 1,
    used: false,
    rule: { minSpend: 50000, reward: { kind: "free" } },
    detail: {
      benefits: ["Gratis 1 minuman ukuran reguler"],
      claimTerms: oneDayClaim,
      requirements: [["Transaksi minimal Rp 50.000 di Cattu Coffee"]],
      note: "Khusus member tier VIP ke atas. Satu kupon untuk satu transaksi.",
      outletIds: ["cattu-sepakat", "cattu-ks-tubun"],
    },
  },
  {
    id: "cp-3",
    brandId: "nordu",
    title: "Sale 40%",
    daysLeft: 3,
    used: false,
    rule: {
      items: ["coffee-creamy", "caffe-latte", "matcha-latte"],
      reward: { kind: "percent", value: 40, max: 12000 },
    },
    detail: {
      benefits: ["Diskon 40% untuk satu minuman", "Maksimal potongan Rp 12.000"],
      claimTerms: [
        "Tidak ada batasan tanggal atau waktu untuk klaim kupon.",
        "Kupon berlaku 3 hari sejak diklaim.",
      ],
      requirements: [
        ["Coffee Creamy, varian apa pun, 1 item"],
        ["Caffe Latte, varian apa pun, 1 item"],
        ["Matcha Latte, varian apa pun, 1 item"],
      ],
      note: "Tidak berlaku kelipatan dan tidak dapat digabung promo lain.",
      outletIds: ["nordu-megamall", "nordu-tanjungsari", "nordu-merdeka"],
    },
  },
  {
    id: "cp-4",
    brandId: "nordu",
    title: "Arenga Coffee Rp 19.000",
    daysLeft: 3,
    used: false,
    rule: { items: ["arenga-coffee"], reward: { kind: "price", value: 19000 } },
    detail: {
      benefits: ["Harga spesial Arenga Coffee jadi Rp 19.000"],
      claimTerms: [
        "Tidak ada batasan tanggal atau waktu untuk klaim kupon.",
        "Kupon berlaku 3 hari sejak diklaim.",
      ],
      requirements: [["Arenga Coffee, varian apa pun, 1 item"]],
      note: "Berlaku untuk 1 cup per transaksi.",
      outletIds: ["nordu-megamall", "nordu-tanjungsari", "nordu-merdeka"],
    },
  },
  {
    id: "cp-5",
    brandId: "lesung-pipi",
    title: "Gratis 1 Kue Lapis",
    daysLeft: 5,
    used: false,
    rule: {
      items: ["dimsum-ayam", "dimsum-udang"],
      reward: { kind: "free", itemId: "kue-lapis" },
    },
    detail: {
      benefits: ["Gratis 1 potong Kue Lapis Legit"],
      claimTerms: [
        "Tidak ada batasan tanggal atau waktu untuk klaim kupon.",
        "Kupon berlaku 5 hari sejak diklaim.",
      ],
      requirements: [
        ["Dimsum Ayam Kukus, varian apa pun, 1 item"],
        ["Dimsum Udang, varian apa pun, 1 item"],
      ],
      note: "Selama persediaan masih ada.",
      outletIds: ["lesung-gajahmada", "lesung-hijas"],
    },
  },
];

/** Coupons on sale for points in "Kupon tersedia". */
export const couponOffers: CouponOffer[] = [
  {
    id: "off-kopi-25",
    brandId: "nordu",
    title: "Diskon 25% Semua Kopi",
    pricePoints: 300,
    validDays: 7,
    rule: {
      items: ["coffee-creamy", "caffe-latte", "americano-arabika"],
      reward: { kind: "percent", value: 25, max: 10000 },
    },
    detail: {
      benefits: ["Diskon 25% untuk satu minuman kopi", "Maksimal potongan Rp 10.000"],
      claimTerms: [
        "Kupon langsung masuk ke Kupon Saya setelah ditukar.",
        "Kupon berlaku 7 hari sejak ditukar.",
      ],
      requirements: [
        ["Coffee Creamy, varian apa pun, 1 item"],
        ["Caffe Latte, varian apa pun, 1 item"],
        ["Americano Arabika, varian apa pun, 1 item"],
      ],
      note: "Tidak berlaku kelipatan.",
      outletIds: ["nordu-megamall", "nordu-tanjungsari", "nordu-merdeka"],
    },
  },
  {
    id: "off-dimsum",
    brandId: "lesung-pipi",
    title: "Gratis Dimsum Udang",
    pricePoints: 450,
    validDays: 5,
    rule: { minSpend: 30000, reward: { kind: "free", itemId: "dimsum-udang" } },
    detail: {
      benefits: ["Gratis 1 porsi Dimsum Udang"],
      claimTerms: [
        "Kupon langsung masuk ke Kupon Saya setelah ditukar.",
        "Kupon berlaku 5 hari sejak ditukar.",
      ],
      requirements: [["Transaksi minimal Rp 30.000 di Lesung Pipi"]],
      note: "Selama persediaan masih ada.",
      outletIds: ["lesung-gajahmada", "lesung-hijas"],
    },
  },
  {
    id: "off-busari-15",
    brandId: "ayam-busari",
    title: "Potongan Rp 15.000",
    pricePoints: 600,
    validDays: 3,
    rule: {
      items: ["nasi-ayam-geprek", "nasi-ayam-bakar"],
      minQty: 2,
      reward: { kind: "amount", value: 15000 },
    },
    detail: {
      benefits: ["Potongan Rp 15.000 per transaksi"],
      claimTerms: [
        "Kupon langsung masuk ke Kupon Saya setelah ditukar.",
        "Kupon berlaku 3 hari sejak ditukar.",
      ],
      requirements: [
        ["Nasi Ayam Geprek Chili Padi, varian apa pun, 2 item"],
        ["Nasi Ayam Bakar Madu, varian apa pun, 2 item"],
      ],
      outletIds: ["busari-veteran", "busari-pancasila"],
    },
  },
  {
    id: "off-cattu-bogo",
    brandId: "cattu",
    title: "Beli 1 Gratis 1 Kopi Susu",
    pricePoints: 1200,
    validDays: 7,
    rule: { items: ["arabika-coffee-milk"], minQty: 2, reward: { kind: "free" } },
    detail: {
      benefits: ["Beli 1 kopi susu, gratis 1 kopi susu"],
      claimTerms: [
        "Kupon langsung masuk ke Kupon Saya setelah ditukar.",
        "Kupon berlaku 7 hari sejak ditukar.",
      ],
      requirements: [["Arabika Coffee Milk, varian apa pun, 2 item"]],
      note: "Minuman gratis adalah yang harganya sama atau lebih rendah.",
      outletIds: ["cattu-sepakat", "cattu-ks-tubun"],
    },
  },
];

/**
 * Voucher codes the app accepts in Voucher Saya, keyed by code. Each
 * claim turns into a voucher shaped like a coupon.
 */
export const voucherCodes: Record<string, Omit<Coupon, "id" | "used">> = {
  GWGBARU: {
    title: "Voucher Member Baru Rp 10.000",
    daysLeft: 14,
    rule: { minSpend: 40000, reward: { kind: "amount", value: 10000 } },
    detail: {
      benefits: ["Potongan Rp 10.000 untuk transaksi pertama"],
      claimTerms: [
        "Satu kode hanya bisa diklaim sekali per akun.",
        "Voucher berlaku 14 hari sejak diklaim.",
      ],
      requirements: [
        ["Transaksi minimal Rp 40.000 di semua brand Good Will Grow"],
      ],
      requirementsTitle: "Minimal transaksi",
      note: "Tidak dapat digabung dengan kupon lain.",
      outletIds: [
        "nordu-megamall",
        "cattu-sepakat",
        "lesung-gajahmada",
        "busari-veteran",
      ],
    },
  },
  NORDUHEMAT: {
    brandId: "nordu",
    title: "Voucher Nordu Hemat 20%",
    daysLeft: 7,
    rule: {
      items: [
        "coffee-creamy",
        "americano-arabika",
        "arabika-coffee-milk",
        "arenga-coffee",
        "caffe-latte",
        "matcha-latte",
        "choco-hazelnut",
      ],
      reward: { kind: "percent", value: 20, max: 8000 },
    },
    detail: {
      benefits: ["Diskon 20% semua minuman", "Maksimal potongan Rp 8.000"],
      claimTerms: [
        "Satu kode hanya bisa diklaim sekali per akun.",
        "Voucher berlaku 7 hari sejak diklaim.",
      ],
      requirements: [["Minuman apa pun di Nordu Coffee, 1 item"]],
      outletIds: ["nordu-megamall", "nordu-tanjungsari", "nordu-merdeka"],
    },
  },
};

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
    outletId: "busari-veteran",
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
    outletId: "lesung-gajahmada",
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
  { id: "c1", postId: "post-1", authorName: "Bagus", time: "3 menit lalu", text: "Wah jadi laper, mau order juga ah", likes: 4 },
  { id: "c2", postId: "post-1", authorName: "Sinta", time: "2 menit lalu", text: "Sambalnya nampol banget emang", likes: 2, liked: true },
  { id: "c3", postId: "post-2", authorName: "Wulan", time: "10 menit lalu", text: "Sering kerja disana juga, cozy!", likes: 1 },
];

export const memberTiers: MemberTier[] = [
  {
    id: "classic",
    name: "Classic",
    minTransactions: 0,
    minSpend: 0,
    pointRate: "0,5%",
    tagline: "Awal perjalanan bersama Good Will Grow",
    island: "[Pulau Kalimantan]",
    perks: [
      "Setiap transaksi mendapatkan poin 0,5% dari nominal transaksi (setelah potongan kupon, pajak, dan potongan poin)",
    ],
  },
  {
    id: "signature",
    name: "Signature",
    minTransactions: 8,
    minSpend: 800000,
    pointRate: "0,5%",
    tagline: "Terus Bertumbuh",
    island: "[Pulau Jawa]",
    perks: [
      "Setiap transaksi mendapatkan poin 0,5% dari nominal transaksi (setelah potongan kupon, pajak, dan potongan poin)",
      "Mendapatkan kupon-kupon menarik untuk digunakan ketika bertransaksi",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    minTransactions: 16,
    minSpend: 1600000,
    pointRate: "1%",
    tagline: "Terhubung Lebih Luas",
    island: "[Pulau Sumatera]",
    perks: [
      "Setiap transaksi mendapatkan poin 1% dari nominal transaksi (setelah potongan kupon, pajak, dan potongan poin)",
      "Mendapatkan kupon-kupon menarik untuk digunakan ketika bertransaksi",
      "Mendapatkan benefit dari partner Good Will Grow",
    ],
  },
  {
    id: "royale",
    name: "Royale",
    minTransactions: 24,
    minSpend: 2400000,
    pointRate: "2%",
    tagline: "Indonesia dalam satu koneksi",
    island: "[Indonesia]",
    perks: [
      "Setiap transaksi mendapatkan poin 2% dari nominal transaksi (setelah potongan kupon, pajak, dan potongan poin)",
      "Mendapatkan kupon-kupon menarik untuk digunakan ketika bertransaksi",
      "Mendapatkan benefit dari partner Good Will Grow",
      "Dapat menggunakan fasilitas premium dari Good Will Grow",
    ],
  },
];

/** Adds up to the member's 1.000-point balance: 1.000 + 90 − 150 + 60. */
export const pointsHistory: PointsHistoryEntry[] = [
  { id: "ph-1", title: "Reward Pendaftaran", date: "29 Agustus 2026", points: 1000, type: "earn" },
  { id: "ph-2", title: "Transaksi Nordu Coffee Mega Mall", date: "05 September 2026", points: 90, type: "earn" },
  { id: "ph-3", title: "Tukar Poin - Diskon Rp 3.000", date: "10 September 2026", points: -150, type: "redeem" },
  { id: "ph-4", title: "Transaksi Cattu Coffee Sepakat", date: "18 September 2026", points: 60, type: "earn" },
];

export const orders: OrderRecord[] = [
  {
    id: "ord-0127",
    brandId: "nordu",
    outletId: "nordu-megamall",
    outletName: "Nordu Coffee Mega Mall",
    nota: "NRD/46/20260922150944513",
    orderCode: "0127",
    transactionId: "01a0c829-bb3f-7878-9413-2b130affd856",
    createdAt: "22 Sep 2026, 15:09",
    status: "belum-bayar",
    channel: "member-apps",
    serviceType: "dine_in",
    paymentMethod: "QRIS",
    lines: [
      { id: "l-1", name: "Coffee Creamy", qty: 1, variant: "Original", unitPrice: 18181 },
    ],
    subtotal: 18181,
    tax: 1818,
    rounding: 1,
    paid: 20000,
    note: "Ambil Sendiri",
  },
  {
    id: "ord-0126",
    brandId: "ayam-busari",
    outletId: "busari-veteran",
    outletName: "Ayam Goreng Busari Veteran",
    nota: "BSR/12/20260918123011204",
    orderCode: "0126",
    transactionId: "01a0c701-4ac2-4f19-9d55-71a4f0be22c1",
    createdAt: "18 Sep 2026, 12:30",
    status: "dibayar",
    channel: "member-apps",
    serviceType: "takeaway",
    paymentMethod: "QRIS",
    lines: [
      {
        id: "l-2",
        name: "Nasi Ayam Geprek Chili Padi",
        qty: 1,
        variant: "Level 3",
        unitPrice: 25000,
      },
    ],
    subtotal: 25000,
    tax: 2500,
    rounding: 0,
    paid: 27500,
    note: "Pedas sedang",
  },
  {
    id: "ord-0125",
    brandId: "lesung-pipi",
    outletId: "lesung-gajahmada",
    outletName: "Lesung Pipi Gajah Mada",
    nota: "LSP/07/20260915091233871",
    orderCode: "0125",
    transactionId: "01a0c5f0-9d88-4b02-84aa-c6f01b9de447",
    createdAt: "15 Sep 2026, 09:12",
    status: "dibatalkan",
    channel: "qr-dine-in",
    serviceType: "dine_in",
    paymentMethod: "QRIS",
    lines: [
      { id: "l-3", name: "Croissant Butter", qty: 2, variant: "Original", unitPrice: 22000 },
    ],
    subtotal: 44000,
    tax: 4400,
    rounding: 0,
    paid: 48400,
  },
  {
    id: "ord-0124",
    brandId: "cattu",
    outletId: "cattu-sepakat",
    outletName: "Cattu Coffee Sepakat",
    nota: "CTU/31/20260912194522019",
    orderCode: "0124",
    transactionId: "01a0c410-2f5b-4d67-93b8-1e0c7de4a920",
    createdAt: "12 Sep 2026, 19:45",
    status: "ditahan",
    channel: "kiosk",
    serviceType: "dine_in",
    paymentMethod: "Tunai",
    lines: [
      { id: "l-4", name: "Arabika Coffee Milk", qty: 1, variant: "Large", unitPrice: 30000 },
      { id: "l-5", name: "Kentang Goreng Saus Sambal", qty: 1, variant: "Original", unitPrice: 18000 },
    ],
    subtotal: 48000,
    tax: 4800,
    rounding: 0,
    paid: 52800,
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
  {
    id: "n4",
    title: "Dinda Ayu menyukai postinganmu",
    body: '"Kopi pagi di Nordu Mega Mall, wajib coba!"',
    time: "10 menit lalu",
    read: false,
    kind: "post-like",
    actorName: "Dinda Ayu",
    href: "/comments/post-1",
  },
  {
    id: "n5",
    title: "Rizky Pratama menyukai komentarmu",
    body: '"Sambalnya nampol banget emang"',
    time: "25 menit lalu",
    read: false,
    kind: "comment-like",
    actorName: "Rizky Pratama",
    href: "/comments/post-1",
  },
  {
    id: "n6",
    title: "Siska Miranda mengomentari postinganmu",
    body: '"Wah jadi laper, mau order juga ah"',
    time: "1 jam lalu",
    read: true,
    kind: "comment",
    actorName: "Siska Miranda",
    href: "/comments/post-1",
  },
  {
    id: "n7",
    title: "Fajar Nugraha menyebut kamu",
    body: "Kamu disebut dalam sebuah komentar di postingan Lesung Pipi Gajah Mada.",
    time: "3 jam lalu",
    read: true,
    kind: "mention",
    actorName: "Fajar Nugraha",
    href: "/comments/post-3",
  },
  {
    id: "n8",
    title: "Tokepin mulai mengikuti kamu",
    body: "Lihat profilnya dan ikuti balik.",
    time: "5 jam lalu",
    read: false,
    kind: "follow",
    actorName: "Tokepin",
    href: "/profile/tokepin",
  },
  {
    id: "n9",
    title: "mariawati menyukai check-in kamu",
    body: '"Croissant butter Lesung Pipi masih hangat"',
    time: "8 jam lalu",
    read: true,
    kind: "like",
    actorName: "mariawati",
    href: "/comments/post-3",
  },
  {
    id: "n10",
    title: "Kartu member kamu naik level",
    body: "Selamat! Level kamu kini Signature. Nikmati benefit barunya.",
    time: "2 hari lalu",
    read: true,
    kind: "member",
  }
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

export function getOrder(id: string) {
  return orders.find((o) => o.id === id);
}

/** Outlets are stored with a short name ("Mega Mall"); cards outside the
 *  outlet picker show it prefixed with the brand ("Nordu Coffee Mega Mall"). */
export function outletFullName(outlet: Outlet) {
  return `${getBrand(outlet.brandId)?.name ?? ""} ${outlet.name}`.trim();
}
