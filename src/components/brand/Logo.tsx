/**
 * The ExtraConsult mark (O-13, chosen 2026-10-21): an EC seal — gold E whose bottom bar runs on
 * under the C — on a petrol rounded square. Drawn on a 48×48 grid.
 * Keep the paths in sync with `brandSvg` in scripts/optimize-images.mjs (favicons, OG image).
 */
export const markPaths = {
  e: "M9 12H21V16.5H13.5V21.75H20V26.25H13.5V31.5H39V36H9Z",
  c: "M35.7 16.5A6.5 6.5 0 1 0 35.7 26.5",
} as const;

type LogoMarkProps = {
  /** "light" for light surfaces (petrol seal), "dark" for petrol/ink surfaces (glass seal). */
  tone?: "light" | "dark";
  className?: string;
};

export function LogoMark({ tone = "light", className = "size-11" }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect
        width="48"
        height="48"
        rx="13"
        className={tone === "light" ? "fill-petrol" : "fill-white/10"}
      />
      <path className="fill-gold" d={markPaths.e} />
      <path
        className="fill-none stroke-gold"
        d={markPaths.c}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
