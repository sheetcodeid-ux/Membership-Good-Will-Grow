import React from "react";
import { View } from "react-native";
import { Screen, ScreenHeader, AppText, Card } from "../components/ui";
import { MediaTile } from "../components/ui/MediaTile";
import { brand, ink } from "../theme/colors";
import { brands } from "../data/mock";

export default function AboutScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Tentang Good Will Grow" />
      <View style={{ paddingHorizontal: 20, gap: 24 }}>
        <View
          style={{
            backgroundColor: brand[600],
            borderRadius: 24,
            padding: 24,
            alignItems: "center",
            gap: 10,
          }}
        >
          <AppText variant="h1" color="#FFFFFF">GWG</AppText>
          <AppText variant="titleLg" color="#FFFFFF" center>
            Aplikasi Membership Lifestyle
          </AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.8)" center>
            Menghubungkanmu dengan seluruh brand Good Will Grow
          </AppText>
        </View>

        <View style={{ gap: 10 }}>
          <AppText variant="body" color={ink[600]}>
            Good Will Grow adalah aplikasi membership lifestyle yang menghubungkanmu dengan seluruh
            brand Good Will Grow. Memungkinkanmu untuk melakukan pemesanan langsung dari gawaimu,
            mendapatkan kupon eksklusif member dan promo terbatas, mengumpulkan poin setiap
            pembelian, serta bergabung dengan komunitas member yang menyukai hal yang sama denganmu.
          </AppText>
          <AppText variant="body" color={ink[600]}>
            Dari rutinitas kopi pagi hingga hangout akhir pekan, Good Will Grow mengubah setiap
            momen jadi kesempatan untuk berkoneksi dan menikmati lebih banyak.
          </AppText>
        </View>

        <View style={{ gap: 12 }}>
          <AppText variant="h3">Prinsip Kami</AppText>
          {[
            { title: "Koneksi Nyata", body: "Menjembatani kekakuan era digital dengan interaksi yang hangat antar manusia." },
            { title: "Tumbuh Bersama", body: "Kesuksesanmu adalah kesuksesan kami — komunitas yang berkembang bersama." },
            { title: "Reward Bermakna", body: "Setiap poin yang terkumpul, setiap momen yang dibagikan, semua punya makna." },
          ].map((p) => (
            <Card key={p.title}>
              <AppText variant="titleLg">{p.title}</AppText>
              <AppText variant="caption" color={ink[500]} style={{ marginTop: 4 }}>
                {p.body}
              </AppText>
            </Card>
          ))}
        </View>

        <View style={{ gap: 12 }}>
          <AppText variant="h3">Mitra Brand</AppText>
          {brands.map((b) => (
            <Card key={b.id} style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
              <MediaTile colors={b.gradient} icon={b.category === "coffee" ? "coffee" : "drumstick"} size={52} radius={16} iconSize={24} />
              <View style={{ flex: 1 }}>
                <AppText variant="titleLg">{b.name}</AppText>
                <AppText variant="caption" color={ink[500]}>{b.tagline}</AppText>
              </View>
            </Card>
          ))}
        </View>
      </View>
    </Screen>
  );
}
