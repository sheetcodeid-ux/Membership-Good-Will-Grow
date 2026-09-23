import { CONTACT } from "./contact";

/**
 * FAQ copy, mirroring the reference's eleven questions. The brand name is
 * ours and the support contacts come from `CONTACT`, because the reference
 * prints another company's number and address.
 */
export interface FaqEntry {
  id: string;
  question: string;
  /** Rendered as separate paragraphs, the way the reference spaces them. */
  answer: string[];
  /** Label for the illustration slot; only the KiosK answer has one. */
  imageLabel?: string;
  /** Route the answer links out to, appended as a "Lihat selengkapnya" link. */
  href?: string;
  linkLabel?: string;
}

export const faqEntries: FaqEntry[] = [
  {
    id: "apa-itu",
    question: "Apa itu Good Will Grow dan bagaimana caranya bergabung?",
    answer: [
      "Good Will Grow adalah aplikasi membership lifestyle untuk brand yang tergabung di dalam Good Will Grow Group.",
      "Untuk bergabung, cukup unduh aplikasi Good Will Grow dari App Store atau Google Play, daftar dengan nomor teleponmu, dan langsung dapatkan poin bonus untuk pembelian pertama.",
    ],
  },
  {
    id: "keuntungan",
    question: "Apa saja keuntungan yang didapat sebagai member Good Will Grow?",
    answer: [
      "Sebagai member Good Will Grow, kamu akan menikmati berbagai keuntungan seperti: poin reward di setiap pembelian, diskon eksklusif, akses ke menu baru lebih dulu, kejutan spesial di hari ulang tahun, dan antrian prioritas.",
      "Semakin sering berbelanja, semakin tinggi level membershipmu.",
    ],
  },
  {
    id: "pesan-online",
    question: "Bisakah saya pesan online melalui aplikasi?",
    answer: [
      "Tentu saja! Fitur Good Will Grow memungkinkanmu memesan terlebih dahulu untuk pickup tanpa antri.",
      "Pembayaran bisa dilakukan via QRIS melalui dompet digital atau m-banking pilihanmu. Tinggal buat pesanan, datang ke outlet, dan ambil pesananmu. Semudah itu.",
    ],
  },
  {
    id: "berbayar",
    question: "Apakah keanggotaan Good Will Grow berbayar?",
    answer: [
      "Tidak, keanggotaan Good Will Grow 100% gratis! Tidak ada biaya registrasi, biaya tahunan, atau biaya lainnya.",
      "Kamu hanya perlu tetap aktif berbelanja untuk mempertahankan status membership dan menikmati semua keuntungan yang tersedia.",
    ],
  },
  {
    id: "customer-support",
    question: "Bagaimana cara menghubungi customer support Good Will Grow?",
    answer: [
      `Kamu dapat menghubungi kami melalui: Chat in-app (24/7), WhatsApp di ${CONTACT.phoneLabel}, email ${CONTACT.emailLabel}, atau berbicara langsung dengan staff di outlet terdekat.`,
      "Tim kami siap membantu dengan masalah teknis, pertanyaan tentang membership, atau saran untuk aplikasi.",
    ],
  },
  {
    id: "cara-poin",
    question: "Bagaimana cara untuk mendapatkan poin?",
    answer: [
      "Setiap kamu berbelanja di Good Will Grow, QR Dine-in, KiosK, dan Kasir, kamu akan mendapatkan poin.",
      "Kamu akan mendapatkan poin sesuai dengan persentase reward poin di level kamu berada saat ini.",
      "Cek progres level kamu di menu Member. Semakin banyak kamu belanja, semakin banyak poin yang akan kamu dapatkan.",
    ],
  },
  {
    id: "poin-kasir",
    question: "Apakah belanja melalui Kasir akan mendapatkan poin?",
    answer: [
      "Tentu saja! Saat melakukan transaksi di kasir, berikan nomor handphone kamu yang terdaftar di Good Will Grow kepada kasir yang bertugas.",
      "Kasir akan memvalidasi nomor handphone kamu. Jika benar, maka kamu akan mendapatkan poin setelah transaksi selesai.",
    ],
  },
  {
    id: "poin-kiosk",
    question: "Apakah belanja melalui KiosK akan mendapatkan poin?",
    answer: [
      "Tentu saja! Pada KiosK, pastikan kamu memasukkan nomor handphone kamu yang terdaftar di Good Will Grow sebelum melakukan pembayaran. Klik tombol 'Tap to Checkout', akan muncul Pop-Up 'Checkout'.",
      "Pada bagian 'Tap disini jika memiliki member', masukkan nomor handphone kamu, dan tekan tombol 'Cek Member' untuk memastikan nomor yang dimasukkan benar.",
      "Jika benar, silakan melakukan pembayaran. Kamu akan mendapatkan poin setelah transaksi selesai.",
    ],
    imageLabel: "Tangkapan layar KiosK",
  },
  {
    id: "poin-qr",
    question: "Apakah belanja melalui QR Dine-in akan mendapatkan poin?",
    answer: [
      "Tentu saja! Pada halaman login QR Dine-in, silakan gunakan nomor handphone kamu yang terdaftar pada Good Will Grow untuk login.",
      "Sebelum melakukan pembayaran, pastikan nama dan nomor handphone yang tampil pada halaman 'Detail Checkout' adalah nama dan nomor handphone kamu yang terdaftar di Good Will Grow. Jika sudah benar, silakan melakukan pembayaran. Kamu akan mendapatkan poin setelah transaksi selesai.",
    ],
  },
  {
    id: "skema-level",
    question: "Bagaimana skema naik/turun level membership?",
    answer: [
      "Setiap kamu melakukan transaksi, sistem akan mendeteksi apakah performa kamu sudah memenuhi syarat untuk naik level. Jika sudah, maka sistem akan langsung menaikkan level kamu dan kamu akan mendapatkan reward dari level yang baru.",
      "Kupon yang didapat dari level sebelumnya masih bisa kamu gunakan sebelum masa berlaku kupon habis. Setelah satu periode (3 bulan) dari review level kamu terakhir, sistem akan kembali memeriksa apakah performa kamu masih layak untuk bertahan di level saat ini, atau malah menurun.",
      "Jika menurun, maka level kamu secara otomatis akan turun, dan reward yang didapatkan akan disesuaikan dengan level barunya. Kupon yang didapat pada level sebelumnya tidak bisa digunakan kembali. Syarat untuk kenaikan level dan periode review bisa kamu lihat di halaman syarat dan ketentuan Good Will Grow ya.",
    ],
    href: "/terms",
    linkLabel: "Buka Syarat & Ketentuan",
  },
  {
    id: "ambil-pesanan",
    question: "Saya sudah pesan, lalu bagaimana cara mengambil pesanan saya?",
    answer: [
      "Kalau kamu sudah melakukan pembayaran, silakan untuk datang ke kasir atau ke tempat yang disediakan untuk mengambil pesanan kamu.",
    ],
  },
];
