/**
 * The brand mark "Стъпала" (O-13, chosen 2026-11-26): gold steps rising to an arched front door —
 * the step-by-step process that ends at the new home. Petrol door on light surfaces, white on
 * petrol/ink. Drawn on a 48×48 grid.
 * Keep the shapes in sync with `brandSvg` in scripts/optimize-images.mjs (favicons, OG image).
 */
export const markPaths = {
  steps: "M3 43V37H10V31H17V25H24V43Z",
  door: "M28 43V18A8 8 0 0 1 44 18V43",
  knob: { cx: 39.5, cy: 30, r: 1.9 },
} as const;

type LogoMarkProps = {
  /** "light" for light surfaces (petrol + gold), "dark" for petrol/ink surfaces (white + gold). */
  tone?: "light" | "dark";
  className?: string;
};

export function LogoMark({ tone = "light", className = "size-11" }: LogoMarkProps) {
  const main = tone === "light" ? "petrol" : "white";
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path className="fill-gold" d={markPaths.steps} />
      <path
        className={main === "petrol" ? "fill-none stroke-petrol" : "fill-none stroke-white"}
        d={markPaths.door}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle className={main === "petrol" ? "fill-petrol" : "fill-white"} {...markPaths.knob} />
    </svg>
  );
}
