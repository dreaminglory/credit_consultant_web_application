import { describe, expect, it } from "vitest";
import { isPending, pending } from "./pending";
import { site } from "./site";

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
