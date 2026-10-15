import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Label } from "./Label";

type SectionHeaderProps = Omit<ComponentProps<"div">, "title"> & {
  label: string;
  title: string;
  /** Optional paragraph under the heading. */
  lead?: string;
  /** Overrides the default h2 size, for long headings in narrow columns. */
  titleClassName?: string;
};

/**
 * Mono label + large heading (+ lead) that opens every Home section (HP-2). Colour comes from
 * the section tone; the heading is always an h2 — the hero owns the page's h1.
 */
export function SectionHeader({
  label,
  title,
  lead,
  titleClassName,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div className={cn(className)} {...props}>
      <Label>{label}</Label>
      <h2 className={cn("mt-3.5", titleClassName)}>{title}</h2>
      {lead && <p className="mt-6 max-w-[58ch] text-lg opacity-80">{lead}</p>}
    </div>
  );
}
