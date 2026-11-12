"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  LockOpen,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfettiBurst } from "@/components/confetti-burst";
import { openWhatsAppMessage } from "@/lib/contact";
import { copy, type Language } from "@/lib/i18n";
import {
  DIAGNOSIS_QUESTION_COUNT,
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
const optionLetters = ["A", "B", "C", "D"];
const RESULT_STEP = DIAGNOSIS_QUESTION_COUNT;
const ANALYZING_MS = 2000;
const ANALYZING_REDUCED_MS = 400;

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

const staggerClassName =
  "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-500 motion-safe:fill-mode-backwards";

const cardClassName =
  "scroll-mt-4 rounded-3xl border border-border bg-card p-6 shadow-[0_24px_56px_-40px_hsl(from_var(--primary)_h_s_l/0.45)] sm:px-8 sm:py-7";

const darkControlClassName =
  "h-11 w-full rounded-xl border border-white/15 bg-white/8 px-4 text-base text-white outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-white/40 hover:border-white/30 focus:border-accent focus:bg-white/12 focus:ring-4 focus:ring-accent/20 aria-invalid:border-red-400/80 aria-invalid:focus:ring-red-400/20 sm:text-sm";

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

  // "Análise" curta antes de revelar o resultado, para gerar expectativa.
  useEffect(() => {
    if (!isResult || phase !== "analyzing") return;

    const timer = window.setTimeout(
      () => {
        setPhase("done");
        setResultOpen(true);
        setConfettiKey((key) => key + 1);
      },
      prefersReducedMotion() ? ANALYZING_REDUCED_MS : ANALYZING_MS,
    );

    return () => window.clearTimeout(timer);
  }, [isResult, phase]);

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
    if (step + 1 === RESULT_STEP) setPhase("analyzing");
    goTo(step + 1);
  };

  const restart = () => {
    setResultOpen(false);
    setAnswers([]);
    setLead(emptyLead);
    setSubmitted(false);
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
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {progressLabel}
          </span>
          {step > 0 && (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              {content.backLabel}
            </button>
          )}
        </div>

        <div
          className="mt-2.5 grid grid-cols-4 gap-1.5"
          role="progressbar"
          aria-label={progressLabel}
          aria-valuemin={0}
          aria-valuemax={DIAGNOSIS_QUESTION_COUNT}
          aria-valuenow={step}
        >
          {content.questions.map((item, index) => (
            <span
              key={item.topic}
              className={cn(
                "h-1.5 rounded-full transition-colors duration-500",
                index < step
                  ? "bg-accent"
                  : index === step
                    ? "bg-accent/35"
                    : "bg-border",
              )}
            />
          ))}
        </div>

        <div key={step} className={cn("mt-5", enterClassName)}>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary/70">
            {question.topic}
          </span>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-2 text-xl font-semibold tracking-tight text-balance text-foreground outline-none sm:text-2xl"
          >
            {question.question}
          </h2>

          <div className="mt-5 grid gap-2">
            {question.options.map((option, index) => {
              const isSelected = answers[step] === index;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectOption(index)}
                  aria-pressed={isSelected}
                  className={cn(
                    "group flex w-full items-center gap-3.5 rounded-2xl border border-border bg-secondary/50 px-4 py-3 text-left text-sm leading-snug text-foreground transition-[border-color,background-color,box-shadow,transform] duration-200 hover:border-accent/50 hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15 active:scale-[0.99] sm:px-5 sm:py-3 sm:text-[15px]",
                    isSelected && "border-accent bg-accent/10",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-xs font-medium text-muted-foreground transition-colors group-hover:border-accent/50 group-hover:text-foreground",
                      isSelected &&
                        "border-accent bg-accent text-accent-foreground group-hover:text-accent-foreground",
                    )}
                    aria-hidden
                  >
                    {optionLetters[index]}
                  </span>
                  <span>{option}</span>
                  <ArrowRight
                    className="ml-auto size-4 shrink-0 text-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const profileIndex = resolveImporterProfile(answers);
  const profile = content.profiles[profileIndex];

  const leadField = (
    field: LeadField,
    options: { type?: string; autoComplete: string; className?: string },
  ) => (
    <div className={options.className}>
      <label
        htmlFor={fieldId(field)}
        className="mb-1.5 block text-sm font-medium text-white/85"
      >
        {content.reward.fields[field].label}
      </label>
      <input
        id={fieldId(field)}
        name={field}
        type={options.type ?? "text"}
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
          className={cn(
            cardClassName,
            "flex min-h-[22rem] flex-col justify-center py-10 sm:py-12",
            enterClassName,
          )}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex size-11 items-center justify-center rounded-full bg-accent/12 text-accent">
              <span className="reward-ring absolute inset-0 rounded-full border-2 border-accent/50" />
              <Sparkles className="size-5" aria-hidden />
            </span>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-semibold tracking-tight text-foreground outline-none sm:text-2xl"
            >
              {content.analyzingTitle}
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {content.analyzingDetail}
          </p>

          <div className="mt-7 h-2 overflow-hidden rounded-full bg-border">
            <div
              className="diagnosis-analyze-bar h-full rounded-full bg-[linear-gradient(90deg,var(--accent),#2f6fd6)]"
              style={{ animationDuration: `${ANALYZING_MS}ms` }}
            />
          </div>

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {content.questions.map((item, index) => (
              <li
                key={item.topic}
                className={cn(
                  "flex items-center gap-2.5 text-sm text-foreground",
                  staggerClassName,
                )}
                style={{ animationDelay: `${250 + index * 380}ms` }}
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Check className="size-3" aria-hidden />
                </span>
                {item.topic}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div
          ref={containerRef}
          className={cn(cardClassName, "py-10 sm:py-12", enterClassName)}
        >
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <CircleCheck className="size-4 text-accent" aria-hidden />
            {content.completedEyebrow}
          </span>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-4 text-2xl font-semibold tracking-tight text-balance text-foreground outline-none sm:text-3xl"
          >
            {content.completedTitle}
          </h2>

          <div className="mt-6 flex items-center gap-4 rounded-2xl border border-accent/30 bg-accent/8 p-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent),#2f6fd6)] text-lg font-semibold text-white">
              {profileIndex + 1}
            </span>
            <span className="min-w-0">
              <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {profile.label} · {profile.focus}
              </span>
              <span className="mt-0.5 block text-lg font-semibold text-primary">
                {profile.name}
              </span>
            </span>
          </div>

          <Button
            type="button"
            size="lg"
            onClick={openResult}
            className="reward-shine mt-6 h-auto min-h-12 w-full whitespace-normal rounded-full bg-accent px-8 py-3 text-center text-accent-foreground hover:bg-accent/90"
          >
            {content.openResultLabel}
            <ArrowRight className="size-4" />
          </Button>
          <button
            type="button"
            onClick={restart}
            className="mx-auto mt-4 flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
          >
            <RotateCcw className="size-4" aria-hidden />
            {content.restartLabel}
          </button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby={dialogTitleId}
        onClose={() => setResultOpen(false)}
        onClick={handleBackdropClick}
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-transparent p-3 backdrop:bg-[#071625]/75 backdrop:backdrop-blur-sm open:flex sm:p-6"
      >
        {resultOpen && (
          <>
            <ConfettiBurst
              fireKey={confettiKey}
              className="pointer-events-none fixed inset-0 z-20 size-full"
            />

            <div className="relative m-auto grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-card shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-500 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <button
                type="button"
                onClick={() => setResultOpen(false)}
                aria-label={content.closeLabel}
                className="absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/25 lg:text-white/70 lg:hover:bg-white/10 lg:hover:text-white"
              >
                <X className="size-5" aria-hidden />
              </button>

              {/* Diagnóstico */}
              <article className="relative bg-[radial-gradient(circle_at_top_left,rgba(90,209,255,0.22),transparent_45%),linear-gradient(135deg,#f8fbff_0%,#eef4fa_100%)] p-6 sm:p-9">
                <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <Sparkles className="size-3.5 text-accent" aria-hidden />
                  {content.resultEyebrow}
                </span>

                <div className="mt-6 flex items-center gap-5">
                  <span className="reward-pop relative flex size-20 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent),#2f6fd6)] text-3xl font-semibold text-white shadow-[0_18px_40px_-16px_rgba(47,111,214,0.8)] sm:size-24 sm:text-4xl">
                    <span className="reward-ring absolute inset-0 rounded-full border-2 border-accent/60" />
                    {profileIndex + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="inline-flex rounded-full border border-accent/30 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {profile.label}
                    </span>
                    <p className="mt-2 text-sm font-medium text-muted-foreground">
                      {profile.focus}
                    </p>
                  </div>
                </div>

                <h2
                  id={dialogTitleId}
                  ref={dialogHeadingRef}
                  tabIndex={-1}
                  className="mt-5 text-3xl font-semibold tracking-tight text-balance text-primary outline-none sm:text-4xl"
                >
                  {profile.name}
                </h2>

                <div className="mt-5 grid grid-cols-4 gap-1.5" aria-hidden>
                  {content.profiles.map((item, index) => (
                    <span
                      key={item.label}
                      className={cn(
                        "h-1.5 rounded-full",
                        index === profileIndex ? "bg-accent" : "bg-primary/10",
                      )}
                    />
                  ))}
                </div>

                <dl className="mt-6 grid gap-5">
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {content.meaningLabel}
                    </dt>
                    <dd className="mt-1.5 text-[15px] leading-relaxed text-foreground">
                      {profile.meaning}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {content.summaryLabel}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {profile.summary}
                    </dd>
                  </div>
                </dl>
              </article>

              {/* Benefício desbloqueado + captura */}
              <section
                aria-label={content.reward.badge}
                className="relative isolate bg-[#071625] p-6 text-white sm:p-9"
              >
                <div
                  className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(245,196,81,0.18),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(47,111,214,0.3),transparent_55%)]"
                  aria-hidden
                />

                <span className="inline-flex items-center gap-2 rounded-full border border-[#f5c451]/40 bg-[#f5c451]/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#f5c451]">
                  <LockOpen className="reward-wiggle size-3.5" aria-hidden />
                  {content.reward.badge}
                </span>
                <h3 className="mt-4 pr-8 text-2xl font-semibold tracking-tight text-balance">
                  {content.reward.title}
                </h3>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {content.reward.perks.map((perk, index) => (
                    <li
                      key={perk}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 py-1.5 pr-1.5 pl-3 text-xs font-medium text-white",
                        staggerClassName,
                      )}
                      style={{ animationDelay: `${450 + index * 200}ms` }}
                    >
                      <CircleCheck className="size-3.5 text-accent" aria-hidden />
                      {perk}
                      <span className="rounded-full bg-[#f5c451] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#071625]">
                        {content.reward.freeTag}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Em telas baixas os itens acima já resumem o texto; evita rolagem. */}
                <p className="mt-4 text-sm leading-relaxed text-white/70 lg:[@media(max-height:780px)]:hidden">
                  {content.reward.description}
                </p>

                <form noValidate onSubmit={handleSubmit} className="mt-5">
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
                    className="reward-shine mt-5 h-auto min-h-12 w-full whitespace-normal rounded-full bg-accent px-8 py-3 text-center font-semibold text-accent-foreground shadow-[0_12px_32px_-12px_rgba(63,193,221,0.8)] hover:bg-accent/90"
                  >
                    {content.reward.submitLabel}
                    <ArrowRight className="size-4" />
                  </Button>
                  <p className="mt-3 text-center text-xs leading-relaxed text-white/50">
                    {content.reward.privacyNote}
                  </p>
                </form>
              </section>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
