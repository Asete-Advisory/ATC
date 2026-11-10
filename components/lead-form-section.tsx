"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CONTACT_EMAIL,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
  buildWhatsAppUrl,
} from "@/lib/contact";
import { copy, type Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type LeadFormContent = (typeof copy)[Language]["leadForm"];

type LeadFormSectionProps = {
  content: LeadFormContent;
};

type FieldName =
  | "name"
  | "company"
  | "phone"
  | "email"
  | "importStatus"
  | "topSellers"
  | "frequentPurchases"
  | "competitiveProduct";

type FormValues = Record<FieldName, string>;
type FormErrors = Partial<Record<FieldName, string>>;

const fieldOrder: FieldName[] = [
  "name",
  "company",
  "phone",
  "email",
  "importStatus",
  "topSellers",
  "frequentPurchases",
  "competitiveProduct",
];

const emptyValues: FormValues = {
  name: "",
  company: "",
  phone: "",
  email: "",
  importStatus: "",
  topSellers: "",
  frequentPurchases: "",
  competitiveProduct: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues, content: LeadFormContent): FormErrors {
  const errors: FormErrors = {};

  for (const field of [
    "name",
    "company",
    "topSellers",
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

  if (!values.importStatus) {
    errors.importStatus = content.selectError;
  }

  return errors;
}

function buildMessage(values: FormValues, content: LeadFormContent) {
  const { fields, importStatus, questions } = content;
  const contactLines = [
    `*${fields.name.label}:* ${values.name.trim()}`,
    `*${fields.company.label}:* ${values.company.trim()}`,
    `*${fields.phone.label}:* ${values.phone.trim()}`,
  ];

  if (values.email.trim()) {
    contactLines.push(`*${fields.email.label}:* ${values.email.trim()}`);
  }

  const answers = [
    [importStatus.label, values.importStatus],
    [questions.topSellers.label, values.topSellers],
    [questions.frequentPurchases.label, values.frequentPurchases],
    [questions.competitiveProduct.label, values.competitiveProduct],
  ].map(([question, answer], index) => `*${index + 1}. ${question}*\n${answer.trim()}`);

  return [content.messageIntro, contactLines.join("\n"), ...answers].join("\n\n");
}

const controlClassName =
  "w-full rounded-xl border border-border bg-secondary/50 px-4 text-base text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 hover:border-accent/40 focus:border-accent focus:bg-background focus:ring-4 focus:ring-accent/15 aria-invalid:border-destructive aria-invalid:bg-destructive/5 aria-invalid:focus:ring-destructive/15 sm:text-sm";

export function LeadFormSection({ content }: LeadFormSectionProps) {
  const baseId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [submitted, setSubmitted] = useState(false);

  const errors = submitted ? validate(values, content) : {};
  const fieldId = (field: FieldName) => `${baseId}-${field}`;
  const errorId = (field: FieldName) => `${baseId}-${field}-error`;

  const update = (field: FieldName, value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

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

    const url = buildWhatsAppUrl(buildMessage(values, content));
    const popup = window.open(url, "_blank");

    if (popup) {
      popup.opener = null;
    } else {
      window.location.href = url;
    }
  };

  const errorText = (field: FieldName) =>
    errors[field] ? (
      <p id={errorId(field)} className="mt-2 text-xs text-destructive">
        {errors[field]}
      </p>
    ) : null;

  const textField = (
    field: "name" | "company" | "phone" | "email",
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
        aria-describedby={errors[field] ? errorId(field) : undefined}
        className={cn(controlClassName, "h-12")}
      />
      {errorText(field)}
    </div>
  );

  const questionField = (
    field: "topSellers" | "frequentPurchases" | "competitiveProduct",
    number: number,
  ) => (
    <div>
      <label
        htmlFor={fieldId(field)}
        className="mb-2 block text-sm font-medium leading-snug text-foreground"
      >
        <span className="mr-1.5 font-mono text-accent">{number}.</span>
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
        aria-describedby={errors[field] ? errorId(field) : undefined}
        className={cn(controlClassName, "min-h-24 resize-y py-3 leading-relaxed")}
      />
      {errorText(field)}
    </div>
  );

  return (
    <section id="formulario" className="scroll-mt-24 bg-secondary/35 py-16 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="contents lg:sticky lg:top-36 lg:block lg:self-start">
          <div className="motion-reveal order-1">
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

          <div className="motion-reveal order-3 grid gap-3 [animation-delay:120ms] lg:mt-10">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="motion-card flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-accent/35"
            >
              <span className="motion-icon flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
                <MessageCircle className="size-5" />
              </span>
              <span>
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
              className="motion-card flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-accent/35"
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
        </div>

        <form
          ref={formRef}
          noValidate
          onSubmit={handleSubmit}
          className="order-2 rounded-3xl border border-border bg-card p-6 shadow-[0_24px_56px_-40px_hsl(from_var(--primary)_h_s_l/0.45)] sm:p-10"
        >
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">
            {content.formTitle}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {content.formDescription}
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {textField("name", { autoComplete: "name" })}
            {textField("company", { autoComplete: "organization" })}
            {textField("phone", { type: "tel", autoComplete: "tel" })}
            {textField("email", {
              type: "email",
              autoComplete: "email",
              optional: true,
            })}
          </div>

          <div className="my-8 h-px bg-border" aria-hidden />

          <div className="grid gap-6">
            <fieldset
              aria-invalid={errors.importStatus ? true : undefined}
              aria-describedby={
                errors.importStatus ? errorId("importStatus") : undefined
              }
            >
              <legend className="mb-3 text-sm font-medium leading-snug text-foreground">
                <span className="mr-1.5 font-mono text-accent">1.</span>
                {content.importStatus.label}
              </legend>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {content.importStatus.options.map((option, index) => (
                  <label
                    key={option}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground transition-[border-color,background-color,box-shadow] duration-200 hover:border-accent/40",
                      "has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/15",
                      errors.importStatus && "border-destructive bg-destructive/5",
                    )}
                  >
                    <input
                      id={index === 0 ? fieldId("importStatus") : undefined}
                      type="radio"
                      name="importStatus"
                      value={option}
                      checked={values.importStatus === option}
                      onChange={() => update("importStatus", option)}
                      className="size-4 shrink-0 accent-[var(--primary)]"
                    />
                    {option}
                  </label>
                ))}
              </div>
              {errorText("importStatus")}
            </fieldset>

            {questionField("topSellers", 2)}
            {questionField("frequentPurchases", 3)}
            {questionField("competitiveProduct", 4)}
          </div>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              {content.privacyNote}
            </p>
            <Button
              type="submit"
              size="lg"
              className="h-12 w-full shrink-0 rounded-full bg-accent px-8 text-accent-foreground hover:bg-accent/90 sm:w-auto"
            >
              {content.submitLabel}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
