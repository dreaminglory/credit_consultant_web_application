import { describe, expect, it } from "vitest";
import { site } from "@/config/site";
import { calculatorCopy, liveCalculatorSlugs } from "@/content/calculators";
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
