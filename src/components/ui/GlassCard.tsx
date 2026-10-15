import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type GlassCardProps = ComponentProps<"div"> & { tone?: "light" | "dark" };

/** Frosted-glass surface; falls back to a solid surface without backdrop-filter. */
export function GlassCard({ tone = "light", className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-card",
        tone === "light" ? "glass text-ink" : "glass-dark text-white",
        className,
      )}
      {...props}
    />
  );
}
