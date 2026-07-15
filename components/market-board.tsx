"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Language } from "@/lib/i18n";
import type { MarketOverviewResponse, MarketQuote } from "@/lib/market";
import { cn } from "@/lib/utils";

type MarketBoardProps = {
  active: boolean;
  lang: Language;
};

const refreshIntervalMs = 60_000;
const pageDurationMs = 30_000;

const marketText: Record<
  Language,
  {
    loading: string;
    unavailable: string;
    columns: {
      asset: string;
      last: string;
      low: string;
      previousClose: string;
      open: string;
      bid: string;
      ask: string;
      volume: string;
      day: string;
      week: string;
      month: string;
      year: string;
      twelveMonths: string;
    };
  }
> = {
  pt: {
    loading: "Carregando investimentos",
    unavailable: "Dados de mercado indisponíveis no momento",
    columns: {
      asset: "Ativo",
      last: "Último",
      low: "Mínimo",
      previousClose: "Fechamento ant.",
      open: "Abertura",
      bid: "Compra",
      ask: "Venda",
      volume: "Volume",
      day: "Dia",
      week: "Semana",
      month: "Mês",
      year: "Ano",
      twelveMonths: "12 meses",
    },
  },
  en: {
    loading: "Loading investments",
    unavailable: "Market data is currently unavailable",
    columns: {
      asset: "Asset",
      last: "Last",
      low: "Low",
      previousClose: "Prev. close",
      open: "Open",
      bid: "Bid",
      ask: "Ask",
      volume: "Volume",
      day: "Day",
      week: "Week",
      month: "Month",
      year: "Year",
      twelveMonths: "12 months",
    },
  },
  zh: {
    loading: "正在加载投资行情",
    unavailable: "当前无法获取市场数据",
    columns: {
      asset: "资产",
      last: "最新",
      low: "最低",
      previousClose: "前收盘",
      open: "开盘",
      bid: "买价",
      ask: "卖价",
      volume: "成交量",
      day: "日",
      week: "周",
      month: "月",
      year: "年",
      twelveMonths: "12个月",
    },
  },
};

const tableHeaderHeight = 28;
const tableRowHeight = 24;

function getPageSize(containerHeight: number) {
  return Math.max(
    1,
    Math.floor((containerHeight - tableHeaderHeight) / tableRowHeight),
  );
}

