"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { RadioTower, TrendingDown, TrendingUp } from "lucide-react";
import { HeroVideoBackground } from "@/components/hero-video-background";
import { MarketBoard } from "@/components/market-board";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { copy, type Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type CommodityQuote = {
  symbol: string;
  label: string;
  price: number;
  change: number | null;
  changePercent: number | null;
  currency: string;
  marketTime: string | null;
};

type ShowcaseScreenProps = {
  lang: Language;
};

type PresentationSlide = "original" | "map" | "market";
type DisplayMode = "auto" | PresentationSlide;

const marketPhrases = [
  "Sourcing internacional",
  "Trading estruturado",
  "Commodities",
  "Importacao",
  "Exportacao",
  "Inteligencia comercial",
  "China Brasil",
] as const;

const originalSlideDurationMs = 30_000;
const mapSlideDurationMs = 300_000;
const marketSlideDurationMs = 300_000;
const autoSlideOrder: PresentationSlide[] = ["original", "map", "market"];
const slideDurations: Record<PresentationSlide, number> = {
  original: originalSlideDurationMs,
  map: mapSlideDurationMs,
  market: marketSlideDurationMs,
};
const financeMonitorEmbedUrl =
  "https://finance.worldmonitor.app/embed.html?layers=stockExchanges,financialCenters,centralBanks,commodityHubs,gulfInvestments,tradeRoutes,cables,waterways&center=8,8&zoom=1.45&theme=dark&variant=finance";
const investmentPanelSymbols = ["GC=F", "SI=F", "HG=F", "CL=F", "BZ=F", "ZS=F"];

function rotateQuotes(quotes: CommodityQuote[], offset: number) {
  if (quotes.length === 0) {
    return [];
  }

  const normalizedOffset = offset % quotes.length;
  return [
    ...quotes.slice(normalizedOffset),
    ...quotes.slice(0, normalizedOffset),
  ];
}

const statusText: Record<
  Language,
  { live: string; loading: string; updated: string }
> = {
  pt: {
    live: "Ao vivo",
    loading: "Cotações em atualização",
    updated: "Atualizado",
  },
  en: {
    live: "Live market",
    loading: "Updating quotes",
    updated: "Updated",
  },
  zh: {
    live: "实时市场",
    loading: "行情更新中",
    updated: "已更新",
  },
};

export function ShowcaseScreen({ lang }: ShowcaseScreenProps) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("auto");
  const [autoSlide, setAutoSlide] = useState<PresentationSlide>("original");
  const autoRotationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (autoRotationTimerRef.current !== null) {
      window.clearTimeout(autoRotationTimerRef.current);
      autoRotationTimerRef.current = null;
    }

    if (displayMode !== "auto") {
      return;
    }

    autoRotationTimerRef.current = window.setTimeout(() => {
      setAutoSlide((current) => {
        const currentIndex = autoSlideOrder.indexOf(current);
        return autoSlideOrder[(currentIndex + 1) % autoSlideOrder.length];
      });
    }, slideDurations[autoSlide]);

    return () => {
      if (autoRotationTimerRef.current !== null) {
        window.clearTimeout(autoRotationTimerRef.current);
        autoRotationTimerRef.current = null;
      }
    };
  }, [autoSlide, displayMode]);

  function handleModeChange(mode: DisplayMode) {
    if (autoRotationTimerRef.current !== null) {
      window.clearTimeout(autoRotationTimerRef.current);
      autoRotationTimerRef.current = null;
    }

    setDisplayMode(mode);
    if (mode === "auto") {
      setAutoSlide("original");
    }
  }

  const activeSlide = displayMode === "auto" ? autoSlide : displayMode;

  return (
    <main className="relative isolate h-svh min-h-[640px] overflow-hidden bg-[#071625] text-white">
      <InstitutionalSlide lang={lang} activeSlide={activeSlide} />
      <DisplayModeControl mode={displayMode} onModeChange={handleModeChange} />
    </main>
  );
}

