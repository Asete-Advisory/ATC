/**
 * Formulário "Tire suas dúvidas" que segue o resultado do diagnóstico em
 * /diagnostico. A copy fica em `copy[lang].diagnosis.intake.questions`.
 */

import { isValidEmail, isValidPhone } from "@/lib/input-masks";

type BaseQuestion = { question: string; hint?: string };

export type IntakeQuestion =
  | (BaseQuestion & {
      kind: "single";
      options: readonly string[];
      /** A última opção é "Outro(a)" e pede um texto. */
      other?: boolean;
      /** Campo de valor aproximado exibido para estas opções. */
      amountFor?: readonly number[];
      amountLabel?: string;
      amountPlaceholder?: string;
    })
  | (BaseQuestion & {
      kind: "multi";
      options: readonly string[];
      other?: boolean;
      max?: number;
    })
  | (BaseQuestion & {
      kind: "text";
      optional?: boolean;
      /** Atalho do tipo "Ainda não defini." no lugar do texto. */
      unknownLabel?: string;
    })
  | (BaseQuestion & {
      kind: "quantity";
      quantityPlaceholder: string;
      units: readonly string[];
      unitLabel: string;
      unknownLabel: string;
    })
  | (BaseQuestion & {
      kind: "contact";
      fields: Readonly<
        Record<ContactField, { readonly label: string; readonly placeholder: string }>
      >;
    });

export type ContactField = "name" | "company" | "city" | "phone" | "email";
export const contactFields: ContactField[] = [
  "name",
  "company",
  "city",
  "phone",
  "email",
];
export type ContactValues = Record<ContactField, string>;
export const emptyContact: ContactValues = {
  name: "",
  company: "",
  city: "",
  phone: "",
  email: "",
};

export type IntakeAnswer = {
  choice?: number;
  choices?: number[];
  text?: string;
  other?: string;
  unknown?: boolean;
  amount?: string;
  quantity?: string;
  unit?: number;
};

export type IntakeErrorMessages = {
  selectError: string;
  textError: string;
  otherError: string;
  phoneError: string;
  emailError: string;
  requiredError: string;
};

/** Erros por campo: "main" (a resposta), "other" (texto do "Outro") ou um campo de contato. */
export type IntakeErrors = Partial<Record<"main" | "other" | ContactField, string>>;


export function isOtherSelected(question: IntakeQuestion, answer: IntakeAnswer) {
  if (question.kind === "single" && question.other) {
    return answer.choice === question.options.length - 1;
  }
  if (question.kind === "multi" && question.other) {
    return answer.choices?.includes(question.options.length - 1) ?? false;
  }
  return false;
}

export function showsAmount(question: IntakeQuestion, answer: IntakeAnswer) {
  return (
    question.kind === "single" &&
    answer.choice !== undefined &&
    (question.amountFor?.includes(answer.choice) ?? false)
  );
}

export function validateIntakeStep(
  question: IntakeQuestion,
  answer: IntakeAnswer,
  contact: ContactValues,
  messages: IntakeErrorMessages,
): IntakeErrors {
  const errors: IntakeErrors = {};

  switch (question.kind) {
    case "single":
      if (answer.choice === undefined) errors.main = messages.selectError;
      break;
    case "multi":
      if (!answer.choices?.length) errors.main = messages.selectError;
      break;
    case "text":
      if (!question.optional && !answer.unknown && !answer.text?.trim()) {
        errors.main = question.unknownLabel
          ? messages.textError
          : messages.requiredError;
      }
      break;
    case "quantity":
      if (!answer.unknown && !answer.quantity?.trim()) {
        errors.main = messages.textError;
      }
      break;
    case "contact": {
      for (const field of ["name", "company", "city", "phone"] as const) {
        if (!contact[field].trim()) errors[field] = messages.requiredError;
      }
      if (!errors.phone && !isValidPhone(contact.phone)) {
        errors.phone = messages.phoneError;
      }
      const email = contact.email.trim();
      if (email && !isValidEmail(email)) errors.email = messages.emailError;
      break;
    }
  }

  if (isOtherSelected(question, answer) && !answer.other?.trim()) {
    errors.other = messages.otherError;
  }

  return errors;
}

/** Texto da resposta para a mensagem do WhatsApp; vazio quando opcional e não respondida. */
export function formatIntakeAnswer(question: IntakeQuestion, answer: IntakeAnswer) {
  const withOther = (index: number, options: readonly string[]) => {
    const label = options[index];
    const isOther =
      "other" in question && question.other && index === options.length - 1;
    return isOther && answer.other?.trim()
      ? `${label.replace(/\.$/, "")}: ${answer.other.trim()}`
      : label;
  };

  switch (question.kind) {
    case "single": {
      if (answer.choice === undefined) return "";
      const label = withOther(answer.choice, question.options);
      const amount = showsAmount(question, answer) ? answer.amount?.trim() : "";
      return amount ? `${label} (R$ ${amount})` : label;
    }
    case "multi":
      return [...(answer.choices ?? [])]
        .sort((a, b) => a - b)
        .map((index) => `• ${withOther(index, question.options)}`)
        .join("\n");
    case "text":
      if (answer.unknown && question.unknownLabel) return question.unknownLabel;
      return answer.text?.trim() ?? "";
    case "quantity":
      if (answer.unknown) return question.unknownLabel;
      if (!answer.quantity?.trim()) return "";
      return `${answer.quantity.trim()} ${question.units[answer.unit ?? 0].toLowerCase()}`;
    case "contact":
      return "";
  }
}
