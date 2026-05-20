"use client";

import { useEffect, useMemo, useState } from "react";
import { type Language } from "@/lib/i18n";

type CommodityQuote = {
  symbol: string;
  label: string;
  price: number;
  change: number | null;
  changePercent: number | null;
  currency: string;
  marketTime: string | null;
};

type CommodityTickerProps = {
  lang: Language;
};

const statusText: Record<Language, { loading: string; unavailable: string }> = {
  pt: {
    loading: "Carregando...",
    unavailable: "Cotações indisponíveis no momento",
  },
  en: {
    loading: "Loading...",
    unavailable: "Quotes unavailable right now",
  },
  zh: {
    loading: "加载中...",
    unavailable: "当前行情不可用",
  },
};

export function CommodityTicker({ lang }: CommodityTickerProps) {
  const [quotes, setQuotes] = useState<CommodityQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(lang === "pt" ? "pt-BR" : lang === "zh" ? "zh-CN" : "en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }),
    [lang],
  );

  useEffect(() => {
    let ignore = false;

    async function loadQuotes() {
      try {
        const response = await fetch(`/api/commodities?lang=${lang}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as {
          commodities?: CommodityQuote[];
        };

        if (!ignore) {
          setQuotes(data.commodities ?? []);
        }
      } catch {
        if (!ignore) {
          setQuotes([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadQuotes();
    const interval = window.setInterval(loadQuotes, 60_000);

    return () => {
      ignore = true;
      window.clearInterval(interval);
    };
  }, [lang]);

  if (isLoading || quotes.length === 0) {
    return (
      <div className="h-7 overflow-hidden border-b border-white/10 bg-primary text-primary-foreground">
        <div className="mx-auto flex h-full max-w-6xl items-center px-6 text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">
          {isLoading ? statusText[lang].loading : statusText[lang].unavailable}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-7 overflow-hidden border-b border-white/10 bg-primary text-primary-foreground">
      <div className="commodity-marquee">
        <div className="commodity-marquee-group">
          {quotes.map((quote) => (
            <CommodityTickerItem
              key={quote.symbol}
              quote={quote}
              numberFormatter={numberFormatter}
            />
          ))}
        </div>
        <div className="commodity-marquee-group" aria-hidden>
          {quotes.map((quote) => (
            <CommodityTickerItem
              key={`${quote.symbol}-duplicate`}
              quote={quote}
              numberFormatter={numberFormatter}
              tabIndex={-1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CommodityTickerItem({
  quote,
  numberFormatter,
  tabIndex,
}: {
  quote: CommodityQuote;
  numberFormatter: Intl.NumberFormat;
  tabIndex?: number;
}) {
  const changePercent = quote.changePercent ?? 0;
  const directionClass =
    changePercent > 0
      ? "text-emerald-300"
      : changePercent < 0
        ? "text-red-300"
        : "text-white/65";
  const yahooFinanceUrl = `https://finance.yahoo.com/quote/${encodeURIComponent(
    quote.symbol,
  )}`;

  return (
    <a
      href={yahooFinanceUrl}
      target="_blank"
      rel="noreferrer"
      tabIndex={tabIndex}
      className="flex h-full shrink-0 items-center border-r border-white/12 px-3 text-[11px] leading-none transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      aria-label={`${quote.label}: ${quote.currency} ${numberFormatter.format(
        quote.price,
      )}. Yahoo Finance`}
    >
      <span className="font-semibold uppercase tracking-[0.08em] text-white">
        {quote.label}
      </span>
      <span className="ml-2 text-white/75">
        {quote.currency} {numberFormatter.format(quote.price)}
      </span>
      <span className={`ml-2 font-semibold ${directionClass}`}>
        {changePercent > 0 ? "+" : ""}
        {numberFormatter.format(changePercent)}%
      </span>
    </a>
  );
}
