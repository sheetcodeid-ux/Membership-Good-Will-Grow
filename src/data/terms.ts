/**
 * Terms text. Mirrors the reference's thirteen clauses; the brand name is ours
 * and every contact detail is a placeholder for Good Will Grow to fill in —
 * the reference's numbers belong to another company.
 */
export interface TermsSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Paragraphs printed after the bullet list. */
  footnotes?: string[];
}

export const TERMS_UPDATED_AT = "09/12/25";

export const termsSections: TermsSection[] = [
  {
    heading: "1. Pendahuluan",
    paragraphs: [
      "Selamat datang di Good Will Grow ('Aplikasi', 'Kami', 'Kita'). Dengan mengunduh, mengakses, atau menggunakan aplikasi ini, Anda ('Pengguna') dianggap telah membaca, memahami, dan menyetujui Syarat Penggunaan (Terms of Use / EULA) berikut.",
    ],
  },
  {
    heading: "2. Penerimaan Syarat",
    paragraphs: [
      "Dengan menggunakan aplikasi Good Will Grow, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini. Jika Anda tidak menyetujui salah satu bagian dari syarat ini, harap hentikan penggunaan aplikasi.",
    ],
  },
  {
    heading: "3. Deskripsi Layanan",
    paragraphs: ["Good Will Grow adalah platform komunitas yang memungkinkan pengguna untuk:"],
    bullets: [
      "Membuat dan membagikan konten seperti teks, foto, atau lokasi (User Generated Content / UGC).",
      "Melihat posting pengguna lain.",
      "Berinteraksi dengan pengguna lain.",
      "Memesan makanan dan minuman secara online melalui fitur pemesanan dalam aplikasi.",
    ],
  },
  {
    heading: "4. Konten Pengguna (User Generated Content)",
    paragraphs: [
      "Anda bertanggung jawab penuh atas konten yang Anda unggah. Dengan mengunggah konten, Anda menyatakan bahwa konten tersebut tidak melanggar hukum dan tidak mengandung:",
    ],
    bullets: [
      "Ujaran kebencian, pelecehan, kekerasan, pornografi, atau diskriminasi.",
      "Pelanggaran hak cipta, merek dagang, atau hak milik intelektual pihak lain.",
      "Informasi pribadi tanpa izin pemiliknya.",
    ],
    footnotes: [
      "Kami tidak menoleransi konten yang bersifat menyinggung, melecehkan, atau berbahaya. Kami berhak menghapus konten dan/atau menangguhkan akun pengguna yang melanggar ketentuan ini tanpa pemberitahuan terlebih dahulu.",
    ],
  },
  {
    heading: "5. Moderasi & Pelaporan",
    paragraphs: ["Good Will Grow menerapkan sistem moderasi untuk menjaga keamanan komunitas:"],
    bullets: [
      "Pengguna dapat melaporkan konten yang tidak pantas melalui tombol 'Laporkan'.",
      "Pengguna dapat memblokir pengguna lain agar tidak melihat atau berinteraksi.",
      "Tim moderasi kami akan meninjau laporan dan mengambil tindakan dalam waktu 24 jam, termasuk penghapusan konten atau penangguhan akun.",
    ],
  },
  {
    heading: "6. Hak Kekayaan Intelektual",
    paragraphs: [
      "Hak cipta dan merek dagang terkait Good Will Grow adalah milik kami. Anda tidak diperkenankan menyalin, memodifikasi, atau mendistribusikan bagian mana pun dari aplikasi tanpa izin tertulis dari kami.",
    ],
  },
  {
    heading: "8. Penggunaan yang Dilarang",
    paragraphs: ["Dilarang menggunakan aplikasi untuk:"],
    bullets: [
      "Aktivitas ilegal atau yang merugikan pihak lain.",
      "Mengunggah malware, spam, atau aktivitas penipuan.",
      "Mengakses sistem tanpa izin.",
    ],
  },
  {
    heading: "9. Penangguhan dan Penghapusan Akun",
    paragraphs: ["Kami berhak menangguhkan atau menghapus akun Anda jika:"],
    bullets: [
      "Anda melanggar syarat dan ketentuan ini.",
      "Ada aktivitas mencurigakan atau pelaporan berulang.",
      "Permintaan langsung dari Anda untuk penghapusan akun.",
    ],
    footnotes: [
      "Untuk menghapus akun, Anda dapat mengajukan permintaan melalui aplikasi atau email ke: [email Good Will Grow].",
    ],
  },
  {
    heading: "10. Batasan Tanggung Jawab",
    paragraphs: [
      "Kami tidak bertanggung jawab atas kehilangan data, kerugian, atau kerusakan akibat penggunaan aplikasi. Penggunaan aplikasi merupakan tanggung jawab Anda sepenuhnya.",
    ],
  },
  {
    heading: "11. Hukum yang Berlaku dan Penyelesaian Sengketa",
    paragraphs: [
      "Syarat dan Ketentuan ini diatur oleh hukum Republik Indonesia. Setiap perselisihan yang timbul sehubungan dengan keanggotaan Good Will Grow akan diselesaikan secara musyawarah atau, apabila diperlukan, melalui pengadilan yang berwenang di Indonesia.",
    ],
  },
  {
    heading: "12. Perubahan Syarat dan Ketentuan",
    paragraphs: [
      "Kami dapat memperbarui syarat dan ketentuan ini sewaktu-waktu. Setiap perubahan akan ditampilkan di halaman ini dengan tanggal yang diperbarui. Kami mendorong anda untuk meninjau halaman ini secara berkala.",
    ],
  },
  {
    heading: "13. Kontak Kami",
    paragraphs: [
      "Jika Anda memiliki pertanyaan, keluhan, atau permintaan terkait syarat dan ketentuan, hubungi kami di:",
    ],
    bullets: [
      "Telepon: [nomor telepon Good Will Grow]",
      "Email: [email Good Will Grow]",
      "Alamat: [alamat Good Will Grow]",
    ],
  },
];
