import type { Ingredient } from "./recipe-rules";

const unitLabels = { g: "g", ml: "ml", l: "L", cup: "xíc." } as const;
const months = [
  "jan.",
  "fev.",
  "mar.",
  "abr.",
  "maio",
  "jun.",
  "jul.",
  "ago.",
  "set.",
  "out.",
  "nov.",
  "dez.",
];

export function formatNumber(value: number): string {
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

export function formatQuantity(ingredient: Ingredient): string {
  if ("toTaste" in ingredient) return "a gosto";
  const amount = formatNumber(ingredient.quantity);
  if (!ingredient.unit) return amount;
  return `${amount} ${unitLabels[ingredient.unit]}`;
}

export function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${months[month! - 1]} ${year}`;
}

export function sourceName(source: string): string {
  return new URL(source).hostname.replace(/^www\./, "");
}
