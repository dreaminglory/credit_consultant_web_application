import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type RoundButtonProps = ComponentProps<"button"> & {
  tone?: "light" | "dark";
  /** `default` is 52 px (carousel arrows); `sm` is 46 px (header menu toggle). */
  size?: "default" | "sm";
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
      className={cn(
        "grid shrink-0 cursor-pointer place-items-center rounded-full text-xl shadow-float",
        size === "default" ? "size-[52px]" : "size-[46px]",
        "transition-[transform,background-color] duration-150 ease-out-soft hover:-translate-y-px",
        tone === "light" ? "bg-white text-ink hover:bg-sand" : "bg-ink text-white hover:bg-petrol",
        className,
      )}
      {...props}
    />
  );
}
