import YahooFinance from "yahoo-finance2";
import { NextResponse } from "next/server";
import type {
  MarketCategory,
  MarketOverviewResponse,
  MarketQuote,
} from "@/lib/market";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type MarketAsset = {
  symbol: string;
  ticker: string;
  label: string;
  category: MarketCategory;
  decimals?: number;
};

type HistoricalReferences = {
  week: number | null;
  month: number | null;
  year: number | null;
  twelveMonths: number | null;
  latestLow: number | null;
  latestOpen: number | null;
  latestVolume: number | null;
  previousClose: number | null;
};

type HistoricalCacheEntry = {
  expiresAt: number;
  references: HistoricalReferences;
};

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

const marketAssets: MarketAsset[] = [
  { symbol: "ABEV3.SA", ticker: "ABEV3", label: "Ambev", category: "stock" },
  { symbol: "B3SA3.SA", ticker: "B3SA3", label: "B3", category: "stock" },
  { symbol: "BBAS3.SA", ticker: "BBAS3", label: "Banco do Brasil", category: "stock" },
  { symbol: "BBDC4.SA", ticker: "BBDC4", label: "Bradesco", category: "stock" },
  { symbol: "BPAC11.SA", ticker: "BPAC11", label: "BTG Pactual", category: "stock" },
  { symbol: "BRAP4.SA", ticker: "BRAP4", label: "Bradespar", category: "stock" },
  { symbol: "CMIG4.SA", ticker: "CMIG4", label: "Cemig", category: "stock" },
  { symbol: "CSNA3.SA", ticker: "CSNA3", label: "CSN", category: "stock" },
  { symbol: "CYRE3.SA", ticker: "CYRE3", label: "Cyrela", category: "stock" },
  { symbol: "ECOR3.SA", ticker: "ECOR3", label: "Ecorodovias", category: "stock" },
  { symbol: "EQTL3.SA", ticker: "EQTL3", label: "Equatorial", category: "stock" },
  { symbol: "GFSA3.SA", ticker: "GFSA3", label: "Gafisa", category: "stock" },
  { symbol: "GGBR4.SA", ticker: "GGBR4", label: "Gerdau", category: "stock" },
  { symbol: "GOAU4.SA", ticker: "GOAU4", label: "Metalúrgica Gerdau", category: "stock" },
  { symbol: "ITSA4.SA", ticker: "ITSA4", label: "Itaúsa", category: "stock" },
  { symbol: "ITUB4.SA", ticker: "ITUB4", label: "Itaú", category: "stock" },
  { symbol: "LREN3.SA", ticker: "LREN3", label: "Lojas Renner", category: "stock" },
  { symbol: "MGLU3.SA", ticker: "MGLU3", label: "Magazine Luiza", category: "stock" },
  { symbol: "MRVE3.SA", ticker: "MRVE3", label: "MRV", category: "stock" },
  { symbol: "PETR3.SA", ticker: "PETR3", label: "Petrobras ON", category: "stock" },
  { symbol: "PETR4.SA", ticker: "PETR4", label: "Petrobras PN", category: "stock" },
  { symbol: "PRIO3.SA", ticker: "PRIO3", label: "PRIO", category: "stock" },
  { symbol: "RADL3.SA", ticker: "RADL3", label: "Raia Drogasil", category: "stock" },
  { symbol: "RDOR3.SA", ticker: "RDOR3", label: "Rede D'Or", category: "stock" },
  { symbol: "RENT3.SA", ticker: "RENT3", label: "Localiza", category: "stock" },
  { symbol: "SUZB3.SA", ticker: "SUZB3", label: "Suzano", category: "stock" },
  { symbol: "USIM5.SA", ticker: "USIM5", label: "Usiminas", category: "stock" },
  { symbol: "VALE3.SA", ticker: "VALE3", label: "Vale", category: "stock" },
  { symbol: "WEGE3.SA", ticker: "WEGE3", label: "WEG", category: "stock" },
  { symbol: "^BVSP", ticker: "IBOV", label: "Ibovespa", category: "index" },
  { symbol: "^GSPC", ticker: "S&P 500", label: "S&P 500", category: "index" },
  { symbol: "^IXIC", ticker: "NASDAQ", label: "Nasdaq", category: "index" },
  { symbol: "BRL=X", ticker: "USD/BRL", label: "Dólar", category: "currency", decimals: 4 },
  { symbol: "CNYBRL=X", ticker: "RMB/BRL", label: "Yuan", category: "currency", decimals: 4 },
  { symbol: "GC=F", ticker: "OURO", label: "Ouro", category: "commodity" },
  { symbol: "SI=F", ticker: "PRATA", label: "Prata", category: "commodity" },
  { symbol: "HG=F", ticker: "COBRE", label: "Cobre", category: "commodity", decimals: 4 },
  { symbol: "CL=F", ticker: "WTI", label: "Petróleo WTI", category: "commodity" },
  { symbol: "BZ=F", ticker: "BRENT", label: "Petróleo Brent", category: "commodity" },
  { symbol: "ZS=F", ticker: "SOJA", label: "Soja", category: "commodity" },
];

const historyCache = new Map<string, HistoricalCacheEntry>();
const pendingHistory = new Map<string, Promise<HistoricalReferences>>();
const historyTtlMs = 30 * 60 * 1000;
const emptyReferences: HistoricalReferences = {
  week: null,
  month: null,
  year: null,
  twelveMonths: null,
  latestLow: null,
  latestOpen: null,
  latestVolume: null,
  previousClose: null,
};

function subtractUtcDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() - days);
  return result;
}

function subtractUtcMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setUTCMonth(result.getUTCMonth() - months);
  return result;
}

function findReferenceClose(
  quotes: Array<{ date: Date; close: number | null }>,
  target: Date,
) {
  for (let index = quotes.length - 1; index >= 0; index -= 1) {
    const quote = quotes[index];
    if (quote.date <= target && quote.close !== null) {
      return quote.close;
    }
  }

  return quotes.find((quote) => quote.close !== null)?.close ?? null;
}

async function fetchHistoricalReferences(symbol: string) {
  const now = new Date();
  const period1 = subtractUtcDays(now, 400);
  const result = await yahooFinance.chart(symbol, {
    period1,
    interval: "1d",
  });
  const quotes = result.quotes
    .filter((quote) => quote.close !== null)
    .sort((first, second) => first.date.getTime() - second.date.getTime());

  if (quotes.length === 0) {
    return emptyReferences;
  }

  const latestQuote = quotes.at(-1);
  const previousQuote = quotes
    .slice(0, -1)
    .reverse()
    .find((quote) => quote.close !== null);

  return {
    week: findReferenceClose(quotes, subtractUtcDays(now, 7)),
    month: findReferenceClose(quotes, subtractUtcMonths(now, 1)),
    year: findReferenceClose(
      quotes,
      new Date(Date.UTC(now.getUTCFullYear(), 0, 1)),
    ),
    twelveMonths: findReferenceClose(quotes, subtractUtcMonths(now, 12)),
    latestLow: positiveOrNull(latestQuote?.low ?? undefined),
    latestOpen: positiveOrNull(latestQuote?.open ?? undefined),
    latestVolume: positiveOrNull(latestQuote?.volume ?? undefined),
    previousClose: previousQuote?.close ?? null,
  } satisfies HistoricalReferences;
}

async function getHistoricalReferences(symbol: string) {
  const cached = historyCache.get(symbol);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.references;
  }

  const pending = pendingHistory.get(symbol);
  if (pending) {
    return pending;
  }

  const request = fetchHistoricalReferences(symbol)
    .then((references) => {
      historyCache.set(symbol, {
        expiresAt: Date.now() + historyTtlMs,
        references,
      });
      return references;
    })
    .catch(() => emptyReferences)
    .finally(() => {
      pendingHistory.delete(symbol);
    });

  pendingHistory.set(symbol, request);
  return request;
}

async function loadHistoricalReferences() {
  const references = new Map<string, HistoricalReferences>();
  const batchSize = 6;

  for (let index = 0; index < marketAssets.length; index += batchSize) {
    const batch = marketAssets.slice(index, index + batchSize);
    const results = await Promise.all(
      batch.map(async (asset) => ({
        symbol: asset.symbol,
        references: await getHistoricalReferences(asset.symbol),
      })),
    );

    results.forEach((result) => {
      references.set(result.symbol, result.references);
    });
  }

  return references;
}

function calculateChange(current: number, reference: number | null) {
  if (reference === null || reference === 0) {
    return null;
  }

  return ((current - reference) / reference) * 100;
}

function positiveOrNull(value: number | undefined) {
  return value === undefined || value <= 0 ? null : value;
}

function toIsoString(value: Date | undefined) {
  return value instanceof Date ? value.toISOString() : null;
}

export async function GET() {
  const [quoteResults, historicalReferences] = await Promise.all([
    Promise.allSettled(
      marketAssets.map((asset) => yahooFinance.quoteCombine(asset.symbol)),
    ),
    loadHistoricalReferences(),
  ]);

  const investments = quoteResults.flatMap<MarketQuote>((result, index) => {
    if (result.status !== "fulfilled") {
      return [];
    }

    const quote = result.value;
    const asset = marketAssets[index];
    const price = quote.regularMarketPrice;
    if (price === undefined) {
      return [];
    }

    const references = historicalReferences.get(asset.symbol) ?? emptyReferences;
    return [
      {
        symbol: asset.symbol,
        ticker: asset.ticker,
        label: asset.label,
        category: asset.category,
        decimals: asset.decimals ?? 2,
        price,
        low:
          positiveOrNull(quote.regularMarketDayLow) ?? references.latestLow,
        previousClose:
          positiveOrNull(quote.regularMarketPreviousClose) ??
          references.previousClose,
        open: positiveOrNull(quote.regularMarketOpen) ?? references.latestOpen,
        bid: positiveOrNull(quote.bid),
        ask: positiveOrNull(quote.ask),
        volume:
          positiveOrNull(quote.regularMarketVolume) ?? references.latestVolume,
        dayChangePercent: quote.regularMarketChangePercent ?? null,
        weekChangePercent: calculateChange(price, references.week),
        monthChangePercent: calculateChange(price, references.month),
        yearChangePercent: calculateChange(price, references.year),
        twelveMonthChangePercent:
          calculateChange(price, references.twelveMonths) ??
          quote.fiftyTwoWeekChangePercent ??
          null,
        marketTime: toIsoString(quote.regularMarketTime),
      },
    ];
  });

  const response: MarketOverviewResponse = {
    investments,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
