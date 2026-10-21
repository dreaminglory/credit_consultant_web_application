import { describe, expect, it } from "vitest";
import { tariffs } from "@/config/tariffs";
import { mortgageFees, notaryFee, propertyCost, purchaseFees, registryFee, toEur } from "./fees";

describe("toEur", () => {
  it("converts the tariff amounts at 1,95583 to the cent", () => {
    // Fixed amounts and bracket limits of т. 8 of the notary tariff.
    expect([30, 43.5, 160.5, 480.5, 730.5, 1530.5, 6000].map(toEur)).toEqual([
      15.34, 22.24, 82.06, 245.68, 373.5, 782.53, 3067.75,
    ]);
    expect([100, 1000, 10_000, 50_000, 100_000, 500_000].map(toEur)).toEqual([
      51.13, 511.29, 5112.92, 25564.59, 51129.19, 255645.94,
    ]);
  });

  it("matches the Registry Agency's own conversion of its minimum fee", () => {
    expect(toEur(10)).toBe(tariffs.registry.minEur);
  });
});

describe("notaryFee", () => {
  it("charges the flat minimum up to 100 лв. inclusive", () => {
    expect(notaryFee(10)).toBe(15.34);
    expect(notaryFee(51.13)).toBe(15.34);
  });

  it("follows the worked example: 150 000 € → 373,50 € + 0,2 % over 51 129,19 €", () => {
    expect(notaryFee(150_000)).toBe(571.24);
  });

  it("is continuous at every bracket limit", () => {
    const { brackets } = tariffs.notary;
    for (let i = 1; i < brackets.length; i++) {
      const limit = toEur(brackets[i]!.overBgn);
      const below = notaryFee(limit);
      const above = notaryFee(limit + 0.01);
      expect(Math.abs(above - below)).toBeLessThanOrEqual(0.02);
      expect(above).toBeCloseTo(toEur(brackets[i]!.baseBgn), 1);
    }
  });

  it("uses the bracket above a limit only past the limit", () => {
    // 5 112,92 € is still in the 1,3 % bracket: 22,24 + 1,3 % × 4 601,63.
    expect(notaryFee(5112.92)).toBe(82.06);
    expect(notaryFee(5112.93)).toBe(82.06);
    // 82,06 + 0,8 % × 14 887,08 = 201,157 → 201,16; 245,68 + 0,5 % × 4 435,41 = 267,857 → 267,86.
    expect(notaryFee(20_000)).toBe(201.16);
    expect(notaryFee(30_000)).toBe(267.86);
  });

  it("is capped at 6 000 лв. = 3 067,75 €", () => {
    expect(notaryFee(2_000_000)).toBe(2526.88);
    expect(notaryFee(2_540_865.94)).toBe(3067.75);
    expect(notaryFee(10_000_000)).toBe(3067.75);
  });

  it("is 0 when there is no deed", () => {
    expect(notaryFee(0)).toBe(0);
  });
});

describe("registryFee", () => {
  it("is 0,1 % with a 5,11 € minimum", () => {
    expect(registryFee(150_000)).toBe(150);
    expect(registryFee(1000)).toBe(5.11);
    expect(registryFee(5110)).toBe(5.11);
    expect(registryFee(5120)).toBe(5.12);
    expect(registryFee(0)).toBe(0);
  });
});

describe("purchaseFees (FR-18)", () => {
  it("adds notary, VAT, registry and municipal tax for 150 000 € at 3 %", () => {
    expect(purchaseFees({ price: 150_000, taxAssessment: 0, transferTaxPct: 3 })).toEqual({
      base: 150_000,
      notaryFee: 571.24,
      notaryVat: 114.25,
      registryFee: 150,
      transferTax: 4500,
      total: 5335.49,
    });
  });

  it("charges on the tax assessment when it is higher than the price", () => {
    const r = purchaseFees({ price: 100_000, taxAssessment: 120_000, transferTaxPct: 2.5 });
    expect(r.base).toBe(120_000);
    expect(r.transferTax).toBe(3000);
    expect(r.registryFee).toBe(120);
  });

  it("is 0 for an empty price", () => {
    expect(purchaseFees({ price: 0, taxAssessment: 0, transferTaxPct: 3 }).total).toBe(0);
  });
});

describe("mortgageFees (FR-19)", () => {
  it("charges the deed and its entry on the loan amount", () => {
    expect(mortgageFees({ loanAmount: 120_000 })).toEqual({
      notaryFee: 511.24,
      notaryVat: 102.25,
      registryFee: 120,
      total: 733.49,
    });
  });

  it("is 0 without a loan", () => {
    expect(mortgageFees({ loanAmount: 0 }).total).toBe(0);
  });
});

describe("propertyCost (FR-20)", () => {
  const base = { price: 150_000, taxAssessment: 0, transferTaxPct: 3, ltvMax: 0.85 };

  it("adds the down payment, purchase fees and mortgage fees", () => {
    expect(propertyCost({ ...base, downPayment: 30_000 })).toEqual({
      downPayment: 30_000,
      loanAmount: 120_000,
      purchaseFees: 5335.49,
      mortgageFees: 733.49,
      cashNeeded: 36_068.98,
      ltvPct: 80,
      exceedsLtv: false,
    });
  });

  it("flags a loan above the BNB LTV limit", () => {
    expect(propertyCost({ ...base, downPayment: 22_500 }).exceedsLtv).toBe(false);
    expect(propertyCost({ ...base, downPayment: 15_000 }).exceedsLtv).toBe(true);
  });

  it("needs no mortgage fees when paid in full", () => {
    const r = propertyCost({ ...base, downPayment: 200_000 });
    expect(r.downPayment).toBe(150_000);
    expect(r.loanAmount).toBe(0);
    expect(r.mortgageFees).toBe(0);
    expect(r.cashNeeded).toBe(155_335.49);
  });
});
