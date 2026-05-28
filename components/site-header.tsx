"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/contact";
import { ArrowRight, Menu, Search } from "lucide-react";
import { CommodityTicker } from "@/components/commodity-ticker";
import {
  copy,
  languages,
  localizedHref,
  localizedPath,
  type Language,
} from "@/lib/i18n";

type SiteHeaderProps = {
  lang: Language;
  content: (typeof copy)[Language]["header"];
};

const searchPlaceholder: Record<Language, string> = {
  pt: "Buscar produtos, serviços e temas",
  en: "Search products, services and topics",
  zh: "搜索产品、服务和主题",
};

const shortCtaLabel: Record<Language, string> = {
  pt: "Falar",
  en: "Talk",
  zh: "联系",
};

export function SiteHeader({ lang, content }: SiteHeaderProps) {
  const [isCondensed, setIsCondensed] = useState(false);
  const lastScrollY = useRef(0);

  const resolveNavHref = (href: string) =>
    href.startsWith("/")
      ? localizedPath(lang, href)
      : localizedHref(lang, href);

  useEffect(() => {
    function updateHeaderState() {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;

      setIsCondensed(currentScrollY > 24 && isScrollingDown);
      lastScrollY.current = currentScrollY;
    }

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateHeaderState);
    };
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#071625]/94 text-white shadow-[0_10px_35px_-30px_rgba(0,0,0,0.75)] backdrop-blur-md">
      <div className="relative mx-auto flex h-12 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-4">
        <form
          action={localizedPath(lang, "/catalogo")}
          className="hidden h-8 w-64 items-center rounded-full border border-white/22 bg-white/5 px-3 text-sm text-white/75 transition-colors focus-within:border-white/50 lg:flex"
          role="search"
        >
          <input
            type="search"
            name="q"
            placeholder={searchPlaceholder[lang]}
            className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/45"
          />
          <button
            type="submit"
            className="ml-2 inline-flex size-4 items-center justify-center text-white/55 transition-colors hover:text-white"
            aria-label={searchPlaceholder[lang]}
          >
            <Search className="size-4" aria-hidden />
          </button>
        </form>

        <a
          href={localizedHref(lang, "#inicio")}
          className="flex shrink-0 items-center md:justify-self-center"
          aria-label="ATC China Brasil"
        >
          <Image
            src="/global/atc-icon-white.svg"
            alt="ATC China Brasil"
            loading="eager"
            width={1205}
            height={375}
            priority
            className="h-6 w-auto md:h-7"
          />
        </a>

        <div className="hidden items-center justify-self-end gap-3 md:flex">
          <div className="flex h-8 items-center rounded-full border border-white/15 bg-white/8 p-0.5">
            {languages.map((option) => (
              <a
                key={option}
                href={localizedHref(option, "#inicio")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  option === lang
                    ? "bg-white text-primary"
                    : "text-white/58 hover:text-white"
                }`}
                hrefLang={option}
              >
                {option === "pt" ? "PT" : option === "en" ? "EN" : "中文"}
              </a>
            ))}
          </div>
          <Button
            asChild
            size="sm"
            className="h-8 rounded-full bg-[#2f6fd6] px-4 text-xs text-white hover:bg-[#3b7deb]"
          >
            <a
              href={buildWhatsAppUrl(content.ctaMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2"
            >
              {content.ctaLabel}
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <Button
            asChild
            size="sm"
            className="h-8 rounded-full bg-[#2f6fd6] px-3 text-xs text-white hover:bg-[#3b7deb]"
          >
            <a
              href={buildWhatsAppUrl(content.ctaMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5"
            >
              {shortCtaLabel[lang]}
              <ArrowRight className="size-3.5" />
            </a>
          </Button>

          <details className="group relative">
            <summary className="flex size-8 cursor-pointer list-none items-center justify-center rounded-full border border-white/15 bg-white/5 text-white marker:content-none [&::-webkit-details-marker]:hidden">
              <Menu className="size-4" aria-hidden />
              <span className="sr-only">{content.menuLabel}</span>
            </summary>
            <div className="fixed right-4 top-14 z-50 max-h-[calc(100dvh-4.5rem)] w-[min(21rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-white/10 bg-[#050505] p-4 shadow-xl">
              <form
                action={localizedPath(lang, "/catalogo")}
                className="mb-3 flex h-10 w-full items-center rounded-full border border-white/20 bg-white/5 px-3"
                role="search"
              >
                <input
                  type="search"
                  name="q"
                  placeholder={searchPlaceholder[lang]}
                  className="w-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/45"
                />
                <button
                  type="submit"
                  className="ml-2 inline-flex size-5 items-center justify-center text-white/60"
                  aria-label={searchPlaceholder[lang]}
                >
                  <Search className="size-4" aria-hidden />
                </button>
              </form>
              <nav className="flex flex-col gap-1" aria-label="Menu mobile">
                {content.nav.map((item) => (
                  <a
                    key={item.href}
                    href={resolveNavHref(item.href)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/68 transition-colors hover:bg-white/8 hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-4 flex items-center rounded-full border border-white/12 bg-white/8 p-1">
                {languages.map((option) => (
                  <a
                    key={option}
                    href={localizedHref(option, "#inicio")}
                    className={`flex-1 rounded-full px-3 py-2 text-center text-xs font-medium transition-colors ${
                      option === lang
                        ? "bg-white text-primary"
                        : "text-white/60 hover:text-white"
                    }`}
                    hrefLang={option}
                  >
                    {option === "pt" ? "PT" : option === "en" ? "EN" : "中文"}
                  </a>
                ))}
              </div>
              <Button
                asChild
                size="sm"
                className="mt-4 h-10 w-full rounded-full bg-[#2f6fd6] text-white hover:bg-[#3b7deb]"
              >
                <a
                  href={buildWhatsAppUrl(content.ctaMessage)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {content.ctaLabel}
                </a>
              </Button>
            </div>
          </details>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out ${
          isCondensed
            ? "max-h-0 -translate-y-2 opacity-0"
            : "max-h-16 translate-y-0 opacity-100"
        }`}
      >
        <nav
          className="hidden h-8 items-center justify-center border-t border-white/6 md:flex"
          aria-label="Menu principal"
        >
          <div className="mx-auto flex max-w-6xl items-center gap-8 px-6">
            {content.nav.map((item) => (
              <a
                key={item.href}
                href={resolveNavHref(item.href)}
                className="relative flex h-8 items-center gap-2 text-xs font-medium text-white/58 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
        <CommodityTicker lang={lang} />
      </div>
    </header>
  );
}
