import { payment, principalFromPayment, roundCents } from "./annuity";
import { monthlyRate, rateFromPayment } from "./rate";

/**
 * One function per v1 calculator (FR-12…17). Inputs are in EUR, % and years, as the visitor
 * types them; money results are rounded to the cent. Limits (BNB DSTI, max term) are passed in
 * from config, never written here (FR-21).
 */

export const toMonths = (years: number) => Math.round(years * 12);

export type MonthlyPaymentInput = { amount: number; years: number; ratePct: number };
export type MonthlyPaymentResult = { payment: number; totalInterest: number; totalPaid: number };

/** FR-12 Месечна вноска. */
export function monthlyPayment({
  amount,
  years,
  ratePct,
}: MonthlyPaymentInput): MonthlyPaymentResult {
  const n = toMonths(years);
  const pay = payment(amount, ratePct, n);
  const totalPaid = roundCents(pay * n);
  return { payment: pay, totalInterest: roundCents(Math.max(totalPaid - amount, 0)), totalPaid };
}

export type RefinanceInput = {
  balance: number;
  years: number;
  currentRatePct: number;
  newRatePct: number;
  switchingCosts: number;
};
export type RefinanceResult = {
  currentPayment: number;
  newPayment: number;
  monthlySaving: number;
  /** Saving over the remaining term after the switching costs; negative means a loss. */
  netSaving: number;
  /** Month in which the saving has paid back the costs; null when it never does. */
  breakEvenMonth: number | null;
};

/** FR-13 Спестяване при рефинансиране: same balance and remaining term at the new rate. */
export function refinance(input: RefinanceInput): RefinanceResult {
  const n = toMonths(input.years);
  const currentPayment = payment(input.balance, input.currentRatePct, n);
  const newPayment = payment(input.balance, input.newRatePct, n);
  const monthlySaving = roundCents(currentPayment - newPayment);
  const netSaving = roundCents(monthlySaving * n - input.switchingCosts);
  let breakEvenMonth: number | null = null;
  if (monthlySaving > 0) {
    const month = Math.max(1, Math.ceil(roundCents(input.switchingCosts / monthlySaving)));
    if (month <= n) breakEvenMonth = month;
  }
  return { currentPayment, newPayment, monthlySaving, netSaving, breakEvenMonth };
}

export type MaxLoanByIncomeInput = {
  netIncome: number;
  otherPayments: number;
  years: number;
  ratePct: number;
  /** Max share of income for all debt payments, e.g. 0.5 (BNB DSTI-O). */
  dstiMax: number;
  /** Max term in years (BNB maturity limit). */
  maxYears: number;
};
export type MaxLoanByIncomeResult = { maxPayment: number; maxLoan: number; years: number };

/** FR-14 Колко мога да изтегля (по доход). */
export function maxLoanByIncome(input: MaxLoanByIncomeInput): MaxLoanByIncomeResult {
  const years = Math.min(input.years, input.maxYears);
  const maxPayment = Math.max(roundCents(input.netIncome * input.dstiMax - input.otherPayments), 0);
  return {
    maxPayment,
    maxLoan: principalFromPayment(maxPayment, input.ratePct, toMonths(years)),
    years,
  };
}

export type MaxLoanByPaymentInput = { payment: number; years: number; ratePct: number };

/** FR-15 Колко мога да изтегля според вноската. */
export function maxLoanByPayment({ payment: pay, years, ratePct }: MaxLoanByPaymentInput) {
  return { maxLoan: principalFromPayment(pay, ratePct, toMonths(years)) };
}

export type CurrentRateInput = { balance: number; payment: number; years: number };

/** FR-16 Каква лихва плащам в момента: nominal annual %, null when the payment is too low. */
export function currentRate({ balance, payment: pay, years }: CurrentRateInput) {
  return { ratePct: rateFromPayment(balance, pay, toMonths(years)) };
}

export type LoanCostInput = {
  amount: number;
  years: number;
  ratePct: number;
  /** One-off fee at drawdown, % of the amount. */
  upfrontFeePct: number;
  /** Account or servicing fee, EUR per month. */
  monthlyFee: number;
  /** Insurance, EUR per year, spread evenly over the months. */
  annualInsurance: number;
};
export type LoanCostResult = {
  payment: number;
  /** Payment plus monthly fee and insurance: what actually leaves the account each month. */
  monthlyOutflow: number;
  totalInterest: number;
  totalFees: number;
  totalInsurance: number;
  /** Everything paid over the term, the upfront fee included. */
  totalCost: number;
  /** Approximate ГПР in %, null when it cannot be computed. */
  aprPct: number | null;
};

/**
 * FR-17 Колко ще ми струва кредитът. ГПР follows Annex 1 of the Consumer Credit Act (EU CCD):
 * the rate X at which the net amount received equals the discounted outflows, with time in
 * years = months / 12, so X = (1 + monthly IRR)^12 − 1.
 */
export function loanCost(input: LoanCostInput): LoanCostResult {
  const n = toMonths(input.years);
  const base = monthlyPayment(input);
  const upfrontFee = roundCents((input.amount * input.upfrontFeePct) / 100);
  const monthlyInsurance = input.annualInsurance / 12;
  const exactOutflow = base.payment + input.monthlyFee + monthlyInsurance;
  const totalFees = roundCents(upfrontFee + input.monthlyFee * n);
  const totalInsurance = roundCents(monthlyInsurance * n);

  const irr = monthlyRate(input.amount - upfrontFee, exactOutflow, n);
  return {
    payment: base.payment,
    monthlyOutflow: roundCents(exactOutflow),
    totalInterest: base.totalInterest,
    totalFees,
    totalInsurance,
    totalCost: roundCents(base.totalPaid + totalFees + totalInsurance),
    aprPct: irr === null ? null : ((1 + irr) ** 12 - 1) * 100,
  };
}
