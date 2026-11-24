/**
 * Mensagem que o cliente envia para a ATC pelo WhatsApp ao terminar um
 * formulário (diagnóstico ou formulário da home). Mesmo formato nos dois:
 *
 *   Olá, equipe ATC! Sou {nome}, da {empresa}, em {cidade}. {origem}
 *
 *   *Interesse e momento atual*
 *   • Rótulo: resposta
 *   *Meu perfil* — {perfil}
 *   *Produto e operação* / *Meu objetivo* / *Minha principal dúvida* /
 *   *Outros pontos que quero conversar*
 *
 * Só entram os campos respondidos; seções vazias são omitidas.
 */

import type { copy, Language } from "@/lib/i18n";
import type { LeadSource } from "@/lib/lead-source";

type LeadMessageCopy = (typeof copy)[Language]["leadMessage"];

export type LeadMessageSection =
  | "interest"
  | "profile"
  | "operation"
  | "goal"
  | "doubt"
  | "other";

export const leadMessageSections: LeadMessageSection[] = [
  "interest",
  "profile",
  "operation",
  "goal",
  "doubt",
  "other",
];

export type LeadMessageLine = {
  section: LeadMessageSection;
  label?: string;
  value: string;
};

type LeadMessageInput = {
  copy: LeadMessageCopy;
  /** "diagnosis" ou "form": muda a frase de origem. */
  origin: "diagnosis" | "form";
  source: LeadSource;
  name?: string;
  company: string;
  city?: string;
  lines: LeadMessageLine[];
};

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

export function buildLeadMessage({
  copy,
  origin,
  source,
  name,
  company,
  city,
  lines,
}: LeadMessageInput) {
  const values = {
    name: name?.trim() ?? "",
    company: company.trim(),
    city: city?.trim() ?? "",
  };
  const identity =
    fill(values.name ? copy.withName : copy.withoutName, values) +
    (values.city ? fill(copy.city, values) : "");
  const originTemplate = copy[origin][source.kind];
  const originText = fill(originTemplate, {
    source: source.kind === "site" ? "" : source.name,
  });
  // Pontuação final de cada idioma ("." ou "。").
  const stop = /[　-〿＀-￯]$/.test(originText) ? "。" : ".";
  const space = stop === "。" ? "" : " ";
  const opening = `${copy.greeting}${space}${identity}${stop}${space}${originText}`;

  const blocks = leadMessageSections.flatMap((section) => {
    const items = lines.filter((line) => line.section === section && line.value);
    if (!items.length) return [];

    const title = `*${copy.sections[section]}*`;
    // Item único sem rótulo (ex.: perfil) fica na mesma linha do título.
    if (items.length === 1 && !items[0].label) {
      return [`${title} — ${items[0].value}`];
    }
    return [
      [
        title,
        ...items.map((item) =>
          item.label ? `• ${item.label}: ${item.value}` : `• ${item.value}`,
        ),
      ].join("\n"),
    ];
  });

  return [opening, ...blocks].join("\n\n");
}