export function MarketBoard({ active, lang }: MarketBoardProps) {
  const content = marketText[lang];
  const [investments, setInvestments] = useState<MarketQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [pageSize, setPageSize] = useState(14);
  const [currentPage, setCurrentPage] = useState(0);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const locale = lang === "pt" ? "pt-BR" : lang === "zh" ? "zh-CN" : "en-US";
  const numberFormatters = useMemo(
    () =>
      new Map([
        [
          2,
          new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        ],
        [
          4,
          new Intl.NumberFormat(locale, {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
          }),
        ],
      ]),
    [locale],
  );
  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [locale],
  );
  const volumeFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        notation: "compact",
        maximumFractionDigits: 1,
      }),
    [locale],
  );
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) {
      return;
    }

    const updatePageSize = (height = container.clientHeight) => {
      setPageSize(getPageSize(height));
    };

    updatePageSize();
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        updatePageSize(entry.contentRect.height);
      }
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadInvestments() {
      try {
        const response = await fetch("/api/market-overview", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`Market request failed with ${response.status}`);
        }

        const data = (await response.json()) as MarketOverviewResponse;
        if (!ignore) {
          setInvestments(data.investments ?? []);
          setHasError(false);
        }
      } catch {
        if (!ignore) {
          setHasError(true);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadInvestments();
    const interval = window.setInterval(loadInvestments, refreshIntervalMs);

    return () => {
      ignore = true;
      window.clearInterval(interval);
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(investments.length / pageSize));

  useEffect(() => {
    setCurrentPage((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  useEffect(() => {
    if (active) {
      setCurrentPage(0);
    }
  }, [active]);

  useEffect(() => {
    if (!active || totalPages <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentPage((current) => (current + 1) % totalPages);
    }, pageDurationMs);

    return () => window.clearInterval(interval);
  }, [active, totalPages]);

  const visibleCount = Math.min(pageSize, investments.length);
  const visibleInvestments = Array.from({ length: visibleCount }, (_, index) => {
    const assetIndex = (currentPage * pageSize + index) % investments.length;
    return investments[assetIndex];
  });

  function formatPrice(value: number | null, decimals: number) {
    if (value === null) {
      return "—";
    }

    return (
      (numberFormatters.get(decimals) ?? numberFormatters.get(2))?.format(
        value,
      ) ?? String(value)
    );
  }

  return (
    <div
      aria-hidden={!active}
      className={cn(
        "absolute inset-x-0 top-36 bottom-20 z-20 overflow-hidden bg-black text-white transition-opacity duration-1000",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div
        ref={tableContainerRef}
        className="h-full overflow-hidden [&>[data-slot=table-container]]:h-full"
      >
        {isLoading ? (
          <MarketTableSkeleton rows={pageSize} />
        ) : visibleInvestments.length > 0 ? (
          <Table className="h-full table-fixed border-collapse font-mono text-[0.63rem] leading-none lg:text-[0.68rem] xl:text-[0.72rem]">
              <TableHeader className="bg-[#24272b] text-white/58">
                <TableRow className="h-7 border-white/10 hover:bg-[#24272b]">
                  <MarketTableHead className="w-[9.5rem] text-left">
                    {content.columns.asset}
                  </MarketTableHead>
                  <MarketTableHead>{content.columns.last}</MarketTableHead>
                  <MarketTableHead>{content.columns.low}</MarketTableHead>
                  <MarketTableHead className="w-[7.5rem]">
                    {content.columns.previousClose}
                  </MarketTableHead>
                  <MarketTableHead>{content.columns.open}</MarketTableHead>
                  <MarketTableHead>{content.columns.bid}</MarketTableHead>
                  <MarketTableHead>{content.columns.ask}</MarketTableHead>
                  <MarketTableHead className="w-[6.5rem]">
                    {content.columns.volume}
                  </MarketTableHead>
                  <MarketTableHead>{content.columns.day}</MarketTableHead>
                  <MarketTableHead>{content.columns.week}</MarketTableHead>
                  <MarketTableHead>{content.columns.month}</MarketTableHead>
                  <MarketTableHead>{content.columns.year}</MarketTableHead>
                  <MarketTableHead>{content.columns.twelveMonths}</MarketTableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleInvestments.map((investment) => (
                  <TableRow
                    key={investment.symbol}
                    className="h-6 border-white/5 odd:bg-[#08090b] even:bg-[#15171a] hover:bg-[#20242a]"
                  >
                    <TableCell className="h-6 overflow-hidden px-2 py-0 text-left font-sans">
                      <div className="flex min-w-0 items-center gap-2">
                        <CategoryMark category={investment.category} />
                        <div className="min-w-0">
                          <p className="truncate text-[0.7rem] font-semibold leading-none text-white">
                            {investment.ticker}
                          </p>
                          <p className="mt-0.5 truncate text-[0.52rem] leading-none text-white/72">
                            {investment.label}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <MarketNumberCell
                      value={investment.price}
                      decimals={investment.decimals}
                      format={formatPrice}
                      emphasized
                    />
                    <MarketNumberCell
                      value={investment.low}
                      decimals={investment.decimals}
                      format={formatPrice}
                    />
                    <MarketNumberCell
                      value={investment.previousClose}
                      decimals={investment.decimals}
                      format={formatPrice}
                    />
                    <MarketNumberCell
                      value={investment.open}
                      decimals={investment.decimals}
                      format={formatPrice}
                    />
                    <MarketNumberCell
                      value={investment.bid}
                      decimals={investment.decimals}
                      format={formatPrice}
                    />
                    <MarketNumberCell
                      value={investment.ask}
                      decimals={investment.decimals}
                      format={formatPrice}
                    />
                    <TableCell className="h-6 px-2 py-0 text-right text-white/68">
                      {investment.volume === null
                        ? "—"
                        : volumeFormatter.format(investment.volume)}
                    </TableCell>
                    <MarketPercentCell
                      value={investment.dayChangePercent}
                      formatter={percentFormatter}
                    />
                    <MarketPercentCell
                      value={investment.weekChangePercent}
                      formatter={percentFormatter}
                    />
                    <MarketPercentCell
                      value={investment.monthChangePercent}
                      formatter={percentFormatter}
                    />
                    <MarketPercentCell
                      value={investment.yearChangePercent}
                      formatter={percentFormatter}
                    />
                    <MarketPercentCell
                      value={investment.twelveMonthChangePercent}
                      formatter={percentFormatter}
                    />
                  </TableRow>
                ))}
              </TableBody>
          </Table>
        ) : (
          <div className="grid h-full place-items-center px-6 text-center text-sm uppercase tracking-[0.16em] text-white/45">
            {hasError ? content.unavailable : content.loading}
          </div>
        )}
      </div>
    </div>
  );
}

function MarketTableHead({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <TableHead
      className={cn(
        "h-7 px-2 text-right text-[0.56rem] font-semibold uppercase tracking-[0.08em] text-white/58",
        className,
      )}
    >
      {children}
    </TableHead>
  );
}

function MarketNumberCell({
  value,
  decimals,
  format,
  emphasized = false,
}: {
  value: number | null;
  decimals: number;
  format: (value: number | null, decimals: number) => string;
  emphasized?: boolean;
}) {
  return (
    <TableCell
      className={cn(
        "h-6 px-2 py-0 text-right text-white/68",
        emphasized && "font-semibold text-white",
      )}
    >
      {format(value, decimals)}
    </TableCell>
  );
}

function MarketPercentCell({
  value,
  formatter,
}: {
  value: number | null;
  formatter: Intl.NumberFormat;
}) {
  return (
    <TableCell
      className={cn(
        "h-6 px-2 py-0 text-right font-semibold",
        value === null
          ? "text-white/28"
          : value > 0
            ? "text-emerald-300"
            : value < 0
              ? "text-red-300"
              : "text-white/58",
      )}
    >
      {value === null
        ? "—"
        : `${value > 0 ? "+" : ""}${formatter.format(value)}%`}
    </TableCell>
  );
}

function CategoryMark({ category }: { category: MarketQuote["category"] }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-2.5 shrink-0 rounded-[0.2rem]",
        category === "stock" && "bg-sky-300",
        category === "index" && "bg-violet-300",
        category === "currency" && "bg-emerald-300",
        category === "commodity" && "bg-amber-300",
      )}
    />
  );
}

function MarketTableSkeleton({ rows }: { rows: number }) {
  return (
    <div className="flex h-full flex-col gap-px bg-black p-2" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="grid h-6 grid-cols-[9rem_repeat(12,minmax(0,1fr))] items-center gap-3 px-2 odd:bg-white/4 even:bg-white/7"
        >
          <Skeleton className="h-2.5 w-20 bg-white/12" />
          {Array.from({ length: 12 }, (_, cellIndex) => (
            <Skeleton key={cellIndex} className="ml-auto h-2 w-10 bg-white/10" />
          ))}
        </div>
      ))}
    </div>
  );
}
