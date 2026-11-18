/**
 * Filtros e máscaras aplicados enquanto a pessoa digita nos formulários
 * (diagnóstico e formulário da home). Cada função recebe o texto bruto do
 * input e devolve o valor já limpo/formatado.
 */

export const inputLimits = {
  name: 80,
  company: 120,
  city: 80,
  email: 120,
  shortText: 120,
  longText: 1000,
} as const;

/** Nomes de pessoa: letras (com acento), espaço, apóstrofo, hífen e ponto. */
export function sanitizePersonName(value: string) {
  return value
    .replace(/[^\p{L}\p{M}\s'.-]/gu, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, inputLimits.name);
}

/** Cidade/UF: como nome, mais a barra de "Itajaí/SC". */
export function sanitizeCity(value: string) {
  return value
    .replace(/[^\p{L}\p{M}\s'./-]/gu, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, inputLimits.city);
}

export function sanitizeEmail(value: string) {
  return value.replace(/\s/g, "").slice(0, inputLimits.email);
}

/**
 * WhatsApp: só dígitos, com máscara brasileira — (47) 9999-0000 ou
 * (47) 99999-0000. Começando com "+", aceita número internacional (até 15 dígitos).
 */
export function formatPhoneInput(value: string) {
  const trimmed = value.trimStart();
  const digits = trimmed.replace(/\D/g, "");

  if (trimmed.startsWith("+")) {
    return `+${digits.slice(0, 15)}`;
  }

  const local = digits.slice(0, 11);
  if (!local) return "";
  if (local.length <= 2) return `(${local}`;

  const area = local.slice(0, 2);
  const rest = local.slice(2);
  if (rest.length <= 4) return `(${area}) ${rest}`;

  // Celular (9 dígitos) quebra em 5+4; fixo (8 dígitos) em 4+4.
  const split = rest.length === 9 ? 5 : 4;
  return `(${area}) ${rest.slice(0, split)}-${rest.slice(split)}`;
}

function decimalSeparator(locale: string) {
  return new Intl.NumberFormat(locale).format(1.5).replace(/\d/g, "") || ",";
}

/**
 * Número com separador de milhar e casas decimais opcionais, no formato do
 * idioma (pt-BR: 1.500,25 · en-US: 1,500.25). Ignora qualquer outro caractere.
 */
function formatDecimalInput(
  value: string,
  locale: string,
  maxIntegerDigits: number,
  maxFractionDigits: number,
) {
  const separator = decimalSeparator(locale);
  const separatorIndex = value.indexOf(separator);
  const hasDecimal = separatorIndex !== -1;

  const integerDigits = (hasDecimal ? value.slice(0, separatorIndex) : value)
    .replace(/\D/g, "")
    .replace(/^0+(?=\d)/, "")
    .slice(0, maxIntegerDigits);
  const fraction = hasDecimal
    ? value
        .slice(separatorIndex + 1)
        .replace(/\D/g, "")
        .slice(0, maxFractionDigits)
    : "";

  if (!integerDigits && !hasDecimal) return "";

  const integer = new Intl.NumberFormat(locale).format(
    Number(integerDigits || "0"),
  );
  return hasDecimal ? `${integer}${separator}${fraction}` : integer;
}

/** Valor em reais: milhar automático e até 2 casas de centavos (1.500,50). */
export function formatAmountInput(value: string, locale = "pt-BR") {
  return formatDecimalInput(value, locale, 13, 2);
}

/** Quantidade: milhar automático e até 3 casas decimais (2,5 toneladas). */
export function formatQuantityInput(value: string, locale = "pt-BR") {
  return formatDecimalInput(value, locale, 9, 3);
}

// usuario@dominio.tld — partes do domínio só com letras, números e hífen,
// terminação com pelo menos 2 letras. Recusa "asd@asd", "a@b.c", "a@@b.com".
const emailPattern =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/i;

export function isValidEmail(value: string) {
  const email = value.trim();
  return email.length <= inputLimits.email && emailPattern.test(email);
}

/**
 * WhatsApp: brasileiro com DDD (10 dígitos fixo, 11 celular começando em 9)
 * ou internacional começando com "+" (8 a 15 dígitos).
 */
export function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (value.trim().startsWith("+")) {
    return digits.length >= 8 && digits.length <= 15;
  }
  if (digits.length === 11) return digits[2] === "9";
  return digits.length === 10;
}