function DisplayModeControl({
  mode,
  onModeChange,
}: {
  mode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
}) {
  const options: Array<{ value: DisplayMode; label: string }> = [
    { value: "auto", label: "Auto" },
    { value: "original", label: "Original" },
    { value: "map", label: "Mapa" },
    { value: "market", label: "Mercado" },
  ];

  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(value) => {
        if (value) {
          onModeChange(value as DisplayMode);
        }
      }}
      spacing={0}
      size="sm"
      aria-label="Modo de exibição"
      className="absolute bottom-2 left-2 z-30 rounded-md border border-white/10 bg-[#071625]/38 p-1 opacity-15 shadow-[0_12px_42px_-24px_rgba(0,0,0,0.95)] backdrop-blur-md transition-opacity duration-200 hover:opacity-100 focus-within:opacity-100"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.label}
          className="h-7 rounded px-2 text-[0.62rem] uppercase tracking-[0.13em] text-white/60 hover:bg-white/10 hover:text-white data-[state=on]:bg-white/14 data-[state=on]:text-white sm:text-[0.68rem] sm:tracking-[0.16em]"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

function InstitutionalSlide({
  lang,
  activeSlide,
}: {
  lang: Language;
  activeSlide: PresentationSlide;
}) {
  const content = copy[lang];
  const [quotes, setQuotes] = useState<CommodityQuote[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(
        lang === "pt" ? "pt-BR" : lang === "zh" ? "zh-CN" : "en-US",
        {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        },
      ),
    [lang],
  );

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(
        lang === "pt" ? "pt-BR" : lang === "zh" ? "zh-CN" : "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      ),
    [lang],
  );

  useEffect(() => {
    setCurrentTime(new Date());

    const clock = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 30_000);

    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadQuotes() {
      try {
        const response = await fetch(`/api/commodities?lang=${lang}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as {
          commodities?: CommodityQuote[];
          updatedAt?: string;
        };

        if (!ignore) {
          setQuotes(data.commodities ?? []);
          setUpdatedAt(data.updatedAt ?? new Date().toISOString());
        }
      } catch {
        if (!ignore) {
          setQuotes([]);
          setUpdatedAt(null);
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

  const marqueeQuotes = quotes.length > 0 ? quotes : [];
  const topTickerQuotes = rotateQuotes(marqueeQuotes, 0);
  const bottomTickerQuotes = rotateQuotes(
    marqueeQuotes,
    Math.ceil(marqueeQuotes.length / 2),
  );
  const footerTickerQuotes = rotateQuotes(
    marqueeQuotes,
    Math.ceil(marqueeQuotes.length / 3),
  );
  const footerTickerQuotesReverse = rotateQuotes(
    marqueeQuotes,
    Math.ceil((marqueeQuotes.length * 2) / 3),
  );
  const showFinanceMap = activeSlide === "map";
  const showMarketBoard = activeSlide === "market";

  return (
    <div className="absolute inset-0 isolate">
      <div
        className={cn(
          "absolute inset-0 -z-20 transition-opacity duration-1000",
          activeSlide === "original" ? "opacity-100" : "opacity-0",
        )}
      >
        <HeroVideoBackground />
      </div>
      <FinanceMapLayer
        active={showFinanceMap}
        quotes={marqueeQuotes}
        numberFormatter={numberFormatter}
        loadingLabel={statusText[lang].loading}
      />
      <MarketBoard active={showMarketBoard} lang={lang} />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,22,37,0.88)_0%,rgba(7,22,37,0.56)_34%,rgba(7,22,37,0.76)_70%,rgba(7,22,37,0.95)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_26%,rgba(90,180,210,0.22),transparent_34%),linear-gradient(90deg,rgba(4,14,25,0.64),rgba(4,14,25,0.16)_48%,rgba(4,14,25,0.62))]" />

      <section className="relative z-10 h-full">
        <div className="absolute inset-x-0 top-0 border-b border-white/12 bg-[#071625]/82 backdrop-blur-md">
          <div className="grid h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-5 sm:gap-6 sm:px-8 lg:px-12">
            <div className="flex min-w-0 items-center justify-start gap-3 text-sm text-white/70">
              <Image
                src="/global/atc-light.png"
                alt="ATC China Brasil"
                width={72}
                height={72}
                priority
                className="size-[4.5rem] rounded-full"
              />
              <span className="hidden items-center gap-2 uppercase tracking-[0.18em] sm:inline-flex">
                <RadioTower className="size-4 text-emerald-300" />
                {statusText[lang].live}
              </span>
            </div>

            <div className="flex min-w-0 items-center justify-center">
              <div className="min-w-0 text-center">
                <p className="truncate text-sm font-semibold uppercase tracking-[0.28em] text-white">
                  Asete Trading Company
                </p>
                <p className="hidden text-xs uppercase tracking-[0.18em] text-white/54 sm:block">
                  Trading • Sourcing • Commodities
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center justify-end">
              {currentTime ? (
                <time className="font-mono text-xl font-semibold text-white">
                  {timeFormatter.format(currentTime)}
                </time>
              ) : null}
            </div>
          </div>

          <QuoteMarquee
            quotes={topTickerQuotes}
            numberFormatter={numberFormatter}
            loadingLabel={statusText[lang].loading}
          />
          <QuoteMarquee
            quotes={bottomTickerQuotes}
            numberFormatter={numberFormatter}
            loadingLabel={statusText[lang].loading}
            reverse
          />
        </div>

        <div className="absolute inset-x-5 top-[clamp(11.25rem,23svh,15rem)] bottom-[clamp(6.75rem,11svh,8.25rem)] grid content-center gap-5 sm:inset-x-8 md:gap-6 lg:inset-x-12 lg:grid-cols-[minmax(0,1fr)_clamp(18rem,25vw,27rem)] lg:items-center xl:gap-8">
          <div className="min-w-0 max-w-[70rem]">
            <Image
              src="/global/atc-icon-white.svg"
              alt="ATC China Brasil"
              width={1205}
              height={375}
              priority
              className="mb-[clamp(1rem,2.2svh,1.7rem)] h-auto w-[clamp(6rem,9vw,10rem)]"
            />
            <h1
              className={cn(
                "max-w-[70rem] text-[clamp(2.85rem,5.5vw,6.25rem)] font-semibold leading-[0.95] tracking-tight text-white transition-[text-shadow] duration-1000 lg:text-[clamp(3.15rem,4.7vw,5.55rem)] 2xl:text-[clamp(3.65rem,4.45vw,6.05rem)]",
                showFinanceMap &&
                  "[text-shadow:0_4px_34px_rgba(0,0,0,0.82),0_2px_12px_rgba(0,0,0,0.86)]",
              )}
            >
              {content.hero.title}
            </h1>
            <p
              className={cn(
                "mt-[clamp(0.9rem,2svh,1.5rem)] max-w-[58rem] text-[clamp(1.05rem,1.42vw,1.72rem)] leading-snug text-white/78 transition-[text-shadow] duration-1000",
                showFinanceMap &&
                  "[text-shadow:0_3px_22px_rgba(0,0,0,0.86),0_1px_8px_rgba(0,0,0,0.92)]",
              )}
            >
              {content.hero.description}
            </p>
          </div>

          <div className="hidden min-w-0 gap-3 self-end md:grid md:grid-cols-3 lg:grid-cols-1 lg:self-center">
            {content.hero.stats.map((stat) => (
              <article
                key={stat.label}
                className="min-h-20 rounded-xl border border-white/14 bg-[#071625]/64 p-4 shadow-[0_22px_80px_-54px_rgba(0,0,0,0.95)] backdrop-blur-md"
              >
                <p className="font-mono text-[clamp(1.65rem,2vw,2.55rem)] font-semibold leading-none text-white">
                  {stat.value}
                </p>
                <p className="mt-2.5 text-[clamp(0.82rem,0.92vw,1rem)] leading-snug text-white/64">
                  {stat.label}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 grid gap-0 border-t border-white/12 bg-[#071625]/86 backdrop-blur-md">
          <div className="overflow-hidden py-4 md:hidden">
            <div className="commodity-marquee">
              <PhraseGroup />
              <PhraseGroup ariaHidden />
            </div>
          </div>

          <div className="hidden min-w-0 md:block">
            <QuoteMarquee
              quotes={footerTickerQuotes}
              numberFormatter={numberFormatter}
              loadingLabel={statusText[lang].loading}
            />
            <QuoteMarquee
              quotes={footerTickerQuotesReverse}
              numberFormatter={numberFormatter}
              loadingLabel={statusText[lang].loading}
              reverse
            />
          </div>
        </div>
      </section>

      {updatedAt ? (
        <div className="pointer-events-none absolute bottom-28 right-8 text-xs uppercase tracking-[0.18em] text-white/40">
          {statusText[lang].updated}{" "}
          {new Intl.DateTimeFormat(
            lang === "pt" ? "pt-BR" : lang === "zh" ? "zh-CN" : "en-US",
            {
              hour: "2-digit",
              minute: "2-digit",
            },
          ).format(new Date(updatedAt))}
        </div>
      ) : null}
    </div>
  );
}

function FinanceMapLayer({
  active,
  quotes,
  numberFormatter,
  loadingLabel,
}: {
  active: boolean;
  quotes: CommodityQuote[];
  numberFormatter: Intl.NumberFormat;
  loadingLabel: string;
}) {
  const panelQuotes = investmentPanelSymbols
    .map((symbol) => quotes.find((quote) => quote.symbol === symbol))
    .filter((quote): quote is CommodityQuote => Boolean(quote));

  return (
    <div
      aria-hidden={!active}
      className={cn(
        "pointer-events-none absolute inset-x-0 top-36 bottom-20 z-20 overflow-hidden bg-black transition-opacity duration-1000",
        active ? "opacity-100" : "opacity-0",
      )}
    >
      <iframe
        title="Finance World Monitor"
        src={financeMonitorEmbedUrl}
        loading="eager"
        tabIndex={-1}
        className="size-full border-0 bg-black"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="autoplay; encrypted-media; fullscreen; geolocation"
      />
      <MapLogoMark />
      <InvestmentMapPanel
        quotes={panelQuotes}
        numberFormatter={numberFormatter}
        loadingLabel={loadingLabel}
      />
    </div>
  );
}

function MapLogoMark() {
  return (
    <div className="pointer-events-none absolute -bottom-8 left-3 z-30 h-36 w-44 overflow-hidden">
      <Image
        src="/global/atc-light.png"
        alt="ATC China Brasil"
        width={288}
        height={273}
        className="h-36 w-auto max-w-none object-contain"
      />
    </div>
  );
}

function InvestmentMapPanel({
  quotes,
  numberFormatter,
  loadingLabel,
}: {
  quotes: CommodityQuote[];
  numberFormatter: Intl.NumberFormat;
  loadingLabel: string;
}) {
  return (
    <aside className="pointer-events-auto absolute right-2 bottom-2 z-30 w-[min(17rem,calc(100vw-1rem))] overflow-hidden rounded-md border border-white/12 bg-[#101316]/94 shadow-[0_18px_56px_-28px_rgba(0,0,0,0.95)] backdrop-blur-md sm:right-3 sm:bottom-3">
      <div className="flex h-9 items-center justify-between border-b border-white/10 px-3">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/78">
          Mercado ATC
        </p>
        <span className="text-[0.62rem] uppercase tracking-[0.16em] text-white/36">
          Live
        </span>
      </div>
      <div className="grid max-h-[min(28rem,calc(100svh-18rem))] overflow-hidden">
        {quotes.length > 0 ? (
          quotes.map((quote) => (
            <InvestmentMapCard
              key={quote.symbol}
              quote={quote}
              numberFormatter={numberFormatter}
            />
          ))
        ) : (
          <div className="flex min-h-24 items-center px-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/45">
            {loadingLabel}
          </div>
        )}
      </div>
    </aside>
  );
}

function InvestmentMapCard({
  quote,
  numberFormatter,
}: {
  quote: CommodityQuote;
  numberFormatter: Intl.NumberFormat;
}) {
  const trend = quote.changePercent ?? 0;
  const isPositive = trend >= 0;

  return (
    <article className="grid min-h-[4.35rem] grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-3 border-b border-white/8 px-3 py-2.5 last:border-b-0">
      <div className="min-w-0">
        <p className="truncate text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white/38">
          {quote.label}
        </p>
        <p className="mt-1 font-mono text-[1.08rem] font-semibold leading-none text-white">
          {quote.currency} {numberFormatter.format(quote.price)}
        </p>
        <p
          className={cn(
            "mt-1 font-mono text-[0.72rem] font-semibold leading-none",
            isPositive ? "text-emerald-300" : "text-red-300",
          )}
        >
          {trend > 0 ? "+" : ""}
          {numberFormatter.format(trend)}%
        </p>
      </div>
      <Sparkline symbol={quote.symbol} value={trend} />
    </article>
  );
}

function Sparkline({ symbol, value }: { symbol: string; value: number }) {
  const points = getSparklinePoints(symbol, value);
  const strokeClass = value >= 0 ? "stroke-emerald-300" : "stroke-red-300";
  const fillClass = value >= 0 ? "fill-emerald-300/10" : "fill-red-300/10";

  return (
    <svg
      viewBox="0 0 96 34"
      aria-hidden="true"
      className="h-9 w-full overflow-visible"
      preserveAspectRatio="none"
    >
      <path
        d={`M0 34 L${points} L96 34 Z`}
        className={fillClass}
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={points}
        fill="none"
        strokeWidth="2"
        className={strokeClass}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function getSparklinePoints(symbol: string, value: number) {
  const width = 96;
  const height = 34;
  const steps = 18;
  const seed = [...symbol].reduce(
    (total, char) => total + char.charCodeAt(0),
    0,
  );
  const direction = value >= 0 ? -1 : 1;

  return Array.from({ length: steps }, (_, index) => {
    const progress = index / (steps - 1);
    const wave =
      Math.sin(seed * 0.17 + index * 0.85) * 4 +
      Math.cos(seed * 0.07 + index * 0.42) * 2.5;
    const trend = direction * progress * Math.min(Math.abs(value), 8) * 1.15;
    const x = (width / (steps - 1)) * index;
    const y = Math.max(4, Math.min(height - 4, height / 2 + wave + trend));

    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function QuoteMarquee({
  quotes,
  numberFormatter,
  loadingLabel,
  reverse = false,
}: {
  quotes: CommodityQuote[];
  numberFormatter: Intl.NumberFormat;
  loadingLabel: string;
  reverse?: boolean;
}) {
  if (quotes.length === 0) {
    return (
      <div className="flex h-10 items-center px-8 text-sm font-semibold uppercase tracking-[0.18em] text-white/60 lg:px-12">
        {loadingLabel}
      </div>
    );
  }

  return (
    <div className="flex h-10 overflow-hidden border-t border-white/8 first:border-t-0">
      <div
        className={reverse ? "commodity-marquee-reverse" : "commodity-marquee"}
      >
        <QuoteGroup quotes={quotes} numberFormatter={numberFormatter} />
        <QuoteGroup
          quotes={quotes}
          numberFormatter={numberFormatter}
          ariaHidden
        />
      </div>
    </div>
  );
}

function QuoteGroup({
  quotes,
  numberFormatter,
  ariaHidden,
}: {
  quotes: CommodityQuote[];
  numberFormatter: Intl.NumberFormat;
  ariaHidden?: boolean;
}) {
  return (
    <div className="commodity-marquee-group" aria-hidden={ariaHidden}>
      {quotes.map((quote) => (
        <div
          key={quote.symbol}
          className="flex h-full shrink-0 items-center border-r border-white/12 px-5 text-[0.82rem] leading-none"
        >
          <QuoteText quote={quote} numberFormatter={numberFormatter} />
        </div>
      ))}
    </div>
  );
}

function QuoteText({
  quote,
  numberFormatter,
}: {
  quote: CommodityQuote;
  numberFormatter: Intl.NumberFormat;
}) {
  return (
    <>
      <span className="font-semibold uppercase tracking-[0.12em] text-white">
        {quote.label}
      </span>
      <span className="ml-3 text-white/72">
        {quote.currency} {numberFormatter.format(quote.price)}
      </span>
      <TrendValue
        value={quote.changePercent ?? 0}
        numberFormatter={numberFormatter}
      />
    </>
  );
}

function TrendValue({
  value,
  numberFormatter,
}: {
  value: number;
  numberFormatter: Intl.NumberFormat;
}) {
  const directionClass =
    value > 0
      ? "text-emerald-300"
      : value < 0
        ? "text-red-300"
        : "text-white/60";
  const TrendIcon = value < 0 ? TrendingDown : TrendingUp;

  return (
    <span
      className={`ml-3 inline-flex items-center gap-1 font-semibold ${directionClass}`}
    >
      <TrendIcon className="size-4" />
      {value > 0 ? "+" : ""}
      {numberFormatter.format(value)}%
    </span>
  );
}

function PhraseGroup({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="commodity-marquee-group" aria-hidden={ariaHidden}>
      {marketPhrases.map((phrase) => (
        <span
          key={phrase}
          className="flex h-full shrink-0 items-center px-8 text-2xl font-semibold uppercase tracking-[0.22em] text-white/68 lg:px-10"
        >
          {phrase}
        </span>
      ))}
    </div>
  );
}
