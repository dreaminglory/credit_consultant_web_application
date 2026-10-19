import { describe, expect, it } from "vitest";
import { exactPayment, payment, principalFromPayment, roundCents } from "./annuity";
import {
  currentRate,
  loanCost,
  maxLoanByIncome,
  maxLoanByPayment,
  monthlyPayment,
  refinance,
} from "./calculators";
import { monthlyRate, rateFromPayment } from "./rate";
import reference from "./reference-cases.json";

describe("annuity", () => {
  it("matches textbook payments", () => {
    expect(payment(100_000, 5, 360)).toBe(536.82);
    expect(payment(20_000, 6, 60)).toBe(386.66);
  });

  it("repays the loan exactly with the unrounded payment", () => {
    // Independent check: run the amortisation month by month.
    const principal = 187_350;
    const rate = 3.37;
    const n = 300;
    const pay = exactPayment(principal, rate, n);
    let balance = principal;
    for (let i = 0; i < n; i++) balance = balance * (1 + rate / 1200) - pay;
    expect(Math.abs(balance)).toBeLessThan(1e-6);
  });

  it("splits evenly at 0 %", () => {
    expect(payment(60_000, 0, 120)).toBe(500);
    expect(principalFromPayment(500, 0, 120)).toBe(60_000);
  });

  it("is the inverse of the payment", () => {
    const pay = exactPayment(150_000, 2.9, 360);
    expect(principalFromPayment(pay, 2.9, 360)).toBe(150_000);
  });

  it("returns 0 for empty inputs", () => {
    expect(payment(0, 3, 360)).toBe(0);
    expect(payment(1000, 3, 0)).toBe(0);
    expect(principalFromPayment(0, 3, 360)).toBe(0);
  });

  it("rounds half away from zero like Excel", () => {
    expect(roundCents(1.005)).toBe(1.01);
    expect(roundCents(2.675)).toBe(2.68);
    expect(roundCents(-1.005)).toBe(-1.01);
  });
});

describe("rate", () => {
  it("recovers the rate of an exact payment", () => {
    for (const rate of [0.5, 2.9, 4.2, 9.5, 24]) {
      expect(rateFromPayment(90_000, exactPayment(90_000, rate, 264), 264)).toBeCloseTo(rate, 8);
    }
  });

  it("is 0 when payments add up to the balance, null when they fall short", () => {
    expect(monthlyRate(12_000, 1000, 12)).toBe(0);
    expect(monthlyRate(12_000, 999, 12)).toBeNull();
    expect(monthlyRate(0, 100, 12)).toBeNull();
  });
});

describe("calculators", () => {
  it("clamps the term to the BNB maximum", () => {
    const result = maxLoanByIncome({
      netIncome: 3000,
      otherPayments: 0,
      years: 40,
      ratePct: 3,
      dstiMax: 0.5,
      maxYears: 30,
    });
    expect(result.years).toBe(30);
  });

  it("never offers a negative payment", () => {
    const result = maxLoanByIncome({
      netIncome: 1000,
      otherPayments: 800,
      years: 30,
      ratePct: 3,
      dstiMax: 0.5,
      maxYears: 30,
    });
    expect(result).toEqual({ maxPayment: 0, maxLoan: 0, years: 30 });
  });

  it("has no break-even when refinancing costs more than it saves", () => {
    const result = refinance({
      balance: 50_000,
      years: 10,
      currentRatePct: 3,
      newRatePct: 3.5,
      switchingCosts: 500,
    });
    expect(result.monthlySaving).toBeLessThan(0);
    expect(result.breakEvenMonth).toBeNull();
  });

  it("gives an APR equal to the effective rate when there are no fees", () => {
    const { aprPct } = loanCost({
      amount: 10_000,
      years: 3,
      ratePct: 12,
      upfrontFeePct: 0,
      monthlyFee: 0,
      annualInsurance: 0,
    });
    // Payment is rounded to the cent, so allow a hair of difference from (1.01)^12 − 1.
    expect(aprPct).toBeCloseTo(12.6825, 2);
  });

  it("reports an unknown rate when the payment cannot repay the balance", () => {
    expect(currentRate({ balance: 100_000, payment: 200, years: 30 }).ratePct).toBeNull();
  });
});

/** Same cases as docs/calculators-reference.xml, which Excel checks with PMT, PV and RATE. */
describe("reference cases (to the cent)", () => {
  it.each(reference.monthlyPayment)("monthly payment %#", ({ input, expected }) => {
    expect(monthlyPayment(input)).toEqual(expected);
  });
  it.each(reference.refinance)("refinance %#", ({ input, expected }) => {
    expect(refinance(input)).toEqual(expected);
  });
  it.each(reference.maxLoanByIncome)("max loan by income %#", ({ input, expected }) => {
    expect(maxLoanByIncome(input)).toEqual(expected);
  });
  it.each(reference.maxLoanByPayment)("max loan by payment %#", ({ input, expected }) => {
    expect(maxLoanByPayment(input)).toEqual(expected);
  });
  it.each(reference.currentRate)("current rate %#", ({ input, expected }) => {
    expect(currentRate(input).ratePct).toBeCloseTo(expected.ratePct, 6);
  });
  it.each(reference.loanCost)("loan cost %#", ({ input, expected }) => {
    const { aprPct, ...money } = loanCost(input);
    const { aprPct: expectedApr, ...expectedMoney } = expected;
    expect(money).toEqual(expectedMoney);
    expect(aprPct).toBeCloseTo(expectedApr, 6);
  });
});
