"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Factory,
  HeartPulse,
  Landmark,
  Layers3,
  Leaf,
  Mountain,
  ShoppingCart,
  Trees,
  UtilityPole,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageVisible } from "@/hooks/use-page-visible";
import type { Language } from "@/lib/i18n";
import type { MarketQuote } from "@/lib/market";
import {
  groupMarketQuotes,
  marketAssetLabel,
  marketQuoteUnit,
  marketViewText,
  type MarketSector,
} from "@/lib/market-sectors";
import { showcaseLocales } from "@/lib/showcase";

const sectorIcons = {
  energy: Factory,
  mining: Mountain,
  finance: Landmark,
  retail: ShoppingCart,
  infrastructure: UtilityPole,
  commodities: Leaf,
  property: Building2,
  health: HeartPulse,
  paper: Trees,
  other: Layers3,
};
const rowDuration = 8_000;

export function MarketSectors({
  investments,
  lang,
  active,
}: {
  investments: MarketQuote[];
  lang: Language;
  active: boolean;
}) {
  const content = marketViewText[lang];
  const { groups, benchmarks } = useMemo(
    () => groupMarketQuotes(investments),
    [investments],
  );
  const [capacity, setCapacity] = useState(6);
  const [gridRows, setGridRows] = useState(2);
  const [rows, setRows] = useState(3);
  const [page, setPage] = useState(0);
  const [assetPages, setAssetPages] = useState<Record<string, number>>({});
  const gridRef = useRef<HTMLDivElement>(null);
  const pageVisible = usePageVisible();
  const totalPages = Math.max(1, Math.ceil(groups.length / capacity));
  const currentPage = Math.min(page, totalPages - 1);
  const visibleGroups = groups.slice(
    currentPage * capacity,
    (currentPage + 1) * capacity,
  );
  const maxAssetPages = Math.max(
    1,
    ...visibleGroups.map((group) => Math.ceil(group.quotes.length / rows)),
  );
  const groupDuration = Math.max(30_000, maxAssetPages * rowDuration);
  const formatters = useMemo(
    () => ({
      price: new Intl.NumberFormat(showcaseLocales[lang], {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      precise: new Intl.NumberFormat(showcaseLocales[lang], {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }),
      percent: new Intl.NumberFormat(showcaseLocales[lang], {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        signDisplay: "exceptZero",
      }),
    }),
    [lang],
  );

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height) return;
      const nextGridRows = height < 300 ? 1 : 2;
      setGridRows(nextGridRows);
      setCapacity((width >= 1000 ? 3 : width >= 620 ? 2 : 1) * nextGridRows);
      // Header, column labels and pager leave at least one full quote row.
      setRows(
        Math.max(
          1,
          Math.min(
            6,
            Math.floor(
              ((height - 14 * (nextGridRows - 1)) / nextGridRows - 106) / 26,
            ),
          ),
        ),
      );
    });
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active || !pageVisible || maxAssetPages <= 1) return;
    const interval = window.setInterval(
      () =>
        setAssetPages((current) => {
          const next = { ...current };
          for (const { sector, quotes } of groups.slice(
            currentPage * capacity,
            (currentPage + 1) * capacity,
          )) {
            next[sector.id] =
              ((current[sector.id] ?? 0) + 1) % Math.ceil(quotes.length / rows);
          }
          return next;
        }),
      rowDuration,
    );
    return () => window.clearInterval(interval);
  }, [active, pageVisible, groups, currentPage, capacity, rows, maxAssetPages]);

  useEffect(() => {
    if (!active || !pageVisible || totalPages <= 1) return;
    const timer = window.setTimeout(() => {
      setPage(
        (current) => (Math.min(current, totalPages - 1) + 1) % totalPages,
      );
      setAssetPages({});
    }, groupDuration);
    return () => window.clearTimeout(timer);
  }, [active, pageVisible, currentPage, totalPages, groupDuration]);

  function price(quote: MarketQuote) {
    return Number.isFinite(quote.price)
      ? (quote.decimals === 4 ? formatters.precise : formatters.price).format(
          quote.price,
        )
      : "—";
  }
  function change(quote: MarketQuote) {
    const value = quote.dayChangePercent;
    return value !== null && Number.isFinite(value)
      ? `${formatters.percent.format(value)}%`
      : "—";
  }
  function trend(quote: MarketQuote) {
    return quote.dayChangePercent === null
      ? "neutral"
      : quote.dayChangePercent > 0
        ? "up"
        : quote.dayChangePercent < 0
          ? "down"
          : "neutral";
  }
  function turnPage(delta: number) {
    setPage(Math.max(0, Math.min(totalPages - 1, currentPage + delta)));
    setAssetPages({});
  }

  return (
    <div className="market-sector-view" hidden={!active}>
      <div
        className="market-sector-grid"
        ref={gridRef}
        style={
          {
            "--sector-columns": capacity / gridRows,
            "--sector-grid-rows": gridRows,
          } as CSSProperties
        }
      >
        {visibleGroups.map(({ sector, quotes }) => {
          const Icon = sectorIcons[sector.id as MarketSector["id"]];
          const count = Math.ceil(quotes.length / rows);
          const assetPage = Math.min(assetPages[sector.id] ?? 0, count - 1);
          const start = assetPage * rows;
          return (
            <article
              key={sector.id}
              className="market-sector-card"
              data-sector={sector.id}
              style={{ "--sector-color": sector.color } as CSSProperties}
              aria-labelledby={`sector-${sector.id}`}
            >
              <header>
                <Icon aria-hidden="true" />
                <h3 id={`sector-${sector.id}`}>{sector.labels[lang]}</h3>
              </header>
              <div className="market-sector-columns" aria-hidden="true">
                <span>{content.asset}</span>
                <span>{content.price}</span>
                <span>{content.day}</span>
              </div>
              <ul className="market-sector-rows">
                {quotes.slice(start, start + rows).map((quote) => (
                  <li
                    key={quote.symbol}
                    data-symbol={quote.symbol}
                    title={
                      quote.marketTime
                        ? `${content.quoteTime}: ${new Date(quote.marketTime).toLocaleString(showcaseLocales[lang])}`
                        : undefined
                    }
                  >
                    <span
                      className="market-sector-asset"
                      title={marketAssetLabel(quote, lang)}
                    >
                      {quote.category === "commodity"
                        ? marketAssetLabel(quote, lang)
                        : quote.ticker}
                    </span>
                    <span className="market-sector-price">
                      <small>{marketQuoteUnit(quote, lang)}</small>{" "}
                      {price(quote)}
                    </span>
                    <span className="market-change" data-trend={trend(quote)}>
                      {change(quote)}
                    </span>
                  </li>
                ))}
              </ul>
              <footer>
                <span>
                  {quotes.length} {content.assets}
                </span>
                <div className="market-pagination">
                  {count > 1 ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={assetPage === 0}
                        aria-label={`${content.previous}: ${sector.labels[lang]}`}
                        onClick={() =>
                          setAssetPages((current) => ({
                            ...current,
                            [sector.id]: assetPage - 1,
                          }))
                        }
                      >
                        <ChevronLeft />
                      </Button>
                      <span>
                        {start + 1}–{Math.min(start + rows, quotes.length)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={assetPage === count - 1}
                        aria-label={`${content.next}: ${sector.labels[lang]}`}
                        onClick={() =>
                          setAssetPages((current) => ({
                            ...current,
                            [sector.id]: assetPage + 1,
                          }))
                        }
                      >
                        <ChevronRight />
                      </Button>
                    </>
                  ) : null}
                </div>
              </footer>
            </article>
          );
        })}
      </div>
      <div className="market-sector-pagination market-pagination">
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={currentPage === 0}
          aria-label={content.previous}
          onClick={() => turnPage(-1)}
        >
          <ChevronLeft />
        </Button>
        <span>
          {content.page} {currentPage + 1} / {totalPages}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={currentPage === totalPages - 1}
          aria-label={content.next}
          onClick={() => turnPage(1)}
        >
          <ChevronRight />
        </Button>
      </div>
      {benchmarks.length > 0 ? (
        <div
          className="market-benchmarks"
          aria-label={content.benchmarks}
          tabIndex={0}
        >
          {benchmarks.map((quote) => (
            <div key={quote.symbol} data-symbol={quote.symbol}>
              <strong>{quote.ticker}</strong>
              <span>
                {marketQuoteUnit(quote, lang)} {price(quote)}
              </span>
              <span className="market-change" data-trend={trend(quote)}>
                {change(quote)}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
