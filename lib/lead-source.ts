/**
 * Origem do contato: de qual anúncio, campanha ou site a pessoa veio. Usada na
 * mensagem do WhatsApp e no analytics do painel /admin.
 *
 * Nos anúncios, configure os parâmetros de URL. No Meta Ads, por exemplo:
 *   utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}
 * Também dá para escrever o nome direto no link: /diagnostico?anuncio=Video-BF-01
 * (e ?campanha=... para a campanha). Hífens e "_" viram espaço.
 * A origem fica guardada na sessão do navegador, então continua valendo se a
 * pessoa navegar pelo site antes de preencher o formulário.
 */

export type LeadSource =
  | { kind: "ad"; name: string }
  | { kind: "campaign"; name: string }
  | { kind: "site" };

export type Attribution = {
  ad: string;
  campaign: string;
  source: string;
  medium: string;
  /** Site de onde a pessoa veio (ex.: "google.com"), sem "www.". */
  referrer: string;
  /** Primeira página da sessão. */
  landing: string;
};

const AD_PARAMS = ["anuncio", "utm_content", "ad_name", "adname"];
const CAMPAIGN_PARAMS = ["campanha", "utm_campaign", "campaign_name", "campaign"];
const STORAGE_KEY = "atc-attribution";

function firstParam(params: URLSearchParams, keys: string[]) {
  for (const key of keys) {
    const value = params
      .get(key)
      ?.replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    // Ignora macros não substituídas, como "{{ad.name}}".
    if (value && !/^\{\{.*\}\}$/.test(value)) return value.slice(0, 120);
  }
  return "";
}

function rawParam(params: URLSearchParams, key: string) {
  return (params.get(key) ?? "").trim().toLowerCase().slice(0, 80);
}

function externalReferrer() {
  try {
    if (!document.referrer) return "";
    const url = new URL(document.referrer);
    if (url.host === window.location.host) return "";
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function readStored(): Attribution | null {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Attribution) : null;
  } catch {
    return null;
  }
}

function store(attribution: Attribution) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Sem sessionStorage (aba anônima, bloqueio): usa só a URL atual.
  }
}

const emptyAttribution: Attribution = {
  ad: "",
  campaign: "",
  source: "",
  medium: "",
  referrer: "",
  landing: "",
};

/**
 * Lê a origem da URL atual. Uma URL com parâmetros de anúncio substitui a
 * origem guardada; sem parâmetros, vale a da entrada na sessão.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return emptyAttribution;

  const params = new URLSearchParams(window.location.search);
  let source = rawParam(params, "utm_source");
  let medium = rawParam(params, "utm_medium");
  // Cliques de anúncio sem UTM ainda trazem o id do clique.
  if (!source && params.has("fbclid")) source = "meta";
  if (!source && (params.has("gclid") || params.has("gbraid") || params.has("wbraid"))) {
    source = "google";
    medium ||= "cpc";
  }

  const fromUrl: Attribution = {
    ad: firstParam(params, AD_PARAMS),
    campaign: firstParam(params, CAMPAIGN_PARAMS),
    source,
    medium,
    referrer: externalReferrer(),
    landing: window.location.pathname,
  };

  const stored = readStored();
  const hasCampaign = Boolean(fromUrl.ad || fromUrl.campaign || fromUrl.source);
  if (stored && !hasCampaign) return stored;

  store(fromUrl);
  return fromUrl;
}

/** Origem resumida para a abertura da mensagem do WhatsApp. */
export function captureLeadSource(): LeadSource {
  const { ad, campaign } = captureAttribution();
  if (ad) return { kind: "ad", name: ad };
  if (campaign) return { kind: "campaign", name: campaign };
  return { kind: "site" };
}
