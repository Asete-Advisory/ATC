/**
 * Painel /admin: sessão (token do PocketBase em cookie httpOnly), período
 * selecionado e leitura das estatísticas e dos leads. Só no servidor.
 */

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { pbFetch } from "@/lib/pocketbase";

export const ADMIN_COOKIE = "atc_admin";
/** Quem pode entrar no painel: a coleção "admins" e os superusuários. */
export const ADMIN_COLLECTIONS = ["admins", "_superusers"] as const;

export type Admin = { id: string; email: string; name: string };

export const getAdminToken = async () =>
  (await cookies()).get(ADMIN_COOKIE)?.value ?? "";

/** Admin logado (validado no PocketBase) ou redireciona para o login. */
export const requireAdmin = cache(async () => {
  const token = await getAdminToken();
  if (!token) redirect("/admin/login");

  let admin: Admin | null = null;
  try {
    for (const collection of ADMIN_COLLECTIONS) {
      const response = await pbFetch(`/api/collections/${collection}/auth-refresh`, {
        method: "POST",
        token,
      });
      if (response.ok) {
        const data = (await response.json()) as { record: Admin };
        admin = data.record;
        break;
      }
      if (response.status !== 401 && response.status !== 403 && response.status !== 404) {
        throw new Error(`PocketBase ${response.status}`);
      }
    }
  } catch {
    throw new Error("Não foi possível falar com o backend do painel.");
  }
  if (!admin) redirect("/admin/login?expirado=1");
  return { admin, token };
});

/* ----------------------------- Período ----------------------------- */

export const PRESETS = [
  { id: "7d", label: "7 dias", days: 7 },
  { id: "30d", label: "30 dias", days: 30 },
  { id: "90d", label: "90 dias", days: 90 },
  { id: "365d", label: "12 meses", days: 365 },
] as const;

export type Range = { from: string; to: string; preset: string };

const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Hoje em São Paulo, AAAA-MM-DD. */
export function todayBR() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(
    new Date(),
  );
}

