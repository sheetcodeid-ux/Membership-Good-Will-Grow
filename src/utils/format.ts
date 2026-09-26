export function formatRupiah(value: number): string {
  return `Rp ${Math.round(value).toLocaleString("id-ID")}`;
}

/** "960 m" under a kilometre, "1.2 km" from there. */
export function formatDistance(km: number): string {
  return km < 1
    ? `${Math.round((km * 1000) / 10) * 10} m`
    : `${km.toFixed(1)} km`;
}
