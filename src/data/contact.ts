import { Linking } from "react-native";

/**
 * Good Will Grow's own customer-service details.
 *
 * The reference screenshots carry CW Coffee's real phone, email and postal
 * address. Those belong to another company, so every slot here stays a
 * labelled placeholder until the client hands over theirs — filling the six
 * constants below updates the Profile help cards, FAQ, Terms and Privacy
 * Policy in one go.
 */
export const CONTACT = {
  csName: "Good Will Grow Customer Service",
  /** What the screens print. */
  phoneLabel: "[nomor telepon Good Will Grow]",
  /** Digits only, country code first (e.g. "628123456789"). Empty = not set. */
  phoneDigits: "",
  emailLabel: "[email Good Will Grow]",
  /** Real address for mailto:. Empty = not set. */
  email: "",
  addressLabel: "[alamat Good Will Grow]",
} as const;

/** True once the client has supplied a real number we can dial. */
export const hasWhatsApp = CONTACT.phoneDigits.length > 0;
export const hasEmail = CONTACT.email.length > 0;

/** Opens the WhatsApp chat with customer service; no-op while unset. */
export function openWhatsApp(message?: string) {
  if (!hasWhatsApp) return;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  Linking.openURL(`https://wa.me/${CONTACT.phoneDigits}${query}`).catch(() => {});
}

/** Opens the mail app (Gmail on most Android phones); no-op while unset. */
export function openEmail(subject?: string) {
  if (!hasEmail) return;
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  Linking.openURL(`mailto:${CONTACT.email}${query}`).catch(() => {});
}
