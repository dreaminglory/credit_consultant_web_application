import type { ChangeEvent } from "react";
import { cn } from "@/lib/cn";

type RangeProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  /** Accessible name and spoken value of the slider. */
  label: string;
  valueText: string;
};

type NumberFieldProps = {
  id: string;
  name: string;
  label: string;
  /** Shown inside the input on the right: €, %, г. */
  unit: string;
  text: string;
  onTextChange: (text: string) => void;
  onBlur: () => void;
  /** Inline hint for an invalid or out-of-range value. */
  error?: string;
  range?: RangeProps;
};

/**
 * Number input for the calculators: a text field with a decimal keypad (accepts "2,9" and
 * "2.9"), a unit suffix, an inline error hint and an optional paired range slider. Parsing
 * and validation stay with the caller.
 */
export function NumberField({
  id,
  name,
  label,
  unit,
  text,
  onTextChange,
  onBlur,
  error,
  range,
}: NumberFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-xs leading-snug font-medium tracking-[0.06em] text-muted uppercase"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={text}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onTextChange(event.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "min-h-[52px] w-full rounded-field border bg-paper py-3 pr-12 pl-4 text-[17px] font-medium text-ink tabular-nums",
            "transition-[border-color,box-shadow] duration-150 focus-visible:border-sea focus-visible:shadow-[0_0_0_3px_rgb(46_107_102/0.2)] focus-visible:outline-none",
            error ? "border-gold-deep" : "border-line",
          )}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center font-mono text-sm text-muted"
        >
          {unit}
        </span>
      </div>
      {range && (
        <input
          type="range"
          min={range.min}
          max={range.max}
          step={range.step}
          value={range.value}
          onChange={(event) => range.onChange(Number(event.target.value))}
          aria-label={range.label}
          aria-valuetext={range.valueText}
          className="mt-1.5 h-11 w-full cursor-pointer accent-sea"
        />
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-gold-deep">
          {error}
        </p>
      )}
    </div>
  );
}
