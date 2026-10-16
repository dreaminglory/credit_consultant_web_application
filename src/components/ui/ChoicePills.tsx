import { cn } from "@/lib/cn";
import { errorId, fieldLabelClass } from "./Field";

type Option<T extends string> = { value: T; label: string };

type ChoicePillsProps<T extends string> = {
  /** Base for the option ids and the error id. */
  id: string;
  name: string;
  legend: string;
  options: readonly Option<T>[];
  value: T | "";
  onChange: (value: T) => void;
  error?: string;
  className?: string;
};

/**
 * Single choice shown as pills (mockup v2 `.seg`): native radios in a fieldset, so arrow keys,
 * labels and screen readers work without script; the checked pill turns ink.
 */
export function ChoicePills<T extends string>({
  id,
  name,
  legend,
  options,
  value,
  onChange,
  error,
  className,
}: ChoicePillsProps<T>) {
  return (
    <fieldset
      className={cn("min-w-0", className)}
      aria-describedby={error ? errorId(id) : undefined}
    >
      <legend className={fieldLabelClass}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="relative cursor-pointer">
            <input
              type="radio"
              id={`${id}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer absolute inset-0 m-0 size-full cursor-pointer opacity-0"
            />
            <span
              className={cn(
                "inline-flex min-h-11 items-center rounded-full border bg-paper px-4 text-[15px] font-medium",
                "transition-[background-color,color,border-color] duration-150",
                "peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white",
                "peer-hover:border-ink/40 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold",
                error ? "border-gold-deep" : "border-line",
              )}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId(id)} className="mt-1.5 text-sm font-medium text-gold-deep">
          {error}
        </p>
      )}
    </fieldset>
  );
}
