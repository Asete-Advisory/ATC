"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  OptionIndicator,
  diagnosisCardClassName,
  diagnosisEnterClassName,
  diagnosisInputClassName,
  diagnosisOptionClassName,
  diagnosisOptionSelectedClassName,
} from "@/components/diagnosis-ui";
import { copy, type Language } from "@/lib/i18n";
import {
  contactFields,
  emptyContact,
  isOtherSelected,
  showsAmount,
  validateIntakeStep,
  type ContactField,
  type ContactValues,
  type IntakeAnswer,
  type IntakeErrors,
  type IntakeQuestion,
} from "@/lib/import-intake";
import { cn } from "@/lib/utils";

type DiagnosisContent = (typeof copy)[Language]["diagnosis"];

type DiagnosisQuestionnaireProps = {
  content: DiagnosisContent;
  /** As 4 perguntas do perfil seguidas das perguntas de dúvidas. */
  questions: readonly IntakeQuestion[];
  onComplete: (answers: IntakeAnswer[], contact: ContactValues) => void;
};

const contactAutoComplete: Record<ContactField, string> = {
  name: "name",
  company: "organization",
  city: "address-level2",
  phone: "tel",
  email: "email",
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Questionário do /diagnostico: uma pergunta por tela. O perfil só é revelado
 * pelo componente pai depois da última resposta.
 */
export function DiagnosisQuestionnaire({
  content,
  questions,
  onComplete,
}: DiagnosisQuestionnaireProps) {
  const intake = content.intake;
  const total = questions.length;

  const baseId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const otherRef = useRef<HTMLInputElement>(null);
  const hasMoved = useRef(false);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<IntakeAnswer[]>(() =>
    questions.map(() => ({})),
  );
  const [contact, setContact] = useState<ContactValues>(emptyContact);
  const [errors, setErrors] = useState<IntakeErrors>({});

  const question = questions[step];
  const answer = answers[step];
  const isLast = step === total - 1;
  const errorMessages = { ...intake, requiredError: content.requiredError };
  const id = (suffix: string) => `${baseId}-${step}-${suffix}`;

  // A cada pergunta: foco no título e card de volta à tela, se saiu dela.
  useEffect(() => {
    if (!hasMoved.current) return;

    headingRef.current?.focus({ preventScroll: true });
    const container = containerRef.current;
    if (!container) return;

    const { top } = container.getBoundingClientRect();
    if (top < 0 || top > window.innerHeight * 0.6) {
      container.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    }
  }, [step]);

  const updateAnswer = (patch: Partial<IntakeAnswer>) => {
    setAnswers((current) =>
      current.map((item, index) => (index === step ? { ...item, ...patch } : item)),
    );
    setErrors({});
  };

  const goTo = (next: number) => {
    hasMoved.current = true;
    setErrors({});
    setStep(next);
  };

  const advance = (answerOverride?: IntakeAnswer) => {
    const current = answerOverride ?? answer;
    const currentErrors = validateIntakeStep(
      question,
      current,
      contact,
      errorMessages,
    );

    if (Object.keys(currentErrors).length) {
      setErrors(currentErrors);
      const firstField = currentErrors.other
        ? id("other")
        : question.kind === "contact"
          ? id(contactFields.find((field) => currentErrors[field]) ?? "name")
          : id("main");
      document.getElementById(firstField)?.focus();
      return;
    }

    if (isLast) {
      onComplete(
        answers.map((item, index) => (index === step ? current : item)),
        contact,
      );
      return;
    }

    goTo(step + 1);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    advance();
  };

  const chooseSingle = (index: number) => {
    if (question.kind !== "single") return;
    const next = { ...answer, choice: index };
    updateAnswer({ choice: index });

    const needsMore =
      (question.other && index === question.options.length - 1) ||
      showsAmount(question, next);

    if (needsMore) {
      // O campo extra aparece abaixo das opções.
      window.requestAnimationFrame(() => otherRef.current?.focus());
    } else if (!isLast) {
      // Escolha única sem campo extra avança sozinha.
      window.setTimeout(() => advance(next), 180);
    }
  };

  const toggleMulti = (index: number) => {
    if (question.kind !== "multi") return;
    const current = answer.choices ?? [];
    const selected = current.includes(index);
    const choices = selected
      ? current.filter((item) => item !== index)
      : [...current, index];
    updateAnswer({ choices });

    if (!selected && question.other && index === question.options.length - 1) {
      window.requestAnimationFrame(() => otherRef.current?.focus());
    }
  };

  const progressLabel = content.progressLabel
    .replace("{current}", String(step + 1))
    .replace("{total}", String(total));
  // Listas longas (9 opções curtas) em duas colunas no desktop, para caber no card.
  const optionsGridClassName = cn(
    "grid gap-2 outline-none",
    "options" in question &&
      question.options.length > 6 &&
      "lg:grid-cols-2",
  );
  const optional = question.kind === "text" && question.optional;
  const multiHint =
    question.kind === "multi" ? (question.hint ?? intake.multiHint) : undefined;
  const hint =
    question.kind === "single"
      ? intake.singleHint
      : question.kind === "multi"
        ? multiHint
        : question.hint;
  const atMax =
    question.kind === "multi" &&
    question.max !== undefined &&
    (answer.choices?.length ?? 0) >= question.max;

  const errorText = (key: keyof IntakeErrors) =>
    errors[key] ? (
      <p id={id(`${key}-error`)} className="mt-1.5 text-sm text-red-600">
        {errors[key]}
      </p>
    ) : null;

  const otherInput = isOtherSelected(question, answer) ? (
    <div className="mt-3">
      <input
        ref={otherRef}
        id={id("other")}
        type="text"
        value={answer.other ?? ""}
        onChange={(event) => updateAnswer({ other: event.target.value })}
        placeholder={intake.otherPlaceholder}
        aria-label={intake.otherPlaceholder}
        aria-invalid={errors.other ? true : undefined}
        aria-describedby={errors.other ? id("other-error") : undefined}
        className={cn(diagnosisInputClassName, "h-12")}
      />
      {errorText("other")}
    </div>
  ) : null;

  const unknownToggle = (label: string) => (
    <button
      type="button"
      onClick={() => updateAnswer({ unknown: !answer.unknown })}
      aria-pressed={answer.unknown ?? false}
      className="group mt-3 flex items-center gap-2.5 rounded-lg py-1 text-[15px] text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
    >
      <OptionIndicator selected={answer.unknown ?? false} multiple />
      {label}
    </button>
  );

  return (
    // No desktop, altura da maior pergunta: o botão e a página não mudam de lugar.
    <div ref={containerRef} className={cn(diagnosisCardClassName, "self-start lg:self-stretch")}>
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
        aria-valuemax={total}
        aria-valuenow={step}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>

      <form
        key={step}
        noValidate
        onSubmit={handleSubmit}
        className={cn("mt-6 flex flex-1 flex-col", diagnosisEnterClassName)}
      >
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-lg leading-snug font-semibold tracking-[-0.01em] text-balance text-foreground outline-none sm:text-xl"
        >
          {question.question}
          {optional && (
            <span className="ml-2 align-middle text-xs font-medium text-muted-foreground">
              ({intake.optionalLabel})
            </span>
          )}
        </h2>
        {hint && (
          <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
        )}

        <div className="mt-4">
          {question.kind === "single" && (
            <>
              <div
                id={id("main")}
                tabIndex={-1}
                role="group"
                aria-label={question.question}
                aria-describedby={errors.main ? id("main-error") : undefined}
                className={optionsGridClassName}
              >
                {question.options.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => chooseSingle(index)}
                    aria-pressed={answer.choice === index}
                    className={cn(
                      diagnosisOptionClassName,
                      "py-3",
                      answer.choice === index && diagnosisOptionSelectedClassName,
                    )}
                  >
                    <OptionIndicator selected={answer.choice === index} />
                    <span>{option}</span>
                  </button>
                ))}
              </div>
              {errorText("main")}
              {otherInput}
              {showsAmount(question, answer) && (
                <div className="mt-4">
                  <label
                    htmlFor={id("amount")}
                    className="mb-1.5 block text-sm text-muted-foreground"
                  >
                    {question.amountLabel}
                  </label>
                  <input
                    ref={otherRef}
                    id={id("amount")}
                    type="text"
                    inputMode="decimal"
                    value={answer.amount ?? ""}
                    onChange={(event) => updateAnswer({ amount: event.target.value })}
                    placeholder={question.amountPlaceholder}
                    className={cn(diagnosisInputClassName, "h-12")}
                  />
                </div>
              )}
            </>
          )}

          {question.kind === "multi" && (
            <>
              <div
                id={id("main")}
                tabIndex={-1}
                role="group"
                aria-label={question.question}
                aria-describedby={errors.main ? id("main-error") : undefined}
                className={optionsGridClassName}
              >
                {question.options.map((option, index) => {
                  const selected = answer.choices?.includes(index) ?? false;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleMulti(index)}
                      aria-pressed={selected}
                      disabled={atMax && !selected}
                      className={cn(
                        diagnosisOptionClassName,
                        "py-3",
                        selected && diagnosisOptionSelectedClassName,
                      )}
                    >
                      <OptionIndicator selected={selected} multiple />
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
              {errorText("main")}
              {otherInput}
            </>
          )}

          {question.kind === "text" && (
            <>
              <textarea
                id={id("main")}
                rows={4}
                value={answer.text ?? ""}
                disabled={answer.unknown}
                onChange={(event) => updateAnswer({ text: event.target.value })}
                placeholder={intake.textPlaceholder}
                aria-label={question.question}
                aria-invalid={errors.main ? true : undefined}
                aria-describedby={errors.main ? id("main-error") : undefined}
                className={cn(
                  diagnosisInputClassName,
                  "min-h-28 resize-y py-3 leading-relaxed disabled:bg-secondary/50 disabled:opacity-60",
                )}
              />
              {errorText("main")}
              {question.unknownLabel && unknownToggle(question.unknownLabel)}
            </>
          )}

          {question.kind === "quantity" && (
            <>
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3">
                <input
                  id={id("main")}
                  type="text"
                  inputMode="decimal"
                  value={answer.quantity ?? ""}
                  disabled={answer.unknown}
                  onChange={(event) => updateAnswer({ quantity: event.target.value })}
                  placeholder={question.quantityPlaceholder}
                  aria-label={question.question}
                  aria-invalid={errors.main ? true : undefined}
                  aria-describedby={errors.main ? id("main-error") : undefined}
                  className={cn(
                    diagnosisInputClassName,
                    "h-12 disabled:bg-secondary/50 disabled:opacity-60",
                  )}
                />
                <select
                  value={answer.unit ?? 0}
                  disabled={answer.unknown}
                  onChange={(event) =>
                    updateAnswer({ unit: Number(event.target.value) })
                  }
                  aria-label={question.unitLabel}
                  className={cn(
                    diagnosisInputClassName,
                    "h-12 cursor-pointer disabled:bg-secondary/50 disabled:opacity-60",
                  )}
                >
                  {question.units.map((unit, index) => (
                    <option key={unit} value={index}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              {errorText("main")}
              {unknownToggle(question.unknownLabel)}
            </>
          )}

          {question.kind === "contact" && (
            <div className="grid gap-3.5 sm:grid-cols-2">
              {contactFields.map((field) => (
                <div
                  key={field}
                  className={cn(field === "email" && "sm:col-span-2")}
                >
                  <label
                    htmlFor={id(field)}
                    className="mb-1.5 block text-sm text-muted-foreground"
                  >
                    {question.fields[field].label}
                    {field === "email" && ` (${intake.optionalLabel.toLowerCase()})`}
                  </label>
                  <input
                    id={id(field)}
                    name={field}
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    autoComplete={contactAutoComplete[field]}
                    value={contact[field]}
                    onChange={(event) => {
                      setContact((current) => ({
                        ...current,
                        [field]: event.target.value,
                      }));
                      setErrors((current) => ({ ...current, [field]: undefined }));
                    }}
                    placeholder={question.fields[field].placeholder}
                    aria-invalid={errors[field] ? true : undefined}
                    aria-describedby={errors[field] ? id(`${field}-error`) : undefined}
                    className={cn(diagnosisInputClassName, "h-12")}
                  />
                  {errorText(field)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* No desktop fica no rodapé do card, na mesma posição em todas as perguntas. */}
        <div className="pt-6 lg:mt-auto">
          <Button
            type="submit"
            size="lg"
            className={cn(
              "h-auto min-h-12 w-full whitespace-normal rounded-full px-8 py-3 text-[15px] font-semibold",
              isLast
                ? "reward-shine bg-accent text-accent-foreground hover:bg-accent/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {isLast ? intake.submitLabel : intake.continueLabel}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </form>
    </div>
  );
}
