import { CONTACT } from "./contact";
import type { TermsSection } from "./terms";

/**
 * Privacy Policy copy. Same eleven clauses as the reference, with our brand
 * name and with every contact detail taken from `CONTACT` — the reference
 * prints another company's phone, email and address.
 */
export const PRIVACY_UPDATED_AT = "29/10/25";

export const privacySections: TermsSection[] = [
  {
    heading: "1. Pendahuluan",
    paragraphs: [
      "Privasi anda sangat penting bagi kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi anda saat menggunakan aplikasi dan layanan kami. Dengan menggunakan Good Will Grow, anda dianggap telah menyetujui ketentuan yang dijelaskan dalam kebijakan ini.",
    ],
  },
  {
    heading: "2. Informasi yang Kami Kumpulkan",
    paragraphs: ["Kami dapat mengumpulkan informasi berikut:"],
    bullets: [
      "Informasi Akun: Nama, username, email, nomor telepon, foto profil, atau informasi login",
      "Konten Pengguna: Postingan, komentar, dan foto yang Anda unggah ke platform",
      "Data Lokasi: Lokasi perangkat saat Anda memberi izin, untuk menampilkan outlet atau event terdekat.",
      "Media & Kamera: Akses ke kamera dan galeri untuk mengunggah foto profil atau konten feed.",
      "Informasi Teknis: Model perangkat, sistem operasi, alamat IP, dan data diagnostik.",
      "Cookie / Analitik: Data perilaku penggunaan aplikasi untuk meningkatkan performa dan pengalaman pengguna.",
    ],
  },
  {
    heading: "3. Tujuan Penggunaan Data",
    paragraphs: ["Kami menggunakan data anda untuk:"],
    bullets: [
      "Menyediakan fitur aplikasi (unggah konten, menampilkan lokasi outlet).",
      "Meningkatkan kualitas layanan dan pengalaman pengguna.",
      "Mencegah spam, penipuan, atau konten yang tidak pantas.",
      "Mengirim notifikasi atau informasi penting terkait aplikasi.",
      "Analitik penggunaan aplikasi secara anonim (misalnya melalui Firebase Analytics).",
    ],
  },
  {
    heading: "4. Izin Akses Perangkat",
    paragraphs: ["Kami mungkin meminta izin berikut:"],
    bullets: [
      "Kamera: Untuk mengambil foto profil atau postingan.",
      "Galeri: Untuk memilih foto dari perangkat.",
      "Lokasi: Untuk menampilkan outlet terdekat atau menandai lokasi posting.",
      "Notifikasi: Untuk memberi tahu aktivitas baru (opsional).",
    ],
    footnotes: [
      "Semua izin hanya digunakan sesuai kebutuhan fitur, dan tidak digunakan untuk pelacakan di luar aplikasi.",
    ],
  },
  {
    heading: "5. Pembagian Data kepada Pihak Ketiga",
    paragraphs: [
      "Kami dapat berbagi sebagian data dengan pihak ketiga hanya untuk tujuan operasional, misalnya:",
    ],
    bullets: [
      "Mitra brand kami (untuk validasi reward atau personalisasi promo).",
      "Layanan pihak ketiga yang mendukung platform kami (misalnya: analitik, hosting) di bawah perjanjian kerahasiaan yang ketat.",
      "Otoritas hukum jika diperlukan oleh hukum.",
    ],
    footnotes: ["Kami tidak menjual atau membagikan data pengguna untuk tujuan periklanan."],
  },
  {
    heading: "6. Keamanan Data",
    bullets: [
      "Kami menerapkan enkripsi dan kontrol akses ketat untuk melindungi data Anda. Kami menggunakan HTTPS, token-based authentication, dan enkripsi penyimpanan lokal untuk menjaga kerahasiaan informasi.",
      "Kami menerapkan perlindungan teknis dan terorganisir yang wajar untuk melindungi data Anda. Semua informasi sensitif dienkripsi saat transit dan saat disimpan. Namun, tidak ada metode transmisi online yang 100% aman. Kami bekerja keras untuk melindungi data Anda, tetapi tidak dapat menjamin keamanan absolut.",
    ],
  },
  {
    heading: "7. Hak Pengguna",
    paragraphs: ["Anda memiliki hak untuk:"],
    bullets: [
      "Mengakses dan memperbarui data pribadi anda",
      "Meminta penghapusan akun dan semua data terkait",
      "Menarik izin akses (kamera, lokasi, dll)",
      "Mengajukan keberatan terhadap penggunaan data tertentu.",
    ],
    footnotes: [
      `Permintaan dapat diajukan melalui aplikasi atau email: ${CONTACT.emailLabel}`,
    ],
  },
  {
    heading: "8. Penghapusan Akun & Data",
    paragraphs: ["Ada 2 mekanisme penghapusan akun."],
    bullets: [
      "Hapus Segera: Semua data seperti postingan, likes, komentar, bookmarks, koleksi, blokir, followers, dan followings akan dihapus secara permanen. Data transaksi, poin, dan kupon tidak dapat diakses kembali. Nomor HP dan username dapat digunakan kembali untuk pendaftaran baru.",
      "Hapus Dengan Masa Tenggang: Selama masa tenggang, akun tidak tampil di feeds dan tidak bisa digunakan untuk transaksi. Data tetap tersimpan dan bisa dipulihkan jika pengguna login kembali sebelum masa tenggang berakhir. Setelah 30 hari tanpa login, akun akan dihapus otomatis oleh sistem.",
    ],
  },
  {
    heading: "9. Data Anak di Bawah Umur",
    paragraphs: [
      "Good Will Grow tidak ditujukan untuk anak di bawah usia 13 tahun. Kami tidak secara sadar mengumpulkan data pribadi dari anak-anak tanpa izin orang tua.",
    ],
  },
  {
    heading: "10. Perubahan Kebijakan",
    paragraphs: [
      "Kami dapat memperbarui kebijakan ini sewaktu-waktu. Setiap perubahan akan ditampilkan di halaman ini dengan tanggal yang diperbarui. Kami mendorong anda untuk meninjau halaman ini secara berkala.",
    ],
  },
  {
    heading: "11. Kontak Kami",
    paragraphs: [
      "Jika Anda memiliki pertanyaan, keluhan, atau permintaan terkait privasi, hubungi kami di:",
    ],
    bullets: [
      `Telepon: ${CONTACT.phoneLabel}`,
      `Email: ${CONTACT.emailLabel}`,
      `Alamat: ${CONTACT.addressLabel}`,
    ],
  },
];
