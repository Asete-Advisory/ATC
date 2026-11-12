"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import { ArrowLeft, ArrowRight, LockOpen, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfettiBurst } from "@/components/confetti-burst";
import { ImporterProfileCard } from "@/components/importer-profile-card";
import { openWhatsAppMessage } from "@/lib/contact";
import { copy, type Language } from "@/lib/i18n";
import {
  DIAGNOSIS_QUESTION_COUNT,
  PROFILE_IMAGES,
  resolveImporterProfile,
} from "@/lib/import-diagnosis";
import { cn } from "@/lib/utils";

type DiagnosisContent = (typeof copy)[Language]["diagnosis"];

type ImportDiagnosisProps = {
  content: DiagnosisContent;
};

type LeadField = "company" | "name" | "contact";
type LeadValues = Record<LeadField, string>;
type LeadErrors = Partial<Record<LeadField, string>>;
type ResultPhase = "analyzing" | "done";

const leadFields: LeadField[] = ["company", "name", "contact"];
const emptyLead: LeadValues = { company: "", name: "", contact: "" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESULT_STEP = DIAGNOSIS_QUESTION_COUNT;
// "Roleta" entre os 4 perfis antes do resultado: o destaque desacelera e para
// no perfil calculado. Voltas mínimas em múltiplo de 4 para terminar no índice certo.
const ROULETTE_MIN_STEPS = 8;
const ROULETTE_LAND_PAUSE_MS = 650;
const ROULETTE_REDUCED_MS = 500;

function validateLead(values: LeadValues, content: DiagnosisContent) {
  const errors: LeadErrors = {};

  for (const field of leadFields) {
    if (!values[field].trim()) {
      errors[field] = content.requiredError;
    }
  }

  const contact = values.contact.trim();
  if (contact) {
    const digits = contact.replace(/\D/g, "");
    const isValid = contact.includes("@")
      ? emailPattern.test(contact)
      : digits.length >= 10 && digits.length <= 15;

    if (!isValid) {
      errors.contact = content.contactError;
    }
  }

  return errors;
}

function buildMessage(
  answers: number[],
  lead: LeadValues,
  content: DiagnosisContent,
) {
  const profile = content.profiles[resolveImporterProfile(answers)];
  const { fields } = content.reward;

  const contactLines = [
    `*${fields.company.label}:* ${lead.company.trim()}`,
    `*${fields.name.label}:* ${lead.name.trim()}`,
    `*${content.contactMessageLabel}:* ${lead.contact.trim()}`,
  ];

  const answerLines = content.questions.map(
    (question, index) =>
      `*${index + 1}. ${question.question}*\n${question.options[answers[index]]}`,
  );

  return [
    content.messageIntro,
    `*${content.profileMessageLabel}:* ${profile.name} (${profile.focus})`,
    contactLines.join("\n"),
    ...answerLines,
  ].join("\n\n");
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const enterClassName =
  "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-500";

// No celular o quiz ocupa a página sem moldura; o card aparece a partir de sm.
const cardClassName =
  "scroll-mt-4 sm:rounded-3xl sm:border sm:border-border sm:bg-card sm:px-8 sm:py-7 sm:shadow-[0_24px_56px_-40px_hsl(from_var(--primary)_h_s_l/0.45)]";

const darkControlClassName =
  "h-12 w-full rounded-xl border border-white/15 bg-white/8 px-4 text-base text-white outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-white/40 hover:border-white/30 focus:border-accent focus:bg-white/12 focus:ring-4 focus:ring-accent/20 aria-invalid:border-red-400/80 aria-invalid:focus:ring-red-400/20 sm:h-11 sm:text-sm";

export function ImportDiagnosis({ content }: ImportDiagnosisProps) {
  const baseId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogHeadingRef = useRef<HTMLHeadingElement>(null);
  const hasInteracted = useRef(false);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [phase, setPhase] = useState<ResultPhase>("analyzing");
  const [highlight, setHighlight] = useState<number | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [lead, setLead] = useState<LeadValues>(emptyLead);
  const [submitted, setSubmitted] = useState(false);

  const isResult = step === RESULT_STEP;
  const errors = submitted ? validateLead(lead, content) : {};
  const fieldId = (field: LeadField) => `${baseId}-${field}`;
  const errorId = (field: LeadField) => `${baseId}-${field}-error`;
  const dialogTitleId = `${baseId}-result-title`;

  // Ao trocar de etapa, leva o foco para o novo título e mantém o card visível.
  useEffect(() => {
    if (!hasInteracted.current) return;

    headingRef.current?.focus({ preventScroll: true });

    const container = containerRef.current;
    if (!container) return;

    // Só rola quando o card saiu da tela (ex.: celular, abaixo do título).
    const { top } = container.getBoundingClientRect();
    if (top < 0 || top > window.innerHeight * 0.6) {
      container.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    }
  }, [step, phase]);

  useEffect(() => {
    if (!isResult || phase !== "analyzing") return;

    const target = resolveImporterProfile(answers);
    const timers: number[] = [];
    const finish = () => {
      setPhase("done");
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
        timers.push(
          window.setTimeout(() => setHighlight(step % 4), elapsed),
        );
      }

      timers.push(window.setTimeout(finish, elapsed + ROULETTE_LAND_PAUSE_MS));
    }

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [isResult, phase, answers]);

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

  const goTo = (nextStep: number) => {
    hasInteracted.current = true;
    setStep(nextStep);
  };

  const selectOption = (optionIndex: number) => {
    setAnswers((current) => {
      const next = current.slice(0, step);
      next[step] = optionIndex;
      return next;
    });
    if (step + 1 === RESULT_STEP) {
      setHighlight(null);
      setPhase("analyzing");
    }
    goTo(step + 1);
  };

  const restart = () => {
    setResultOpen(false);
    setAnswers([]);
    setLead(emptyLead);
    setSubmitted(false);
    setHighlight(null);
    setPhase("analyzing");
    goTo(0);
  };

  const openResult = () => {
    setResultOpen(true);
    setConfettiKey((key) => key + 1);
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) setResultOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    const currentErrors = validateLead(lead, content);
    const firstInvalid = leadFields.find((field) => currentErrors[field]);

    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    openWhatsAppMessage(buildMessage(answers, lead, content));
  };

  if (!isResult) {
    const question = content.questions[step];
    const progressLabel = content.progressLabel
      .replace("{current}", String(step + 1))
      .replace("{total}", String(DIAGNOSIS_QUESTION_COUNT));

    return (
      <div ref={containerRef} className={cardClassName}>
        <div className="flex min-h-8 items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">{progressLabel}</span>
          {step > 0 && (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              className="-mr-3 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              {content.backLabel}
            </button>
          )}
        </div>

        <div
          className="mt-2 h-1 overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-label={progressLabel}
          aria-valuemin={0}
          aria-valuemax={DIAGNOSIS_QUESTION_COUNT}
          aria-valuenow={step}
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${((step + 1) / DIAGNOSIS_QUESTION_COUNT) * 100}%` }}
          />
        </div>

        <div key={step} className={cn("mt-6", enterClassName)}>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-xl leading-snug font-semibold tracking-[-0.01em] text-balance text-foreground outline-none sm:text-2xl"
          >
            {question.question}
          </h2>

          <div className="mt-5 grid gap-2">
            {question.options.map((option, index) => (
              <button
                key={option}
                type="button"
                onClick={() => selectOption(index)}
                aria-pressed={answers[step] === index}
                className={cn(
                  "w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-left text-[15px] leading-snug text-foreground transition-[border-color,background-color,transform] duration-150 hover:border-accent/60 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15 active:scale-[0.99] sm:bg-secondary/40 sm:px-5",
                  answers[step] === index && "border-accent bg-accent/10",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const profile = content.profiles[resolveImporterProfile(answers)];

  const leadField = (
    field: LeadField,
    options: { autoComplete: string; className?: string },
  ) => (
    <div className={options.className}>
      <label
        htmlFor={fieldId(field)}
        className="mb-1.5 block text-sm text-white/80"
      >
        {content.reward.fields[field].label}
      </label>
      <input
        id={fieldId(field)}
        name={field}
        type="text"
        autoComplete={options.autoComplete}
        value={lead[field]}
        onChange={(event) =>
          setLead((current) => ({ ...current, [field]: event.target.value }))
        }
        placeholder={content.reward.fields[field].placeholder}
        aria-invalid={errors[field] ? true : undefined}
        aria-describedby={errors[field] ? errorId(field) : undefined}
        className={darkControlClassName}
      />
      {errors[field] && (
        <p id={errorId(field)} className="mt-1.5 text-xs text-red-300">
          {errors[field]}
        </p>
      )}
    </div>
  );

  return (
    <>
      {phase === "analyzing" ? (
        <div
          ref={containerRef}
          className={cardClassName}
          role="status"
          aria-live="polite"
          data-diagnosis-roulette=""
        >
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-xl font-semibold tracking-[-0.01em] text-foreground outline-none sm:text-2xl"
          >
            {content.analyzingTitle}
          </h2>
          <div className="mt-5 grid gap-2 lg:grid-cols-2 lg:gap-2.5">
            {content.profiles.map((item, index) => (
              <ImporterProfileCard
                key={item.name}
                name={item.name}
                focus={item.focus}
                image={PROFILE_IMAGES[index]}
                active={highlight === index}
                muted={highlight !== null && highlight !== index}
              />
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className={cn(
            cardClassName,
            "lg:flex lg:min-h-[20rem] lg:flex-col lg:justify-center",
            enterClassName,
          )}
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
            className="mx-auto mt-3 flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
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

            <div className="relative m-auto grid min-h-dvh w-full max-w-5xl overflow-hidden bg-card sm:min-h-0 sm:rounded-[2rem] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-500 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
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
                  className="mt-1.5 pr-10 text-[1.875rem] leading-[1.1] font-semibold lg:pr-0 tracking-[-0.015em] text-balance text-primary outline-none motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-90 motion-safe:duration-700 motion-safe:delay-150 motion-safe:fill-mode-backwards sm:text-[2.5rem]"
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

              {/* Benefício desbloqueado + captura */}
              <section
                aria-label={content.reward.badge}
                className="bg-[#071625] px-6 pt-7 pb-10 text-white sm:p-10"
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

                <form noValidate onSubmit={handleSubmit} className="mt-7">
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {leadField("company", { autoComplete: "organization" })}
                    {leadField("name", { autoComplete: "name" })}
                    {leadField("contact", {
                      autoComplete: "tel",
                      className: "sm:col-span-2",
                    })}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="reward-shine mt-6 h-auto min-h-13 w-full whitespace-normal rounded-full bg-accent px-6 py-3 text-center text-[15px] leading-snug font-semibold text-accent-foreground hover:bg-accent/90 sm:px-8"
                  >
                    {content.reward.submitLabel}
                    <ArrowRight className="hidden size-4 sm:block" />
                  </Button>
                </form>
              </section>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
