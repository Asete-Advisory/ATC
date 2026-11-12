import type { Metadata } from "next";
import { Check } from "lucide-react";
import { FocusHeader } from "@/components/focus-header";
import { ImportDiagnosis } from "@/components/import-diagnosis";
import { SiteFooter } from "@/components/site-footer";
import { copy, getLanguage } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Diagnóstico de Importação | ATC China Brasil",
  description:
    "Responda a 4 perguntas rápidas, descubra o perfil de importador da sua empresa e desbloqueie uma sessão de viabilidade com a ATC China Brasil.",
  alternates: { canonical: "/diagnostico" },
};

type DiagnosisPageProps = {
  searchParams?: Promise<{
    lang?: string;
  }>;
};

export default async function DiagnosisPage({
  searchParams,
}: DiagnosisPageProps) {
  const params = await searchParams;
  const lang = getLanguage(params?.lang);
  const content = copy[lang];
  const diagnosis = content.diagnosis;

  return (
    <>
      <FocusHeader lang={lang} path="/diagnostico" />
      <main>
        <section className="relative flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(90,209,255,0.2),transparent_28%),linear-gradient(180deg,rgba(8,24,48,0.04),transparent_18%),linear-gradient(135deg,#f8fbff_0%,#eef4fa_100%)]">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-8 sm:py-12 lg:[@media(max-height:780px)]:py-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
            <div className="motion-reveal">
              <span className="inline-flex rounded-full border border-accent/30 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                {diagnosis.eyebrow}
              </span>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-balance text-primary sm:text-4xl xl:text-5xl">
                {diagnosis.title}
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground xl:text-lg">
                {diagnosis.description}
              </p>
              <ul className="mt-6 grid gap-2.5">
                {diagnosis.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium text-foreground"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-primary">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <ImportDiagnosis key={lang} content={diagnosis} />
          </div>
        </section>
      </main>
      <SiteFooter content={content.footer} />
    </>
  );
}
