"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { site } from "@/config/site";
import { leadForm } from "@/content/lead";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { ChoicePills } from "@/components/ui/ChoicePills";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { ATTRIBUTION_KEY, readStoredSource } from "@/lib/lead/attribution";
import type { LeadErrorCode, LeadResponse } from "@/lib/lead/handleLead";
import {
  fieldErrors,
  leadRequestSchema,
  productValues,
  type LeadField,
  type LeadMethod,
  type LeadProduct,
  type LeadRequestInput,
  type LeadTime,
  type LeadVariant,
} from "@/lib/lead/schema";
import { useTurnstile } from "./useTurnstile";

type Values = {
  product: LeadProduct | "";
  name: string;
  phone: string;
  city: string;
  amount: string;
  method: LeadMethod | "";
  time: LeadTime | "";
  email: string;
  notes: string;
  consent: boolean;
};

type Errors = Partial<Record<LeadField, string>>;
type Status = { kind: "idle" | "sending" } | { kind: "error"; code: LeadErrorCode | "network" };

/** Fields in visual order per variant; the first invalid one gets focus on submit. */
const ORDER: Record<LeadVariant, LeadField[]> = {
  full: [
    "product",
    "name",
    "phone",
    "city",
    "amount",
    "method",
    "time",
    "email",
    "notes",
    "consent",
  ],
  compact: [
    "product",
    "name",
    "phone",
    "method",
    "city",
    "amount",
    "time",
    "email",
    "notes",
    "consent",
  ],
};
/** Behind the „Още подробности“ expander in the compact variant (FR-7a). */
const DETAILS: LeadField[] = ["city", "amount", "time", "email", "notes"];

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const noSubscribe = () => () => {};
/** Product from `?produkt=…`; `null` on the server so the static HTML stays neutral. */
function useUrlProduct(enabled: boolean): LeadProduct | null {
  return useSyncExternalStore(
    noSubscribe,
    () => {
      if (!enabled) return null;
      const value = new URLSearchParams(window.location.search).get("produkt");
      return value && (productValues as readonly string[]).includes(value)
        ? (value as LeadProduct)
        : null;
    },
    () => null,
  );
}

type LeadFormProps = {
  variant: LeadVariant;
  /** Loan pages pre-select their product (FR-7). */
  defaultProduct?: LeadProduct;
  /** `/konsultacia?produkt=…` pre-selects from the link (read in the browser; page stays static). */
  productFromUrl?: boolean;
  /** Direct contact buttons shown when sending fails (FR-6); rendered by the server parent. */
  fallback: ReactNode;
};

/**
 * Consultation form (B-17, FR-1…7a). One schema with `/api/lead`; compact shows the essentials
 * plus an expander, full shows every field. On success the visitor lands on `/blagodarim`.
 */
