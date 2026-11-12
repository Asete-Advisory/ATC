import type { Metadata } from "next";
import { FocusHeader } from "@/components/focus-header";
import { ImportDiagnosis } from "@/components/import-diagnosis";
import { ImporterProfileCard } from "@/components/importer-profile-card";
import { SiteFooter } from "@/components/site-footer";
import { copy, getLanguage, type Language } from "@/lib/i18n";
import { PROFILE_IMAGES } from "@/lib/import-diagnosis";

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

type DiagnosisContent = (typeof copy)[Language]["diagnosis"];

function ProfilesGrid({
  content,
  className,
}: {
  content: DiagnosisContent;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-sm text-muted-foreground">{content.profilesLabel}</p>
      <div className="mt-3 grid gap-2 lg:grid-cols-2 lg:gap-2.5">
        {content.profiles.map((profile, index) => (
          <ImporterProfileCard
            key={profile.name}
            name={profile.name}
            focus={profile.focus}
            image={PROFILE_IMAGES[index]}
          />
        ))}
      </div>
    </div>
  );
}

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
        <section className="bg-[linear-gradient(135deg,#f8fbff_0%,#eef4fa_100%)] lg:flex lg:min-h-[calc(100svh-3.5rem)] lg:items-center">
          <div className="mx-auto grid w-full max-w-6xl gap-7 px-5 pt-7 pb-10 sm:gap-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16 lg:[@media(max-height:780px)]:py-5">
            <div className="motion-reveal">
              <h1 className="max-w-lg text-balance text-primary">
                <span className="block text-[15px] font-medium text-muted-foreground sm:text-lg">
                  {diagnosis.kicker}
                </span>
                <span className="mt-1.5 block text-[1.75rem] leading-[1.15] sm:mt-2 font-semibold tracking-[-0.01em] sm:text-[2.5rem] lg:text-[2.25rem] xl:text-[2.5rem] lg:[@media(max-height:780px)]:text-[2rem]">
                  {diagnosis.title}
                </span>
              </h1>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:mt-4 sm:text-base lg:[@media(max-height:780px)]:mt-3">
                {diagnosis.description}
              </p>

              <ProfilesGrid
                content={diagnosis}
                className="mt-7 hidden lg:block lg:[@media(max-height:780px)]:mt-5"
              />
            </div>

            <div>
              <ImportDiagnosis key={lang} content={diagnosis} />
              {/* Escondida durante a roleta, que já mostra os mesmos perfis. */}
              <ProfilesGrid
                content={diagnosis}
                className="mt-10 border-t border-border pt-6 lg:hidden [main:has([data-diagnosis-roulette])_&]:hidden"
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content.footer} />
    </>
  );
}
