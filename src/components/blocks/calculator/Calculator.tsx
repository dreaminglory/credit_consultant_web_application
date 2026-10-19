"use client";

import { useId, useState } from "react";
import { site } from "@/config/site";
import { calculatorCopy, calculatorUi, type LiveCalculatorSlug } from "@/content/calculators";
import { ButtonArrow, ButtonLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Mesh } from "@/components/ui/Mesh";
import { NumberField } from "@/components/ui/NumberField";
import { clamp, formatInput, parseNumber } from "@/lib/calc/input";
import { cn } from "@/lib/cn";
import { calculatorOutput, type CalculatorValues } from "./results";

type CalculatorProps = {
  slug: LiveCalculatorSlug;
  /** Where "Искам реални оферти" leads: the Home form, or /konsultacia on other pages. */
  ctaHref: string;
  className?: string;
};

const mapValues = <T, U>(record: Record<string, T>, fn: (value: T) => U) =>
  Object.fromEntries(Object.entries(record).map(([key, value]) => [key, fn(value)]));

/**
 * Embeddable calculator (B-12, FR-12…17, FR-22): inputs on the left, live result on a dark
 * gradient panel on the right, disclaimer always visible. The first render uses the example
 * values from config, so the static HTML already shows a real result. Values never leave the
 * browser and are never put in the URL.
 */
export function Calculator({ slug, ctaHref, className }: CalculatorProps) {
  const copy = calculatorCopy[slug];
  const defaults = site.calculatorDefaults[slug] as CalculatorValues;
  const baseId = useId();

  // Last valid number per field drives the result; the text is what the visitor typed.
  const [values, setValues] = useState<CalculatorValues>(defaults);
  const [texts, setTexts] = useState<Record<string, string>>(() =>
    mapValues(defaults, formatInput),
  );

  const output = calculatorOutput(slug, values);

  function setText(key: string, text: string, min: number, max: number) {
    setTexts((prev) => ({ ...prev, [key]: text }));
    const parsed = parseNumber(text);
    if (parsed !== null && parsed >= min && parsed <= max) {
      setValues((prev) => ({ ...prev, [key]: parsed }));
    }
  }

  function commit(key: string, min: number, max: number) {
    const parsed = parseNumber(texts[key] ?? "");
    const value = parsed === null ? values[key]! : clamp(parsed, min, max);
    setValues((prev) => ({ ...prev, [key]: value }));
    setTexts((prev) => ({ ...prev, [key]: formatInput(value) }));
  }

  function setFromSlider(key: string, value: number) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setTexts((prev) => ({ ...prev, [key]: formatInput(value) }));
  }

  return (
    <div
      className={cn(
        "grid overflow-hidden rounded-card border border-line bg-white md:grid-cols-2",
        className,
      )}
    >
      <form
        className="grid content-start gap-5 p-6 md:p-8"
        onSubmit={(event) => event.preventDefault()}
        noValidate
      >
        {copy.fields.map((field) => {
          const id = `${baseId}-${field.key}`;
          const text = texts[field.key] ?? "";
          const parsed = parseNumber(text);
          const invalid = parsed === null || parsed < field.min || parsed > field.max;
          const value = values[field.key]!;
          return (
            <NumberField
              key={field.key}
              id={id}
              name={field.key}
              label={field.label}
              unit={field.unit}
              text={text}
              onTextChange={(next) => setText(field.key, next, field.min, field.max)}
              onBlur={() => commit(field.key, field.min, field.max)}
              error={
                invalid
                  ? calculatorUi.invalid(formatInput(field.min), formatInput(field.max))
                  : undefined
              }
              range={
                field.slider
                  ? {
                      min: field.min,
                      max: field.max,
                      step: field.step,
                      value: clamp(value, field.min, field.max),
                      onChange: (next) => setFromSlider(field.key, next),
                      label: calculatorUi.slider(field.label),
                      valueText: `${formatInput(value)} ${field.unit}`,
                    }
                  : undefined
              }
            />
          );
        })}
      </form>

      <div className="relative isolate flex flex-col justify-center gap-5 overflow-hidden bg-ink p-6 text-white md:p-8">
        <Mesh tone="dark" />
        <Label className="text-haze opacity-100">{copy.headline}</Label>
        <output
          aria-live="polite"
          className="block font-head text-[clamp(40px,5.6vw,68px)] leading-none font-extrabold tracking-[-0.04em] break-words tabular-nums"
        >
          {output.headline}
        </output>
        {output.rows.length > 0 && (
          <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 text-[15px] text-mist">
            {output.rows.map((row) => (
              <div key={row.label} className="contents">
                <dt>{row.label}</dt>
                <dd className="text-right font-semibold text-white tabular-nums">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {output.note && (
          <p role="status" className="rounded-tile bg-white/10 px-4 py-3 text-[15px] text-white">
            {output.note}
          </p>
        )}
        <ButtonLink href={ctaHref} variant="gold" className="self-start">
          {copy.cta} <ButtonArrow />
        </ButtonLink>
        <p className="text-[13px] leading-normal text-haze">{copy.disclaimer}</p>
      </div>
    </div>
  );
}
