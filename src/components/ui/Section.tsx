import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type SectionTone = "paper" | "white" | "sand" | "ink" | "petrol";

const tones: Record<SectionTone, string> = {
  paper: "bg-paper text-ink",
  white: "bg-white text-ink",
  sand: "bg-sand text-ink",
  ink: "bg-ink text-white",
  petrol: "bg-petrol text-white",
};

type SectionProps = ComponentProps<"section"> & { tone?: SectionTone };

/**
 * Page section with the vertical rhythm from mockup v2 (96 px desktop, 64 px phone).
 * Background effects (Mesh) are composed as children.
 */
export function Section({ tone = "paper", className, ...props }: SectionProps) {
  return (
    <section className={cn("relative isolate py-16 md:py-24", tones[tone], className)} {...props} />
  );
}
