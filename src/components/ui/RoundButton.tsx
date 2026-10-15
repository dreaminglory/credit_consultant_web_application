import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type RoundButtonProps = ComponentProps<"button"> & {
  tone?: "light" | "dark";
  /** Accessible name; round buttons show only an icon. */
  label: string;
};

/** 52 px circular icon button (carousel arrows, menu toggle). */
export function RoundButton({
  tone = "light",
  label,
  className,
  type = "button",
  ...props
}: RoundButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "grid size-[52px] shrink-0 cursor-pointer place-items-center rounded-full text-xl shadow-float",
        "transition-[transform,background-color] duration-150 ease-out-soft hover:-translate-y-px",
        tone === "light" ? "bg-white text-ink hover:bg-sand" : "bg-ink text-white hover:bg-petrol",
        className,
      )}
      {...props}
    />
  );
}
