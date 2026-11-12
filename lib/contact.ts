export const WHATSAPP_NUMBER = "5547996135427";
export const WHATSAPP_DISPLAY = "+55 (47) 99613-5427";
export const CONTACT_EMAIL = "contato@atcchinabrasil.com";

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppMessage(message: string) {
  const url = buildWhatsAppUrl(message);
  const popup = window.open(url, "_blank");

  if (popup) {
    popup.opener = null;
  } else {
    window.location.href = url;
  }
}
