"use client";

import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-controls";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/contact";
import { ArrowRight, Menu } from "lucide-react";
import { CommodityTicker } from "@/components/commodity-ticker";
import {
  copy,
  localizedHref,
  localizedPath,
  type Language,
} from "@/lib/i18n";

type SiteHeaderProps = {
  lang: Language;
  content: (typeof copy)[Language]["header"];
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
      <div className="relative mx-auto flex h-12 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-4">
        <a
          href={localizedHref(lang, "#inicio")}
          className="flex shrink-0 items-center lg:col-start-2 lg:justify-self-center"
          aria-label="ACS"
        >
          <BrandLogo
            loading="eager"
            priority
            sizes="(min-width: 768px) 90px, 77px"
            className="h-6 w-auto md:h-7"
          />
        </a>

        <div className="hidden items-center justify-self-end gap-3 md:flex">
          <LanguageSwitcher lang={lang} />
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
              <LanguageSwitcher lang={lang} className="mt-4 flex h-10 w-full" />
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
