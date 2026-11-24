"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { ArrowRight, Check, LockOpen, RotateCcw, Ticket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfettiBurst } from "@/components/confetti-burst";
import { DiagnosisQuestionnaire } from "@/components/diagnosis-questionnaire";
import {
  OptionIndicator,
  diagnosisCardClassName as cardClassName,
  diagnosisEnterClassName as enterClassName,
} from "@/components/diagnosis-ui";
import { openWhatsAppMessage } from "@/lib/contact";
import { copy, type Language } from "@/lib/i18n";
import {
  DIAGNOSIS_QUESTION_COUNT,
  resolveImporterProfile,
} from "@/lib/import-diagnosis";
import {
  buildLeadMessage,
  type LeadMessageLine,
  type LeadMessageSection,
} from "@/lib/lead-message";
import { captureLeadSource } from "@/lib/lead-source";
import {
  formatIntakeAnswer,
  type ContactValues,
  type IntakeAnswer,
  type IntakeQuestion,
} from "@/lib/import-intake";
import { cn } from "@/lib/utils";

type DiagnosisContent = (typeof copy)[Language]["diagnosis"];
type LeadMessageCopy = (typeof copy)[Language]["leadMessage"];

type ImportDiagnosisProps = {
  content: DiagnosisContent;
  messageCopy: LeadMessageCopy;
};

type Stage = "questions" | "analyzing" | "done";

// "Roleta" entre os 4 perfis antes do resultado: o destaque desacelera e para
// no perfil calculado. Voltas mínimas em múltiplo de 4 para terminar no índice certo.
const ROULETTE_MIN_STEPS = 8;
const ROULETTE_LAND_PAUSE_MS = 650;
const ROULETTE_REDUCED_MS = 500;

// A abertura (importação/exportação) vem antes das 4 perguntas do perfil.
const PROFILE_START = 1;
// Exportação aparece como "Em breve" até as perguntas desse caminho chegarem.
const EXPORT_OPTION = 1;

// Ordem de `content.questions` (perguntas do perfil).
const PROFILE_IDS = ["curiosity", "concern", "goal", "size"];

/** Abertura, 4 perguntas do perfil (escolha única) e perguntas de dúvidas. */
function buildQuestions(content: DiagnosisContent): IntakeQuestion[] {
  const path = content.pathQuestion;

  return [
    {
      kind: "single",
      id: "path",
      label: content.messageLabels.path,
      question: path.question,
      options: path.options.map((option) => option.title),
      optionDetails: path.options.map((option) => option.description),
      optionIcons: ["import", "export"],
      disabledOptions: [EXPORT_OPTION],
      disabledBadge: path.soonLabel,
    },
    ...content.questions.map(
      (item, index): IntakeQuestion => ({
        kind: "single",
        id: PROFILE_IDS[index],
        label: content.messageLabels.profile[index],
        question: item.question,
        options: item.options,
      }),
    ),
    ...(content.intake.questions as readonly IntakeQuestion[]),
  ];
}

// Em qual seção da mensagem do WhatsApp cada resposta entra.
const messageSectionById: Record<string, LeadMessageSection> = {
  path: "interest",
  importStatus: "interest",
  radar: "interest",
  radarLimit: "interest",
  radarPlan: "interest",
  product: "operation",
  reference: "operation",
  purpose: "operation",
  currentPurchase: "operation",
  frequency: "operation",
  quantity: "operation",
  requirement: "operation",
  investment: "operation",
  timing: "operation",
  goal: "goal",
  improvement: "goal",
  curiosity: "doubt",
  concern: "doubt",
  clarify: "doubt",
};

