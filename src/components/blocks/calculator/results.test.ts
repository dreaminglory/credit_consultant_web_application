import { describe, expect, it } from "vitest";
import { site } from "@/config/site";
import {
  calculatorCopy,
  isLiveCalculator,
  liveCalculatorSlugs,
  releasedCalculatorSlugs,
} from "@/content/calculators";
import { calculatorOutput } from "./results";

const plain = (text: string) => text.replace(/[  ]/g, " ");

describe("calculatorOutput", () => {
  it("has copy, defaults and fields that match for every live calculator", () => {
    for (const slug of liveCalculatorSlugs) {
      const defaults = site.calculatorDefaults[slug];
      expect(calculatorCopy[slug].fields.map((f) => f.key).sort()).toEqual(
        Object.keys(defaults).sort(),
      );
      for (const field of calculatorCopy[slug].fields) {
        const value = (defaults as Record<string, number>)[field.key]!;
        expect(value).toBeGreaterThanOrEqual(field.min);
        expect(value).toBeLessThanOrEqual(field.max);
      }
      const output = calculatorOutput(slug, defaults as Record<string, number>);
      expect(output.headline).not.toBe("");
      for (const row of output.rows) expect(row.label).toBeTruthy();
    }
  });

  it("formats the monthly payment example", () => {
    const output = calculatorOutput("mesechna-vnoska", { amount: 120000, years: 30, ratePct: 2.9 });
    expect(plain(output.headline)).toBe("499,48 €");
  });

  it("uses the BNB limits from config for the max loan", () => {
    const output = calculatorOutput("kolko-moga-da-iztegla", {
      netIncome: 2600,
      otherPayments: 200,
      years: 30,
      ratePct: 2.9,
    });
    expect(plain(output.headline)).toBe("264 277 €");
    expect(plain(output.rows[0]!.value)).toBe("1100,00 €");
  });

  it("explains instead of showing a number when nothing adds up", () => {
    expect(
      calculatorOutput("refinansirane", {
        balance: 50000,
        years: 10,
        currentRatePct: 3,
        newRatePct: 3.5,
        switchingCosts: 500,
      }).note,
    ).toBeTruthy();
    expect(
      calculatorOutput("tekushta-lihva", { balance: 100000, payment: 200, years: 30 }).note,
    ).toBeTruthy();
  });
});

describe("fee calculators (FR-18…20)", () => {
  it("formats the purchase fees for 150 000 € in Plovdiv", () => {
    const output = calculatorOutput("taksi-pri-pokupka", {
      price: 150000,
      taxAssessment: 0,
      transferTaxPct: 3,
    });
    expect(plain(output.headline)).toBe("5335,49 €");
    expect(output.rows.map((r) => plain(r.value))).toEqual([
      "571,24 €",
      "114,25 €",
      "150,00 €",
      "4500,00 €",
    ]);
  });

  it("formats the mortgage fees without a transfer tax row", () => {
    const output = calculatorOutput("notarialni-taksi-ipoteka", { loanAmount: 120000 });
    expect(plain(output.headline)).toBe("733,49 €");
    expect(output.rows).toHaveLength(3);
  });

  it("warns when the down payment is below the BNB minimum", () => {
    const values = { price: 150000, taxAssessment: 0, transferTaxPct: 3 };
    expect(
      calculatorOutput("cena-na-imota", { ...values, downPayment: 30000 }).note,
    ).toBeUndefined();
    expect(calculatorOutput("cena-na-imota", { ...values, downPayment: 10000 }).note).toBeTruthy();
  });

  it("releases the fee calculators once the tariffs are confirmed (O-12)", () => {
    for (const slug of ["taksi-pri-pokupka", "notarialni-taksi-ipoteka", "cena-na-imota"]) {
      expect(isLiveCalculator(slug)).toBe(true);
      expect(releasedCalculatorSlugs).toContain(slug);
    }
  });
});
