import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Visual variants from mockup v2. */
export type ButtonVariant = "dark" | "line" | "gold" | "light";

const base =
  "group inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full px-[26px] font-body text-base font-semibold no-underline whitespace-nowrap " +
  "transition-[transform,background-color,color] duration-150 ease-out-soft hover:-translate-y-px active:translate-y-0 " +
  "disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  dark: "bg-ink text-white hover:bg-petrol",
  line: "bg-transparent text-ink shadow-[inset_0_0_0_2px_var(--color-ink)] hover:bg-ink hover:text-white",
  gold: "bg-gold text-ink hover:bg-[color-mix(in_oklab,var(--color-gold),white_12%)]",
  light: "bg-white text-ink hover:bg-sand",
};

export function buttonClasses(variant: ButtonVariant = "dark", className?: string) {
  return cn(base, variants[variant], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant };

export function Button({ variant = "dark", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant };

/** Internal navigation styled as a pill button. */
export function ButtonLink({ variant = "dark", className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}

type ButtonAnchorProps = ComponentProps<"a"> & { variant?: ButtonVariant };

/** External or protocol links (tel:, viber:, https://wa.me) styled as a pill button. */
export function ButtonAnchor({ variant = "dark", className, ...props }: ButtonAnchorProps) {
  return <a className={buttonClasses(variant, className)} {...props} />;
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
