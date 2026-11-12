"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CONTACT_EMAIL,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
  openWhatsAppMessage,
} from "@/lib/contact";
import { copy, type Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type LeadFormContent = (typeof copy)[Language]["leadForm"];

type LeadFormSectionProps = {
  content: LeadFormContent;
};

type TextFieldName =
  | "company"
  | "name"
  | "phone"
  | "email"
  | "importStatus"
  | "operationType"
  | "segmentOther"
  | "frequentPurchases"
  | "competitiveProduct";

type FieldName = TextFieldName | "segments";

type FormValues = Record<TextFieldName, string> & {
  segments: string[];
  segmentOtherSelected: boolean;
};
type FormErrors = Partial<Record<FieldName, string>>;

const fieldOrder: FieldName[] = [
  "company",
  "name",
  "phone",
  "email",
  "importStatus",
  "operationType",
  "segments",
  "segmentOther",
  "frequentPurchases",
  "competitiveProduct",
];

const emptyValues: FormValues = {
  company: "",
  name: "",
  phone: "",
  email: "",
  importStatus: "",
  operationType: "",
  segments: [],
  segmentOtherSelected: false,
  segmentOther: "",
  frequentPurchases: "",
  competitiveProduct: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues, content: LeadFormContent): FormErrors {
  const errors: FormErrors = {};

  for (const field of [
    "company",
    "frequentPurchases",
    "competitiveProduct",
  ] as const) {
    if (!values[field].trim()) {
      errors[field] = content.requiredError;
    }
  }

  const phoneDigits = values.phone.replace(/\D/g, "");
  if (!values.phone.trim()) {
    errors.phone = content.requiredError;
  } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.phone = content.phoneError;
  }

  if (values.email.trim() && !emailPattern.test(values.email.trim())) {
    errors.email = content.emailError;
  }

  for (const field of ["importStatus", "operationType"] as const) {
    if (!values[field]) {
      errors[field] = content.selectError;
    }
  }

  if (!values.segments.length && !values.segmentOtherSelected) {
    errors.segments = content.segmentsError;
  } else if (values.segmentOtherSelected && !values.segmentOther.trim()) {
    errors.segmentOther = content.requiredError;
  }

  return errors;
}

function buildMessage(values: FormValues, content: LeadFormContent) {
  const { fields, importStatus, operationType, segments, questions } = content;
  const contactLines = [`*${fields.company.label}:* ${values.company.trim()}`];

  if (values.name.trim()) {
    contactLines.push(`*${fields.name.label}:* ${values.name.trim()}`);
  }

  contactLines.push(`*${fields.phone.label}:* ${values.phone.trim()}`);

  if (values.email.trim()) {
    contactLines.push(`*${fields.email.label}:* ${values.email.trim()}`);
  }

  // Mantém a ordem exibida no formulário, não a ordem de clique.
  const selectedSegments = segments.options
    .filter((option) => values.segments.includes(option))
    .map((option) => `• ${option}`);

  if (values.segmentOtherSelected) {
    selectedSegments.push(
      `• ${segments.otherMessageLabel}: ${values.segmentOther.trim()}`,
    );
  }

  const answers = [
    [importStatus.label, values.importStatus],
    [operationType.label, values.operationType],
    [segments.label, selectedSegments.join("\n")],
    [questions.frequentPurchases.label, values.frequentPurchases.trim()],
    [questions.competitiveProduct.label, values.competitiveProduct.trim()],
  ].map(([question, answer], index) => `*${index + 1}. ${question}*\n${answer}`);

  return [content.messageIntro, contactLines.join("\n"), ...answers].join("\n\n");
}

const controlClassName =
  "w-full rounded-xl border border-border bg-secondary/50 px-4 text-base text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 hover:border-accent/40 focus:border-accent focus:bg-background focus:ring-4 focus:ring-accent/15 aria-invalid:border-destructive aria-invalid:bg-destructive/5 aria-invalid:focus:ring-destructive/15 sm:text-sm";

const choiceClassName =
  "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm leading-snug text-foreground transition-[border-color,background-color,box-shadow] duration-200 hover:border-accent/40 has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/15";

const choiceErrorClassName = "border-destructive bg-destructive/5";

function QuestionNumber({ children }: { children: ReactNode }) {
  return <span className="mr-1.5 font-mono text-accent">{children}.</span>;
}