export function addDays(day: string, days: number) {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function parseRange(params: Record<string, string | string[] | undefined>): Range {
  const value = (key: string) => {
    const raw = params[key];
    return typeof raw === "string" ? raw : "";
  };
  const today = todayBR();
  const from = value("de");
  const to = value("ate");
  if (DAY.test(from) && DAY.test(to) && from <= to) {
    return { from, to: to > today ? today : to, preset: "custom" };
  }
  const preset = PRESETS.find((item) => item.id === value("periodo")) ?? PRESETS[1];
  return { from: addDays(today, -(preset.days - 1)), to: today, preset: preset.id };
}

export function rangeQuery(range: Range): Record<string, string> {
  return range.preset === "custom"
    ? { de: range.from, ate: range.to }
    : { periodo: range.preset };
}

/** Limites em UTC do PocketBase (São Paulo = UTC−3, sem horário de verão). */
export function rangeBounds(range: Range) {
  return {
    from: `${range.from} 03:00:00.000Z`,
    to: `${addDays(range.to, 1)} 03:00:00.000Z`,
  };
}

/* ----------------------------- Dados ----------------------------- */

export type Totals = {
  pageviews: number;
  visitors: number;
  sessions: number;
  leads: number;
  leadsDiagnosis: number;
  leadsForm: number;
  whatsapp: number;
};

export type Channel = "campaign" | "search" | "social" | "referral" | "direct";

export type Stats = {
  range: { from: string; to: string; days: number };
  totals: Totals;
  previous: Totals;
  daily: { date: string; pageviews: number; visitors: number; leads: number }[];
  channels: { channel: Channel; visitors: number; sessions: number; leads: number }[];
  campaigns: {
    campaign: string;
    ad: string;
    source: string;
    visitors: number;
    sessions: number;
    pageviews: number;
    leads: number;
  }[];
  pages: { path: string; pageviews: number; visitors: number }[];
  referrers: { label: string; visitors: number }[];
  devices: { label: string; visitors: number }[];
};

export type LeadAnswer = { section: string; label?: string; value: string };

export type Lead = {
  id: string;
  origin: "diagnosis" | "form";
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  profile: string;
  locale: string;
  answers: LeadAnswer[] | null;
  message: string;
  whatsapp: boolean;
  whatsapp_at: string;
  channel: Channel | "";
  campaign: string;
  ad: string;
  utm_source: string;
  utm_medium: string;
  referrer: string;
  landing: string;
  created: string;
};

export type LeadList = {
  items: Lead[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
};

async function pbJson<T>(path: string, token: string): Promise<T> {
  const response = await pbFetch(path, { token });
  if (response.status === 401 || response.status === 403) redirect("/admin/login?expirado=1");
  if (!response.ok) throw new Error(`PocketBase ${response.status}`);
  return (await response.json()) as T;
}

export function fetchStats(range: Range, token: string) {
  const query = new URLSearchParams({ from: range.from, to: range.to });
  return pbJson<Stats>(`/api/atc/stats?${query}`, token);
}

export type LeadFilters = {
  range: Range;
  origin?: string;
  channel?: string;
  campaign?: string;
  ad?: string;
  search?: string;
  page?: number;
  perPage?: number;
};

/** Texto seguro dentro de aspas no filtro do PocketBase. */
const quote = (value: string) => `"${value.replace(/["\\]/g, "").slice(0, 160)}"`;

export function fetchLeads(filters: LeadFilters, token: string) {
  const bounds = rangeBounds(filters.range);
  const conditions = [`created >= ${quote(bounds.from)}`, `created < ${quote(bounds.to)}`];
  if (filters.origin === "diagnosis" || filters.origin === "form") {
    conditions.push(`origin = ${quote(filters.origin)}`);
  }
  if (filters.channel) conditions.push(`channel = ${quote(filters.channel)}`);
  if (filters.campaign !== undefined) conditions.push(`campaign = ${quote(filters.campaign)}`);
  if (filters.ad !== undefined) conditions.push(`ad = ${quote(filters.ad)}`);
  const search = filters.search?.trim();
  if (search) {
    const term = quote(search);
    conditions.push(
      `(name ~ ${term} || company ~ ${term} || email ~ ${term} || phone ~ ${term} || city ~ ${term})`,
    );
  }

  const query = new URLSearchParams({
    page: String(filters.page ?? 1),
    perPage: String(filters.perPage ?? 25),
    sort: "-created",
    filter: conditions.join(" && "),
    fields:
      "id,origin,name,company,email,phone,city,profile,whatsapp,channel,campaign,ad,utm_source,created",
  });
  return pbJson<LeadList>(`/api/collections/leads/records?${query}`, token);
}

export async function fetchLead(id: string, token: string) {
  if (!/^[a-z0-9]{15}$/.test(id)) return null;
  const response = await pbFetch(`/api/collections/leads/records/${id}`, { token });
  if (response.status === 404) return null;
  if (response.status === 401 || response.status === 403) redirect("/admin/login?expirado=1");
  if (!response.ok) throw new Error(`PocketBase ${response.status}`);
  return (await response.json()) as Lead;
}

/* ----------------------------- Rótulos ----------------------------- */

export const channelLabels: Record<Channel, string> = {
  campaign: "Anúncios e campanhas",
  search: "Busca orgânica",
  social: "Redes sociais",
  referral: "Outros sites",
  direct: "Direto",
};

export const originLabels = {
  diagnosis: "Diagnóstico",
  form: "Formulário da home",
} as const;

export const deviceLabels: Record<string, string> = {
  mobile: "Celular",
  tablet: "Tablet",
  desktop: "Computador",
};

export const sectionLabels: Record<string, string> = {
  interest: "Interesse e momento atual",
  profile: "Perfil",
  operation: "Produto e operação",
  goal: "Objetivo",
  doubt: "Principal dúvida",
  other: "Outros pontos",
};

const numberFormat = new Intl.NumberFormat("pt-BR");
export const formatNumber = (value: number) => numberFormat.format(value);

export function formatPercent(part: number, total: number) {
  if (!total) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(part / total);
}

/** Data do PocketBase ("2026-11-25 13:12:17.400Z") em horário de Brasília. */
export function formatDateTime(value: string, withTime = true) {
  if (!value) return "";
  const date = new Date(value.replace(" ", "T"));
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

export function formatDay(day: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", ...options }).format(
    new Date(`${day}T12:00:00Z`),
  );
}

/** Link do WhatsApp para falar com o lead (número brasileiro sem DDI ganha 55). */
export function whatsappLink(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
  return digits.length >= 10 ? `https://wa.me/${digits}` : "";
}
