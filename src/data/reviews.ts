/**
 * Ratings and reviews shown on the outlet pages, until reviews come from
 * the order service. Names are masked the way the reviews list prints
 * them; nothing here belongs to a real person.
 */

export interface OutletReview {
  id: string;
  brandId: string;
  /** Masked, e.g. "A**** P****". */
  name: string;
  initials: string;
  memberSince: number;
  rating: number;
  text: string;
  /** What they ordered, as the review card prints it. */
  items: string;
  /** What they liked, from the rating form. */
  liked: string[];
  /** e.g. "21 Sep 2026". */
  date: string;
  helpful: number;
}

export interface OutletStats {
  rating: number;
  /** "1,2rb+" */
  countLabel: string;
  /** Minutes until an order is usually ready, e.g. "10-15". */
  prepMinutes: string;
}

/** A stable small number from a string, so each outlet keeps its figures. */
function seed(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

export function outletStats(outletId: string): OutletStats {
  const h = seed(outletId);
  const rating = 4.6 + (h % 4) / 10;
  const count = 6 + (h % 30);
  const prep = ["5-10", "10-15", "10-20", "15-20"][h % 4];
  return {
    rating: Math.round(rating * 10) / 10,
    countLabel: `${Math.floor(count / 10)},${count % 10}rb+`,
    prepMinutes: prep,
  };
}

export const reviews: OutletReview[] = [
  // Nordu Coffee
  {
    id: "rv-n1",
    brandId: "nordu",
    name: "R**** A*****",
    initials: "RA",
    memberSince: 2024,
    rating: 5,
    text: "Arenga coffee-nya pas banget manisnya, disajikan cepat walau lagi ramai.",
    items: "Arenga Coffee, Kentang Goreng Saus Sambal",
    liked: ["Rasa enak", "Porsi pas", "Cepat disiapkan"],
    date: "22 Sep 2026",
    helpful: 12,
  },
  {
    id: "rv-n2",
    brandId: "nordu",
    name: "D***",
    initials: "D",
    memberSince: 2025,
    rating: 5,
    text: "Coffee creamy favorit, selalu konsisten rasanya. Baristanya ramah.",
    items: "Coffee Creamy",
    liked: ["Rasa enak", "Pelayanan ramah"],
    date: "20 Sep 2026",
    helpful: 8,
  },
  {
    id: "rv-n3",
    brandId: "nordu",
    name: "S***** M****",
    initials: "SM",
    memberSince: 2023,
    rating: 4,
    text: "Enak, cuma antrean ambil pesanan agak lama di jam pulang kerja.",
    items: "Caffe Latte, Choco Hazelnut",
    liked: ["Rasa enak", "Kemasan rapi"],
    date: "18 Sep 2026",
    helpful: 3,
  },
  {
    id: "rv-n4",
    brandId: "nordu",
    name: "Y****",
    initials: "Y",
    memberSince: 2025,
    rating: 5,
    text: "Pesan lewat aplikasi, datang tinggal ambil. Praktis!",
    items: "Americano Arabika",
    liked: ["Cepat disiapkan", "Praktis"],
    date: "15 Sep 2026",
    helpful: 5,
  },
  {
    id: "rv-n5",
    brandId: "nordu",
    name: "F***** H*****",
    initials: "FH",
    memberSince: 2024,
    rating: 3,
    text: "Rasanya oke, tapi es-nya kebanyakan. Lain kali pesan less ice.",
    items: "Arabika Coffee Milk",
    liked: ["Kemasan rapi"],
    date: "12 Sep 2026",
    helpful: 1,
  },
  // Cattu Coffee
  {
    id: "rv-c1",
    brandId: "cattu",
    name: "N**** P*****",
    initials: "NP",
    memberSince: 2024,
    rating: 5,
    text: "Kopi susu Cattu juara, aren-nya kerasa. Croissant-nya juga renyah.",
    items: "Kopi Susu Cattu, Croissant Butter",
    liked: ["Rasa enak", "Porsi pas", "Masih hangat"],
    date: "23 Sep 2026",
    helpful: 9,
  },
  {
    id: "rv-c2",
    brandId: "cattu",
    name: "A***",
    initials: "A",
    memberSince: 2025,
    rating: 5,
    text: "Matcha latte-nya creamy dan tidak terlalu manis. Suka!",
    items: "Matcha Latte",
    liked: ["Rasa enak"],
    date: "19 Sep 2026",
    helpful: 4,
  },
  {
    id: "rv-c3",
    brandId: "cattu",
    name: "B**** S*******",
    initials: "BS",
    memberSince: 2023,
    rating: 4,
    text: "Tempatnya nyaman buat kerja, pesanan cepat jadi.",
    items: "Aren Latte, Cinnamon Roll",
    liked: ["Cepat disiapkan", "Pelayanan ramah"],
    date: "14 Sep 2026",
    helpful: 2,
  },
  // Lesung Pipi
  {
    id: "rv-l1",
    brandId: "lesung-pipi",
    name: "M***** L***",
    initials: "ML",
    memberSince: 2024,
    rating: 5,
    text: "Dimsum ayamnya lembut, sambalnya bikin nagih. Datang masih panas.",
    items: "Dimsum Ayam Kukus, Lumpia Kulit Tahu",
    liked: ["Rasa enak", "Masih hangat", "Porsi pas"],
    date: "21 Sep 2026",
    helpful: 11,
  },
  {
    id: "rv-l2",
    brandId: "lesung-pipi",
    name: "T***",
    initials: "T",
    memberSince: 2025,
    rating: 4,
    text: "Hakau udangnya enak, isinya penuh. Semoga ada varian pedas.",
    items: "Hakau Udang",
    liked: ["Rasa enak", "Kemasan rapi"],
    date: "17 Sep 2026",
    helpful: 3,
  },
  {
    id: "rv-l3",
    brandId: "lesung-pipi",
    name: "I**** R*******",
    initials: "IR",
    memberSince: 2023,
    rating: 5,
    text: "Kue lapisnya legit dan wangi, cocok buat oleh-oleh.",
    items: "Kue Lapis Legit, Bolu Pandan",
    liked: ["Rasa enak", "Kemasan rapi"],
    date: "10 Sep 2026",
    helpful: 6,
  },
  // Ayam Goreng Busari
  {
    id: "rv-b1",
    brandId: "ayam-busari",
    name: "H**** F*******",
    initials: "HF",
    memberSince: 2024,
    rating: 5,
    text: "Ayam geprek level 3 pedasnya pas, ayamnya besar dan renyah.",
    items: "Nasi Ayam Geprek Chili Padi, Es Teh Manis",
    liked: ["Rasa enak", "Porsi pas", "Masih hangat"],
    date: "22 Sep 2026",
    helpful: 14,
  },
  {
    id: "rv-b2",
    brandId: "ayam-busari",
    name: "W****",
    initials: "W",
    memberSince: 2025,
    rating: 4,
    text: "Kremesnya banyak, nasinya pulen. Sambal ijo-nya mantap.",
    items: "Nasi Ayam Goreng Kremes, Ayam Penyet Sambal Ijo",
    liked: ["Rasa enak", "Porsi pas"],
    date: "16 Sep 2026",
    helpful: 4,
  },
  {
    id: "rv-b3",
    brandId: "ayam-busari",
    name: "K***** A****",
    initials: "KA",
    memberSince: 2023,
    rating: 2,
    text: "Pesanan agak lama keluarnya waktu jam makan siang.",
    items: "Nasi Ayam Bakar Madu",
    liked: [],
    date: "11 Sep 2026",
    helpful: 1,
  },
];

export function reviewsFor(brandId: string) {
  return reviews.filter((r) => r.brandId === brandId);
}
