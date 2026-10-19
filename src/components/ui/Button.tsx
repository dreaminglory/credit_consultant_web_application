import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Visual variants from mockup v2. */
export type ButtonVariant = "dark" | "line" | "line-light" | "gold" | "light" | "pending";

/**
 * Sizes are mutually exclusive. `cn` does not merge conflicting utilities, so never override
 * height, padding or font size through `className` — pick a size instead.
 */
export type ButtonSize = "default" | "compact" | "bar";

const sizes: Record<ButtonSize, string> = {
  default: "min-h-[52px] gap-3 px-[26px] text-base",
  compact: "min-h-[46px] gap-2 px-5 text-[15px]",
  bar: "min-h-[46px] gap-2 px-3 text-sm",
};

const base =
  "group inline-flex items-center justify-center rounded-full font-body font-semibold no-underline whitespace-nowrap " +
  "transition-[transform,background-color,color] duration-150 ease-out-soft hover:-translate-y-px active:translate-y-0 " +
  "disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  dark: "bg-ink text-white hover:bg-petrol",
  line: "bg-transparent text-ink shadow-[inset_0_0_0_2px_var(--color-ink)] hover:bg-ink hover:text-white",
  /** Outline button for dark sections. */
  "line-light":
    "bg-transparent text-white shadow-[inset_0_0_0_2px_rgb(255_255_255/0.6)] hover:bg-white hover:text-ink",
  gold: "bg-gold text-ink hover:bg-[color-mix(in_oklab,var(--color-gold),white_12%)]",
  light: "bg-white text-ink hover:bg-sand",
  /** Marks a button whose target is an open owner item (A-6); never ships (check:content). */
  pending:
    "cursor-not-allowed border-2 border-dashed border-gold bg-gold/10 text-inherit hover:translate-y-0",
};

export function buttonClasses(
  variant: ButtonVariant = "dark",
  className?: string,
  size: ButtonSize = "default",
) {
  return cn(base, sizes[size], variants[variant], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize };

export function Button({
  variant = "dark",
  size,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className, size)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize };

/** Internal navigation styled as a pill button. */
export function ButtonLink({ variant = "dark", size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, className, size)} {...props} />;
}

type ButtonAnchorProps = ComponentProps<"a"> & { variant?: ButtonVariant; size?: ButtonSize };

/** External or protocol links (tel:, viber:, https://wa.me) styled as a pill button. */
export function ButtonAnchor({ variant = "dark", size, className, ...props }: ButtonAnchorProps) {
  return <a className={buttonClasses(variant, className, size)} {...props} />;
}

/** Round arrow chip placed inside a button, after the text. */
export function ButtonArrow({ children = "→" }: { children?: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-[26px] place-items-center rounded-full bg-current/15 text-sm transition-transform duration-150 ease-out-soft group-hover:translate-x-0.5"
    >
      {children}
    </span>
  );
}
