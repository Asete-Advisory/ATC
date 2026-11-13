import type { Metadata } from "next";
import {
  ArrowRight,
  ClipboardList,
  Compass,
  Factory,
  Gift,
  Globe2,
  ListChecks,
  ScanSearch,
  Ship,
  Tag,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { FocusHeader } from "@/components/focus-header";
import { ImportDiagnosis } from "@/components/import-diagnosis";
import { SiteFooter } from "@/components/site-footer";
import { copy, getLanguage, type Language } from "@/lib/i18n";

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

const QUIZ_ANCHOR = "diagnostico";

// Mesma ordem de `diagnosis.steps.items`, `rewardSection.items` e `profiles`.
const stepIcons: LucideIcon[] = [ListChecks, ScanSearch, Gift];
const rewardIcons: LucideIcon[] = [ClipboardList, Factory, Globe2];
const profileIcons: LucideIcon[] = [Compass, TrendingUp, Tag, Ship];

function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex size-12 items-center justify-center rounded-full bg-accent/12 text-[#0f86a8]">
      <Icon className="size-5" aria-hidden />
    </span>
  );
}

function StartButton({ label }: { label: string }) {
  return (
    <a
      href={`#${QUIZ_ANCHOR}`}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
    >
      {label}
      <ArrowRight className="size-4" aria-hidden />
    </a>
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
      <main className="bg-white">
        {/* Hero: chamada à esquerda, diagnóstico em card à direita. */}
        <section className="bg-[linear-gradient(180deg,#f4f8fc_0%,#ffffff_100%)] lg:flex lg:min-h-[calc(100svh-3.5rem)] lg:items-center">
          <div className="mx-auto grid w-full max-w-6xl gap-7 px-4 pt-7 pb-14 sm:px-6 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16 lg:py-10">
            <div className="motion-reveal px-1 sm:px-0">
              <h1 className="max-w-xl text-[1.75rem] leading-[1.15] font-bold tracking-[-0.015em] text-balance text-foreground sm:text-[2.5rem] lg:text-[2.75rem]">
                {diagnosis.title.start}
                <span className="text-[#0f86a8]">{diagnosis.title.highlight}</span>
                {diagnosis.title.end}
              </h1>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
                {diagnosis.description}
              </p>
              <p className="mt-3 hidden text-lg font-medium text-foreground/80 sm:block">
                {diagnosis.tagline}
              </p>
            </div>

            {/* Altura fixa (a da maior etapa): trocar de pergunta não empurra o resto da página. */}
            <div
              id={QUIZ_ANCHOR}
              className="grid min-h-[47rem] scroll-mt-6 min-[380px]:min-h-[42.5rem] sm:min-h-[36rem] lg:min-h-[38.5rem]"
            >
              <ImportDiagnosis key={lang} content={diagnosis} />
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm text-muted-foreground">
              {diagnosis.steps.eyebrow}
            </p>
            <h2 className="mt-1 text-[1.75rem] font-bold tracking-[-0.01em] text-foreground sm:text-4xl">
              {diagnosis.steps.title}
            </h2>
            <ol className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
              {diagnosis.steps.items.map((item, index) => (
                <li
                  key={item.title}
                  className="flex flex-col items-center rounded-2xl bg-[#f4f8fc] px-6 py-8"
                >
                  <IconBadge icon={stepIcons[index]} />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 max-w-xs text-[15px] leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <StartButton label={diagnosis.startLabel} />
            </div>
          </div>
        </section>

        {/* Prêmio */}
        <section className="bg-[#071625] px-4 py-16 text-white sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#f5c451]/15 text-[#f5c451]">
                <Gift className="size-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-[1.75rem] font-bold tracking-[-0.01em] sm:text-4xl">
                {diagnosis.rewardSection.title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70 sm:text-lg">
                {diagnosis.rewardSection.description}
              </p>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
              {diagnosis.rewardSection.items.map((item, index) => {
                const Icon = rewardIcons[index];
                return (
                  <li
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/5 px-6 py-7"
                  >
                    <Icon className="size-6 text-accent" aria-hidden />
                    <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-white/65">
                      {item.description}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Perfis */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-[1.75rem] font-bold tracking-[-0.01em] text-foreground sm:text-4xl">
                {diagnosis.profilesLabel}
              </h2>
              <p className="mt-3 text-[15px] text-muted-foreground sm:text-lg">
                {diagnosis.profilesDescription}
              </p>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {diagnosis.profiles.map((profile, index) => {
                const Icon = profileIcons[index];
                return (
                  <li
                    key={profile.name}
                    className="rounded-2xl border border-border bg-card px-6 py-7 shadow-[0_12px_32px_-24px_rgba(7,22,37,0.35)]"
                  >
                    <Icon className="size-6 text-[#0f86a8]" aria-hidden />
                    <h3 className="mt-4 text-lg leading-snug font-semibold text-foreground">
                      {profile.name}
                    </h3>
                    <p className="mt-0.5 text-sm font-medium text-[#0f86a8]">
                      {profile.focus}
                    </p>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                      {profile.meaning}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Confiança */}
        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-3xl bg-[#f4f8fc] px-6 py-12 text-center sm:px-10">
            <h2 className="text-[1.75rem] font-bold tracking-[-0.01em] text-foreground sm:text-4xl">
              {diagnosis.trustTitle}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {content.hero.stats.map((stat) => (
                <div key={stat.value}>
                  <p className="text-2xl font-bold text-primary sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[15px] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <StartButton label={diagnosis.startLabel} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content.footer} />
    </>
  );
}
