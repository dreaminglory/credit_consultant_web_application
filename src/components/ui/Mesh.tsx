import { cn } from "@/lib/cn";

const light =
  "bg-[radial-gradient(40%_45%_at_18%_25%,var(--color-sea)_0%,transparent_70%),radial-gradient(35%_40%_at_80%_20%,var(--color-gold)_0%,transparent_70%),radial-gradient(45%_50%_at_70%_85%,var(--color-petrol)_0%,transparent_70%),radial-gradient(40%_40%_at_25%_85%,var(--color-sand)_0%,transparent_70%)] bg-sage";

const dark =
  "bg-[radial-gradient(40%_45%_at_15%_20%,var(--color-sea)_0%,transparent_70%),radial-gradient(30%_35%_at_85%_30%,var(--color-gold-deep)_0%,transparent_70%),radial-gradient(50%_50%_at_60%_90%,var(--color-petrol)_0%,transparent_70%)] bg-ink";

/**
 * Soft drifting gradient behind a section (DR-1, DR-4). Place as the first child of a
 * `Section`; content after it stacks above because Section isolates its stacking context.
 */
export function Mesh({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className={cn(
          "absolute -inset-[20%] blur-[70px] will-change-transform motion-safe:animate-drift",
          tone === "light" ? light : dark,
        )}
      />
    </div>
  );
}
