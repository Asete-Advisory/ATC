"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CONTACT_EMAIL,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
  openWhatsAppMessage,
} from "@/lib/contact";
import { copy, type Language } from "@/lib/i18n";
import {
  formatPhoneInput,
  inputLimits,
  isValidEmail,
  isValidPhone,
  sanitizeEmail,
  sanitizePersonName,
  todayInputValue,
} from "@/lib/input-masks";
import { formatDateValue } from "@/lib/import-intake";
import { buildLeadMessage, type LeadMessageLine } from "@/lib/lead-message";
import { captureLeadSource } from "@/lib/lead-source";
import { newLeadId, sendLead } from "@/lib/site-analytics";
import { cn } from "@/lib/utils";

type LeadFormContent = (typeof copy)[Language]["leadForm"];
type LeadMessageCopy = (typeof copy)[Language]["leadMessage"];

type LeadFormSectionProps = {
  content: LeadFormContent;
  messageCopy: LeadMessageCopy;
};

type TextFieldName =
  | "company"
  | "name"
  | "phone"
  | "email"
  | "importStatus"
  | "operationType"
  | "radar"
  | "radarLimit"
  | "radarPlan"
  | "radarDate"
  | "segmentOther"
  | "frequentPurchases"
  | "competitiveProduct";

type FieldName = TextFieldName | "segments";

// Filtro/máscara aplicado enquanto a pessoa digita (os demais campos são livres).
const fieldMasks: Partial<Record<TextFieldName, (value: string) => string>> = {
  company: (value) => value.slice(0, inputLimits.company),
  name: sanitizePersonName,
  phone: formatPhoneInput,
  email: sanitizeEmail,
};

type FormValues = Record<TextFieldName, string> & {
  segments: string[];
  segmentOtherSelected: boolean;
};
type FormErrors = Partial<Record<FieldName, string>>;
type RadioFieldName =
  | "importStatus"
  | "operationType"
  | "radar"
  | "radarLimit"
  | "radarPlan";

const fieldOrder: FieldName[] = [
  "company",
  "name",
  "phone",
  "email",
  "importStatus",
  "operationType",
  "radar",
  "radarLimit",
  "radarPlan",
  "radarDate",
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
  radar: "",
  radarLimit: "",
  radarPlan: "",
  radarDate: "",
  segments: [],
  segmentOtherSelected: false,
  segmentOther: "",
  frequentPurchases: "",
  competitiveProduct: "",
};

// RADAR: "Sim" (1ª opção) pergunta a modalidade; "Não" pergunta se há
// planejamento, e "Sim" no planejamento pede a data prevista.
function radarVisibility(values: FormValues, content: LeadFormContent) {
  const hasRadar = values.radar === content.radar.options[0];
  const noRadar = values.radar === content.radar.options[1];
  return {
    limit: hasRadar,
    plan: noRadar,
    date: noRadar && values.radarPlan === content.radarPlan.options[0],
  };
}

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

  if (!values.phone.trim()) {
    errors.phone = content.requiredError;
  } else if (!isValidPhone(values.phone)) {
    errors.phone = content.phoneError;
  }

  if (values.email.trim() && !isValidEmail(values.email)) {
    errors.email = content.emailError;
  }

  const radar = radarVisibility(values, content);
  for (const field of ["importStatus", "operationType", "radar"] as const) {
    if (!values[field]) {
      errors[field] = content.selectError;
    }
  }
  if (radar.limit && !values.radarLimit) errors.radarLimit = content.selectError;
  if (radar.plan && !values.radarPlan) errors.radarPlan = content.selectError;
  if (radar.date && !values.radarDate) errors.radarDate = content.dateError;

  if (!values.segments.length && !values.segmentOtherSelected) {
    errors.segments = content.segmentsError;
  } else if (values.segmentOtherSelected && !values.segmentOther.trim()) {
    errors.segmentOther = content.requiredError;
  }

  return errors;
}

function buildMessage(
  values: FormValues,
  content: LeadFormContent,
  messageCopy: LeadMessageCopy,
) {
  const labels = content.messageLabels;
  const radar = radarVisibility(values, content);

  // Mantém a ordem exibida no formulário, não a ordem de clique.
  const selectedSegments: string[] = content.segments.options.filter((option) =>
    values.segments.includes(option),
  );
  if (values.segmentOtherSelected && values.segmentOther.trim()) {
    selectedSegments.push(
      `${content.segments.otherMessageLabel}: ${values.segmentOther.trim()}`,
    );
  }

  const radarPlan =
    radar.date && values.radarDate
      ? `${values.radarPlan} (${content.radarPlan.dateMessageLabel}: ${formatDateValue(values.radarDate, messageCopy.locale)})`
      : values.radarPlan;

  const lines: LeadMessageLine[] = [
    { section: "interest", label: labels.operationType, value: values.operationType },
    { section: "interest", label: labels.importStatus, value: values.importStatus },
    { section: "interest", label: labels.radar, value: values.radar },
    { section: "interest", label: labels.radarLimit, value: radar.limit ? values.radarLimit : "" },
    { section: "interest", label: labels.radarPlan, value: radar.plan ? radarPlan : "" },
    { section: "operation", label: labels.segments, value: selectedSegments.join("; ") },
    { section: "operation", label: labels.frequentPurchases, value: values.frequentPurchases.trim() },
    { section: "operation", label: labels.competitiveProduct, value: values.competitiveProduct.trim() },
    { section: "other", label: messageCopy.phone, value: values.phone.trim() },
    { section: "other", label: messageCopy.email, value: values.email.trim() },
  ];

  const message = buildLeadMessage({
    copy: messageCopy,
    origin: "form",
    source: captureLeadSource(),
    name: values.name,
    company: values.company,
    lines,
  });

  return { message, lines };
}

