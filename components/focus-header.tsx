import Image from "next/image";
import {
  languages,
  localizedHref,
  localizedPath,
  type Language,
} from "@/lib/i18n";

type FocusHeaderProps = {
  lang: Language;
  /** Página para onde a troca de idioma leva (ex.: "/diagnostico"). */
  path: string;
};

const languageLabels: Record<Language, string> = {
  pt: "PT",
  en: "EN",
  zh: "中文",
};

/**
 * Header enxuto para páginas de conversão (funil de vídeos): só logo e idioma,
 * sem busca, menu, cotações ou CTA, para manter o foco no formulário.
 */
export function FocusHeader({ lang, path }: FocusHeaderProps) {
  return (
    <header className="bg-[#071625] text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
        <a
          href={localizedHref(lang)}
          className="flex shrink-0 items-center"
          aria-label="ATC China Brasil"
        >
          <Image
            src="/global/atc-icon-white.svg"
            alt="ATC China Brasil"
            width={1205}
            height={375}
            priority
            className="h-6 w-auto md:h-7"
          />
        </a>

        <nav
          aria-label="Idioma"
          className="flex h-8 items-center rounded-full border border-white/15 bg-white/8 p-0.5"
        >
          {languages.map((option) => (
            <a
              key={option}
              href={localizedPath(option, path)}
              hrefLang={option}
              aria-current={option === lang ? "page" : undefined}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                option === lang
                  ? "bg-white text-primary"
                  : "text-white/58 hover:text-white"
              }`}
            >
              {languageLabels[option]}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
