/** Parsing and formatting of calculator values for Bulgarian visitors. */

/** Accepts "120 000", "120000,50", "2,9" and "2.9"; returns null for anything else. */
export function parseNumber(text: string): number | null {
  const cleaned = text.replace(/[\s  €%]/g, "").replace(",", ".");
  if (!/^\d+(\.\d*)?$|^\.\d+$/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const eurCents = new Intl.NumberFormat("bg-BG", { style: "currency", currency: "EUR" });
const eurWhole = new Intl.NumberFormat("bg-BG", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const percent = new Intl.NumberFormat("bg-BG", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const plain = new Intl.NumberFormat("bg-BG", { maximumFractionDigits: 2 });

/** EUR with cents (payments) or in whole euros (loan sizes). */
export function formatEur(value: number, cents = true): string {
  return (cents ? eurCents : eurWhole).format(value);
}

/** "2,90 %". */
export function formatPercent(valuePct: number): string {
  return `${percent.format(valuePct)} %`;
}

/** A number as it is written back into a field: "120 000", "2,9". */
export function formatInput(value: number): string {
  return plain.format(value);
}
