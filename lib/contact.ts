export const WHATSAPP_NUMBER = "5547996135427";
export const WHATSAPP_DISPLAY = "+55 (47) 99613-5427";
export const CONTACT_EMAIL = "contato@atcchinabrasil.com";

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
