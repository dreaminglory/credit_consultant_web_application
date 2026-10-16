import { site } from "@/config/site";
import { calculatorCopy, calculatorUi, type LiveCalculatorSlug } from "@/content/calculators";
import {
  currentRate,
  loanCost,
  maxLoanByIncome,
  maxLoanByPayment,
  monthlyPayment,
  refinance,
  type CurrentRateInput,
  type LoanCostInput,
  type MaxLoanByPaymentInput,
  type MonthlyPaymentInput,
  type RefinanceInput,
} from "@/lib/calc/calculators";
import { formatEur, formatPercent } from "@/lib/calc/input";

export type CalculatorValues = Record<string, number>;

export type CalculatorOutput = {
  headline: string;
  rows: { label: string; value: string }[];
  /** Shown instead of a misleading number, e.g. when refinancing saves nothing. */
  note?: string;
};

/**
 * Turns the visitor's values into the formatted result of one calculator. Maths is in
 * src/lib/calc; this only picks the function, the labels and the formatting. Payments show
 * cents, loan sizes and totals whole euros.
 */
export function calculatorOutput(
  slug: LiveCalculatorSlug,
  values: CalculatorValues,
): CalculatorOutput {
  const labels = calculatorCopy[slug].rows;
  const row = (key: string, value: string) => ({ label: labels[key]!, value });

  switch (slug) {
    case "mesechna-vnoska": {
      const r = monthlyPayment(values as MonthlyPaymentInput);
      return {
        headline: formatEur(r.payment),
        rows: [
          row("totalInterest", formatEur(r.totalInterest, false)),
          row("totalPaid", formatEur(r.totalPaid, false)),
        ],
      };
    }
    case "refinansirane": {
      const r = refinance(values as RefinanceInput);
      const saves = r.monthlySaving > 0;
      return {
        headline: formatEur(Math.max(r.monthlySaving, 0)),
        rows: [
          row("currentPayment", formatEur(r.currentPayment)),
          row("newPayment", formatEur(r.newPayment)),
          row("netSaving", formatEur(r.netSaving, false)),
          row(
            "breakEvenMonth",
            r.breakEvenMonth === null ? calculatorUi.never : calculatorUi.months(r.breakEvenMonth),
          ),
        ],
        note: saves ? undefined : labels.noSaving,
      };
    }
    case "kolko-moga-da-iztegla": {
      const { dstiMax, maxTermYears } = site.limits.bnb;
      const r = maxLoanByIncome({
        netIncome: values.netIncome!,
        otherPayments: values.otherPayments!,
        years: values.years!,
        ratePct: values.ratePct!,
        dstiMax,
        maxYears: maxTermYears,
      });
      return {
        headline: formatEur(r.maxLoan, false),
        rows: [row("maxPayment", formatEur(r.maxPayment))],
      };
    }
    case "spored-vnoskata": {
      const r = maxLoanByPayment(values as MaxLoanByPaymentInput);
      return { headline: formatEur(r.maxLoan, false), rows: [] };
    }
    case "tekushta-lihva": {
      const r = currentRate(values as CurrentRateInput);
      return r.ratePct === null
        ? { headline: calculatorUi.unknown, rows: [], note: labels.tooLow }
        : { headline: formatPercent(r.ratePct), rows: [] };
    }
    case "cena-na-kredita": {
      const r = loanCost(values as LoanCostInput);
      return {
        headline: formatEur(r.totalCost, false),
        rows: [
          row("payment", formatEur(r.payment)),
          row("monthlyOutflow", formatEur(r.monthlyOutflow)),
          row("totalInterest", formatEur(r.totalInterest, false)),
          row("totalFees", formatEur(r.totalFees, false)),
          row("totalInsurance", formatEur(r.totalInsurance, false)),
          row("aprPct", r.aprPct === null ? calculatorUi.unknown : formatPercent(r.aprPct)),
        ],
      };
    }
  }
}
