"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { RadioTower, TrendingUp } from "lucide-react";
import { HeroVideoBackground } from "@/components/hero-video-background";
import { Button } from "@/components/ui/button";
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

type DisplayMode = "cycle" | "original" | "map";

const marketPhrases = [
  "Sourcing internacional",
  "Trading estruturado",
  "Commodities",
  "Importacao",
  "Exportacao",
  "Inteligencia comercial",
  "China Brasil",
] as const;

const slideDurationMs = 120_000;
const financeMonitorEmbedUrl =
  "https://finance.worldmonitor.app/embed.html?layers=stockExchanges,financialCenters,centralBanks,commodityHubs,gulfInvestments,tradeRoutes,cables,waterways&center=18,8&zoom=1.45&theme=dark&variant=finance";

function rotateQuotes(quotes: CommodityQuote[], offset: number) {
  if (quotes.length === 0) {
    return [];
  }

  const normalizedOffset = offset % quotes.length;
  return [...quotes.slice(normalizedOffset), ...quotes.slice(0, normalizedOffset)];
}

const statusText: Record<Language, { live: string; loading: string; updated: string }> = {
  pt: {
    live: "Mercado ao vivo",
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
  const [displayMode, setDisplayMode] = useState<DisplayMode>("cycle");
  const [cycleShowsFinanceMap, setCycleShowsFinanceMap] = useState(false);

  useEffect(() => {
    if (displayMode !== "cycle") {
      return;
    }

    setCycleShowsFinanceMap(false);

    const interval = window.setInterval(() => {
      setCycleShowsFinanceMap((current) => !current);
    }, slideDurationMs);

    return () => window.clearInterval(interval);
  }, [displayMode]);

  const showFinanceMap =
    displayMode === "map" || (displayMode === "cycle" && cycleShowsFinanceMap);

  return (
    <main className="relative isolate h-svh min-h-[640px] overflow-hidden bg-[#071625] text-white">
      <InstitutionalSlide lang={lang} showFinanceMap={showFinanceMap} />
      <DisplayModeControl mode={displayMode} onModeChange={setDisplayMode} />
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
    { value: "cycle", label: "Auto" },
    { value: "original", label: "Original" },
    { value: "map", label: "Mapa" },
  ];

  return (
    <div className="absolute bottom-2 left-2 z-30 flex rounded-md border border-white/10 bg-[#071625]/38 p-1 opacity-15 shadow-[0_12px_42px_-24px_rgba(0,0,0,0.95)] backdrop-blur-md transition-opacity duration-200 hover:opacity-100 focus-within:opacity-100">
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          size="sm"
          variant="ghost"
          aria-pressed={mode === option.value}
          onClick={() => onModeChange(option.value)}
          className={cn(
            "h-7 rounded px-2 text-[0.68rem] uppercase tracking-[0.16em] text-white/60 hover:bg-white/10 hover:text-white",
            mode === option.value && "bg-white/14 text-white",
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

function InstitutionalSlide({
  lang,
  showFinanceMap,
}: {
  lang: Language;
  showFinanceMap: boolean;
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
  const bottomTickerQuotes = rotateQuotes(marqueeQuotes, Math.ceil(marqueeQuotes.length / 2));
  const featuredQuotes = marqueeQuotes.slice(0, 4);

  return (
    <div className="absolute inset-0 isolate">
      <div
        className={cn(
          "absolute inset-0 -z-20 transition-opacity duration-1000",
          showFinanceMap ? "opacity-0" : "opacity-100",
        )}
      >
        <HeroVideoBackground />
      </div>
      <FinanceMapLayer active={showFinanceMap} />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,22,37,0.88)_0%,rgba(7,22,37,0.56)_34%,rgba(7,22,37,0.76)_70%,rgba(7,22,37,0.95)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_26%,rgba(90,180,210,0.22),transparent_34%),linear-gradient(90deg,rgba(4,14,25,0.64),rgba(4,14,25,0.16)_48%,rgba(4,14,25,0.62))]" />

      <section className="relative z-10 h-full">
        <div className="absolute inset-x-0 top-0 border-b border-white/12 bg-[#071625]/82 backdrop-blur-md">
          <div className="flex h-16 items-center gap-4 px-5 sm:gap-6 sm:px-8 lg:px-12">
            <div className="flex min-w-0 items-center gap-4">
              <Image
                src="/global/atc-light.png"
                alt="ATC China Brasil"
                width={44}
                height={44}
                priority
                className="size-11 rounded-full"
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold uppercase tracking-[0.22em] text-white sm:text-sm sm:tracking-[0.28em]">
                  ATC China Brasil
                </p>
                <p className="hidden text-xs uppercase tracking-[0.18em] text-white/54 sm:block">
                  Trading • Sourcing • Commodities
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3 text-sm text-white/70 sm:gap-5">
              <span className="hidden items-center gap-2 uppercase tracking-[0.18em] sm:inline-flex">
                <RadioTower className="size-4 text-emerald-300" />
                {statusText[lang].live}
              </span>
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

          <div className="hidden min-w-0 grid-cols-4 md:grid">
            {featuredQuotes.length > 0 ? (
              featuredQuotes.map((quote) => (
                <FeaturedQuote
                  key={quote.symbol}
                  quote={quote}
                  numberFormatter={numberFormatter}
                />
              ))
            ) : (
              <div className="col-span-4 flex items-center justify-center px-8 text-sm uppercase tracking-[0.18em] text-white/54">
                {statusText[lang].loading}
              </div>
            )}
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

function FinanceMapLayer({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden={!active}
      className={cn(
        "pointer-events-none absolute inset-x-5 top-[clamp(11.25rem,23svh,15rem)] bottom-[clamp(6.75rem,11svh,8.25rem)] z-20 overflow-hidden bg-black transition-opacity duration-1000 sm:inset-x-8 lg:inset-x-12",
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
    </div>
  );
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
        <QuoteGroup quotes={quotes} numberFormatter={numberFormatter} ariaHidden />
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

function FeaturedQuote({
  quote,
  numberFormatter,
}: {
  quote: CommodityQuote;
  numberFormatter: Intl.NumberFormat;
}) {
  return (
    <article className="flex min-h-20 flex-col justify-center border-r border-white/12 px-5 py-3 last:border-r-0">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/50">
        {quote.label}
      </p>
      <div className="mt-2.5 flex items-end justify-between gap-3">
        <p className="font-mono text-[clamp(1.35rem,1.65vw,2rem)] font-semibold leading-none text-white">
          {quote.currency} {numberFormatter.format(quote.price)}
        </p>
        <TrendValue value={quote.changePercent ?? 0} numberFormatter={numberFormatter} />
      </div>
    </article>
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
      <TrendValue value={quote.changePercent ?? 0} numberFormatter={numberFormatter} />
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
    value > 0 ? "text-emerald-300" : value < 0 ? "text-red-300" : "text-white/60";

  return (
    <span className={`ml-3 inline-flex items-center gap-1 font-semibold ${directionClass}`}>
      <TrendingUp className="size-4" />
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
