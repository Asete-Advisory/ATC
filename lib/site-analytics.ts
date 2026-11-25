/**
 * Envio de visitas e leads para o backend (PocketBase), pelas rotas
 * /api/site/* do próprio site. Não usa cookies nem IP: o visitante e a sessão
 * são ids aleatórios guardados no navegador.
 */

import { captureAttribution } from "@/lib/lead-source";
import type { LeadMessageLine } from "@/lib/lead-message";

const VISITOR_KEY = "atc-vid";
const SESSION_KEY = "atc-sid";

function randomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function storedId(storage: () => Storage, key: string) {
  try {
    const current = storage().getItem(key);
    if (current) return current;
    const id = randomId();
    storage().setItem(key, id);
    return id;
  } catch {
    return randomId();
  }
}

function identity() {
  return {
    visitor: storedId(() => window.localStorage, VISITOR_KEY),
    session: storedId(() => window.sessionStorage, SESSION_KEY),
    attribution: captureAttribution(),
  };
}

function deviceType() {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const shortSide = Math.min(window.screen.width, window.screen.height);
  if (coarse && shortSide < 600) return "mobile";
  if (coarse) return "tablet";
  return window.innerWidth < 640 ? "mobile" : "desktop";
}

function post(url: string, body: unknown) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    // Continua mesmo se a página for trocada (ex.: abertura do WhatsApp).
    keepalive: true,
  });
}

function isAutomated() {
  return typeof navigator !== "undefined" && navigator.webdriver;
}

export function sendPageview(path: string) {
  if (isAutomated()) return;
  const lang = new URLSearchParams(window.location.search).get("lang") ?? "pt";
  post("/api/site/v", {
    ...identity(),
    path,
    device: deviceType(),
    lang: lang.slice(0, 8),
  }).catch(() => {});
}

/** Id de registro no formato do PocketBase (15 caracteres a-z0-9). */
export function newLeadId() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(15);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

export type LeadPayload = {
  id: string;
  origin: "diagnosis" | "form";
  name?: string;
  company: string;
  email: string;
  phone: string;
  city?: string;
  profile?: string;
  locale: string;
  answers: LeadMessageLine[];
  message: string;
  whatsapp: boolean;
};

/** Salva o lead no painel. Falhas não atrapalham o envio pelo WhatsApp. */
export function sendLead(lead: LeadPayload) {
  if (isAutomated()) return;
  post("/api/site/lead", {
    ...identity(),
    ...lead,
    answers: lead.answers.filter((line) => line.value),
  }).catch(() => {});
}

/** Marca que a pessoa abriu o WhatsApp com a mensagem do lead. */
export function markLeadWhatsApp(id: string) {
  if (isAutomated()) return;
  post("/api/site/lead/whatsapp", { id }).catch(() => {});
}
