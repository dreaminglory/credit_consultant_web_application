import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Small mono label above section headings (DR-1). Colour is inherited from the section tone. */
export function Label({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-mono text-[13px] leading-none font-medium tracking-[0.08em] uppercase opacity-80",
        className,
      )}
      {...props}
    />
  );
}
