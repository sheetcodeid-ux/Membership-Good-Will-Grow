import type { ProfileFields } from "../store/authStore";
import { members } from "../data/mock";

/** The parts of a profile the completeness card counts, in the order it asks for them. */
const PARTS: { label: string; filled: (p: ProfileFields) => boolean }[] = [
  { label: "nama", filled: (p) => !!p.name.trim() },
  { label: "username", filled: (p) => !!p.username.trim() },
  { label: "email", filled: (p) => !!p.email.trim() },
  { label: "tanggal lahir", filled: (p) => !!p.birthDate.trim() },
  { label: "jenis kelamin", filled: (p) => !!p.gender },
  { label: "lokasi", filled: (p) => !!p.village.trim() },
  { label: "alamat", filled: (p) => !!p.address.trim() },
  { label: "bio", filled: (p) => !!p.bio.trim() },
];

export function profileCompleteness(p: ProfileFields) {
  const missing = PARTS.filter((part) => !part.filled(p)).map(
    (part) => part.label,
  );
  const total = PARTS.length;
  const done = total - missing.length;
  return { done, total, missing, percent: Math.round((done / total) * 100) };
}

/** Why a name, username or email cannot be saved, or undefined if it can. */
export function nameError(name: string) {
  if (name.trim().length < 2) return "Nama minimal 2 huruf.";
  return undefined;
}

export function usernameError(username: string, current: string) {
  const u = username.trim();
  if (u.length < 3) return "Username minimal 3 karakter.";
  if (u.length > 20) return "Username maksimal 20 karakter.";
  if (!/^[a-z0-9._]+$/.test(u))
    return "Hanya huruf kecil, angka, titik, dan garis bawah.";
  if (u !== current && members.some((m) => m.username === u))
    return "Username ini sudah dipakai member lain.";
  return undefined;
}

export function emailError(email: string) {
  const e = email.trim();
  if (!e) return undefined;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e))
    return "Format email belum benar.";
  return undefined;
}