export function LeadFormSection({ content }: LeadFormSectionProps) {
  const baseId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [submitted, setSubmitted] = useState(false);

  const errors = submitted ? validate(values, content) : {};
  const fieldId = (field: FieldName) => `${baseId}-${field}`;
  const errorId = (field: FieldName) => `${baseId}-${field}-error`;

  const update = (field: TextFieldName, value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  const toggleSegment = (option: string, checked: boolean) =>
    setValues((current) => ({
      ...current,
      segments: checked
        ? [...current.segments, option]
        : current.segments.filter((item) => item !== option),
    }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    const currentErrors = validate(values, content);
    const firstInvalid = fieldOrder.find((field) => currentErrors[field]);

    if (firstInvalid) {
      const target =
        formRef.current?.querySelector<HTMLElement>(
          `#${CSS.escape(fieldId(firstInvalid))}`,
        ) ??
        formRef.current?.querySelector<HTMLElement>(
          `[name="${firstInvalid}"]`,
        );
      target?.focus();
      return;
    }

    openWhatsAppMessage(buildMessage(values, content));
  };

  const errorText = (field: FieldName) =>
    errors[field] ? (
      <p id={errorId(field)} className="mt-2 text-xs text-destructive">
        {errors[field]}
      </p>
    ) : null;

  const describedBy = (field: FieldName) =>
    errors[field] ? errorId(field) : undefined;

  const textField = (
    field: "company" | "name" | "phone" | "email",
    options: { type?: string; autoComplete: string; optional?: boolean },
  ) => (
    <div>
      <label
        htmlFor={fieldId(field)}
        className="mb-2 block text-sm font-medium text-foreground"
      >
        {content.fields[field].label}
        {options.optional && (
          <span className="ml-1.5 font-normal text-muted-foreground">
            ({content.optionalLabel})
          </span>
        )}
      </label>
      <input
        id={fieldId(field)}
        name={field}
        type={options.type ?? "text"}
        autoComplete={options.autoComplete}
        inputMode={field === "phone" ? "tel" : undefined}
        value={values[field]}
        onChange={(event) => update(field, event.target.value)}
        placeholder={content.fields[field].placeholder}
        aria-invalid={errors[field] ? true : undefined}
        aria-describedby={describedBy(field)}
        className={cn(controlClassName, "h-12")}
      />
      {errorText(field)}
    </div>
  );

  const radioField = (
    field: "importStatus" | "operationType",
    number: number,
    columns: string,
  ) => (
    <fieldset
      aria-invalid={errors[field] ? true : undefined}
      aria-describedby={describedBy(field)}
    >
      <legend className="mb-3 text-sm font-medium leading-snug text-foreground">
        <QuestionNumber>{number}</QuestionNumber>
        {content[field].label}
      </legend>
      <div className={cn("grid gap-2.5", columns)}>
        {content[field].options.map((option, index) => (
          <label
            key={option}
            className={cn(choiceClassName, errors[field] && choiceErrorClassName)}
          >
            <input
              id={index === 0 ? fieldId(field) : undefined}
              type="radio"
              name={field}
              value={option}
              checked={values[field] === option}
              onChange={() => update(field, option)}
              className="size-4 shrink-0 accent-[var(--primary)]"
            />
            {option}
          </label>
        ))}
      </div>
      {errorText(field)}
    </fieldset>
  );

  const questionField = (
    field: "frequentPurchases" | "competitiveProduct",
    number: number,
  ) => (
    <div>
      <label
        htmlFor={fieldId(field)}
        className="mb-2 block text-sm font-medium leading-snug text-foreground"
      >
        <QuestionNumber>{number}</QuestionNumber>
        {content.questions[field].label}
      </label>
      <textarea
        id={fieldId(field)}
        name={field}
        rows={2}
        value={values[field]}
        onChange={(event) => update(field, event.target.value)}
        placeholder={content.questions[field].placeholder}
        aria-invalid={errors[field] ? true : undefined}
        aria-describedby={describedBy(field)}
        className={cn(controlClassName, "min-h-24 resize-y py-3 leading-relaxed")}
      />
      {errorText(field)}
    </div>
  );

  const segmentHintId = `${baseId}-segments-hint`;

  return (
    <section id="formulario" className="scroll-mt-24 bg-secondary/35 py-16 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="motion-reveal lg:sticky lg:top-36 lg:self-start">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {content.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance text-foreground md:text-5xl">
            {content.title}
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            {content.description}
          </p>
        </div>

        <form
          ref={formRef}
          noValidate
          onSubmit={handleSubmit}
          className="rounded-3xl border border-border bg-card p-6 shadow-[0_24px_56px_-40px_hsl(from_var(--primary)_h_s_l/0.45)] sm:p-10"
        >
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">
            {content.formTitle}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {content.formDescription}
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {textField("company", { autoComplete: "organization" })}
            {textField("name", { autoComplete: "name", optional: true })}
            {textField("phone", { type: "tel", autoComplete: "tel" })}
            {textField("email", {
              type: "email",
              autoComplete: "email",
              optional: true,
            })}
          </div>

          <div className="my-8 h-px bg-border" aria-hidden />

          <div className="grid gap-7">
            {radioField("importStatus", 1, "sm:grid-cols-2")}
            {radioField("operationType", 2, "")}

            <fieldset
              aria-invalid={errors.segments ? true : undefined}
              aria-describedby={[
                segmentHintId,
                errors.segments && errorId("segments"),
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <legend className="text-sm font-medium leading-snug text-foreground">
                <QuestionNumber>3</QuestionNumber>
                {content.segments.label}
              </legend>
              <p
                id={segmentHintId}
                className="mt-1.5 mb-3 text-xs leading-relaxed text-muted-foreground"
              >
                {content.segments.hint}
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {content.segments.options.map((option, index) => (
                  <label
                    key={option}
                    className={cn(
                      choiceClassName,
                      errors.segments && choiceErrorClassName,
                    )}
                  >
                    <input
                      id={index === 0 ? fieldId("segments") : undefined}
                      type="checkbox"
                      name="segments"
                      value={option}
                      checked={values.segments.includes(option)}
                      onChange={(event) =>
                        toggleSegment(option, event.target.checked)
                      }
                      className="size-4 shrink-0 accent-[var(--primary)]"
                    />
                    {option}
                  </label>
                ))}
                <label
                  className={cn(
                    choiceClassName,
                    errors.segments && choiceErrorClassName,
                  )}
                >
                  <input
                    type="checkbox"
                    name="segments"
                    value="other"
                    checked={values.segmentOtherSelected}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      setValues((current) => ({
                        ...current,
                        segmentOtherSelected: checked,
                      }));
                      if (checked) {
                        requestAnimationFrame(() =>
                          document.getElementById(fieldId("segmentOther"))?.focus(),
                        );
                      }
                    }}
                    className="size-4 shrink-0 accent-[var(--primary)]"
                  />
                  {content.segments.otherLabel}
                </label>
              </div>
              {errorText("segments")}

              {values.segmentOtherSelected && (
                <div className="mt-3">
                  <label htmlFor={fieldId("segmentOther")} className="sr-only">
                    {content.segments.otherLabel}
                  </label>
                  <input
                    id={fieldId("segmentOther")}
                    name="segmentOther"
                    type="text"
                    value={values.segmentOther}
                    onChange={(event) =>
                      update("segmentOther", event.target.value)
                    }
                    placeholder={content.segments.otherPlaceholder}
                    aria-invalid={errors.segmentOther ? true : undefined}
                    aria-describedby={describedBy("segmentOther")}
                    className={cn(controlClassName, "h-12")}
                  />
                  {errorText("segmentOther")}
                </div>
              )}
            </fieldset>

            {questionField("frequentPurchases", 4)}
            {questionField("competitiveProduct", 5)}
          </div>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              {content.privacyNote}
            </p>
            <Button
              type="submit"
              size="lg"
              className="h-auto min-h-12 w-full shrink-0 whitespace-normal rounded-full bg-accent px-8 py-3 text-center text-accent-foreground hover:bg-accent/90 sm:w-auto"
            >
              {content.submitLabel}
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="mt-8 grid gap-3 border-t border-border pt-8">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="motion-card flex items-center gap-4 rounded-2xl border border-border bg-secondary/40 p-4 hover:border-accent/35"
            >
              <span className="motion-icon flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
                <MessageCircle className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {content.whatsappLabel}
                </span>
                <span className="mt-0.5 block font-medium text-foreground">
                  {WHATSAPP_DISPLAY}
                </span>
              </span>
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="motion-card flex items-center gap-4 rounded-2xl border border-border bg-secondary/40 p-4 hover:border-accent/35"
            >
              <span className="motion-icon flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
                <Mail className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {content.emailLabel}
                </span>
                <span className="mt-0.5 block truncate font-medium text-foreground">
                  {CONTACT_EMAIL}
                </span>
              </span>
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}