export function LeadForm({ variant, defaultProduct, productFromUrl, fallback }: LeadFormProps) {
  const router = useRouter();
  const base = useId();
  const id = (field: string) => `${base}-${field}`;
  const honeypot = useRef<HTMLInputElement>(null);
  const {
    container: turnstileRef,
    activate: activateTurnstile,
    getToken,
    reset: resetTurnstile,
  } = useTurnstile(SITE_KEY);
  const urlProduct = useUrlProduct(productFromUrl ?? false);

  const [input, setValues] = useState<Values>({
    product: defaultProduct ?? "",
    name: "",
    phone: "",
    city: "",
    amount: "",
    // A phone call is the usual first step (mockup v2 pre-selects it); the product is not
    // guessed unless a loan page or link supplies it.
    method: "telefon",
    time: "",
    email: "",
    notes: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [detailsOpen, setDetailsOpen] = useState(variant === "full");
  // A visitor's own choice wins over the product from the link (FR-7).
  const values: Values = { ...input, product: input.product || urlProduct || "" };

  /** Focuses the first invalid field after the errors (and maybe the expander) are rendered. */
  const focusFirstError = (found: Errors) => {
    const first = ORDER[variant].find((field) => found[field]);
    if (!first) return false;
    flushSync(() => {
      setErrors(found);
      if (DETAILS.includes(first)) setDetailsOpen(true);
    });
    const fieldId = id(first);
    const target =
      first === "product" || first === "method"
        ? document.querySelector<HTMLInputElement>(`input[name="${CSS.escape(fieldId)}"]`)
        : document.getElementById(fieldId);
    target?.focus();
    return true;
  };

  const request = (current: Values): LeadRequestInput =>
    ({ variant, ...current }) as LeadRequestInput;

  const validate = (current: Values) => {
    const result = leadRequestSchema.safeParse(request(current));
    return result.success ? {} : fieldErrors(result.error);
  };

  /** Re-checks one field: on blur, and while typing once it shows an error. */
  const check = (field: LeadField, current: Values) =>
    setErrors((previous) => {
      const message = validate(current)[field];
      if (message === previous[field]) return previous;
      const next = { ...previous };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });

  const update = <K extends keyof Values>(field: K, value: Values[K]) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (errors[field]) check(field, next);
  };

  const blur = (field: LeadField) => () => check(field, values);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "sending") return;

    const found = validate(values);
    setErrors(found);
    if (focusFirstError(found)) {
      setStatus({ kind: "idle" });
      return;
    }

    setStatus({ kind: "sending" });
    let stored = null;
    try {
      stored = readStoredSource(sessionStorage.getItem(ATTRIBUTION_KEY));
    } catch {
      // Storage blocked: send without the landing data.
    }

    try {
      const token = await getToken();
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...request(values),
          website: honeypot.current?.value ?? "",
          turnstileToken: token ?? undefined,
          source: { ...stored, page: window.location.pathname },
        }),
      });
      const result = (await response.json().catch(() => null)) as LeadResponse | null;
      if (result?.ok) {
        router.push(site.lead.thanksHref);
        return;
      }
      resetTurnstile();
      if (result?.error === "validation" && result.fieldErrors) focusFirstError(result.fieldErrors);
      setStatus({ kind: "error", code: result?.error ?? "delivery" });
    } catch {
      resetTurnstile();
      setStatus({ kind: "error", code: "network" });
    }
  }

  const sending = status.kind === "sending";
  const compact = variant === "compact";

  const product = (
    <ChoicePills
      id={id("product")}
      name={id("product")}
      legend={leadForm.product}
      options={site.lead.products}
      value={values.product}
      onChange={(value) => update("product", value)}
      error={errors.product}
      className="sm:col-span-2"
    />
  );
  const method = (
    <ChoicePills
      id={id("method")}
      name={id("method")}
      legend={leadForm.method}
      options={site.lead.methods}
      value={values.method}
      onChange={(value) => update("method", value)}
      error={errors.method}
      className="sm:col-span-2"
    />
  );
  const details = (
    <>
      <TextField
        id={id("city")}
        label={compact ? leadForm.cityOptional : leadForm.city}
        autoComplete="address-level2"
        required={!compact}
        value={values.city}
        onChange={(event) => update("city", event.target.value)}
        onBlur={blur("city")}
        error={errors.city}
      />
      <TextField
        id={id("amount")}
        label={leadForm.amount}
        inputMode="numeric"
        autoComplete="off"
        value={values.amount}
        onChange={(event) => update("amount", event.target.value)}
        onBlur={blur("amount")}
        error={errors.amount}
      />
      {!compact && method}
      <SelectField
        id={id("time")}
        label={leadForm.time}
        value={values.time}
        onChange={(event) => update("time", event.target.value as LeadTime | "")}
        error={errors.time}
      >
        <option value="">{leadForm.timeAny}</option>
        {site.lead.timeSlots.map((slot) => (
          <option key={slot.value} value={slot.value}>
            {slot.label}
          </option>
        ))}
      </SelectField>
      <TextField
        id={id("email")}
        label={leadForm.email}
        type="email"
        autoComplete="email"
        spellCheck={false}
        value={values.email}
        onChange={(event) => update("email", event.target.value)}
        onBlur={blur("email")}
        hint={leadForm.emailHint}
        error={errors.email}
      />
      <TextAreaField
        id={id("notes")}
        label={leadForm.notes}
        placeholder={leadForm.notesPlaceholder}
        maxLength={1000}
        value={values.notes}
        onChange={(event) => update("notes", event.target.value)}
        onBlur={blur("notes")}
        error={errors.notes}
        wrapperClassName="sm:col-span-2"
      />
    </>
  );

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      onFocusCapture={activateTurnstile}
      className="relative"
      aria-busy={sending}
    >
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        {product}
        <TextField
          id={id("name")}
          label={leadForm.name}
          autoComplete="name"
          required
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          onBlur={blur("name")}
          error={errors.name}
        />
        <TextField
          id={id("phone")}
          label={leadForm.phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={leadForm.phonePlaceholder}
          required
          value={values.phone}
          onChange={(event) => update("phone", event.target.value)}
          onBlur={blur("phone")}
          hint={leadForm.phoneHint}
          error={errors.phone}
        />
        {compact ? (
          <>
            {method}
            <div className="sm:col-span-2">
              <button
                type="button"
                aria-expanded={detailsOpen}
                aria-controls={id("details")}
                onClick={() => setDetailsOpen((open) => !open)}
                className="flex w-full items-center justify-between gap-3 rounded-field border border-dashed border-line px-4 py-3 text-left transition-colors duration-150 hover:border-ink/40"
              >
                <span>
                  <span className="block font-semibold">{leadForm.more}</span>
                  <span className="block text-sm text-muted">{leadForm.moreHint}</span>
                </span>
                <Icon
                  name="chevron"
                  className={cn(
                    "size-5 shrink-0 transition-transform duration-250 ease-out-soft",
                    detailsOpen && "rotate-180",
                  )}
                />
              </button>
              <div
                id={id("details")}
                hidden={!detailsOpen}
                className="mt-5 grid gap-x-4 gap-y-5 sm:grid-cols-2"
              >
                {details}
              </div>
            </div>
          </>
        ) : (
          details
        )}
      </div>

      <div aria-hidden="true" className="absolute -left-[10000px] size-px overflow-hidden">
        <label htmlFor={id("website")}>Уебсайт</label>
        <input ref={honeypot} id={id("website")} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer items-start gap-3 text-[15px] text-muted">
          <input
            id={id("consent")}
            type="checkbox"
            required
            checked={values.consent}
            onChange={(event) => update("consent", event.target.checked)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${id("consent")}-error` : undefined}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-petrol"
          />
          <span>
            {leadForm.consentBefore}
            <Link href={site.lead.privacyHref} className="text-ink underline underline-offset-2">
              {leadForm.consentLink}
            </Link>
            {leadForm.consentAfter}
          </span>
        </label>
        {errors.consent && (
          <p id={`${id("consent")}-error`} className="mt-1.5 text-sm font-medium text-gold-deep">
            {errors.consent}
          </p>
        )}
      </div>

      <div ref={turnstileRef} className="mt-4 empty:hidden" />

      <Button type="submit" variant="dark" disabled={sending} className="mt-6 w-full">
        {sending ? leadForm.sending : leadForm.submit}
        {!sending && <ButtonArrow />}
      </Button>

      <div role="alert" className="empty:hidden">
        {status.kind === "error" && <StatusMessage code={status.code} fallback={fallback} />}
        {status.kind === "idle" && Object.keys(errors).length > 0 && (
          <p className="mt-4 text-sm font-medium text-gold-deep">{leadForm.errors.summary}</p>
        )}
      </div>
    </form>
  );
}

function StatusMessage({
  code,
  fallback,
}: {
  code: LeadErrorCode | "network";
  fallback: ReactNode;
}) {
  if (code === "validation") {
    return <p className="mt-4 text-sm font-medium text-gold-deep">{leadForm.errors.summary}</p>;
  }
  const text =
    code === "verification"
      ? leadForm.errors.verification
      : code === "rate_limit"
        ? leadForm.errors.rateLimit
        : code === "network"
          ? leadForm.errors.network
          : leadForm.errors.failed;
  return (
    <div className="mt-5 rounded-tile border-2 border-gold bg-gold/10 p-4">
      <p className="font-medium">{text}</p>
      <div className="mt-4">{fallback}</div>
    </div>
  );
}
