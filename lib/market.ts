export type MarketCategory = "stock" | "index" | "currency" | "commodity";

export type MarketQuote = {
  symbol: string;
  ticker: string;
  label: string;
  category: MarketCategory;
  decimals: number;
  price: number;
  low: number | null;
  previousClose: number | null;
  open: number | null;
  bid: number | null;
  ask: number | null;
  volume: number | null;
  dayChangePercent: number | null;
  weekChangePercent: number | null;
  monthChangePercent: number | null;
  yearChangePercent: number | null;
  twelveMonthChangePercent: number | null;
  marketTime: string | null;
};

export type MarketOverviewResponse = {
  investments: MarketQuote[];
  updatedAt: string;
};
