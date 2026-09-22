import React from "react";
import { View } from "react-native";
import { Screen, ScreenHeader, AppText, Divider } from "../components/ui";
import { ink } from "../theme/colors";

const sections = [
  {
    title: "1. Pendahuluan",
    body: "Selamat datang di Good Will Grow ('Aplikasi', 'Kami'). Dengan mengunduh, mengakses, atau menggunakan aplikasi ini, Anda ('Pengguna') dianggap telah membaca, memahami, dan menyetujui Syarat Penggunaan berikut.",
  },
  {
    title: "2. Penerimaan Syarat",
    body: "Dengan menggunakan aplikasi Good Will Grow, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini. Jika Anda tidak menyetujui salah satu bagian dari syarat ini, harap hentikan penggunaan aplikasi.",
  },
  {
    title: "3. Deskripsi Layanan",
    body: "Good Will Grow adalah platform komunitas yang memungkinkan pengguna untuk membuat dan membagikan konten, melihat postingan pengguna lain, berinteraksi dengan pengguna lain, serta memesan makanan dan minuman secara online melalui fitur pemesanan dalam aplikasi.",
  },
  {
    title: "4. Keanggotaan & Poin",
    body: "Poin diperoleh dari setiap transaksi yang memenuhi syarat dan dapat ditukarkan sesuai kebijakan yang berlaku. Level keanggotaan (Classic, Elite, Royale) ditentukan dari akumulasi transaksi dan nominal belanja dalam periode berjalan.",
  },
  {
    title: "5. Konten Pengguna (UGC)",
    body: "Pengguna bertanggung jawab penuh atas konten yang dibagikan melalui fitur Feeds. Konten yang melanggar hukum, mengandung SARA, atau merugikan pihak lain dapat dihapus tanpa pemberitahuan.",
  },
  {
    title: "6. Penggunaan yang Dilarang",
    body: "Dilarang menggunakan aplikasi untuk aktivitas ilegal, mengunggah malware atau spam, maupun mengakses sistem tanpa izin.",
  },
  {
    title: "7. Perubahan Ketentuan",
    body: "Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diinformasikan melalui aplikasi.",
  },
];

export default function TermsScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Syarat & Ketentuan" />
      <View style={{ paddingHorizontal: 20, gap: 4 }}>
        <AppText variant="h2">Terms & Conditions</AppText>
        <AppText variant="caption" color={ink[500]}>
          Syarat dan Ketentuan Good Will Grow · Pembaharuan Terakhir: 22/09/26
        </AppText>

        <View style={{ height: 20 }} />

        {sections.map((s, i) => (
          <View key={s.title} style={{ gap: 10, marginBottom: 20 }}>
            <AppText variant="titleLg" color="#0B2B73">{s.title}</AppText>
            <AppText variant="body" color={ink[600]}>{s.body}</AppText>
            {i < sections.length - 1 ? <Divider /> : null}
          </View>
        ))}
      </View>
    </Screen>
  );
}
