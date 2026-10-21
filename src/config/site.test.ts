import { describe, expect, it } from "vitest";
import { isPending, pending } from "./pending";
import { site } from "./site";
import { tariffs } from "./tariffs";

describe("pending", () => {
  it("marks values as pending with their open item", () => {
    const value = pending("O-5", "Phone number", "draft");
    expect(isPending(value)).toBe(true);
    expect(isPending("0888")).toBe(false);
    expect(value).toMatchObject({ pending: "O-5", draft: "draft" });
  });
});

describe("site config", () => {
  it("lists the ten v1 partner banks with unique ids and logo paths (BL-2)", () => {
    expect(site.banks).toHaveLength(10);
    expect(new Set(site.banks.map((b) => b.id)).size).toBe(10);
    for (const bank of site.banks) expect(bank.logo).toBe(`/banks/${bank.id}.svg`);
  });

  it("has the four loan products in menu order", () => {
    expect(site.loans.map((l) => l.slug)).toEqual([
      "ipotechni",
      "refinansirane",
      "biznes",
      "potrebitelski",
    ]);
  });

  it("keeps registration data identical wherever it is shown (CR-6)", () => {
    expect(site.legal.eik).toBe("207809106");
    expect(site.legal.bnbRegisterNo).toBe("BCI000104");
    const disclosure = site.legal.disclosure;
    const text = isPending(disclosure) ? disclosure.draft : disclosure;
    expect(text).toContain(site.legal.eik);
    expect(text).toContain(site.legal.bnbRegisterNo);
  });
});

describe("tariffs (FR-18…21, O-12)", () => {
  it("records a legal rate, a source and a check date for every municipality", () => {
    const { minPct, maxPct, municipalities } = tariffs.transferTax;
    expect(municipalities.map((m) => m.id)).toEqual([
      "plovdiv",
      "sofia",
      "varna",
      "burgas",
      "stara-zagora",
      "ruse",
    ]);
    for (const m of municipalities) {
      expect(m.ratePct).toBeGreaterThanOrEqual(minPct);
      expect(m.ratePct).toBeLessThanOrEqual(maxPct);
      expect(m.source).toBeTruthy();
      expect(m.url).toMatch(/^https:\/\//);
      expect(m.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("starts the fee calculators at the office city's rate", () => {
    expect(site.calculatorDefaults["taksi-pri-pokupka"].transferTaxPct).toBe(
      tariffs.transferTax.municipalities[0].ratePct,
    );
    expect(tariffs.transferTax.municipalities[0].name).toBe(site.office.city);
  });
});
