/**
 * Origem do contato para a mensagem do WhatsApp: nome do anúncio, nome da
 * campanha ou, sem parâmetros, "formulário do site".
 *
 * Nos anúncios, configure os parâmetros de URL. No Meta Ads, por exemplo:
 *   utm_source=meta&utm_campaign={{campaign.name}}&utm_content={{ad.name}}
 * A origem fica guardada na sessão do navegador, então continua valendo se a
 * pessoa navegar pelo site antes de preencher o formulário.
 */

export type LeadSource =
  | { kind: "ad"; name: string }
  | { kind: "campaign"; name: string }
  | { kind: "site" };

const AD_PARAMS = ["utm_content", "ad_name", "adname"];
const CAMPAIGN_PARAMS = ["utm_campaign", "campaign_name", "campaign"];
const STORAGE_KEY = "atc-lead-source";

function firstParam(params: URLSearchParams, keys: string[]) {
  for (const key of keys) {
    const value = params.get(key)?.replace(/\s+/g, " ").trim();
    // Ignora macros não substituídas, como "{{ad.name}}".
    if (value && !/^\{\{.*\}\}$/.test(value)) return value.slice(0, 120);
  }
  return "";
}

function readStored(): LeadSource | null {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as LeadSource) : null;
  } catch {
    return null;
  }
}

/** Lê a origem da URL atual (e guarda) ou, sem parâmetros, a já guardada. */
export function captureLeadSource(): LeadSource {
  if (typeof window === "undefined") return { kind: "site" };

  const params = new URLSearchParams(window.location.search);
  const ad = firstParam(params, AD_PARAMS);
  const campaign = firstParam(params, CAMPAIGN_PARAMS);
  const source: LeadSource | null = ad
    ? { kind: "ad", name: ad }
    : campaign
      ? { kind: "campaign", name: campaign }
      : null;

  if (!source) return readStored() ?? { kind: "site" };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(source));
  } catch {
    // Sem sessionStorage (aba anônima, bloqueio): usa só a URL atual.
  }
  return source;
}
