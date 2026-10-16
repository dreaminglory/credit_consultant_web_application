import { describe, expect, it } from "vitest";
import { normalizePhone } from "./phone";
import { fieldErrors, leadRequestSchema, toLead, type LeadRequestInput } from "./schema";

const compact: LeadRequestInput = {
  variant: "compact",
  product: "ipotechni",
  name: "Иван",
  phone: "0888 123 456",
  city: "",
  amount: "",
  method: "telefon",
  time: "",
  email: "",
  notes: "",
  consent: true,
};

describe("normalizePhone (FR-3)", () => {
  it.each([
    ["0888 123 456", "+359888123456"],
    ["0888-123-456", "+359888123456"],
    ["032 123 456", "+35932123456"],
    ["+359 888 123 456", "+359888123456"],
    ["00359888123456", "+359888123456"],
    ["+359 0888 123 456", "+359888123456"],
    ["359888123456", "+359888123456"],
    ["+44 7700 900123", "+447700900123"],
    ["0049 151 2345 6789", "+4915123456789"],
  ])("%s → %s", (input, expected) => {
    expect(normalizePhone(input)).toBe(expected);
  });

  it.each(["", "123", "0888", "abc", "+0123456789", "08881234567890", "+1234567"])(
    "rejects %s",
    (input) => {
      expect(normalizePhone(input)).toBeNull();
    },
  );
});

describe("leadRequestSchema (FR-1, FR-7a)", () => {
  it("accepts the compact variant without city", () => {
    expect(leadRequestSchema.safeParse(compact).success).toBe(true);
  });

  it("requires the city in the full variant", () => {
    const result = leadRequestSchema.safeParse({ ...compact, variant: "full" });
    expect(result.success).toBe(false);
    if (!result.success) expect(fieldErrors(result.error).city).toBeDefined();
    expect(
      leadRequestSchema.safeParse({ ...compact, variant: "full", city: "Пловдив" }).success,
    ).toBe(true);
  });

  it("reports Bulgarian messages per field", () => {
    const result = leadRequestSchema.safeParse({
      ...compact,
      name: " ",
      phone: "12",
      consent: false,
      email: "not-an-email",
      amount: "сто",
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    const errors = fieldErrors(result.error);
    expect(Object.keys(errors).sort()).toEqual(["amount", "consent", "email", "name", "phone"]);
    expect(errors.phone).toMatch(/телефон/i);
  });

  it("rejects unknown products, methods and time slots", () => {
    expect(leadRequestSchema.safeParse({ ...compact, product: "lizing" }).success).toBe(false);
    expect(leadRequestSchema.safeParse({ ...compact, method: "fax" }).success).toBe(false);
    expect(leadRequestSchema.safeParse({ ...compact, time: "22-23" }).success).toBe(false);
  });

  it("rejects amounts above the limit", () => {
    expect(leadRequestSchema.safeParse({ ...compact, amount: "10000001" }).success).toBe(false);
  });

  it("has no fields for ЕГН or ID documents (FR-2)", () => {
    const result = leadRequestSchema.safeParse({ ...compact, egn: "8001010000" });
    expect(result.success && "egn" in result.data).toBe(false);
  });
});

describe("toLead", () => {
  it("normalises phone, amount, optional fields and trims text", () => {
    const parsed = leadRequestSchema.parse({
      ...compact,
      name: "  Мария Петрова ",
      amount: "120 000",
      email: "maria@example.com",
      time: "9-12",
    });
    expect(toLead(parsed)).toMatchObject({
      name: "Мария Петрова",
      phone: "+359888123456",
      amount: 120000,
      email: "maria@example.com",
      time: "9-12",
      source: {},
    });
  });

  it("maps empty optional fields to null", () => {
    const lead = toLead(leadRequestSchema.parse(compact));
    expect(lead).toMatchObject({ amount: null, email: null, time: null });
  });
});

describe("full variant errors", () => {
  it("reports the missing city together with other field errors", () => {
    const result = leadRequestSchema.safeParse({
      ...compact,
      variant: "full",
      name: "",
      consent: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(fieldErrors(result.error)).sort()).toEqual(["city", "consent", "name"]);
    }
  });
});
