"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Globe2, RadioTower, TrendingUp } from "lucide-react";
import { HeroVideoBackground } from "@/components/hero-video-background";
import { copy, type Language } from "@/lib/i18n";

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

const marketPhrases = [
  "Sourcing internacional",
  "Trading estruturado",
  "Commodities",
  "Importacao",
  "Exportacao",
  "Inteligencia comercial",
  "China Brasil",
] as const;

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
  const featuredQuotes = marqueeQuotes.slice(0, 4);

  return (
    <main className="relative isolate h-svh min-h-[640px] overflow-hidden bg-[#071625] text-white">
      <div className="absolute inset-0 -z-20">
        <HeroVideoBackground />
      </div>
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
            quotes={marqueeQuotes}
            numberFormatter={numberFormatter}
            loadingLabel={statusText[lang].loading}
          />
        </div>

        <div className="absolute inset-x-5 top-[clamp(8.75rem,19svh,14rem)] bottom-[clamp(7.5rem,13svh,9.25rem)] grid content-center gap-5 sm:inset-x-8 md:gap-6 lg:inset-x-12 lg:grid-cols-[minmax(0,1fr)_clamp(19rem,28vw,30rem)] lg:items-center xl:gap-8">
          <div className="min-w-0 max-w-[74rem]">
            <div className="mb-[clamp(0.9rem,2.1svh,1.75rem)] inline-flex max-w-full items-center gap-3 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[clamp(0.68rem,0.85vw,0.9rem)] font-semibold uppercase tracking-[0.18em] text-white/78 backdrop-blur-md sm:px-5 sm:py-3">
              <Globe2 className="size-4 text-cyan-200" />
              <span className="truncate">Operacao internacional em movimento</span>
            </div>
            <h1 className="max-w-[74rem] text-[clamp(3rem,6.2vw,7.15rem)] font-semibold leading-[0.92] tracking-tight text-white lg:text-[clamp(3.5rem,5.25vw,6.2rem)] 2xl:text-[clamp(4.25rem,5vw,6.9rem)]">
              {content.hero.title}
            </h1>
            <p className="mt-[clamp(1rem,2.2svh,1.75rem)] max-w-[64rem] text-[clamp(1.1rem,1.65vw,2rem)] leading-snug text-white/78">
              {content.hero.description}
            </p>
          </div>

          <div className="hidden min-w-0 gap-3 self-end md:grid md:grid-cols-3 lg:grid-cols-1 lg:self-center">
            {content.hero.stats.map((stat) => (
              <article
                key={stat.label}
                className="min-h-24 rounded-xl border border-white/14 bg-[#071625]/64 p-4 shadow-[0_22px_80px_-54px_rgba(0,0,0,0.95)] backdrop-blur-md sm:p-5"
              >
                <p className="font-mono text-[clamp(1.75rem,2.3vw,3rem)] font-semibold leading-none text-white">
                  {stat.value}
                </p>
                <p className="mt-3 text-[clamp(0.86rem,1.05vw,1.12rem)] leading-snug text-white/64">
                  {stat.label}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 grid gap-0 border-t border-white/12 bg-[#071625]/86 backdrop-blur-md lg:grid-cols-[1fr_auto]">
          <div className="overflow-hidden py-4 sm:py-5">
            <div className="commodity-marquee">
              <PhraseGroup />
              <PhraseGroup ariaHidden />
            </div>
          </div>

          <div className="hidden min-w-[42rem] grid-cols-4 border-l border-white/12 md:grid">
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
    </main>
  );
}

function QuoteMarquee({
  quotes,
  numberFormatter,
  loadingLabel,
}: {
  quotes: CommodityQuote[];
  numberFormatter: Intl.NumberFormat;
  loadingLabel: string;
}) {
  if (quotes.length === 0) {
    return (
      <div className="flex h-12 items-center px-8 text-sm font-semibold uppercase tracking-[0.18em] text-white/60 lg:px-12">
        {loadingLabel}
      </div>
    );
  }

  return (
    <div className="flex h-12 overflow-hidden">
      <div className="commodity-marquee">
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
          className="flex h-full shrink-0 items-center border-r border-white/12 px-5 text-sm leading-none"
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
    <article className="flex min-h-24 flex-col justify-center border-r border-white/12 px-5 last:border-r-0">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
        {quote.label}
      </p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="font-mono text-2xl font-semibold leading-none text-white">
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
