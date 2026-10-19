import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type RoundTone = "light" | "dark";
/** `default` is 52 px (carousel arrows); `sm` is 46 px (header menu toggle); `xs` is 44 px. */
type RoundSize = "default" | "sm" | "xs";

const sizes: Record<RoundSize, string> = {
  default: "size-[52px]",
  sm: "size-[46px]",
  xs: "size-11",
};

function roundClasses(tone: RoundTone, size: RoundSize, className?: string) {
  return cn(
    "grid shrink-0 cursor-pointer place-items-center rounded-full text-xl no-underline shadow-float",
    sizes[size],
    "transition-[transform,background-color] duration-150 ease-out-soft hover:-translate-y-px",
    tone === "light" ? "bg-white text-ink hover:bg-sand" : "bg-ink text-white hover:bg-petrol",
    className,
  );
}

type RoundButtonProps = ComponentProps<"button"> & {
  tone?: RoundTone;
  size?: RoundSize;
  /** Accessible name; round buttons show only an icon. */
  label: string;
};

/** Circular icon button (carousel arrows, menu toggle). Size is a prop — `cn` does not merge. */
export function RoundButton({
  tone = "light",
  size = "default",
  label,
  className,
  type = "button",
  ...props
}: RoundButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={roundClasses(tone, size, className)}
      {...props}
    />
  );
}

type RoundLinkProps = ComponentProps<typeof Link> & {
  tone?: RoundTone;
  size?: RoundSize;
  label: string;
};

/** Circular icon link (card and caption arrows). */
export function RoundLink({
  tone = "light",
  size = "default",
  label,
  className,
  ...props
}: RoundLinkProps) {
  return <Link aria-label={label} className={roundClasses(tone, size, className)} {...props} />;
}
