import * as z from "zod/mini";
import { site } from "@/config/site";
import { normalizePhone } from "./phone";

/**
 * One schema for both form variants, used in the browser and in `/api/lead` (FR-3, FR-7a).
 * Fields arrive as the form holds them (strings); `toLead()` turns a valid request into the
 * normalised lead the email and the Sheet use. There is deliberately no field for ЕГН, ID card
 * data or income documents (FR-2). `zod/mini` keeps the form's client bundle small.
 */

const values = <T extends { value: string }>(options: readonly T[]) =>
  options.map((option) => option.value) as [T["value"], ...T["value"][]];

export const productValues = values(site.lead.products);
export const methodValues = values(site.lead.methods);
export const timeValues = values(site.lead.timeSlots);

export type LeadProduct = (typeof productValues)[number];
export type LeadMethod = (typeof methodValues)[number];
export type LeadTime = (typeof timeValues)[number];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const AMOUNT = /^\d{1,9}$/;

const text = (max: number) =>
  z.string().check(z.trim(), z.maxLength(max, "Текстът е твърде дълъг."));

/** Strips spaces and thousands separators, so „120 000“ and „120.000“ both read as 120000. */
export function amountDigits(input: string): string {
  return input.replace(/[\s.,'’]/g, "");
}

/** Where the visitor came from (FR-5). Never contains personal data. */
export const sourceSchema = z.object({
  page: z.optional(text(500)),
  landing: z.optional(text(500)),
  referrer: z.optional(text(500)),
  utm_source: z.optional(text(200)),
  utm_medium: z.optional(text(200)),
  utm_campaign: z.optional(text(200)),
  utm_term: z.optional(text(200)),
  utm_content: z.optional(text(200)),
  gclid: z.optional(text(300)),
  fbclid: z.optional(text(300)),
});

export type LeadSource = z.infer<typeof sourceSchema>;

const commonShape = {
  product: z.enum(productValues, "Изберете какво ви трябва."),
  name: text(80).check(z.minLength(2, "Напишете името си.")),
  phone: text(30).check(
    z.refine((value) => normalizePhone(value) !== null, "Проверете телефона — напр. 0888 123 456."),
  ),
  amount: text(20).check(
    z.refine(
      (value) =>
        value === "" ||
        (AMOUNT.test(amountDigits(value)) && Number(amountDigits(value)) <= site.lead.maxAmount),
      "Напишете сумата само с цифри, напр. 120000.",
    ),
  ),
  method: z.enum(methodValues, "Изберете как да говорим."),
  time: z.union([z.enum(timeValues), z.literal("")]),
  email: text(120).check(
    z.refine((value) => value === "" || EMAIL.test(value), "Проверете имейл адреса."),
  ),
  notes: text(1000),
  consent: z.literal(true, "Нужно е съгласието ви, за да се свържа с вас."),
  /** Honeypot: hidden from people, filled in by bots (FR-4). */
  website: z.optional(z.string()),
  turnstileToken: z.optional(text(2048)),
  source: z.optional(sourceSchema),
};

/**
 * Discriminated by variant, so every field error shows at once (an object-level refinement
 * would wait until the other fields are valid). Compact only requires what it shows (FR-7a).
 */
export const leadRequestSchema = z.discriminatedUnion("variant", [
  z.object({ ...commonShape, variant: z.literal("compact"), city: text(80) }),
  z.object({
    ...commonShape,
    variant: z.literal("full"),
    city: text(80).check(z.minLength(2, "Напишете населеното място.")),
  }),
]);

export type LeadRequestInput = z.input<typeof leadRequestSchema>;
export type LeadRequest = z.output<typeof leadRequestSchema>;
export type LeadField = keyof LeadRequest;
export type LeadVariant = LeadRequest["variant"];

/** The normalised lead used by the owner email, the Sheet and the auto-reply. */
export type Lead = {
  product: LeadProduct;
  name: string;
  /** E.164. */
  phone: string;
  city: string;
  amount: number | null;
  method: LeadMethod;
  time: LeadTime | null;
  email: string | null;
  notes: string;
  source: LeadSource;
};

export function toLead(request: LeadRequest): Lead {
  return {
    product: request.product,
    name: request.name,
    phone: normalizePhone(request.phone)!,
    city: request.city,
    amount: request.amount === "" ? null : Number(amountDigits(request.amount)),
    method: request.method,
    time: request.time === "" ? null : request.time,
    email: request.email === "" ? null : request.email,
    notes: request.notes,
    source: request.source ?? {},
  };
}

/** First message per field, for inline errors (client) and the 400 response (server). */
export function fieldErrors(error: z.core.$ZodError): Partial<Record<LeadField, string>> {
  const errors: Partial<Record<LeadField, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as LeadField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

export function labelOf<T extends string>(
  options: readonly { value: T; label: string }[],
  value: T,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}