const controlClassName =
  "w-full rounded-xl border border-border bg-secondary/50 px-4 text-base text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 hover:border-accent/40 focus:border-accent focus:bg-background focus:ring-4 focus:ring-accent/15 aria-invalid:border-destructive aria-invalid:bg-destructive/5 aria-invalid:focus:ring-destructive/15 sm:text-sm";

const choiceClassName =
  "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm leading-snug text-foreground transition-[border-color,background-color,box-shadow] duration-200 hover:border-accent/40 has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/15";

const choiceErrorClassName = "border-destructive bg-destructive/5";

function QuestionNumber({ children }: { children: ReactNode }) {
  return <span className="mr-1.5 font-mono text-accent">{children}.</span>;
}

export function LeadFormSection({ content, messageCopy }: LeadFormSectionProps) {
  const baseId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [submitted, setSubmitted] = useState(false);

  const errors = submitted ? validate(values, content) : {};
  const radar = radarVisibility(values, content);

  // Guarda o anúncio/campanha da URL de entrada para a mensagem final.
  useEffect(() => {
    captureLeadSource();
  }, []);
  const fieldId = (field: FieldName) => `${baseId}-${field}`;
  const errorId = (field: FieldName) => `${baseId}-${field}-error`;

  const update = (field: TextFieldName, value: string) =>
    setValues((current) => ({
      ...current,
      [field]: fieldMasks[field]?.(value) ?? value,
    }));

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

    const { message, lines } = buildMessage(values, content, messageCopy);
    openWhatsAppMessage(message);
    sendLead({
      id: newLeadId(),
      origin: "form",
      name: values.name,
      company: values.company,
      email: values.email,
      phone: values.phone,
      locale: messageCopy.locale,
      // Telefone e e-mail já vão em campos próprios.
      answers: lines.filter(
        (line) => line.label !== messageCopy.phone && line.label !== messageCopy.email,
      ),
      message,
      whatsapp: true,
    });
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
        inputMode={
          field === "phone" ? "tel" : field === "email" ? "email" : undefined
        }
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
    field: RadioFieldName,
    number: number | null,
    columns: string,
  ) => {
    const question = content[field];
    const hint = "hint" in question ? question.hint : undefined;
    const hintId = `${fieldId(field)}-hint`;

    return (
    <fieldset
      aria-invalid={errors[field] ? true : undefined}
      aria-describedby={
        [hint && hintId, describedBy(field)].filter(Boolean).join(" ") ||
        undefined
      }
    >
      <legend className="text-sm font-medium leading-snug text-foreground">
        {number !== null && <QuestionNumber>{number}</QuestionNumber>}
        {question.label}
      </legend>
      {hint ? (
        <p
          id={hintId}
          className="mt-1.5 mb-3 text-xs leading-relaxed text-muted-foreground"
        >
          {hint}
        </p>
      ) : (
        <div className="mb-3" aria-hidden />
      )}
      <div className={cn("grid gap-2.5", columns)}>
        {question.options.map((option, index) => (
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
              onChange={() => {
                update(field, option);
                if (field === "radarPlan" && index === 0) {
                  requestAnimationFrame(() =>
                    document.getElementById(fieldId("radarDate"))?.focus(),
                  );
                }
              }}
              className="size-4 shrink-0 accent-[var(--primary)]"
            />
            {option}
          </label>
        ))}
      </div>
      {errorText(field)}
    </fieldset>
    );
  };

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
        maxLength={inputLimits.longText}
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

            {/* RADAR: a pergunta seguinte depende do "Sim"/"Não". */}
            <div>
              {radioField("radar", 3, "grid-cols-2")}
              {(radar.limit || radar.plan) && (
                <div className="mt-5 border-l-2 border-accent/40 pl-4 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-1 sm:pl-5">
                  {radar.limit && radioField("radarLimit", null, "sm:grid-cols-2")}
                  {radar.plan && radioField("radarPlan", null, "grid-cols-2")}
                  {radar.date && (
                    <div className="mt-4">
                      <label
                        htmlFor={fieldId("radarDate")}
                        className="mb-2 block text-sm font-medium text-foreground"
                      >
                        {content.radarPlan.dateLabel}
                      </label>
                      <input
                        id={fieldId("radarDate")}
                        name="radarDate"
                        type="date"
                        min={todayInputValue()}
                        value={values.radarDate}
                        onChange={(event) => update("radarDate", event.target.value)}
                        aria-invalid={errors.radarDate ? true : undefined}
                        aria-describedby={describedBy("radarDate")}
                        className={cn(
                          controlClassName,
                          "block h-12 min-w-0 appearance-none text-left tabular-nums sm:max-w-60 [&::-webkit-date-and-time-value]:text-left",
                        )}
                      />
                      {errorText("radarDate")}
                    </div>
                  )}
                </div>
              )}
            </div>

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
                <QuestionNumber>4</QuestionNumber>
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
                    maxLength={inputLimits.shortText}
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

            {questionField("frequentPurchases", 5)}
            {questionField("competitiveProduct", 6)}
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
