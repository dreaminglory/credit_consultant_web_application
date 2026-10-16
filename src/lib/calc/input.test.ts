import { describe, expect, it } from "vitest";
import { clamp, formatEur, formatInput, formatPercent, parseNumber } from "./input";

// Intl uses narrow no-break spaces in bg-BG; compare with plain spaces.
const plain = (text: string) => text.replace(/[  ]/g, " ");

describe("parseNumber", () => {
  it("accepts Bulgarian and English decimals and grouping spaces", () => {
    expect(parseNumber("120 000")).toBe(120000);
    expect(parseNumber("2,9")).toBe(2.9);
    expect(parseNumber("2.9")).toBe(2.9);
    expect(parseNumber("120 000,50 €")).toBe(120000.5);
    expect(parseNumber("3,")).toBe(3);
  });

  it("rejects empty, negative and malformed values", () => {
    expect(parseNumber("")).toBeNull();
    expect(parseNumber("-5")).toBeNull();
    expect(parseNumber("1,2,3")).toBeNull();
    expect(parseNumber("abc")).toBeNull();
  });
});

describe("format", () => {
  it("formats EUR the Bulgarian way", () => {
    expect(plain(formatEur(499.48))).toBe("499,48 €");
    expect(plain(formatEur(264276.97, false))).toBe("264 277 €");
  });

  it("formats percent and inputs", () => {
    expect(formatPercent(4.2024)).toBe("4,20 %");
    expect(plain(formatInput(120000))).toBe("120 000");
    expect(formatInput(2.9)).toBe("2,9");
  });

  it("clamps", () => {
    expect(clamp(40, 1, 30)).toBe(30);
    expect(clamp(-1, 0, 5)).toBe(0);
  });
});
