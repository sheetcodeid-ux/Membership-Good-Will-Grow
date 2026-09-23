/**
 * Administrative areas for the "Pilih Lokasi" picker on Edit Profil.
 *
 * There is no reference screen for the picker yet, so this is a working
 * sample covering the provinces the outlets sit in. Swap it for the real
 * Kemendagri list once the client confirms the flow.
 */
export interface Village {
  name: string;
}

export interface District {
  name: string;
  villages: string[];
}

export interface Regency {
  name: string;
  districts: District[];
}

export interface Province {
  name: string;
  regencies: Regency[];
}

export const provinces: Province[] = [
  {
    name: "Kalimantan Barat",
    regencies: [
      {
        name: "Kota Pontianak",
        districts: [
          {
            name: "Pontianak Kota",
            villages: ["Sungai Jawi", "Darat Sekip", "Mariana", "Tengah", "Sungai Bangkong"],
          },
          {
            name: "Pontianak Selatan",
            villages: ["Akcaya", "Benua Melayu Darat", "Kota Baru", "Parit Tokaya"],
          },
          {
            name: "Pontianak Barat",
            villages: ["Pal Lima", "Sungai Beliung", "Sungai Jawi Dalam", "Sungai Jawi Luar"],
          },
          {
            name: "Pontianak Tenggara",
            villages: ["Bangka Belitung Darat", "Bangka Belitung Laut"],
          },
        ],
      },
      {
        name: "Kabupaten Kubu Raya",
        districts: [
          {
            name: "Sungai Raya",
            villages: ["Arang Limbung", "Kapur", "Limbung", "Parit Baru", "Sungai Raya"],
          },
          { name: "Sungai Kakap", villages: ["Pal Sembilan", "Punggur Kecil", "Sungai Kakap"] },
          { name: "Rasau Jaya", villages: ["Rasau Jaya Satu", "Rasau Jaya Dua"] },
        ],
      },
      {
        name: "Kota Singkawang",
        districts: [
          { name: "Singkawang Barat", villages: ["Melayu", "Pasiran", "Tengah"] },
          { name: "Singkawang Tengah", villages: ["Roban", "Sekip Lama", "Jawa"] },
        ],
      },
      {
        name: "Kabupaten Sanggau",
        districts: [
          { name: "Kapuas", villages: ["Beringin", "Bunut", "Ilir Kota", "Tanjung Sekayam"] },
          { name: "Parindu", villages: ["Pusat Damai", "Marita", "Suka Gerundi"] },
        ],
      },
    ],
  },
  {
    name: "DKI Jakarta",
    regencies: [
      {
        name: "Jakarta Selatan",
        districts: [
          { name: "Kebayoran Baru", villages: ["Gandaria Utara", "Melawai", "Senayan"] },
          { name: "Tebet", villages: ["Tebet Barat", "Tebet Timur", "Kebon Baru"] },
        ],
      },
      {
        name: "Jakarta Pusat",
        districts: [
          { name: "Menteng", villages: ["Menteng", "Cikini", "Gondangdia"] },
          { name: "Tanah Abang", villages: ["Bendungan Hilir", "Karet Tengsin", "Kebon Melati"] },
        ],
      },
    ],
  },
  {
    name: "Jawa Barat",
    regencies: [
      {
        name: "Kota Bandung",
        districts: [
          { name: "Coblong", villages: ["Dago", "Lebak Siliwangi", "Sekeloa"] },
          { name: "Sukajadi", villages: ["Cipedes", "Pasteur", "Sukagalih"] },
        ],
      },
      {
        name: "Kota Bogor",
        districts: [
          { name: "Bogor Tengah", villages: ["Babakan", "Pabaton", "Sempur"] },
          { name: "Bogor Utara", villages: ["Bantarjati", "Tegal Gundil", "Tanah Baru"] },
        ],
      },
    ],
  },
];
