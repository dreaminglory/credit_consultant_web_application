import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Labelled form controls from mockup v2 (`.field`): mono label, paper input, sea focus ring,
 * inline error linked with `aria-describedby` (WCAG 2.2 AA). Same look as `NumberField`.
 */

export const fieldLabelClass =
  "mb-2 block font-mono text-xs leading-snug font-medium tracking-[0.06em] text-muted uppercase";

export const fieldControlClass =
  "min-h-[52px] w-full rounded-field border bg-paper px-4 py-3 text-[17px] font-medium text-ink " +
  "placeholder:text-muted/70 transition-[border-color,box-shadow] duration-150 " +
  "focus-visible:border-sea focus-visible:shadow-[0_0_0_3px_rgb(46_107_102/0.2)] focus-visible:outline-none";

type FieldShellProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

export const hintId = (id: string) => `${id}-hint`;
export const errorId = (id: string) => `${id}-error`;

/** ARIA wiring for a control inside `FieldShell`. */
export function describedBy(id: string, hint?: string, error?: string) {
  const ids = [error && errorId(id), hint && hintId(id)].filter(Boolean).join(" ");
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": ids || undefined,
  } as const;
}

function FieldShell({ id, label, hint, error, className, children }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={hintId(id)} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId(id)} className="mt-1.5 text-sm font-medium text-gold-deep">
          {error}
        </p>
      )}
    </div>
  );
}

type FieldProps<T extends "input" | "select" | "textarea"> = ComponentProps<T> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  /** Classes for the wrapper (grid placement). */
  wrapperClassName?: string;
};

export function TextField({
  id,
  label,
  hint,
  error,
  wrapperClassName,
  className,
  ...props
}: FieldProps<"input">) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={wrapperClassName}>
      <input
        id={id}
        className={cn(fieldControlClass, error ? "border-gold-deep" : "border-line", className)}
        {...describedBy(id, hint, error)}
        {...props}
      />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  hint,
  error,
  wrapperClassName,
  className,
  children,
  ...props
}: FieldProps<"select">) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={wrapperClassName}>
      <select
        id={id}
        className={cn(
          fieldControlClass,
          "cursor-pointer",
          error ? "border-gold-deep" : "border-line",
          className,
        )}
        {...describedBy(id, hint, error)}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
}

export function TextAreaField({
  id,
  label,
  hint,
  error,
  wrapperClassName,
  className,
  ...props
}: FieldProps<"textarea">) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={wrapperClassName}>
      <textarea
        id={id}
        className={cn(
          fieldControlClass,
          "min-h-[104px] resize-y",
          error ? "border-gold-deep" : "border-line",
          className,
        )}
        {...describedBy(id, hint, error)}
        {...props}
      />
    </FieldShell>
  );
}