function buildMessage(
  questions: IntakeQuestion[],
  answers: IntakeAnswer[],
  contact: ContactValues,
  profileAnswers: number[],
  content: DiagnosisContent,
  messageCopy: LeadMessageCopy,
) {
  const profile = content.profiles[resolveImporterProfile(profileAnswers)];
  const locale = content.intake.numberLocale;

  const lines: LeadMessageLine[] = questions.flatMap((item, index) => {
    if (item.kind === "contact") return [];
    const value = formatIntakeAnswer(item, answers[index], locale);
    if (!value) return [];
    return [
      {
        section: messageSectionById[item.id ?? ""] ?? "other",
        label: item.label ?? item.question,
        value,
      },
    ];
  });

  lines.push({ section: "profile", value: `${profile.name} (${profile.focus})` });

  // Contato que não está na abertura: WhatsApp informado, e-mail e sorteio.
  lines.push(
    { section: "other", label: messageCopy.phone, value: contact.phone.trim() },
    { section: "other", label: messageCopy.email, value: contact.email.trim() },
  );
  const contactIndex = questions.findIndex((item) => item.kind === "contact");
  const contactQuestion = questions[contactIndex];
  if (contactQuestion?.kind === "contact" && contactQuestion.optInLabel) {
    lines.push({
      section: "other",
      label: content.prizeMessageLabel,
      value: answers[contactIndex]?.optIn ? content.yesLabel : content.noLabel,
    });
  }

  return buildLeadMessage({
    copy: messageCopy,
    origin: "diagnosis",
    source: captureLeadSource(),
    name: contact.name,
    company: contact.company,
    city: contact.city,
    lines,
  });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ImportDiagnosis({ content, messageCopy }: ImportDiagnosisProps) {
  const baseId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogHeadingRef = useRef<HTMLHeadingElement>(null);

  const [questions] = useState(() => buildQuestions(content));
  const [round, setRound] = useState(0);
  const [stage, setStage] = useState<Stage>("questions");
  const [profileAnswers, setProfileAnswers] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [highlight, setHighlight] = useState<number | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [sent, setSent] = useState(false);
  const [prizeOptIn, setPrizeOptIn] = useState(false);

  const dialogTitleId = `${baseId}-result-title`;

  // Guarda o anúncio/campanha da URL de entrada para a mensagem final.
  useEffect(() => {
    captureLeadSource();
  }, []);

  // Ao sair do questionário: foco no novo título e card de volta à tela.
  useEffect(() => {
    if (stage === "questions") return;

    headingRef.current?.focus({ preventScroll: true });
    const container = containerRef.current;
    if (!container) return;

    const { top, bottom } = container.getBoundingClientRect();
    if (top < 0 || bottom > window.innerHeight + 1) {
      container.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    }
  }, [stage]);

  useEffect(() => {
    if (stage !== "analyzing") return;

    const target = resolveImporterProfile(profileAnswers);
    const timers: number[] = [];
    const finish = () => {
      setStage("done");
      setResultOpen(true);
      setConfettiKey((key) => key + 1);
    };

    if (prefersReducedMotion()) {
      setHighlight(target);
      timers.push(window.setTimeout(finish, ROULETTE_REDUCED_MS));
    } else {
      const steps = ROULETTE_MIN_STEPS + target;
      let elapsed = 0;

      for (let step = 0; step <= steps; step += 1) {
        // Intervalos crescentes: começa rápido e desacelera até parar.
        elapsed += 70 + 280 * Math.pow(step / steps, 2.4);
        timers.push(window.setTimeout(() => setHighlight(step % 4), elapsed));
      }

      timers.push(window.setTimeout(finish, elapsed + ROULETTE_LAND_PAUSE_MS));
    }

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [stage, profileAnswers]);

  // Sincroniza o <dialog> nativo (foco preso, Esc, camada superior).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (resultOpen) {
      if (!dialog.open) dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      dialogHeadingRef.current?.focus({ preventScroll: true });
      dialog.scrollTop = 0;
    } else if (dialog.open) {
      dialog.close();
    }

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [resultOpen]);

  const complete = (answers: IntakeAnswer[], contact: ContactValues) => {
    const diagnosisAnswers = answers
      .slice(PROFILE_START, PROFILE_START + DIAGNOSIS_QUESTION_COUNT)
      .map((item) => item.choice ?? 0);
    const contactIndex = questions.findIndex((item) => item.kind === "contact");

    setProfileAnswers(diagnosisAnswers);
    setMessage(
      buildMessage(
        questions,
        answers,
        contact,
        diagnosisAnswers,
        content,
        messageCopy,
      ),
    );
    setPrizeOptIn(Boolean(answers[contactIndex]?.optIn));
    setHighlight(null);
    setSent(false);
    setStage("analyzing");
  };

  const restart = () => {
    setResultOpen(false);
    setProfileAnswers([]);
    setMessage("");
    setHighlight(null);
    setSent(false);
    setStage("questions");
    setRound((value) => value + 1);
  };

  const openResult = () => {
    setResultOpen(true);
    setConfettiKey((key) => key + 1);
  };

  const sendAnswers = () => {
    openWhatsAppMessage(message);
    setSent(true);
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) setResultOpen(false);
  };

  if (stage === "questions") {
    return (
      <DiagnosisQuestionnaire
        key={round}
        content={content}
        questions={questions}
        onComplete={complete}
      />
    );
  }

  const profile = content.profiles[resolveImporterProfile(profileAnswers)];

  return (
    <>
      {stage === "analyzing" ? (
        <div
          ref={containerRef}
          className={cardClassName}
          role="status"
          aria-live="polite"
          data-diagnosis-roulette=""
        >
          <div className="my-auto">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-semibold tracking-[-0.01em] text-foreground outline-none sm:text-2xl"
            >
              {content.analyzingTitle}
            </h2>
            <div className="mt-5 grid gap-2.5">
              {content.profiles.map((item, index) => (
                <div
                  key={item.name}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border bg-white px-4 py-3.5 transition-[border-color,background-color,opacity,transform] duration-150",
                    highlight === index
                      ? "scale-[1.02] border-accent bg-accent/8 shadow-[0_0_0_3px_color-mix(in_oklch,var(--accent)_30%,transparent)]"
                      : "border-[#d5dde6]",
                    highlight !== null && highlight !== index && "opacity-50",
                  )}
                >
                  <OptionIndicator selected={highlight === index} />
                  <span className="min-w-0">
                    <span className="block text-[15px] leading-snug font-semibold text-foreground">
                      {item.name}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
                      {item.focus}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className={cn(cardClassName, "justify-center", enterClassName)}
        >
          <p className="text-sm text-muted-foreground">
            {content.completedEyebrow}
          </p>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-1.5 text-2xl leading-tight font-semibold tracking-[-0.01em] text-primary outline-none sm:text-3xl"
          >
            {profile.name}
          </h2>
          <p className="mt-1 text-muted-foreground">{profile.focus}</p>

          <Button
            type="button"
            size="lg"
            onClick={openResult}
            className="mt-7 h-auto min-h-12 w-full whitespace-normal rounded-full bg-accent px-8 py-3 text-center text-accent-foreground hover:bg-accent/90"
          >
            {content.openResultLabel}
            <ArrowRight className="size-4" />
          </Button>
          <button
            type="button"
            onClick={restart}
            className="mx-auto mt-3 flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            {content.restartLabel}
          </button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby={dialogTitleId}
        onClose={() => setResultOpen(false)}
        onClick={handleBackdropClick}
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-transparent p-0 backdrop:bg-[#071625]/75 backdrop:backdrop-blur-sm open:flex sm:p-6"
      >
        {resultOpen && (
          <>
            <ConfettiBurst
              fireKey={confettiKey}
              className="pointer-events-none fixed inset-0 z-20 size-full"
            />

            {/* No celular o botão fica fixo no canto enquanto o conteúdo rola. */}
            <button
              type="button"
              onClick={() => setResultOpen(false)}
              aria-label={content.closeLabel}
              className="fixed top-3 right-3 z-30 flex size-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-[0_4px_16px_-6px_rgba(0,0,0,0.35)] backdrop-blur focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/25 lg:hidden"
            >
              <X className="size-5" aria-hidden />
            </button>

            <div className="relative m-auto grid min-h-dvh w-full max-w-5xl overflow-clip bg-card shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-500 sm:min-h-0 sm:rounded-[2rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <button
                type="button"
                onClick={() => setResultOpen(false)}
                aria-label={content.closeLabel}
                className="absolute top-4 right-4 z-10 hidden size-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/25 lg:flex"
              >
                <X className="size-5" aria-hidden />
              </button>

              {/* Diagnóstico */}
              <article className="flex flex-col justify-center bg-[#f4f8fc] px-6 pt-7 pb-7 sm:p-10">
                <p className="text-sm text-muted-foreground">
                  {content.resultEyebrow}
                </p>
                <h2
                  id={dialogTitleId}
                  ref={dialogHeadingRef}
                  tabIndex={-1}
                  className="mt-1.5 pr-10 text-[1.875rem] leading-[1.1] font-semibold tracking-[-0.015em] text-balance text-primary outline-none motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-90 motion-safe:duration-700 motion-safe:delay-150 motion-safe:fill-mode-backwards sm:text-[2.5rem] lg:pr-0"
                >
                  {profile.name}
                </h2>
                <p className="mt-2 font-medium text-primary/70">
                  {profile.focus}
                </p>

                {/* No celular fica só o resumo pessoal, para o benefício aparecer logo. */}
                <p className="mt-7 hidden text-[17px] leading-relaxed text-foreground lg:block">
                  {profile.meaning}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-foreground/80 lg:mt-3 lg:text-muted-foreground">
                  {profile.summary}
                </p>
              </article>

              {/* Benefício desbloqueado + envio das respostas */}
              <section
                aria-label={content.reward.badge}
                className="flex flex-col justify-center bg-[#071625] px-6 pt-7 pb-3 text-white sm:p-10"
              >
                <p className="flex items-center gap-2 text-sm font-medium text-[#f5c451]">
                  <LockOpen className="reward-wiggle size-4" aria-hidden />
                  {content.reward.badge}
                </p>
                <h3 className="mt-3 pr-8 text-2xl leading-tight font-semibold tracking-[-0.01em] text-balance">
                  {content.reward.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/70">
                  {content.reward.description}
                </p>
                {prizeOptIn && (
                  <p className="mt-4 flex items-start gap-2 rounded-xl border border-[#f5c451]/30 bg-[#f5c451]/10 px-4 py-3 text-[15px] leading-snug font-medium text-[#f5c451]">
                    <Ticket className="mt-0.5 size-4 shrink-0" aria-hidden />
                    {content.reward.prizeLine}
                  </p>
                )}

                {/* No celular o botão do WhatsApp fica preso ao pé da tela enquanto o texto rola. */}
                <div className="sticky bottom-0 z-10 -mx-6 mt-7 bg-[#071625] px-6 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-16px_24px_-8px_#071625] sm:static sm:mx-0 sm:mt-0 sm:bg-transparent sm:p-0 sm:shadow-none">
                {sent ? (
                  <div className="rounded-2xl sm:mt-7 border border-white/10 bg-white/5 p-5">
                    <p className="flex items-center gap-2 font-semibold">
                      <Check className="size-5 text-accent" aria-hidden />
                      {content.reward.sentTitle}
                    </p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-white/70">
                      {content.reward.sentDescription}
                    </p>
                    <button
                      type="button"
                      onClick={sendAnswers}
                      className="mt-1 inline-flex min-h-11 items-center text-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/25"
                    >
                      {content.reward.reopenLabel}
                    </button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    size="lg"
                    onClick={sendAnswers}
                    className="reward-shine h-auto min-h-13 sm:mt-7 w-full whitespace-normal rounded-full bg-accent px-6 py-3 text-center text-[15px] leading-snug font-semibold text-accent-foreground hover:bg-accent/90 sm:px-8"
                  >
                    {content.reward.submitLabel}
                    <ArrowRight className="size-4" />
                  </Button>
                )}
                </div>
              </section>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
