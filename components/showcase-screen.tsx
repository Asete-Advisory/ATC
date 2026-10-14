"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { RadioTower, TrendingDown, TrendingUp } from "lucide-react";
import { MarketBoard } from "@/components/market-board";
import { TradeRoutesMap } from "@/components/trade-routes-map";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { copy, getLanguage, type Language } from "@/lib/i18n";
import {
  showcaseLocales,
  showcaseText,
  showcaseSlideOrder,
  showcaseSlideDurations,
  type DisplayMode,
  type PresentationSlide,
} from "@/lib/showcase";
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

const investmentPanelSymbols = ["GC=F", "SI=F", "HG=F", "CL=F", "BZ=F", "ZS=F"];

function rotateQuotes(quotes: CommodityQuote[], offset: number) {
  if (quotes.length === 0) return [];
  const normalizedOffset = offset % quotes.length;
  return [
    ...quotes.slice(normalizedOffset),
    ...quotes.slice(0, normalizedOffset),
  ];
}

export function ShowcaseScreen({ lang: initialLanguage }: { lang: Language }) {
  const searchParams = useSearchParams();
  const lang = searchParams
    ? getLanguage(searchParams.get("lang") ?? undefined)
    : initialLanguage;
  const content = copy[lang];
  const text = showcaseText[lang];
  const [displayMode, setDisplayMode] = useState<DisplayMode>("auto");
  const [autoSlide, setAutoSlide] = useState<PresentationSlide>("original");
  const autoRotationTimerRef = useRef<number | null>(null);
  const [quotes, setQuotes] = useState<CommodityQuote[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const activeSlide = displayMode === "auto" ? autoSlide : displayMode;
  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(showcaseLocales[lang], {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }),
    [lang],
  );
  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(showcaseLocales[lang], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [lang],
  );

  useEffect(() => {
    if (displayMode !== "auto") return;
    autoRotationTimerRef.current = window.setTimeout(() => {
      setAutoSlide(
        (current) =>
          showcaseSlideOrder[
            (showcaseSlideOrder.indexOf(current) + 1) %
              showcaseSlideOrder.length
          ],
      );
    }, showcaseSlideDurations[autoSlide]);
    return () => {
      if (autoRotationTimerRef.current !== null)
        window.clearTimeout(autoRotationTimerRef.current);
    };
  }, [autoSlide, displayMode]);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = window.setInterval(
      () => setCurrentTime(new Date()),
      30_000,
    );
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let ignore = false;
    let controller: AbortController | undefined;
    async function loadQuotes() {
      controller?.abort();
      controller = new AbortController();
      const request = controller;
      const timeout = window.setTimeout(() => request.abort(), 15_000);
      try {
        const response = await fetch(`/api/commodities?lang=${lang}`, {
          cache: "no-store",
          signal: request.signal,
        });
        if (!response.ok) throw new Error("Quotes unavailable");
        const data = (await response.json()) as {
          commodities?: CommodityQuote[];
          updatedAt?: string;
        };
        if (!ignore) {
          setQuotes(data.commodities ?? []);
          setUpdatedAt(data.updatedAt ?? null);
        }
      } catch {
        if (!ignore) {
          setQuotes([]);
          setUpdatedAt(null);
        }
      } finally {
        window.clearTimeout(timeout);
      }
    }
    void loadQuotes();
    const interval = window.setInterval(loadQuotes, 60_000);
    return () => {
      ignore = true;
      controller?.abort();
      window.clearInterval(interval);
    };
  }, [lang]);

  function handleModeChange(value: string) {
    if (!value || value === displayMode) return;
    if (autoRotationTimerRef.current !== null)
      window.clearTimeout(autoRotationTimerRef.current);
    setDisplayMode(value as DisplayMode);
    if (value === "auto") setAutoSlide("original");
  }

  function changeLanguage(value: string) {
    if ((value !== "pt" && value !== "en") || value === lang) return;
    const url = new URL(window.location.href);
    url.searchParams.set("lang", value);
    // Native history integrates with useSearchParams without remounting the
    // presentation or resetting its slide, market format and timers.
    window.history.pushState(null, "", url);
  }

  const panelQuotes = investmentPanelSymbols
    .map((symbol) => quotes.find((quote) => quote.symbol === symbol))
    .filter((quote): quote is CommodityQuote => Boolean(quote));

  return (
    <main
      className="showcase-screen"
      lang={showcaseLocales[lang]}
      data-slide={activeSlide}
      data-mode={displayMode}
    >
      <header className="showcase-header">
        <Image
          src="/global/atc-icon-white.svg"
          alt="ATC China Brasil"
          width={1205}
          height={375}
          priority
          className="showcase-logo"
        />
        <ToggleGroup
          type="single"
          value={displayMode}
          onValueChange={handleModeChange}
          size="sm"
          spacing={1}
          aria-label={text.displayMode}
          className="showcase-navigation"
        >
          {(["auto", "original", "map", "market"] as const).map((mode) => (
            <ToggleGroupItem
              key={mode}
              value={mode}
              data-current={activeSlide === mode}
              aria-controls={mode === "auto" ? undefined : `show-${mode}`}
            >
              {text[mode]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="showcase-header-tools">
          <span className="showcase-live">
            <RadioTower aria-hidden="true" />
            {quotes.length > 0 ? text.live : text.loading}
          </span>
          {currentTime ? (
            <time
              className="showcase-clock"
              dateTime={currentTime.toISOString()}
            >
              {timeFormatter.format(currentTime)}
            </time>
          ) : null}
          <ToggleGroup
            type="single"
            value={lang}
            onValueChange={changeLanguage}
            size="sm"
            spacing={1}
            aria-label={text.language}
            className="showcase-segmented"
          >
            <ToggleGroupItem value="pt" aria-label="Português">
              PT
            </ToggleGroupItem>
            <ToggleGroupItem value="en" aria-label="English">
              EN
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </header>
      <div className="showcase-tickers">
        <QuoteMarquee
          quotes={quotes}
          numberFormatter={numberFormatter}
          loadingLabel={text.loading}
        />
        <QuoteMarquee
          quotes={rotateQuotes(quotes, Math.ceil(quotes.length / 2))}
          numberFormatter={numberFormatter}
          loadingLabel={text.loading}
          reverse
        />
      </div>
      <div className="showcase-stage">
        <section
          id="show-original"
          className="showcase-home"
          hidden={activeSlide !== "original"}
          aria-label={text.original}
        >
          <Image
            src="/global/porto.webp"
            alt=""
            fill
            sizes="100vw"
            priority
            className="showcase-home-photo"
          />
          <div className="showcase-home-content">
            <div>
              <p className="showcase-eyebrow">{text.eyebrow}</p>
              <h1>{content.showcase.title}</h1>
              <p className="showcase-description">
                {content.showcase.description}
              </p>
              <p className="showcase-worldwide">{text.worldwide}</p>
            </div>
            <div className="showcase-stats">
              {content.hero.stats.map((stat, index) => (
                <article key={index}>
                  <strong>{stat.value}</strong>
                  <p>{stat.label}</p>
                </article>
              ))}
            </div>
          </div>
          {updatedAt && Number.isFinite(Date.parse(updatedAt)) ? (
            <p className="showcase-updated">
              {text.updated}{" "}
              <time dateTime={updatedAt}>
                {timeFormatter.format(new Date(updatedAt))}
              </time>
            </p>
          ) : null}
        </section>
        <section
          id="show-map"
          className="showcase-map-panel"
          hidden={activeSlide !== "map"}
          aria-label={text.map}
        >
          <TradeRoutesMap lang={lang} active={activeSlide === "map"} />
          <aside className="showcase-map-quotes" aria-label={text.market}>
            <p className="showcase-eyebrow">{text.market}</p>
            {panelQuotes.length > 0 ? (
              panelQuotes.map((quote) => (
                <article key={quote.symbol}>
                  <p>{quote.label}</p>
                  <strong>
                    {quote.currency} {numberFormatter.format(quote.price)}
                  </strong>
                  <TrendValue
                    value={quote.changePercent}
                    numberFormatter={numberFormatter}
                  />
                </article>
              ))
            ) : (
              <p>{text.loading}</p>
            )}
          </aside>
        </section>
        <MarketBoard active={activeSlide === "market"} lang={lang} />
      </div>
      <footer className="showcase-tickers">
        <QuoteMarquee
          quotes={rotateQuotes(quotes, Math.ceil(quotes.length / 3))}
          numberFormatter={numberFormatter}
          loadingLabel={text.loading}
        />
        <QuoteMarquee
          quotes={rotateQuotes(quotes, Math.ceil((quotes.length * 2) / 3))}
          numberFormatter={numberFormatter}
          loadingLabel={text.loading}
          reverse
        />
      </footer>
    </main>
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
        value={quote.changePercent}
        numberFormatter={numberFormatter}
      />
    </>
  );
}

function TrendValue({
  value,
  numberFormatter,
}: {
  value: number | null;
  numberFormatter: Intl.NumberFormat;
}) {
  if (value === null) {
    return <span className="ml-3 text-white/60">—</span>;
  }

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
