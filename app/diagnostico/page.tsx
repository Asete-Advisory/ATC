import type { Metadata } from "next";
import { FocusHeader } from "@/components/focus-header";
import { ImportDiagnosis } from "@/components/import-diagnosis";
import { SiteFooter } from "@/components/site-footer";
import { copy, getLanguage } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Diagnóstico de importação | ATC China Brasil",
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
        <section className="relative flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden bg-[linear-gradient(135deg,#f8fbff_0%,#eef4fa_100%)]">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-8 sm:py-12 lg:[@media(max-height:780px)]:py-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
            <div className="motion-reveal">
              <h1 className="max-w-lg text-balance text-primary">
                <span className="block text-base font-medium text-muted-foreground sm:text-lg">
                  {diagnosis.kicker}
                </span>
                <span className="mt-2 block text-[2rem] leading-[1.12] font-semibold tracking-[-0.01em] sm:text-[2.5rem] xl:text-[2.75rem]">
                  {diagnosis.title}
                </span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground xl:text-lg">
                {diagnosis.description}
              </p>
            </div>

            <ImportDiagnosis key={lang} content={diagnosis} />
          </div>
        </section>
      </main>
      <SiteFooter content={content.footer} />
    </>
  );
}
