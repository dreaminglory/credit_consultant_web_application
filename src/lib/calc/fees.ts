import { tariffs } from "@/config/tariffs";
import { roundCents } from "./annuity";

/**
 * Fees on a property purchase and a mortgage (FR-18…20, A-14). Tariffs come from
 * `src/config/tariffs.ts` with their sources; nothing is estimated here. Inputs and results are
 * in EUR, rounded to the cent.
 */

/** лв. → € at the fixed rate, rounded to the cent like every converted tariff amount. */
export function toEur(bgn: number): number {
  return roundCents(bgn / tariffs.eurRate);
}

const notaryBrackets = tariffs.notary.brackets.map((b) => ({
  over: toEur(b.overBgn),
  base: toEur(b.baseBgn),
  pct: b.pct,
}));
const notaryMax = toEur(tariffs.notary.maxBgn);

/** Notary fee without VAT for a deed with this material interest (т. 8); 0 when there is none. */
export function notaryFee(materialInterest: number): number {
  if (materialInterest <= 0) return 0;
  let bracket = notaryBrackets[0]!;
  for (const b of notaryBrackets) if (materialInterest > b.over) bracket = b;
  const fee = bracket.base + ((materialInterest - bracket.over) * bracket.pct) / 100;
  return roundCents(Math.min(fee, notaryMax));
}

/** Registry Agency fee for entering a deed or a mortgage (чл. 2, ал. 1); 0 when there is none. */
export function registryFee(base: number): number {
  if (base <= 0) return 0;
  return Math.max(roundCents((base * tariffs.registry.pct) / 100), tariffs.registry.minEur);
}

export type NotaryCost = {
  notaryFee: number;
  notaryVat: number;
  registryFee: number;
};

function deedCost(base: number): NotaryCost {
  const fee = notaryFee(base);
  return {
    notaryFee: fee,
    notaryVat: roundCents(fee * tariffs.notary.vatRate),
    registryFee: registryFee(base),
  };
}

const sum = (...values: number[]) => roundCents(values.reduce((a, b) => a + b, 0));

export type PurchaseFeesInput = {
  price: number;
  /** Данъчна оценка; 0 when unknown. Fees are charged on the higher of the two. */
  taxAssessment: number;
  /** Municipal transfer tax, %. */
  transferTaxPct: number;
};
export type PurchaseFeesResult = NotaryCost & {
  /** Material interest the fees are charged on. */
  base: number;
  transferTax: number;
  total: number;
};

/** FR-18 Такси при покупка на имот: notary + VAT, registry fee and municipal transfer tax. */
export function purchaseFees(input: PurchaseFeesInput): PurchaseFeesResult {
  const base = Math.max(input.price, input.taxAssessment, 0);
  const deed = deedCost(base);
  const transferTax = roundCents((base * input.transferTaxPct) / 100);
  return {
    ...deed,
    base,
    transferTax,
    total: sum(deed.notaryFee, deed.notaryVat, deed.registryFee, transferTax),
  };
}

export type MortgageFeesInput = { loanAmount: number };
export type MortgageFeesResult = NotaryCost & { total: number };

/**
 * FR-19 Нотариални такси при ипотека: the mortgage deed is charged on the secured amount
 * (ЗННД чл. 97, ал. 1, т. 7), and its entry in the property register likewise.
 */
export function mortgageFees({ loanAmount }: MortgageFeesInput): MortgageFeesResult {
  const deed = deedCost(Math.max(loanAmount, 0));
  return { ...deed, total: sum(deed.notaryFee, deed.notaryVat, deed.registryFee) };
}

export type PropertyCostInput = PurchaseFeesInput & {
  downPayment: number;
  /** BNB LTV-O limit as a share, e.g. 0.85 (site.limits.bnb.ltvMax). */
  ltvMax: number;
};
export type PropertyCostResult = {
  downPayment: number;
  loanAmount: number;
  purchaseFees: number;
  mortgageFees: number;
  /** Down payment plus all fees: the cash needed before the loan is paid out. */
  cashNeeded: number;
  /** Loan as a share of the price, %. */
  ltvPct: number;
  /** True when the loan is above the BNB LTV limit for the price. */
  exceedsLtv: boolean;
};

/** FR-20 Колко ще ми струва имотът: own funds needed for a purchase with a mortgage. */
export function propertyCost(input: PropertyCostInput): PropertyCostResult {
  const price = Math.max(input.price, 0);
  const downPayment = Math.min(Math.max(input.downPayment, 0), price);
  const loanAmount = roundCents(price - downPayment);
  const purchase = purchaseFees(input).total;
  const mortgage = mortgageFees({ loanAmount }).total;
  return {
    downPayment,
    loanAmount,
    purchaseFees: purchase,
    mortgageFees: mortgage,
    cashNeeded: sum(downPayment, purchase, mortgage),
    ltvPct: price > 0 ? (loanAmount / price) * 100 : 0,
    exceedsLtv: loanAmount > roundCents(price * input.ltvMax),
  };
}
