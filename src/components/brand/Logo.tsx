import { useId } from "react";

/**
 * The ExtraConsult mark (O-13, chosen 2026-10-21): an EC monogram with a rising arrow — gold
 * upper E and arrow, petrol lower E and C (white on dark surfaces). Drawn on a 48×48 grid; a
 * mask cuts a gap around the arrow where it crosses the letters, so it works on any background.
 * Keep the paths in sync with `brandSvg` in scripts/optimize-images.mjs (favicons, OG image).
 */
export const markPaths = {
  eTop: "M4 6H19V12H10.5V19H16V25H4Z",
  eBottom: "M4 27H10.5V36H19V42H4Z",
  c: "M37.75 18.8A9.5 9.5 0 1 0 41.2 31.75",
  arrow: "M17 37 25 29 30.5 33.5 38.5 20.5",
  head: "M43.5 12.5 42.5 23.3 34.6 18.2Z",
} as const;

type LogoMarkProps = {
  /** "light" for light surfaces (petrol + gold), "dark" for petrol/ink surfaces (white + gold). */
  tone?: "light" | "dark";
  className?: string;
};

export function LogoMark({ tone = "light", className = "size-11" }: LogoMarkProps) {
  const mask = useId();
  const light = tone === "light";
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
        <rect width="48" height="48" fill="#fff" />
        <path
          d={markPaths.arrow}
          fill="none"
          stroke="#000"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d={markPaths.head} fill="#000" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${mask})`}>
        <path className="fill-gold" d={markPaths.eTop} />
        <path className={light ? "fill-petrol" : "fill-white"} d={markPaths.eBottom} />
        <path
          className={light ? "fill-none stroke-petrol" : "fill-none stroke-white"}
          d={markPaths.c}
          strokeWidth="6"
        />
      </g>
      <path
        className="fill-none stroke-gold"
        d={markPaths.arrow}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path className="fill-gold" d={markPaths.head} />
    </svg>
  );
}
