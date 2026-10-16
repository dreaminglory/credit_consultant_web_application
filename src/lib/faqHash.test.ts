import { describe, expect, it } from "vitest";
import { site } from "@/config/site";
import { faqCategories } from "@/content/faq";
import { categoryHash, questionHash, resolveFaqHash } from "./faqHash";

describe("resolveFaqHash", () => {
  it("resolves a category hash", () => {
    expect(resolveFaqHash("#vaprosi-refinansirane", faqCategories)).toEqual({
      categoryId: "refinansirane",
      questionId: null,
    });
  });

  it("resolves a question hash to its category and question", () => {
    expect(resolveFaqHash("vaprosi-usluga-bezplatna", faqCategories)).toEqual({
      categoryId: "usluga",
      questionId: "bezplatna",
    });
  });

  it("ignores the section anchor and foreign hashes", () => {
    expect(resolveFaqHash("#vaprosi", faqCategories)).toBeNull();
    expect(resolveFaqHash("#proces", faqCategories)).toBeNull();
    expect(resolveFaqHash("", faqCategories)).toBeNull();
  });

  it("round-trips every generated hash", () => {
    for (const category of faqCategories) {
      expect(resolveFaqHash(categoryHash(category.id), faqCategories)?.categoryId).toBe(
        category.id,
      );
      for (const item of category.items) {
        expect(resolveFaqHash(questionHash(category.id, item.id), faqCategories)).toEqual({
          categoryId: category.id,
          questionId: item.id,
        });
      }
    }
  });
});

describe("faq content", () => {
  it("has at least 5 categories and 15 questions (FAQ-2)", () => {
    expect(faqCategories.length).toBeGreaterThanOrEqual(5);
    expect(faqCategories.flatMap((c) => c.items).length).toBeGreaterThanOrEqual(15);
  });

  it("gives every loan page its own category (FAQ-3, FAQ-4)", () => {
    for (const loan of site.loans) {
      expect(faqCategories.filter((c) => c.loan === loan.slug)).toHaveLength(1);
    }
  });

  it("uses unique ids so hashes never collide", () => {
    const ids = faqCategories.flatMap((c) => c.items.map((i) => `${c.id}-${i.id}`));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
