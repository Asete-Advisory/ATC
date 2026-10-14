import type { Language } from "@/lib/i18n";
import type { MarketQuote } from "@/lib/market";

// Editorial presentation groups, not an official exchange classification.
export const marketSectors = [
  {
    id: "energy",
    color: "#b96b35",
    labels: { pt: "Energia e petróleo", en: "Energy & oil", zh: "能源与石油" },
    tickers: ["PETR3", "PETR4", "PRIO3"],
  },
  {
    id: "mining",
    color: "#397fbb",
    labels: {
      pt: "Mineração e siderurgia",
      en: "Mining & steel",
      zh: "采矿与钢铁",
    },
    tickers: ["VALE3", "GGBR4", "CSNA3", "GOAU4", "USIM5", "BRAP4"],
  },
  {
    id: "finance",
    color: "#7960ba",
    labels: {
      pt: "Bancos e serviços financeiros",
      en: "Banking & financial services",
      zh: "银行与金融服务",
    },
    tickers: ["ITUB4", "BBDC4", "BBAS3", "BPAC11", "B3SA3", "ITSA4"],
  },
  {
    id: "retail",
    color: "#318773",
    labels: {
      pt: "Consumo e varejo",
      en: "Consumer & retail",
      zh: "消费与零售",
    },
    tickers: ["ABEV3", "LREN3", "MGLU3"],
  },
  {
    id: "infrastructure",
    color: "#bb606f",
    labels: {
      pt: "Infraestrutura e serviços",
      en: "Infrastructure & services",
      zh: "基础设施与服务",
    },
    tickers: ["CMIG4", "EQTL3", "ECOR3", "RENT3", "WEGE3"],
  },
  {
    id: "commodities",
    color: "#9c7720",
    labels: { pt: "Commodities", en: "Commodities", zh: "大宗商品" },
    tickers: [],
  },
  {
    id: "property",
    color: "#548594",
    labels: {
      pt: "Construção e imóveis",
      en: "Construction & real estate",
      zh: "建筑与房地产",
    },
    tickers: ["CYRE3", "GFSA3", "MRVE3"],
  },
  {
    id: "health",
    color: "#4b8c86",
    labels: { pt: "Saúde", en: "Healthcare", zh: "医疗保健" },
    tickers: ["RADL3", "RDOR3"],
  },
  {
    id: "paper",
    color: "#6f8750",
    labels: { pt: "Papel e celulose", en: "Pulp & paper", zh: "纸浆与造纸" },
    tickers: ["SUZB3"],
  },
  {
    id: "other",
    color: "#586b80",
    labels: { pt: "Outros setores", en: "Other sectors", zh: "其他行业" },
    tickers: [],
  },
] as const;

export type MarketSector = (typeof marketSectors)[number];
export type MarketSectorGroup = { sector: MarketSector; quotes: MarketQuote[] };

const stockSectors = new Map<string, string>(
  marketSectors.flatMap((sector) =>
    sector.tickers.map((ticker) => [`${ticker}.SA`, sector.id] as const),
  ),
);

export function groupMarketQuotes(quotes: MarketQuote[]) {
  const groups = new Map<string, MarketQuote[]>();
  const benchmarks: MarketQuote[] = [];
  for (const quote of quotes) {
    if (quote.category === "index" || quote.category === "currency") {
      benchmarks.push(quote);
      continue;
    }
    const id =
      quote.category === "commodity"
        ? "commodities"
        : (stockSectors.get(quote.symbol) ?? "other");
    const group = groups.get(id) ?? [];
    group.push(quote);
    groups.set(id, group);
  }
  return {
    groups: marketSectors.flatMap((sector) => {
      const entries = groups.get(sector.id);
      return entries?.length ? [{ sector, quotes: entries }] : [];
    }),
    benchmarks,
  };
}

const assetLabels: Record<string, Record<Language, string>> = {
  "GC=F": { pt: "Ouro", en: "Gold", zh: "黄金" },
  "SI=F": { pt: "Prata", en: "Silver", zh: "白银" },
  "HG=F": { pt: "Cobre", en: "Copper", zh: "铜" },
  "CL=F": { pt: "Petróleo WTI", en: "WTI crude oil", zh: "WTI原油" },
  "BZ=F": { pt: "Petróleo Brent", en: "Brent crude oil", zh: "布伦特原油" },
  "ZS=F": { pt: "Soja", en: "Soybeans", zh: "大豆" },
  "BRL=X": { pt: "Dólar", en: "US dollar", zh: "美元" },
  "CNYBRL=X": { pt: "Yuan", en: "Chinese yuan", zh: "人民币" },
};

export function marketAssetLabel(quote: MarketQuote, lang: Language) {
  return assetLabels[quote.symbol]?.[lang] ?? quote.label;
}

export function marketQuoteUnit(quote: MarketQuote, lang: Language) {
  if (quote.category === "index") return lang === "zh" ? "点" : "pts";
  if (quote.symbol === "ZS=F") return "US¢/bu";
  if (["GC=F", "SI=F", "HG=F", "CL=F", "BZ=F"].includes(quote.symbol))
    return "USD";
  if (
    quote.symbol.endsWith(".SA") ||
    ["BRL=X", "CNYBRL=X"].includes(quote.symbol)
  )
    return "BRL";
  return "";
}

export const marketViewText = {
  pt: {
    title: "Mercado",
    format: "Formato do mercado",
    table: "Tabela",
    sectors: "Setores",
    page: "Página",
    previous: "Página anterior",
    next: "Próxima página",
    price: "Preço",
    day: "Dia",
    asset: "Ativo",
    assets: "ativos",
    consulted: "Consulta",
    stale: "Falha ao atualizar · últimas cotações disponíveis",
    benchmarks: "Índices e moedas",
    quoteTime: "Horário da cotação",
    noQuotes: "Dados de mercado indisponíveis no momento",
  },
  en: {
    title: "Markets",
    format: "Market format",
    table: "Table",
    sectors: "Sectors",
    page: "Page",
    previous: "Previous page",
    next: "Next page",
    price: "Price",
    day: "Day",
    asset: "Asset",
    assets: "assets",
    consulted: "Retrieved",
    stale: "Update failed · last available quotes",
    benchmarks: "Indices & currencies",
    quoteTime: "Quote time",
    noQuotes: "Market data is currently unavailable",
  },
  zh: {
    title: "市场",
    format: "市场显示方式",
    table: "表格",
    sectors: "行业",
    page: "页",
    previous: "上一页",
    next: "下一页",
    price: "价格",
    day: "日",
    asset: "资产",
    assets: "项资产",
    consulted: "查询时间",
    stale: "更新失败 · 显示最近可用行情",
    benchmarks: "指数与汇率",
    quoteTime: "行情时间",
    noQuotes: "当前无法获取市场数据",
  },
} satisfies Record<Language, Record<string, string>>;
