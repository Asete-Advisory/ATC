"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Languages } from "lucide-react";
import {
  languageLocales,
  navigationLanguages,
  type Language,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

const languageLabels = {
  pt: "Português",
  en: "English",
  zh: "中文（普通话）",
} satisfies Record<Language, string>;

const portugueseLabels = {
  pt: "Traduzir para português",
  en: "Translate to Portuguese",
  zh: "切换为葡萄牙语",
} satisfies Record<Language, string>;

const languageMenuLabels = {
  pt: "Idioma",
  en: "Language",
  zh: "语言",
} satisfies Record<Language, string>;

function LanguageLink({
  lang,
  targetLanguage,
  label = languageLabels[targetLanguage],
  className,
  children,
}: {
  lang: Language;
  targetLanguage: Language;
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());
  params.set("lang", targetLanguage);
  const href = `${pathname}?${params.toString()}`;

  return (
    <Link
      href={href}
      hrefLang={languageLocales[targetLanguage]}
      aria-label={label}
      aria-current={lang === targetLanguage ? "true" : undefined}
      title={label}
      className={className}
      prefetch={false}
      scroll={false}
      onNavigate={(event) => {
        if (window.location.hash) {
          event.preventDefault();
          router.push(`${href}${window.location.hash}`, { scroll: false });
        }
      }}
    >
      {children}
    </Link>
  );
}

export function LanguageSwitcher({
  lang,
  className,
}: {
  lang: Language;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={languageMenuLabels[lang]}
      className={cn(
        "inline-flex h-8 shrink-0 items-center rounded-full border border-white/15 bg-white/8 p-0.5",
        className,
      )}
    >
      {navigationLanguages.map((option) => (
        <LanguageLink
          key={option}
          lang={lang}
          targetLanguage={option}
          className={cn(
            "flex h-full flex-1 items-center justify-center rounded-full px-3 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
            option === lang
              ? "bg-white text-primary"
              : "text-white/60 hover:bg-white/8 hover:text-white",
          )}
        >
          <span lang={languageLocales[option]}>
            {option === "en" ? "EN" : "中文"}
          </span>
        </LanguageLink>
      ))}
    </div>
  );
}

function BrazilFlag() {
  return (
    <svg
      viewBox="0 0 28 20"
      className="h-6 w-8 shrink-0 rounded-[3px]"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="#009b3a" d="M0 0h28v20H0z" />
      <path fill="#ffdf00" d="m14 2 12 8-12 8L2 10z" />
      <circle cx="14" cy="10" r="5" fill="#002776" />
      <path d="M9.2 8.6c3.1-.5 6.6.8 9.4 3" fill="none" stroke="#fff" strokeWidth="1.1" />
      <g fill="#fff">
        <circle cx="12" cy="10.7" r=".35" />
        <circle cx="14.2" cy="12.5" r=".35" />
        <circle cx="16.2" cy="11.7" r=".35" />
        <circle cx="15.2" cy="8" r=".3" />
      </g>
    </svg>
  );
}

export function DocumentLanguage({ lang }: { lang: Language }) {
  useEffect(() => {
    document.documentElement.lang = languageLocales[lang];
  }, [lang]);

  return null;
}

export function PortugueseLanguageButton({ lang }: { lang: Language }) {
  return (
    <>
      <DocumentLanguage lang={lang} />
      <LanguageLink
        lang={lang}
        targetLanguage="pt"
        label={portugueseLabels[lang]}
        className={cn(
          "fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-5 z-60 inline-flex h-14 items-center gap-3 rounded-full border border-slate-200 bg-white/95 px-4 text-[#071625] shadow-[0_12px_32px_rgba(8,24,48,0.2)] backdrop-blur-sm transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/35 motion-reduce:transform-none sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] sm:left-6 print:hidden",
          lang === "pt" && "border-emerald-500 ring-2 ring-emerald-500/25",
        )}
      >
        <BrazilFlag />
        <span aria-hidden="true" className="h-5 w-px bg-slate-200" />
        <Languages className="size-6" strokeWidth={1.75} aria-hidden="true" />
      </LanguageLink>
    </>
  );
}
